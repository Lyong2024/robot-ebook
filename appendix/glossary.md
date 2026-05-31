# 机器人术语表

本术语表收录了机器人开发中常见的专业术语，提供中英文对照和简明解释。

---

## A

### Action（动作）
ROS 2 中的一种通信机制，用于长时间运行的任务。客户端发送目标，服务器执行任务并返回反馈和结果。适合导航、抓取等需要持续反馈的任务。

### Actuator（执行器）
将控制信号转换为物理运动的装置，如电机、气缸、液压装置等。机器人的"肌肉"。

### AMCL（Adaptive Monte Carlo Localization，自适应蒙特卡洛定位）
一种基于粒子滤波的定位算法，用于在已知地图中估计机器人位置。ROS 中的经典定位方案。

### Arduino
开源硬件平台，适合初学者进行电子原型开发。常用于机器人的底层控制。

### Autonomous（自主）
机器人能够在没有人类干预的情况下感知环境、做出决策并执行任务。

---

## B

### Base Link（基座坐标系）
机器人本体的参考坐标系，通常位于机器人底盘中心。所有其他坐标系都相对于它定义。

### Behavior Tree（行为树）
一种任务规划和决策的层次化结构，比有限状态机更灵活。常用于游戏 AI 和机器人任务规划。

### Boston Dynamics
美国机器人公司，以 Atlas、Spot 等动态腿式机器人闻名。

---

## C

### Cartographer
Google 开发的 SLAM 算法，支持 2D 和 3D 建图，精度高、鲁棒性强。

### CAN Bus（Controller Area Network，控制器局域网）
工业标准通信协议，常用于机器人内部模块间的实时通信。

### Callback（回调函数）
在 ROS 中，当消息到达时自动执行的函数。订阅者通过回调函数处理接收到的数据。

### Costmap（代价地图）
导航中使用的地图，每个栅格包含通过该区域的"代价"。障碍物代价高，空旷区域代价低。

### CV（Computer Vision，计算机视觉）
让计算机理解和处理图像的技术，是机器人感知的核心。

---

## D

### DARPA Robotics Challenge（DARPA 机器人挑战赛）
美国国防高级研究计划局举办的机器人竞赛，推动了人形机器人和灾难救援机器人的发展。

### Depth Camera（深度相机）
能够测量场景中每个像素距离的相机，如 Intel RealSense、Kinect。

### DDS（Data Distribution Service，数据分发服务）
ROS 2 的底层通信中间件，提供实时、可靠的数据传输。

### DOF（Degrees of Freedom，自由度）
机器人或机械臂能够独立运动的方向数量。6-DOF 机械臂可以到达空间中任意位置和姿态。

### DWB（Dynamic Window Approach，动态窗口法）
一种局部路径规划算法，通过评估速度空间中的轨迹来避障。Nav2 的默认局部规划器。

---

## E

### Embodied AI（具身智能）
将 AI 模型部署到物理机器人上，让模型能够与真实世界交互。强调"身体"对智能的重要性。

### Encoder（编码器）
测量电机旋转角度或速度的传感器，用于里程计和运动控制。

### End-Effector（末端执行器）
机械臂末端的工具，如夹爪、吸盘、焊枪等。

### ESP32
乐鑫公司的低成本微控制器，支持 WiFi 和蓝牙，适合物联网和机器人项目。

---

## F

### Figure AI
美国人形机器人公司，开发通用人形机器人 Figure 01。

### Forward Kinematics（正运动学）
根据关节角度计算末端执行器位置和姿态的过程。

### FPS（Frames Per Second，帧率）
视觉系统每秒处理的图像数量。实时机器人通常需要 30 FPS 以上。

---

## G

### Gazebo
开源 3D 机器人仿真器，支持物理引擎、传感器仿真和多机器人协作。ROS 的标准仿真平台。

### Gmapping
基于粒子滤波的 2D SLAM 算法，适合小型环境建图。

