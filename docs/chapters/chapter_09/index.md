# 第9章：ROS 2 核心概念

ROS 2 是机器人软件的中间层。它不代替 Linux，也不代替电机驱动。它解决的是另一件事：很多进程要交换传感器数据、配置和长任务，而且这些进程经常不在同一台电脑上。

本章按「写一个能在真机上维护的节点」来组织，而不是按名词表。每一节都能单独读完并动手。示例以 **Humble Hawksbill**（Ubuntu 22.04）为准。Jazzy、Kilted、Lyrical 的差异写在对应小节里。日期以 2026 年 11 月的发行说明为准，支持窗口会变，选版本前再看 [发行节奏](https://docs.ros.org/en/rolling/The-ROS2-Project/Release-Schedule.html)。

## 先建立这张图

一个差速小车在软件里通常是这些进程：

```text
激光驱动 --/scan--> 算法节点 --/cmd_vel--> 底盘驱动 --/odom--> 算法节点
                      |                         |
                      +-------- /tf ------------+
参数文件、Launch 负责把它们按命名空间拉起来
rosbag 负责把 /scan、/tf、/cmd_vel 录下来以后回放
```

后面九节就是把这张图里的每一根线讲清楚。

| 节 | 你将能做的事 |
| --- | --- |
| [9.1 发行版、安装与工作空间](./01-distro-workspace.md) | 选发行版、装桌面版、建 overlay、交出一个能 `ros2 run` 的包 |
| [9.2 计算图、话题与 QoS](./02-graph-topics-qos.md) | 发布和订阅、看懂命名与重映射、处理 QoS 不兼容 |
| [9.3 接口、服务与动作](./03-interfaces-services-actions.md) | 在「数据流 / 短请求 / 可取消长任务」之间做对选择 |
| [9.4 参数与 Launch](./04-parameters-launch.md) | 用 YAML 配节点，用一个 launch 拉起一组节点 |
| [9.5 坐标、时间与 rosbag](./05-tf-time-rosbag.md) | 发对 tf、打对时间戳、录包回放 |
| [9.6 执行器、组件与 C++](./06-executor-components.md) | 知道回调为什么卡住，能读一段 rclcpp |
| [9.7 命令行与排错](./07-cli-debugging.md) | 用 CLI 和 rqt 在十分钟内缩小故障范围 |
| [9.8 多机通信与真机话题](./08-dds-robot-interface.md) | 定 `/cmd_vel`、`/odom`、`/scan`、`/tf` 的合同，换 RMW 和 domain |
| [拓展阅读](./further-reading.md) | 课程、社区和开源项目索引 |

## 三种通信，先记住用途

| 机制 | 形态 | 典型数据 |
| --- | --- | --- |
| 话题 Topic | 多对多的数据流，发完即走 | 激光、图像、速度指令 |
| 服务 Service | 一问一答，调用方等结果 | 触发一次标定、查询一次状态 |
| 动作 Action | 长时间任务，带反馈，可取消 | 导航到某点、规划一条轨迹 |

参数不是第四种通信。参数是启动时和运行中的配置。100 Hz 的传感器不要塞进参数。

## 阅读顺序

第一次学：9.1 → 9.2 → 9.4 → 9.7，做完每节末尾的练习，再读 9.3 和 9.5。9.6 和 9.8 在你要读 Nav2 源码或把节点放到另一台电脑上时再读。

已经会 ROS 1：直接读每节里的「和 ROS 1 不同」段落。最容易带错的三件事是：没有 master、参数必须先声明、QoS 不一致时订阅者收不到数据。

## 本章不讲的内容

Gazebo、Nav2、MoveIt、SLAM 在第 10 章以后。本章只把那些包赖以运行的接口、坐标和时间讲到能对接的程度。

## 练习怎么算做完

每节有一个最小练习。全部做完时，你的工作空间里应有一个 Python 包，它能：

1. 以 10 Hz 发布 `geometry_msgs/msg/Twist` 到 `cmd_vel`。
2. 用服务重置计数器。
3. 用 launch 同时启动发布者和一个打印订阅者，速度上限来自 YAML。
4. 把 `cmd_vel` 录进 rosbag，再回放出来。

代码风格跟官方 rclpy 教程一致：一个类继承 `Node`，`main()` 里 `init`、`spin`、`shutdown`。
