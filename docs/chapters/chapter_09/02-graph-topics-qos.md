# 9.2 计算图、话题与 QoS

[9.1](./01-distro-workspace.md) 让节点跑起来。这一节让两个节点交换数据，并解释「图上看得见、回调却不来」是怎么发生的。

## 学习目标

- 用发布者和订阅者传递一条消息
- 区分绝对名、相对名和 `~/` 私有名，会用 `--ros-args -r` 重映射
- 知道整数 `10` 在 QoS 里到底是什么
- 用传感器 QoS 订阅激光，而不是用默认的 Reliable

## 9.2.1 计算图里有什么

同一时刻互相发现的节点组成 **计算图**。节点是图里的计算单元，一个可执行文件里可以有一个或多个节点。节点之间用话题、服务、动作或参数交换数据。发现是分布式的，没有中心 master。

**话题**是一条强类型的总线，适合连续数据：激光、图像、轮速。

- 发布者生产样本，订阅者消费样本。一个话题可以有多个发布者和多个订阅者。
- 订阅者通常不关心样本来自哪一个发布者。
- **消息是类型，不是连接。** `.msg` 描述字段。连接要同时满足三件事：话题名相同、类型相同、QoS 兼容。

```text
相机节点 -- /image (sensor_msgs/msg/Image) --> 检测节点
                                         \--> 录像节点
```

类型不同就不会配对，哪怕名字都叫 `/scan`。

## 9.2.2 名字怎么展开

