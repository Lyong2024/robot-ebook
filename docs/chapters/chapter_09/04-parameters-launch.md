# 9.4 参数与 Launch

节点能通信之后，下一步是不要把速度上限写死在源码里，也不要开四个终端去启动四个进程。参数是配置。Launch 是启动清单。

## 学习目标

- 声明参数、从 YAML 覆盖、在运行中修改
- 写出能安装、能 `ros2 launch` 的 Python launch 文件
- 避开 Humble 上不存在的 Jazzy 回调 API

## 9.4.1 参数不是话题

参数挂在某一个节点上，有名字、类型和描述。类型是固定的：`bool`、`int64`、`float64`、`string`，以及它们的数组。用来放轮距、串口设备名、速度上限、是否使用仿真时间。

100 Hz 的激光不要放进参数。参数服务不是数据通道。

和 ROS 1 的差别：节点必须先 **声明** 它接受的参数。外部用命令行、YAML 或 `ros2 param set` 写入一个没声明的名字，默认会被拒绝，不会悄悄出现在参数服务器上。`Node` 的 `allow_undeclared_parameters` 默认是 `False`。只有参数名事先未知时才打开它。

类型在声明时定下。运行中把字符串改成数字，默认失败。

## 9.4.2 在类里声明和读取

```python
import rclpy
from rclpy.node import Node
from rcl_interfaces.msg import ParameterDescriptor


class Cruise(Node):

    def __init__(self):
        super().__init__('cruise')
        self.declare_parameter(
            'max_speed',
            0.3,
            ParameterDescriptor(
                description='Linear speed limit in m/s.',
                read_only=True,
            ),
        )
        self.declare_parameter('robot_name', 'bot')
        self.timer = self.create_timer(1.0, self.on_timer)

    def on_timer(self):
        speed = self.get_parameter('max_speed').value
        name = self.get_parameter('robot_name').value
        self.get_logger().info('%s max_speed=%s' % (name, speed))


def main():
    rclpy.init()
    node = Cruise()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
```

`read_only=True` 的参数在初始化之后不能 `ros2 param set`。启动时的 YAML 仍然能给定初始值，因为那时候还在初始化。

没声明就 `get_parameter`，会得到 `ParameterNotDeclaredException`。

要拒绝非法值，用 Humble 有的这一个回调。它只负责检查，不要在里面改成员变量：后面的回调仍可能拒绝这次修改。

```python
from rcl_interfaces.msg import SetParametersResult

def on_set(params):
    result = SetParametersResult(successful=True)
    for param in params:
        if param.name == 'robot_name' and param.value == '':
            result.successful = False
            result.reason = 'robot_name must not be empty'
    return result

self.add_on_set_parameters_callback(on_set)
```

Jazzy 另外有 `add_pre_set_parameters_callback` 和 `add_post_set_parameters_callback`。Humble 的 rclpy 没有这两个方法。改成员变量的逻辑放在你确认 `set` 成功之后的定时器或事件里，不要假设 Humble 有 post 回调。

`package.xml` 如果直接 import 了 `rcl_interfaces`，加上 `<exec_depend>rcl_interfaces</exec_depend>`。

## 9.4.3 YAML 长什么样

文件的键是节点全名，下面固定一层 `ros__parameters`。通配符按 `/` 切开的整段匹配，不能写 `foo*`。

```yaml
cruise:
  ros__parameters:
    max_speed: 0.2
    robot_name: "crate"

/**:
  ros__parameters:
    use_sim_time: false
```

- `/**` 匹配任意命名空间下的任意节点。
- `/*` 只匹配根命名空间下的任意节点，匹配不到 `/robot1/cruise`。
- 节点全名压过通配符。

```bash
ros2 run my_robot_pkg cruise --ros-args --params-file config/cruise.yaml
ros2 param list
ros2 param get /cruise max_speed
ros2 param set /cruise robot_name dock
ros2 param dump /cruise
```

单个参数可以不写文件：`--ros-args -p max_speed:=0.15`。所有 ROS 参数都要放在 `--ros-args` 后面。