### GPIO（General Purpose Input/Output，通用输入输出）
微控制器的可编程引脚，用于连接传感器和执行器。

### Grasp Planning（抓取规划）
计算如何稳定抓取物体的算法，需要考虑接触点、力分布和物体几何。

---

## H

### HAL（Hardware Abstraction Layer，硬件抽象层）
隔离硬件细节的软件层，让上层代码不依赖具体硬件。

### Humble
ROS 2 的长期支持版本（2022-2027），推荐用于生产环境。

---

## I

### IMU（Inertial Measurement Unit，惯性测量单元）
测量加速度和角速度的传感器，用于姿态估计和里程计。

### Inverse Kinematics（逆运动学）
根据期望的末端执行器位置计算关节角度的过程。通常有多个解或无解。

---

## J

### Joint（关节）
机器人中允许相对运动的连接部分，如旋转关节（Revolute）和平移关节（Prismatic）。

---

## K

### Kalman Filter（卡尔曼滤波）
一种最优估计算法，融合多个传感器数据来估计系统状态。广泛用于定位和跟踪。

### Kinect
微软开发的深度相机，曾是机器人视觉的热门选择（已停产）。

---

## L

### LaserScan（激光扫描）
激光雷达输出的 2D 距离数据，用于建图和避障。

### LeRobot
Hugging Face 开源的机器人学习平台，提供数据集、模型和硬件设计。

### LiDAR（Light Detection and Ranging，激光雷达）
使用激光测量距离的传感器，精度高、范围远，是自动驾驶和机器人的核心传感器。

### Localization（定位）
确定机器人在地图中位置和朝向的过程。

---

## M

### Map（地图）
环境的数字化表示，可以是栅格地图、点云、拓扑图等。

### MoveIt
ROS 的运动规划框架，用于机械臂路径规划、碰撞检测和运动学求解。

### MQTT（Message Queuing Telemetry Transport）
轻量级物联网通信协议，适合资源受限的设备。

---

## N

### Nav2（Navigation 2）
ROS 2 的导航框架，提供路径规划、避障、定位等功能。

### Node（节点）
ROS 中的基本计算单元，每个节点是一个独立的进程，通过话题、服务或动作通信。

---

## O

### Occupancy Grid（占据栅格）
将环境划分为网格，每个格子标记为占据、空闲或未知。常用于 2D 建图。

### Odometry（里程计）
通过测量轮子转动或视觉特征来估计机器人运动的方法。会累积误差。

### OpenCV（Open Source Computer Vision Library）
开源计算机视觉库，提供图像处理、特征检测、目标跟踪等功能。

---

## P

### Particle Filter（粒子滤波）
一种非参数贝叶斯滤波方法，用大量"粒子"表示状态分布。AMCL 的核心算法。

### Path Planning（路径规划）
计算从起点到终点的无碰撞路径。分为全局规划和局部规划。

### PID（Proportional-Integral-Derivative，比例-积分-微分）
经典控制算法，通过调整三个参数来减小误差。广泛用于电机控制。

### Point Cloud（点云）
3D 空间中的点集合，通常由深度相机或激光雷达生成。

### Publisher（发布者）
ROS 中发送消息到话题的节点。

### PWM（Pulse Width Modulation，脉宽调制）
通过改变脉冲宽度来控制电机速度或 LED 亮度的技术。

---

## Q

### QoS（Quality of Service，服务质量）
ROS 2 中的通信策略配置，包括可靠性、持久性、历史深度等。

### Quaternion（四元数）
表示 3D 旋转的数学工具，避免了欧拉角的万向锁问题。ROS 中的标准姿态表示。

---

## R

### RANSAC（Random Sample Consensus，随机采样一致性）
鲁棒的参数估计算法，能够在有噪声和异常值的数据中找到模型。

### RealSense
Intel 的深度相机系列，支持 RGB-D 和立体视觉。