规则见 [Topic and Service name mapping to DDS](https://design.ros2.org/articles/topic_and_service_names.html)。合法字符是字母、数字、`_` 和 `/`。不能以数字开头，不能有 `//` 或 `__`，不能以 `/` 结尾。

| 代码里写的名字 | 节点在命名空间 `/ns`、节点名 `node` 时展开成 |
| --- | --- |
| `cmd_vel` | `/ns/cmd_vel` |
| `/cmd_vel` | `/cmd_vel` |
| `~/status` | `/ns/node/status` |

`~/status` 是私有名。ROS 1 里常见的 `~status`（没有斜杠）在 ROS 2 里是非法名字。

重映射放在 `--ros-args` 后面。改节点名用 `__node`，不要用 ROS 1 的 `__name`：

```bash
ros2 run my_robot_pkg hello_node --ros-args \
  -r __node:=driver \
  -r __ns:=/robot1 \
  -r cmd_vel:=/robot1/cmd_vel
```

`--remap` 与 `-r` 相同。节点名的替换值不能带 `/`。命名空间的替换值必须是以 `/` 开头的绝对名。先应用节点名和命名空间，再应用话题重映射。相对的新名字还会再进命名空间；写成 `/robot1/cmd_vel` 则是绝对目标。

## 9.2.3 最小的发布者和订阅者

把下面两个文件放进 [9.1](./01-distro-workspace.md) 的 `my_robot_pkg`，并在 `setup.py` 的 `console_scripts` 里各加一行。`package.xml` 增加：

```xml
<exec_depend>std_msgs</exec_depend>
```

`std_msgs/msg/String` 只有一个字段 `data`。自 Foxy 起官方把它标成不推荐用于业务，教学例子仍用它。真正的接口应表达含义，例如速度用 `Twist`，不要用字符串拼。

发布者，每 0.5 秒一条：

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class Talker(Node):

    def __init__(self):
        super().__init__('talker')
        self.publisher = self.create_publisher(String, 'chatter', 10)
        self.count = 0
        self.timer = self.create_timer(0.5, self.on_timer)

    def on_timer(self):
        msg = String()
        msg.data = 'hello %d' % self.count
        self.publisher.publish(msg)
        self.get_logger().info('publish: "%s"' % msg.data)
        self.count += 1


def main(args=None):
    rclpy.init(args=args)
    node = Talker()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

订阅者：

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class Listener(Node):

    def __init__(self):
        super().__init__('listener')
        self.subscription = self.create_subscription(
            String, 'chatter', self.on_msg, 10)

    def on_msg(self, msg):
        self.get_logger().info('heard: "%s"' % msg.data)


def main(args=None):
    rclpy.init(args=args)
    node = Listener()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

第四个参数 `10` 不是「随便写的队列」。它展开成：

| 策略 | 值 |
| --- | --- |
| history | KEEP_LAST |
| depth | 10 |
| reliability | RELIABLE |
| durability | VOLATILE |

也就是只保留最新 10 条、尽量可靠送达、不给晚加入的订阅者补历史。它不是 ROS 1 的 latched topic。

两个终端分别 `ros2 run`。第三个终端：

```bash
ros2 topic list
ros2 topic echo /chatter
ros2 topic hz /chatter
ros2 topic info /chatter --verbose
```

`echo` 会自己再挂一个订阅者，所以发布者的订阅计数会加一。`--verbose` 才打印 QoS。不带 `-v` 的 `info` 只告诉你类型和端点数量。

## 9.2.4 速度指令长什么样

差速底盘和键盘遥控之间的合同几乎总是 `geometry_msgs/msg/Twist`：

| 字段 | 单位 | 差速机器人 |
| --- | --- | --- |
| `linear.x` | m/s | 前进为正 |
| `linear.y` | m/s | 不用，保持 0 |
| `linear.z` | m/s | 不用 |
| `angular.z` | rad/s | 逆时针为正 |
| `angular.x`、`angular.y` | rad/s | 不用 |

坐标轴按 [REP 103](https://www.ros.org/reps/rep-0103.html)：x 向前，y 向左，z 向上，右手系。机体坐标系的名字按 [REP 105](https://www.ros.org/reps/rep-0105.html)，在 [9.5](./05-tf-time-rosbag.md) 展开。

`Twist` 没有 `header`，所以 `ros2 topic delay` 用不上。需要时间戳时用 `geometry_msgs/msg/TwistStamped`。

手发一条速度，确认字段名没写错：

```bash
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.1, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.2}}"
```

真机上先把轮子架空。`linear.x: 0.1` 是每秒 0.1 米，不是「很慢的百分比」。

## 9.2.5 QoS：对不上就一条都没有

QoS 是这条连接答应做到什么程度。订阅者提出愿意接受的最低质量，发布者给出自己能提供的质量。请求比提供更严，这一对就 **不建立连接**，不是「偶尔丢包」。

| 策略 | 取值 | 怎么选 |
| --- | --- | --- |
| Reliability | RELIABLE 或 BEST_EFFORT | 指令、状态用 Reliable。激光、图像、点云用 Best Effort，只要最新一帧 |
| Durability | VOLATILE 或 TRANSIENT_LOCAL | 传感器和速度用 Volatile。地图这种「晚启动也要拿到最后一条」才两边都用 Transient Local |
| History / depth | KEEP_LAST + 深度 | 处理不过来时丢掉旧样本。深度不一致 **不会** 阻止连接 |
| Deadline、Lifespan、Liveliness | 默认即可 | 等你需要检测「对方停更了」再设 |

可靠性的搭配：

| 发布者 | 订阅者 | 结果 |
| --- | --- | --- |
| Best effort | Best effort | 通 |
| Reliable | Reliable | 通 |
| Reliable | Best effort | 通 |
| Best effort | Reliable | **不通** |

耐久性同理：发布者 Volatile、订阅者 Transient Local，不通。反过来则通，但晚加入者看不到历史。

激光驱动通常用传感器预设：Best Effort、Volatile、KeepLast(5)。rclpy 里是 `qos_profile_sensor_data`。业务节点若写成 `create_subscription(..., 10)`，订阅端是 Reliable，于是回调永远不来。`ros2 topic info -v` 仍能看见双方。

```python
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import LaserScan

self.create_subscription(LaserScan, 'scan', self.on_scan, qos_profile_sensor_data)
```

`ros2 topic echo` 默认用传感器预设，所以它经常能看见 `/scan`，而你自己的 Reliable 订阅看不见。这不是驱动坏了。若你把 echo 固定成可靠模式，它也会沉默：

```bash
ros2 topic echo /scan --qos-reliability best_effort --qos-durability volatile
```

Jazzy 另有 `best_available` 预设，会在创建端点时去迁就已经发现的对端。Humble 没有这个名字，不要写进 Humble 的代码。

## 9.2.6 和 ROS 1 不同的地方

- 队列长度参数同时决定了可靠性，不只是队列。
- latched 话题要换成双方都是 Transient Local。
- 私有名是 `~/foo`。
- 重映射旗标是 `--ros-args -r __node:=`。

## 练习

1. 让 talker 改发 `geometry_msgs/msg/Twist`，10 Hz，`linear.x` 在 0 和 0.2 之间交替。
2. 用 `__ns:=/robot1` 启动它，确认话题变成 `/robot1/chatter` 或你重映射后的绝对名。
3. 另写一个订阅者，用 `qos_profile_sensor_data` 去听一个 Reliable 的 talker，再对调。用 `ros2 topic info -v` 记下两种情况下的 reliability，解释哪一种收得到。

## 来源

- [Understanding topics](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.html)
- [Writing a publisher and subscriber (Python)](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Py-Publisher-And-Subscriber.html)
- [About Quality of Service](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Quality-of-Service-Settings.html)
- [Node arguments](https://docs.ros.org/en/humble/How-To-Guides/Node-arguments.html)
- [REP 103](https://www.ros.org/reps/rep-0103.html)

下一节：[9.3 接口、服务与动作](./03-interfaces-services-actions.md)。
