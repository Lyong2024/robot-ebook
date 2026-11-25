# 9.7 命令行与排错

图上的故障大多数不用改代码。这一节是一张「我想知道什么 → 用哪条命令」的表，以及三个最常让 rqt 变成空白的原因。

命令以 Humble 的 `ros2cli` 为准。Jazzy 上这些子命令相同。每个新终端先 `source /opt/ros/humble/setup.bash`，有工作空间再 source 它的 `install/setup.bash`。

## 学习目标

- 在不改代码的情况下确认节点、话题、类型和 QoS
- 把日志开到 DEBUG，同时避免在高频回调里刷 INFO
- 判断「看不到节点」是没 source、domain 不同，还是 daemon 缓存

## 9.7.1 命令对照

图查询默认走一个后台 daemon，用来缓存发现结果。缓存过时时加 `--no-daemon`，或先 `ros2 daemon stop`。

| 我想知道 | 命令 |
| --- | --- |
| 有哪些节点 | `ros2 node list` |
| 含下划线开头的隐藏节点 | `ros2 node list -a` |
| 某节点的发布、订阅、服务 | `ros2 node info /cruise` |
| 有哪些话题 | `ros2 topic list -t` |
| 类型、端点数 | `ros2 topic info /chatter` |
| 再加上 QoS | `ros2 topic info /chatter --verbose` |
| 看内容 | `ros2 topic echo /chatter` |
| 频率 | `ros2 topic hz /chatter` |
| 谁在用这种类型 | `ros2 topic find geometry_msgs/msg/Twist` |
| 发一条就停 | `ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.0}}"` |
| 有哪些服务 | `ros2 service list -t` |
| 调一次空服务 | `ros2 service call /clear std_srvs/srv/Empty` |
| 某节点的参数 | `ros2 param list /cruise` |
| 读、改、看描述 | `ros2 param get /cruise max_speed`、`ros2 param set`、`ros2 param describe` |
| 导出 YAML | `ros2 param dump /cruise > cruise.yaml` |
| 包在哪 | `ros2 pkg prefix my_robot_pkg --share` |
| 包里的可执行文件 | `ros2 pkg executables my_robot_pkg` |
| 接口定义 | `ros2 interface show geometry_msgs/msg/Twist` |
| 一份可粘贴的 YAML 样例 | `ros2 interface proto geometry_msgs/msg/Twist` |
| 环境自检 | `ros2 doctor` |
| 只看失败项 | `ros2 doctor --report-failed` |
| 和 doctor 同一条命令 | `ros2 wtf` |
| 绕过发现缓存 | `ros2 node list --no-daemon` |
| 停掉缓存进程 | `ros2 daemon stop` |

`ros2 param set` 只改当前进程，重启即丢失。要保留，就 `dump` 成 YAML，再用 `--params-file` 启动。

`ros2 interface` 三个动词不要混：

| 动词 | 输出 |
| --- | --- |
| `list` | 已安装的类型名字 |
| `show` | 字段、常量和注释 |
| `proto` | 一份默认值 YAML。服务只给 Request，动作只给 Goal |

`topic find` 的帮助文本里曾把 `std_msgs` 印成 `std_msg`。类型名以 `ros2 interface list` 为准，是 `std_msgs/msg/String`。

## 9.7.2 日志

级别从低到高是 DEBUG、INFO、WARN、ERROR、FATAL。没到级别的语句不会进三个出口：终端、`~/.ros/log`、话题 `/rosout`。

Humble 上把某个节点调到 DEBUG：

```bash
ros2 run my_robot_pkg cruise --ros-args --log-level cruise:=DEBUG
```

也可以 `--log-level debug` 作用于整个进程。环境变量 `RCUTILS_LOGGING_SEVERITY` 在 Humble 的 rcutils 里 **没有** 这个开关，不要从旧笔记里抄。

日志文件名是 `~/.ros/log/<可执行文件>_<pid>_<毫秒时间>.log`。没有官方的 `latest/` 目录。Launch 里要在当前终端看，节点设 `output='screen'`。

rqt 里过滤 `/rosout`：

```bash
sudo apt install ros-humble-rqt-console
ros2 run rqt_console rqt_console
```

计算图和曲线：

```bash
sudo apt install ros-humble-rqt-graph ros-humble-rqt-plot
ros2 run rqt_graph rqt_graph
ros2 run rqt_plot rqt_plot
```

100 Hz 回调里不要 `info`。过了级别检查之后，每次调用都要写终端、写文件、发 `/rosout`，C++ 侧还有一把进程内的日志锁。高频数据用 `ros2 topic hz` 看，日志只留状态变化。

## 9.7.3 rqt_graph 是空的

按这个顺序查，不要同时改三处：

1. **没 source。** 新终端里 `ros2` 找不到，或找到的是另一个发行版。`echo $ROS_DISTRO` 应是 `humble`。
2. **`ROS_DOMAIN_ID` 不同。** 一个终端是 0，另一个是 7，图是隔开的。同一机器人上的终端保持同一个值。细节在 [9.8](./08-dds-robot-interface.md)。
3. **daemon 还记着旧图。** 节点已经退出，`ros2 node list` 仍能看到。执行 `ros2 daemon stop`，或查询时加 `--no-daemon`。

`ros2 doctor` 看本机环境。`ros2 doctor hello` 是另一条子命令，用来在两台机器之间互发组播，不是 doctor 的旗标。

## 9.7.4 一轮五分钟的排错

节点「不说话」时：

```bash
ros2 node list --no-daemon
ros2 node info /cruise
ros2 topic info /cmd_vel --verbose
ros2 topic hz /cmd_vel
```

- `node list` 没有它：进程没起来，或 domain / RMW 不一致。
- 有节点、没有话题：名字被重映射了，用 `node info` 看实际话题。
- 有发布者、`hz` 为 0、订阅者 QoS 更严：回到 [9.2](./02-graph-topics-qos.md) 的可靠性表。
- `hz` 正常但机器人不动：消息到了驱动，问题在串口、急停或单位，不在图里。

## 练习

1. 启动 talker。用 `interface proto` 生成 YAML，再 `topic pub --once` 发一条同类型消息。不要手写字段名。
2. 用 `--log-level talker:=DEBUG` 启动，确认终端里出现 DEBUG。再改回 info，确认 DEBUG 消失。
3. 在一个终端 `export ROS_DOMAIN_ID=42` 后启动节点，另一个终端不设置。`ros2 node list` 应看不到它。两边设成同一个数字后再看。

## 来源

- [About command line tools](https://docs.ros.org/en/humble/Concepts/Basic/About-Command-Line-Tools.html)
- [About logging](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Logging.html)
- [Getting started with ros2doctor](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Getting-Started-With-Ros2doctor.html)
- [Using rqt_console](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Using-Rqt-Console/Using-Rqt-Console.html)

下一节：[9.8 多机通信与真机话题](./08-dds-robot-interface.md)。