### RGB-D
同时提供彩色图像（RGB）和深度信息（D）的相机。

### RoboCup
国际机器人足球和服务机器人竞赛，推动机器人技术发展。

### ROS（Robot Operating System）
开源机器人软件框架，提供硬件抽象、通信、工具和库。

### RPLIDAR
思岚科技的低成本 2D 激光雷达，适合教育和研究。

### RT-1 / RT-2（Robotics Transformer）
Google 开发的机器人大模型，能够从视觉输入直接输出机器人动作。

---

## S

### Sensor Fusion（传感器融合）
结合多个传感器数据以获得更准确、更鲁棒的估计。

### Service（服务）
ROS 中的请求-响应通信模式，客户端发送请求，服务器返回响应。

### SLAM（Simultaneous Localization and Mapping，同步定位与建图）
机器人在未知环境中同时构建地图和定位自己的技术。

### Subscriber（订阅者）
ROS 中接收话题消息的节点。

---

## T

### Tesla Optimus
特斯拉开发的人形机器人，目标是通用家庭和工业应用。

### TF / TF2（Transform，坐标变换）
ROS 中管理坐标系关系的库，自动计算不同坐标系之间的变换。

### Topic（话题）
ROS 中的发布-订阅通信通道，多个节点可以发布或订阅同一话题。

### Trajectory（轨迹）
机器人或机械臂随时间变化的位置和速度序列。

### TurtleBot
教育和研究用的移动机器人平台，ROS 的官方参考平台。

---

## U

### URDF（Unified Robot Description Format，统一机器人描述格式）
XML 格式的机器人模型文件，描述机器人的连杆、关节、传感器等。

### Unitree
宇树科技，中国四足和人形机器人公司，产品包括 Go1、H1 等。

---

## V

### Visual Odometry（视觉里程计）
通过跟踪图像特征来估计相机运动的方法。

### VLA（Vision-Language-Action，视觉-语言-动作模型）
结合视觉、语言和动作的多模态机器人模型，能够理解自然语言指令并执行任务。

---

## W

### Workspace（工作空间）
机械臂末端执行器能够到达的所有位置的集合。

---

## X

### XACRO（XML Macros）
URDF 的扩展，支持宏、变量和数学运算，简化机器人模型编写。

---

## Y

### YOLO（You Only Look Once）
实时目标检测算法，速度快、精度高，广泛用于机器人视觉。

---

## Z

### Zero-Shot Learning（零样本学习）
模型在没有见过特定任务训练数据的情况下执行该任务的能力。大模型的重要特性。

---

## 符号和缩写

- **2D/3D**：二维/三维
- **API**：Application Programming Interface（应用程序接口）
- **CPU**：Central Processing Unit（中央处理器）
- **GPU**：Graphics Processing Unit（图形处理器）
- **Hz**：Hertz（赫兹），频率单位
- **I/O**：Input/Output（输入/输出）
- **JSON**：JavaScript Object Notation（JavaScript 对象表示法）
- **LAN**：Local Area Network（局域网）
- **LED**：Light-Emitting Diode（发光二极管）
- **OS**：Operating System（操作系统）
- **RAM**：Random Access Memory（随机存取存储器）
- **SDK**：Software Development Kit（软件开发工具包）
- **UART**：Universal Asynchronous Receiver/Transmitter（通用异步收发器）
- **USB**：Universal Serial Bus（通用串行总线）
- **XML**：Extensible Markup Language（可扩展标记语言）
- **YAML**：YAML Ain't Markup Language（YAML 不是标记语言）

---

**使用建议**：
- 首次遇到术语时，查阅本表理解基本含义
- 结合具体章节深入学习每个概念
- 在实践中反复使用，加深理解
- 遇到新术语时，欢迎补充到本表

**持续更新**：机器人技术快速发展，新术语不断涌现。建议定期关注最新论文和开源项目，保持知识更新。