键名必须已经 `declare_parameter`，否则默认被拒绝。`parameter_blackboard` 这个演示节点会自动接收任意参数，你自己的节点不会。

## 9.4.4 一个负责启动的文件

Launch 文件是 Python（也可以是 XML 或 YAML）。入口函数名必须是 `generate_launch_description`。

把 `launch/cruise.launch.py` 放在包根目录，而不是放进 Python 模块目录：

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    speed = LaunchConfiguration('max_speed')
    return LaunchDescription([
        DeclareLaunchArgument('max_speed', default_value='0.2'),
        Node(
            package='my_robot_pkg',
            executable='cruise',
            name='cruise',
            output='screen',
            parameters=[{
                'max_speed': speed,
                'robot_name': 'crate',
            }],
        ),
    ])
```

`parameters` 是一个 **列表**。元素可以是字典，也可以是 YAML 的绝对路径。多个元素按顺序传入，同名参数以后者为准。没写 `namespace` 时，字典会被加上 `/**` 前缀；`name` 和 `namespace` 都写了，就按该节点全名匹配。

`setup.py` 的 `data_files` 要把 `launch/` 装进 share，否则 `ros2 launch` 找不到文件：

```python
import os
from glob import glob

data_files=[
    ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
    ('share/' + package_name, ['package.xml']),
    (os.path.join('share', package_name, 'launch'), glob('launch/*.py')),
],
```

`package.xml` 增加：

```xml
<exec_depend>launch</exec_depend>
<exec_depend>launch_ros</exec_depend>
```

重新编译并在新终端 source 之后：

```bash
ros2 launch my_robot_pkg cruise.launch.py
ros2 launch my_robot_pkg cruise.launch.py max_speed:=0.05
ros2 launch my_robot_pkg cruise.launch.py --show-args
```

包含另一个 launch 时，官方示例把路径直接交给 `IncludeLaunchDescription`，参数用 `.items()`：

```python
from launch.actions import IncludeLaunchDescription
from launch.substitutions import PathJoinSubstitution

IncludeLaunchDescription(
    PathJoinSubstitution([
        FindPackageShare('my_robot_pkg'),
        'launch',
        'cruise.launch.py',
    ]),
    launch_arguments={'max_speed': '0.1'}.items(),
)
```

条件启动用 `IfCondition`。延迟启动用 `TimerAction(period=2.0, actions=[...])`。这些类都在 `launch.actions` 里。

节点日志默认进 `~/.ros/log`。Launch 里要在当前终端看见，设 `output='screen'`。

## 9.4.5 和 ROS 1 不同的地方

- 没有全局参数服务器。参数属于节点。
- 未声明的参数默认设不进去。
- `roslaunch` 的 XML 仍可用，但新文件优先写 Python，因为条件、替换和事件都在同一套 API 里。
- 改了 `setup.py` 的 `data_files` 必须重编。`--symlink-install` 不会替你发现一个从没安装过的目录。

## 练习

1. 给巡航节点加参数 `rate_hz`，默认 10。定时器周期用 `1.0 / rate_hz`。
2. 用 YAML 把 `rate_hz` 改成 2，用 `--params-file` 启动，看日志间隔。
3. 把 talker 和 listener 放进同一个 launch，listener 用 `remappings` 把 `chatter` 指到 `cruise/chatter`。`ros2 topic list` 里应只剩重映射后的那条，而不是两条互不相干的话题。

## 来源

- [About parameters](https://docs.ros.org/en/humble/Concepts/Basic/About-Parameters.html)
- [Using parameters in a class (Python)](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Using-Parameters-In-A-Class-Python.html)
- [Node arguments](https://docs.ros.org/en/humble/How-To-Guides/Node-arguments.html)
- [Launch substitutions](https://docs.ros.org/en/humble/Tutorials/Intermediate/Launch/Using-Substitutions.html)
- [Jazzy parameter callbacks](https://docs.ros.org/en/jazzy/Concepts/Basic/About-Parameters.html)（pre/post 仅 Jazzy）

下一节：[9.5 坐标、时间与 rosbag](./05-tf-time-rosbag.md)。
