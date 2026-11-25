# 9.3 接口、服务与动作

话题适合「一直在发」。有些交互不是流：问一次、等一个答案，或者派一个要跑好几秒、中途还想取消的任务。这一节把这三种接口分开，并写一个能编译的自定义服务。

## 学习目标

- 为一种交互选对 topic、service 或 action
- 写出 `.srv`，放进 `ament_cmake` 接口包
- 用 rclpy 实现一次加法服务
- 说清动作的 goal、feedback、result、cancel，而不把导航误写成服务

## 9.3.1 三种接口

| | 话题 | 服务 | 动作 |
| --- | --- | --- | --- |
| 形态 | 单向样本流 | 一次请求，一次响应 | 一次目标，多次反馈，最后结果 |
| 时长 | 连续 | 短，调用方在等 | 数秒到数分钟 |
| 谁对谁 | 多发布者，多订阅者 | 一个名字上应只有一个服务端 | 一个名字上应只有一个动作服务端 |
| 取消 | 没有「这一次调用」 | 没有 | 客户端可以取消，服务端也可以中止 |
| 例子 | `/scan`、`/cmd_vel` | 清一次屏、做一次短计算 | 导航到一个点、走完一段轨迹 |

同一名字上挂两个服务端时，请求落到谁没有定义。不要靠这个做负载均衡。

短请求不要用动作，开销在建连和状态机上。可能被打断的长任务不要用服务：服务没有反馈，也没有取消。需要持续知道「现在怎样」的量，用话题，不要用服务轮询。

## 9.3.2 自定义接口必须是 CMake 包

纯 Python 包可以 **使用** 已经生成好的类型，不能自己编译 `.msg`、`.srv`、`.action`。官方教程的原话是：接口包只能是 `ament_cmake` 包。使用它的节点可以是 Python。

在工作空间里单独建一个接口包，不要把消息塞进节点包：

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_cmake --license Apache-2.0 robot_interfaces
```

一个三整数加法，请求和响应用一行 `---` 分开：

```text
# srv/AddThreeInts.srv
int64 a
int64 b
int64 c
---
int64 sum
```

字段是 `类型 名字`，小写加下划线。常量必须全大写。不能把另一个 srv 嵌进 srv。

`CMakeLists.txt` 在 `find_package(ament_cmake REQUIRED)` 之后加上：

```cmake
find_package(rosidl_default_generators REQUIRED)

rosidl_generate_interfaces(${PROJECT_NAME}
  "srv/AddThreeInts.srv"
)
```

第一个参数必须以包名开头。`package.xml` 在 `ament_cmake` 的 `buildtool_depend` 旁边加：

```xml
<buildtool_depend>rosidl_default_generators</buildtool_depend>
<exec_depend>rosidl_default_runtime</exec_depend>
<member_of_group>rosidl_interface_packages</member_of_group>
```

若消息里用了别的包的类型，例如 `geometry_msgs/Point`，再加 `<depend>geometry_msgs</depend>`，并在 CMake 里 `find_package` 后把包名放进 `DEPENDENCIES`。

```bash
cd ~/ros2_ws
colcon build --packages-select robot_interfaces
source install/setup.bash
ros2 interface show robot_interfaces/srv/AddThreeInts
```

能打出请求和响应字段，生成才成功。Python 里用：

```python
from robot_interfaces.srv import AddThreeInts
```

使用方的 `package.xml` 写 `<exec_depend>robot_interfaces</exec_depend>`。

`.msg` 放 `msg/`，`.action` 放 `action/`，都列进 `rosidl_generate_interfaces`。动作文件是三段，用两行 `---`：

```text
# 目标
int64 order
---
# 结果
int64[] sequence
---
# 反馈
int64[] sequence
```

Humble 自带的 `example_interfaces/action/Fibonacci` 的反馈字段就叫 `sequence`。教程包 `action_tutorials_interfaces` 里叫 `partial_sequence`。抄代码时先 `ros2 interface show`，不要混用字段名。

`example_interfaces` 随桌面版的演示依赖装上，不在 `ros-base` 的最小集合里。交付产品时用自己的接口包，不要依赖 `example_interfaces`。

## 9.3.3 服务端和客户端

下面用桌面版已有的 `example_interfaces/srv/AddTwoInts`，这样本节不必先编译接口包。请求字段是 `a`、`b`，响应字段是 `sum`。

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python --license Apache-2.0 \
  py_srvcli --dependencies rclpy example_interfaces
```

服务端。回调要 `return response`，进程要 `spin`，否则请求到了也没人处理：

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts


