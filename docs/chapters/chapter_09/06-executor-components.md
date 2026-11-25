# 9.6 执行器、组件与 C++

前面的节点都停在 `rclpy.spin` 上。这一节解释这行在做什么，以及为什么服务回调里再去等另一个服务会永远等下去。Nav2 的大部分节点是 C++，这里给一段对照，够你读启动日志和源码入口。

## 学习目标

- 说明单线程执行器为什么会被一个回调堵住
- 在「回调里再调用服务」时选对回调组，或改成异步
- 知道组件容器是 C++ 进程，Humble 和 Jazzy 都不能把 rclpy 节点装进去
- 读懂一个 30 行以内的 rclcpp 发布者

## 9.6.1 spin 是一个单线程循环

`rclpy.spin(node)` 使用进程里的 `SingleThreadedExecutor`。定时器、订阅、服务、动作回调排成一条队，**同一时刻只跑一个**。

回调里做这些事，整个节点都会停：

- `time.sleep`，或阻塞式串口读，且没有超时
- 在订阅回调里同步等待另一个服务的结果
- 长时间的图像处理却不把周期让出去

传感器回调因此要短。把重活交给定时器分片，或者交给另一个进程。日志也要短：100 Hz 的回调里打 `info`，会同时写终端、`~/.ros/log` 和 `/rosout`。

## 9.6.2 回调组和死锁

默认情况下，一个节点的回调在同一个 **MutuallyExclusive** 组里：执行器保证它们互斥。

服务端的回调若再 `call()` 另一个服务，而那个服务端又在同一个单线程执行器里，调用就永远完成不了。对方要运行回调，可是线程正停在这次调用上。

两条正路：

1. 客户端用 `call_async`，在 future 完成时再处理，不要在回调里阻塞等待。官方不推荐同步的 `Client.call()`。见 [Sync vs async](https://docs.ros.org/en/jazzy/How-To-Guides/Sync-Vs-Async.html)。
2. 确实需要并行时，把「会等待」的回调放进 `ReentrantCallbackGroup` 或另一个 `MutuallyExclusiveCallbackGroup`，并用 `MultiThreadedExecutor`。调用方和被调服务不能留在同一个互斥组。

```python
from rclpy.executors import MultiThreadedExecutor
from rclpy.callback_groups import ReentrantCallbackGroup

class Bridge(Node):
    def __init__(self):
        super().__init__('bridge')
        group = ReentrantCallbackGroup()
        self.create_service(AddTwoInts, 'add', self.on_add, callback_group=group)
        self.client = self.create_client(
            AddTwoInts, 'add_downstream', callback_group=group)

def main():
    rclpy.init()
    node = Bridge()
    executor = MultiThreadedExecutor()
    executor.add_node(node)
    executor.spin()
```

多线程之后，回调会重入。改 `self.count` 这类共享数据时要自己加锁，或者避免共享。能用异步就不要先上多线程。

Jazzy 的 `MultiThreadedExecutor` 默认线程数算法和 Humble 不同。不要在业务代码里依赖「默认就是 4 条线程」。

## 9.6.3 组件是 C++ 的进程内节点

每个 `ros2 run` 都是一个进程。十几个小节点会带来十几个进程的发现和调度开销。C++ 可以把节点编译成组件，装进同一个容器进程，例如 Nav2 的 `nav2_container`。可选的进程内通信（intra-process）只在这种 C++ 组件之间讨论。

Humble 和 Jazzy 都 **不能** `ros2 component load` 一个 rclpy 节点。`rclpy_components` 没有进入这两个发行版。Python 节点保持独立进程，用 launch 把它们和 C++ 容器一起拉起来。这不是临时缺口的传闻：组合的 Python API 到 2026 年仍是开放问题（[rclpy#575](https://github.com/ros2/rclpy/issues/575)）。

读 Nav2 时你会看到 `RCLCPP_COMPONENTS_REGISTER_NODE`。那一行只对 rclcpp 有意义。

## 9.6.4 同一发布者的 C++ 形状

下面和 [9.2](./02-graph-topics-qos.md) 的 talker 做同一件事。依赖是 `rclcpp` 和 `std_msgs`，包类型是 `ament_cmake`。

```cpp
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Talker : public rclcpp::Node
{
public:
  Talker() : Node("talker"), count_(0)
  {
    publisher_ = create_publisher<std_msgs::msg::String>("chatter", 10);
    timer_ = create_wall_timer(
      std::chrono::milliseconds(500),
      std::bind(&Talker::on_timer, this));
  }

private:
  void on_timer()
  {
    std_msgs::msg::String msg;
    msg.data = "hello " + std::to_string(count_++);
    publisher_->publish(msg);
    RCLCPP_INFO(get_logger(), "publish: '%s'", msg.data.c_str());
  }

  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
  int count_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Talker>());
  rclcpp::shutdown();
  return 0;
}
```

| | Python | C++ |
| --- | --- | --- |
| 基类 | `rclpy.node.Node` | `rclcpp::Node` |
| 发布 | `create_publisher(String, 'chatter', 10)` | `create_publisher<std_msgs::msg::String>("chatter", 10)` |
| 日志 | `self.get_logger().info(...)` | `RCLCPP_INFO(get_logger(), ...)` |
| 自旋 | `rclpy.spin(node)` | `rclcpp::spin(node)` |
| 队列 `10` | KeepLast 10，Reliable，Volatile | 相同的默认 QoS |

Jazzy 的文档示例常用 lambda 代替 `std::bind`。语义一样。

## 9.6.5 测试分三层

不要一开始就写集成框架。

| 层 | 测什么 | 怎么跑 |
| --- | --- | --- |
| 纯函数 | 运动学、限幅、单位换算，不启动 ROS | `pytest`，`colcon test --packages-select my_robot_pkg` |
| 手测图 | 话题是否出现、频率对不对 | `ros2 topic echo`、`ros2 topic hz` |
| 节点级 | 进程起来后某话题在超时内收到消息 | `launch_testing`，见官方 [集成测试](https://docs.ros.org/en/humble/Tutorials/Intermediate/Testing/Integration.html) |

`ament_copyright` 和 `ament_flake8` 是 `ros2 pkg create` 带上的风格检查。提交前让它们过，不要把测试时间花在格式上。

## 练习

1. 在服务回调里 `time.sleep(2)`，同时用 10 Hz 定时器打日志。观察定时器在这两秒里停住。然后删掉 sleep。
2. 读一遍 Nav2 任一 `CMakeLists.txt` 里的 `rclcpp_components_register_node`，写出它注册的类名。不需要编译 Nav2。
3. 把速度限幅写成纯函数 `clamp(speed, limit)`，用 pytest 覆盖上限、下限和刚好等于限制三种输入。

## 来源

- [About executors](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Executors.html)
- [Using callback groups](https://docs.ros.org/en/jazzy/How-To-Guides/Using-callback-groups.html)
- [Composition](https://docs.ros.org/en/humble/Tutorials/Intermediate/Composition.html)
- [Writing a publisher (C++)](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)
- [rclpy#575](https://github.com/ros2/rclpy/issues/575)

下一节：[9.7 命令行与排错](./07-cli-debugging.md)。
