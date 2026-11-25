# 9.5 坐标、时间与 rosbag

激光的话题名对了还不够。点在哪个坐标系、在哪一时刻采的，决定了它能不能和底盘对上。这一节只建立这棵树和记录它的方法。定位算法、Gazebo 世界和 Nav2 代价地图在后面的章。

## 学习目标

- 画出 `map → odom → base_link → 传感器`，并保证每条边只有一个发布者
- 用节点时钟给消息盖时间戳，用 `Time()` 查询最新变换
- 写一份两连杆的 URDF，交给 `robot_state_publisher`
- 用 `ros2 bag` 录下 `/tf` 和传感器，再播回来

## 9.5.1 轴和四层树

单位是米、弧度、秒。[REP 103](https://www.ros.org/reps/rep-0103.html) 规定机体坐标：x 向前，y 向左，z 向上，右手系。绕 z 的正角度是逆时针。相机光轴常用另一个坐标系，名字带 `_optical`：z 向前，x 向右，y 向下。不要把光轴系当成机体轴。

[REP 105](https://www.ros.org/reps/rep-0105.html) 规定移动底盘的树：

```text
map  →  odom  →  base_link  →  laser_frame
```

| 坐标系 | 含义 | 谁发布指向它的那条边 |
| --- | --- | --- |
| `base_link` | 底盘刚体，轴向遵守 REP 103 | 里程计发布 `odom → base_link` |
| `odom` | 连续、会漂移的局部世界。控制用它 | 同上，只有这一个里程计源 |
| `map` | 允许跳变的全局世界。定位修正写在这里 | 定位发布 `map → odom`，不要发布 `map → base_link` |
| `laser_frame` | 雷达相对车体的固定安装位姿 | URDF 的 fixed 关节，或一个静态变换，二选一 |

每个子坐标系只能有一个父坐标系。两个节点发布同一对 parent/child，后写入的会覆盖缓存，RViz 里模型和点云错开，话题名看起来却都正常。

`base_footprint`（地面投影）不在 REP 105 正文里。有的 URDF 把它插在 `odom` 和 `base_link` 之间。可以用，但里程计只能喂其中一条边。

## 9.5.2 发布和查询变换

动态变换走 `/tf`，固定变换走 `/tf_static`。`/tf_static` 是 Transient Local：后启动的监听者仍能拿到最后一次静态变换。

里程计广播的最小形状。四元数这里只演示航向角，`x = y = 0`，`z = sin(yaw/2)`，`w = cos(yaw/2)`。不要依赖一个未声明的 `tf_transformations` 包。

```python
import math
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import TransformStamped
from tf2_ros import TransformBroadcaster


class OdomTf(Node):

    def __init__(self):
        super().__init__('odom_tf')
        self.broadcaster = TransformBroadcaster(self)
        self.yaw = 0.0
        self.create_timer(0.05, self.on_timer)

    def on_timer(self):
        t = TransformStamped()
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'odom'
        t.child_frame_id = 'base_link'
        t.transform.translation.x = 0.0
        t.transform.rotation.z = math.sin(self.yaw * 0.5)
        t.transform.rotation.w = math.cos(self.yaw * 0.5)
        self.broadcaster.sendTransform(t)


def main():
    rclpy.init()
    node = OdomTf()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

`header.stamp` 用 `self.get_clock().now().to_msg()`。这是节点的 ROS 时钟，不是 `time.time()`。参数 `use_sim_time` 为真时，这个时钟跟随 `/clock`。混用墙钟和仿真钟，查询就会报外推错误。

监听时，时间参数 `rclpy.time.Time()`（零时刻）表示 **缓存里最新的一条**，不是「现在」。用 `now()` 去查，变换戳通常早几毫秒，缓存里没有未来，于是 `ExtrapolationException`。

```python
from tf2_ros import Buffer, TransformListener, TransformException

self.buffer = Buffer()
self.listener = TransformListener(self.buffer, self)

def on_timer(self):
    try:
        t = self.buffer.lookup_transform('odom', 'base_link', rclpy.time.Time())
    except TransformException as ex:
        self.get_logger().warn(str(ex))
        return
```

激光点要变到 `odom` 时，查询时间用 **那条** `LaserScan.header.stamp`，不要用查询瞬间的 `now()`。

不要在订阅回调里把 `lookup_transform` 的超时设得很长。等待会堵住执行器，新的 `/tf` 进不来。默认超时是 0：没有就立刻抛异常。捕获 `TransformException` 即可，它盖住找不到坐标系、连不通和外推。

坐标系 id 不要以 `/` 开头。`base_link` 合法，`/base_link` 会在 tf2 里被拒绝。

固定的雷达外参若还没有 URDF，用旗标形式，Humble 和 Jazzy 都认：

```bash
ros2 run tf2_ros static_transform_publisher \
  --x 0.2 --y 0 --z 0.15 --yaw 0 --pitch 0 --roll 0 \
  --frame-id base_link --child-frame-id laser_frame
```

旧的「八个位置参数、yaw 在 roll 前面」会报警，rolling 上已删除。新 launch 不要再写它。

## 9.5.3 一份最小 URDF

URDF 描述连杆和关节。`robot_state_publisher` 读取参数 `robot_description`，把固定关节发到 `/tf_static`，把活动关节按 `/joint_states` 发到 `/tf`。xacro 是展开成 URDF 的宏，运行时 tf 不读 xacro 原文。

```xml
<?xml version="1.0"?>
<robot name="deskbot">
  <link name="base_link"/>
  <link name="laser_frame"/>
  <joint name="laser_joint" type="fixed">
    <parent link="base_link"/>
    <child link="laser_frame"/>
    <origin xyz="0.2 0 0.15" rpy="0 0 0"/>
  </joint>
</robot>
```

Launch 里读文件、交给状态发布器。不要再另起一个 `static_transform_publisher` 发同一对坐标系。

```python
from pathlib import Path
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    urdf = Path(__file__).with_name('deskbot.urdf').read_text()
    return LaunchDescription([
        Node(
            package='robot_state_publisher',
            executable='robot_state_publisher',
            parameters=[{'robot_description': urdf}],
        ),
    ])
```

包要 `<exec_depend>robot_state_publisher</exec_depend>`。检查：

```bash
ros2 run tf2_ros tf2_echo base_link laser_frame
```

应看到平移 x 约 0.2 米。`tf2_echo` 会等到这条边出现。

## 9.5.4 录下来，再播回去

```bash
ros2 bag record -o desk /scan /tf /tf_static /cmd_vel
ros2 bag info desk
ros2 bag play desk
```

Humble 的默认存储是 **sqlite3**，目录里是 `metadata.yaml` 和 `.db3`。Jazzy 及更新的发行版默认是 **mcap**。在 Humble 上要 mcap 必须写明：

```bash
ros2 bag record -s mcap -o desk /scan /tf /tf_static
```

回放是把消息重新发布。现场驱动若还在发 `/tf` 和 `/scan`，包和真机会抢同一条边。回放前停掉驱动，或者 `--remap` 到别的名字。

仿真时间要成对出现：节点侧 `use_sim_time:=true`，播放侧发布时钟。Humble 的旗标是 `--clock`，默认 40 Hz：

```bash
ros2 bag play desk --clock
```

只给一半节点打开 `use_sim_time`，另一半仍用墙钟，是外推错误的常见来源。`/clock` 只留一个发布者。

`/tf_static` 是 Transient Local。录包时要确认包里真有这些静态样本（`ros2 bag info` 里能看到条数）。晚于录制开始才启动的 `robot_state_publisher` 若没被录进去，回放时雷达坐标系会缺父节点。

## 9.5.5 和 ROS 1 不同的地方

- 静态变换有单独话题 `/tf_static`，不是靠 latched `/tf`。
- `lookup` 的零时间是「最新」，用 `rclpy.time.Time()`。
- 坐标系名不要前导斜杠。
- `rosbag` 命令是 `ros2 bag`。Humble 默认 sqlite3，不是所有发行版都默认 mcap。

## 练习

1. 发布本节的 `odom → base_link`，用 `tf2_echo odom base_link` 看到单位四元数附近的旋转。
2. 加上两连杆 URDF。`ros2 topic echo /tf_static --qos-durability transient_local` 能看到 `laser_frame`。耐久性必须是 transient local，否则 echo 的默认可能对不上，一条都没有。
3. 录 10 秒 `/tf` 和 `/tf_static`，停掉广播器，再 `ros2 bag play`。`tf2_echo` 应恢复。若没有，先看包里这两个话题的条数。

## 来源

- [REP 103](https://www.ros.org/reps/rep-0103.html)
- [REP 105](https://www.ros.org/reps/rep-0105.html)
- [Writing a tf2 broadcaster (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Writing-A-Tf2-Broadcaster-Py.html)
- [Writing a tf2 listener (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Writing-A-Tf2-Listener-Py.html)
- [static_transform_publisher](https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Writing-A-Tf2-Static-Broadcaster-Cpp.html)
- [Recording and playing back data](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html)

下一节：[9.6 执行器、组件与 C++](./06-executor-components.md)。