class AddServer(Node):

    def __init__(self):
        super().__init__('add_server')
        self.create_service(AddTwoInts, 'add_two_ints', self.on_add)

    def on_add(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info('request: %d + %d' % (request.a, request.b))
        return response


def main():
    rclpy.init()
    node = AddServer()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

客户端。`call_async` 立刻返回 `Future`，不返回和。Humble 的官方 Python 教程在 `main` 里用 `rclpy.spin_until_future_complete` 等到结果。这个函数没有标成废弃，但 **不能在回调里调用**：那时执行器已经在 spin，再套一层会卡住。

```python
import sys
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts


class AddClient(Node):

    def __init__(self):
        super().__init__('add_client')
        self.client = self.create_client(AddTwoInts, 'add_two_ints')

    def send(self, a, b):
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('waiting for add_two_ints')
        request = AddTwoInts.Request()
        request.a = a
        request.b = b
        return self.client.call_async(request)


def main():
    rclpy.init()
    node = AddClient()
    future = node.send(int(sys.argv[1]), int(sys.argv[2]))
    rclpy.spin_until_future_complete(node, future)
    node.get_logger().info('sum = %d' % future.result().sum)
    node.destroy_node()
    rclpy.shutdown()
```

```bash
ros2 run py_srvcli service_node
ros2 run py_srvcli client_node 3 5
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 1, b: 2}"
```

`call()` 这种阻塞写法官方不推荐。服务端若还没起来，`wait_for_service` 会每秒打一行日志，而不是抛一个难以读的异常。

在服务回调里再去同步调用别的服务，单线程执行器会死锁。处理方式在 [9.6](./06-executor-components.md)。

## 9.3.4 动作为什么不是「高级服务」

一个动作有四段语义：

1. **Goal**：客户端要什么，例如「到这个位姿」。
2. **Feedback**：执行中反复上报，例如剩余距离。
3. **Result**：结束时的一份结果。
4. **Cancel**：客户端喊停，或服务端自己中止。

导航到一个航点会走很多秒。用服务的话，调用方要么一直堵着，要么失去取消能力。Nav2 的 `navigate_to_pose` 因此是动作。本章不展开 Nav2 的行为树，只要接口选对。

Humble 的 Python 动作教程用 `action_tutorials_interfaces/action/Fibonacci` 或桌面版的 `example_interfaces/action/Fibonacci`。骨架是：

```python
from rclpy.action import ActionServer
from example_interfaces.action import Fibonacci

self._action_server = ActionServer(
    self,
    Fibonacci,
    'fibonacci',
    self.execute_callback,
)
```

`execute_callback` 收到 `goal_handle`。循环里检查 `goal_handle.is_cancel_requested`，用 `goal_handle.publish_feedback` 发反馈，最后 `goal_handle.succeed()` 并返回 result。客户端用 `ActionClient` 的 `send_goal_async`，在 goal 被接受后的 `ClientGoalHandle` 上登记 feedback 回调，并另行 `get_result_async`。

完整的可运行文件以官方教程为准，不要从记忆里补参数顺序：

- [Writing an action server and client (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Writing-an-Action-Server-Client/Py.html)

命令行可以不写节点就走一遍状态机：

```bash
ros2 action list
ros2 action info /fibonacci
ros2 interface show example_interfaces/action/Fibonacci
```

## 9.3.5 和 ROS 1 不同的地方

- `.action` 是一等接口，不再靠 `actionlib` 的一组隐式话题拼出来给人记。
- 接口生成只在 `ament_cmake` 包里做。
- 服务回调必须返回响应对象；忘记 `return response` 时客户端的 future 不会得到你以为已经填好的字段。

## 练习

1. 在 `robot_interfaces` 里加入 `AddThreeInts`，编译并用 `ros2 interface show` 核对。
2. 把加法服务改成这个类型。用 `ros2 service call` 计算 `2+3+4`。
3. 用一句话写下：底盘急停按钮应该是话题、服务还是动作。急停要持续发布「速度为零」时，答案是话题；「立刻中止正在执行的导航」才需要动作的 cancel。

## 来源

- [About ROS 2 interfaces](https://docs.ros.org/en/humble/Concepts/About-ROS-2-Interfaces.html)
- [Creating custom msg and srv](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Custom-ROS2-Interfaces.html)
- [Writing a simple service and client (Python)](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Service-And-Client.html)
- [Understanding actions](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Actions/Understanding-ROS2-Actions.html)
- [Writing an action server and client (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Writing-an-Action-Server-Client/Py.html)

下一节：[9.4 参数与 Launch](./04-parameters-launch.md)。
