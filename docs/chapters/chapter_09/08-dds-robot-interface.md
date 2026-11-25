# 9.8 多机通信与真机话题

到这里，节点、话题、参数和坐标都有了。真机上还差两件事：这些进程怎样在网络里互相看见，以及底盘到底认哪条话题。

## 学习目标

- 说明 RMW 负责发现、传输和 QoS，Humble 默认是 Fast DDS
- 用 `ROS_DOMAIN_ID` 把两组实验隔开
- 写出差速底盘的最小话题合同，并在动手前核对 `cmd_vel` 的类型
- 给多机器人加命名空间时，连 tf 的坐标系一起加前缀

## 9.8.1 DDS 在这里的角色

ROS 2 没有 master。RMW 把节点和话题翻译成某家 DDS 的发现、序列化和传输。QoS 也由这层执行。

Humble 随二进制发布、并且文档标成完全支持的两家是：

| 实现 | 环境变量的值 | 地位 |
| --- | --- | --- |
| eProsima Fast DDS | `rmw_fastrtps_cpp` | 默认 |
| Eclipse Cyclone DDS | `rmw_cyclonedds_cpp` | 需另装包才能切换 |

[REP 2000](https://www.ros.org/reps/rep-2000.html) 里带默认标记的一行：Humble、Iron、Jazzy、Kilted 都是 Fast DDS。默认用 Cyclone 的是已经停止维护的 Galactic。不要把「ROS 2 默认 Cyclone」写进 Humble 的环境。

同一套机器人用同一个发行版、同一个 RMW。不同 RMW 有时能互通，官方不保证。

## 9.8.2 切换实现

```bash
sudo apt install ros-humble-rmw-cyclonedds-cpp
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ros2 daemon stop
```

未设置变量时，装了 Fast DDS 就用它。Fast DDS 不在、只装了别的实现时，按包名字母序选第一个，结果可能不是你以为的那家。

`ros2 doctor --report` 能看到当前中间件。daemon 会记住它启动时的 RMW 和 domain。节点已经换成 Cyclone、daemon 还是 Fast DDS 时，`ros2 node list` 是空的。先 `ros2 daemon stop`。

大点云在 Cyclone 上中断时，官方调优页才建议增大套接字缓冲，并用 `CYCLONEDDS_URI` 指向一份只改缓冲区的 XML。那是大消息问题的起点，不是每台机器人的必备配置。见 [DDS tuning](https://docs.ros.org/en/humble/How-To-Guides/DDS-tuning.html)。

默认发现用组播。Wi-Fi 上组播经常不可靠。官方的第一检查是：

```bash
ros2 multicast receive
ros2 multicast send
```

另一台终端应收到 `Hello World!`。防火墙若用 `ufw`，排错页给出的最小放行只针对组播地址段 `224.0.0.0/4` 的 UDP。那不是「关掉防火墙」。是否放行按现场策略决定。

域 0 的发现组播端口是 7400。完整公式在 [About Domain ID](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Domain-ID.html)。

## 9.8.3 用域把实验隔开

`ROS_DOMAIN_ID` 把同一网络切成互不可见的逻辑网。默认是 0。Linux 上建议用 0 到 101。

```bash
export ROS_DOMAIN_ID=30
```

同一局域网里每个人都用 0，节点会互相发现，键盘遥控可能开到别人的车。每组实验用一个未占用的整数，机器人和笔记本必须相同。TurtleBot3 手册的例子就是 30，那只是例子，不是保留值。

域号不是口令。它只改发现用的 UDP 端口，不加密内容。

ROS 2 可以做 DDS 安全（SROS2）：证书、权限、治理文件。总开关是 `ROS_SECURITY_ENABLE`，默认不打开。未配置时，不要把同一 Wi-Fi 上的话题当成保密通道。配置步骤以官方教程为准，本章不展开签发证书：

- [About security](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Security.html)
- [Introducing ROS 2 security](https://docs.ros.org/en/humble/Tutorials/Advanced/Security/Introducing-ros2-security.html)

## 9.8.4 差速底盘的最小合同

单位仍是米和弧度。差速底盘只使用 `linear.x`（前进，m/s）和 `angular.z`（逆时针，rad/s）。

| 话题 | 类型 | 谁发布 | 谁消费 |
| --- | --- | --- | --- |
| `cmd_vel` | 见下一小节 | 遥控或导航控制器 | 底盘驱动 |
| `odom` | `nav_msgs/msg/Odometry` | 轮式里程计 | 定位、导航 |
| `scan` | `sensor_msgs/msg/LaserScan` | 雷达驱动 | 代价地图、SLAM |
| `joint_states` | `sensor_msgs/msg/JointState` | 关节或轮子驱动 | `robot_state_publisher` |
| `/tf` | `tf2_msgs/msg/TFMessage` | 里程计发 `odom → base_link`，定位发 `map → odom` | tf2、RViz |
| `/tf_static` | 同上 | `robot_state_publisher` 的固定关节 | tf2 |

名字写在节点里时通常是相对名。节点在根命名空间时，它们才出现为 `/cmd_vel`、`/odom`、`/scan`。

**`cmd_vel` 不永远是 `Twist`。** Humble 的 Nav2 控制器源码发 `geometry_msgs/msg/Twist`。Humble 的 `diff_drive_controller` 默认订阅的是节点私有名 `~/cmd_vel`（`TwistStamped`）和 `~/cmd_vel_unstamped`（`Twist`），里程计在 `~/odom`。Jazzy 的 TurtleBot3 手册把 `cmd_vel` 写成 `TwistStamped`，要用回 `Twist` 就改 `enable_stamped_cmd_vel`。接真机前执行：

```bash
ros2 topic info /cmd_vel --verbose
```

类型不一致时，图上两边都在，回调一条都没有。这和 QoS 不兼容是同一类故障：配对条件没满足。

`/odom` 有数据而 RViz 里车不动时，再查变换。导航要的是消息和 `odom → base_link` 两条一起在：

```bash
ros2 run tf2_ros tf2_echo odom base_link
```

## 9.8.5 两台机器人

根上的 `/cmd_vel` 只能有一个写入者。第二台车用命名空间：

```bash
ros2 run my_robot_pkg cruise --ros-args -r __ns:=/robot1
```

相对名 `cmd_vel` 变成 `/robot1/cmd_vel`。坐标系也要变成 `robot1/base_link`、`robot1/odom`。只改话题、不改 `frame_id`，两台车的 tf 会抢同一个 `base_link`。

Nav2 的多机器人 launch 还会把 `/tf` 重映射成相对名 `tf`，否则变换仍挤在全局 `/tf` 上。前缀的规则以那份 launch 和机器人的 URDF 为准：

- [Nav2 bringup（Humble）](https://github.com/ros-navigation/navigation2/blob/humble/nav2_bringup/launch/bringup_launch.py)
- [OSRF 多机器人书](https://osrf.github.io/ros2multirobotbook/) 只用来看命名空间的思路，命令以你当前发行版为准

每个坐标系仍然只有一个父节点。

## 9.8.6 第一检查

运动之前只做只读检查。

| 症状 | 先看 |
| --- | --- |
| 两个终端互相看不见 | `echo $ROS_DOMAIN_ID` 是否相同 |
| 节点在跑，`node list` 是空的 | `ros2 daemon stop` 后再查 |
| 换了 RMW 仍然看不见 | `printenv RMW_IMPLEMENTATION`，然后停 daemon |
| 新终端没有 `ros2` | `echo $ROS_DISTRO` |
| 两机能 ping，ROS 不通 | `ros2 multicast receive` / `send` |
| 车不动，发行版是 Jazzy | `topic info` 看是不是 `TwistStamped` |
| `/odom` 有了，模型不动 | `tf2_echo odom base_link` |
| `/scan` 有了，代价地图是空的 | `header.frame_id` 能否变到 `base_link` |
| 车速乱跳 | `topic info /cmd_vel` 的发布者是否多于一个 |

## 9.8.7 中文材料里容易过时的三点

[鱼香 ROS 2 的 Humble 教程](https://fishros.com/d2lros2/) 把通信、DDS 和 Nav2 串成了一条学习路径，适合跟着做。它写于 Humble 周期，没有 Jazzy 的 `TwistStamped` 变化。

2018 年的中文入门笔记讲清了「没有 master、用 DDS」这件事，但包名仍是 `rmw_connext_cpp`、`rmw_fastrtps_cpp` 的早期写法。Humble 的 Connext 标识是 `rmw_connextdds`。

不要从旧文带走这三句：

- 「ROS 2 默认 Cyclone」只对 Galactic 成立。
- 「`/cmd_vel` 一定是 `Twist`」在 Jazzy 的 TurtleBot3 上已经不成立。
- 「域号就是安全隔离」不成立。加密要另开 SROS2。

## 练习

1. 两个终端设成不同的 `ROS_DOMAIN_ID`，确认 `ros2 node list` 互相为空。再设回同一个值。
2. 对一个正在发布的 `cmd_vel` 运行 `ros2 topic info -v`，把类型和 reliability 记下来。写订阅者时用同一种类型。
3. 用 `__ns:=/robot1` 启动 [9.2](./02-graph-topics-qos.md) 的 talker。列出话题，确认没有落在根上的 `/chatter`。

## 来源

- [About different middleware vendors](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Different-Middleware-Vendors.html)
- [Working with multiple RMW implementations](https://docs.ros.org/en/humble/How-To-Guides/Working-with-multiple-RMW-implementations.html)
- [About Domain ID](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Domain-ID.html)
- [Installation troubleshooting](https://docs.ros.org/en/humble/How-To-Guides/Installation-Troubleshooting.html)
- [REP 2000](https://www.ros.org/reps/rep-2000.html)
- [About security](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Security.html)

回到 [9.0 全景](./index.md)，或去 [拓展阅读](./further-reading.md)。
