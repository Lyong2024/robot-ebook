# 开源项目索引

> 精选机器人开发必备的开源项目、工具库和学习资源

---

## 🤖 机器人操作系统

### ROS (Robot Operating System)
**官网：** https://www.ros.org/  
**GitHub：** https://github.com/ros  
**许可证：** BSD

**简介：**
机器人软件开发的事实标准，提供硬件抽象、设备驱动、库函数、可视化工具等。

**版本：**
- **ROS 1** - Noetic Ninjemys (2020, Ubuntu 20.04, 支持到2025)
- **ROS 2** - Jazzy Jalisco (2024, Ubuntu 24.04, 最新LTS)

**核心功能：**
- 节点通信（话题、服务、动作）
- 参数服务器
- 坐标变换（tf2）
- 可视化（RViz）
- 仿真集成（Gazebo）

**学习资源：**
- 官方教程：https://docs.ros.org/
- ROS Wiki：http://wiki.ros.org/
- ROS Discourse：https://discourse.ros.org/

**适用场景：** 移动机器人、机械臂、无人机、服务机器人

---

### ROS 2 Navigation (Nav2)
**GitHub：** https://github.com/ros-planning/navigation2  
**文档：** https://navigation.ros.org/

**简介：**
ROS 2的自主导航框架，支持2D/3D导航、动态避障、路径规划。

**核心组件：**
- **Planner Server** - 全局路径规划
- **Controller Server** - 局部路径跟踪
- **Behavior Server** - 行为树执行
- **Recovery Server** - 故障恢复

**支持算法：**
- NavFn, Smac Planner (全局规划)
- DWB, TEB, MPPI (局部控制)
- Behavior Trees (任务调度)

**适用场景：** 室内导航、仓储物流、服务机器人

---

### MoveIt 2
**官网：** https://moveit.ros.org/  
**GitHub：** https://github.com/ros-planning/moveit2

**简介：**
机械臂运动规划框架，支持逆运动学、碰撞检测、轨迹优化。

**核心功能：**
- OMPL运动规划库集成
- IK求解器（KDL, TracIK, Bio IK）
- 碰撞检测（FCL）
- 轨迹执行与监控
- MoveIt Servo（实时伺服控制）

**支持机械臂：**
- Universal Robots (UR3/5/10/16)
- ABB, KUKA, Franka Emika
- 自定义URDF机械臂

**适用场景：** 工业机械臂、协作机器人、抓取操作

---

## 🎮 仿真平台

### Gazebo (Ignition Gazebo)
**官网：** https://gazebosim.org/  
**GitHub：** https://github.com/gazebosim

**简介：**
高保真3D机器人仿真器，支持物理引擎、传感器仿真、多机器人。

**物理引擎：**
- ODE (默认)
- Bullet
- DART
- Simbody

**传感器支持：**
- 相机、深度相机、激光雷达
- IMU、GPS、磁力计
- 力/力矩传感器

**ROS集成：**
- gazebo_ros_pkgs (ROS 1)
- ros_gz (ROS 2)

**适用场景：** 算法验证、硬件测试、多机器人协作

---

### CoppeliaSim (V-REP)
**官网：** https://www.coppeliarobotics.com/  
**许可证：** 教育版免费，商业版收费

**简介：**
多功能机器人仿真平台，支持多种编程语言和控制方式。

**特点：**
- 内置机器人模型库
- 可视化编程（Lua脚本）
- Python/C++/Java API
- ROS接口

**应用：**
- 教学演示
- 算法原型
- 视觉仿真

---

### Isaac Sim (NVIDIA)
**官网：** https://developer.nvidia.com/isaac-sim  
**许可证：** 免费（需NVIDIA账号）

**简介：**
基于Omniverse的高性能机器人仿真平台，支持光线追踪、AI训练。

**特点：**
- 照片级渲染
- GPU加速物理
- 合成数据生成
- ROS/ROS 2集成

**适用场景：** 深度学习、计算机视觉、数字孪生

---

## 📷 计算机视觉

### OpenCV
**官网：** https://opencv.org/  
**GitHub：** https://github.com/opencv/opencv

**简介：**
计算机视觉库，包含2500+优化算法。

**核心模块：**
- 图像处理（滤波、变换）
- 特征检测（SIFT, ORB, AKAZE）
- 目标检测（Haar, HOG）
- 相机标定
- 立体视觉

**语言支持：** C++, Python, Java, JavaScript

**ROS集成：** cv_bridge

---

### YOLO (You Only Look Once)
**GitHub：** https://github.com/ultralytics/ultralytics  
**官网：** https://ultralytics.com/

**简介：**
实时目标检测算法，速度快、精度高。

**版本演进：**
- YOLOv5 (2020) - Ultralytics
- YOLOv8 (2023) - 最新版本
- YOLOv9, YOLOv10 (2024)

**性能：**
- YOLOv8n: 80+ FPS (GPU)
- YOLOv8x: 50+ mAP (COCO)

**应用：** 目标检测、实例分割、姿态估计

---

### MediaPipe (Google)
**GitHub：** https://github.com/google/mediapipe  
**官网：** https://mediapipe.dev/

**简介：**
跨平台机器学习管道框架，支持手势识别、人脸检测、姿态估计。

**预训练模型：**
- 手部追踪（21个关键点）
- 人脸网格（468个关键点）
- 姿态估计（33个关键点）
- 物体检测

**平台支持：** Android, iOS, Web, Desktop

---

## 🗺️ SLAM算法

### ORB-SLAM3
**GitHub：** https://github.com/UZ-SLAMLab/ORB_SLAM3  
**论文：** IEEE TRO 2021

**简介：**
视觉SLAM系统，支持单目、双目、RGB-D、鱼眼相机。

**特点：**
- 多地图系统
- 回环检测
- 重定位
- IMU融合

**性能：** 实时运行（30 FPS）

---

### Cartographer
**GitHub：** https://github.com/cartographer-project/cartographer  
**开发者：** Google

**简介：**
2D/3D SLAM系统，支持激光雷达、IMU融合。

**核心技术：**
- 子图匹配
- 回环检测
- 姿态图优化

**ROS集成：** cartographer_ros

**适用场景：** 室内建图、多层建筑

---

### LIO-SAM
**GitHub：** https://github.com/TixiaoShan/LIO-SAM  
**论文：** IROS 2020

**简介：**
激光雷达惯性里程计，紧耦合IMU和LiDAR。

**特点：**
- 因子图优化
- 回环检测
- GPS融合（可选）

**性能：** 大规模室外环境

---

### RTAB-Map
**GitHub：** https://github.com/introlab/rtabmap  
**官网：** http://introlab.github.io/rtabmap/

**简介：**
RGB-D SLAM，支持大规模环境建图。

**特点：**
- 内存管理（长期运行）
- 多传感器融合
- 3D重建

**ROS集成：** rtabmap_ros

---

## 🦾 机械臂控制

### ros2_control
**GitHub：** https://github.com/ros-controls/ros2_control  
**文档：** https://control.ros.org/

**简介：**
ROS 2硬件抽象层，统一机器人控制接口。

**核心概念：**
- Hardware Interface（硬件接口）
- Controller Manager（控制器管理）
- Controller（控制器）

**内置控制器：**
- Joint Trajectory Controller
- Diff Drive Controller
- Gripper Action Controller

---

### Drake (MIT)
**官网：** https://drake.mit.edu/  
**GitHub：** https://github.com/RobotLocomotion/drake

**简介：**
机器人规划与控制工具箱，支持优化、仿真、分析。

**特点：**
- 多体动力学
- 轨迹优化
- 模型预测控制（MPC）
- 混合系统

**语言：** C++, Python

---

## 🚁 无人机

### PX4 Autopilot
**官网：** https://px4.io/  
**GitHub：** https://github.com/PX4/PX4-Autopilot

**简介：**
开源飞控软件，支持多旋翼、固定翼、VTOL。

**特点：**
- 模块化架构
- 多种飞行模式
- 任务规划
- ROS 2集成（px4_ros_com）

**硬件支持：** Pixhawk系列

---

### ArduPilot
**官网：** https://ardupilot.org/  
**GitHub：** https://github.com/ArduPilot/ardupilot

**简介：**
成熟的开源飞控，支持多种平台。

**支持平台：**
- 多旋翼（Copter）
- 固定翼（Plane）
- 无人车（Rover）
- 无人船（Boat）

---

## 🔧 硬件平台

### Arduino
**官网：** https://www.arduino.cc/  
**GitHub：** https://github.com/arduino/Arduino

**简介：**
开源电子原型平台，易学易用。

**热门开发板：**
- Arduino Uno (ATmega328P)
- Arduino Mega (ATmega2560)
- Arduino Nano (小型化)

**应用：** 传感器接口、电机控制、原型开发

---

### ESP32
**官网：** https://www.espressif.com/  
**GitHub：** https://github.com/espressif/esp-idf

**简介：**
低成本WiFi/蓝牙MCU，性能强大。

**特点：**
- 双核240MHz
- WiFi + 蓝牙5.0
- 丰富外设（ADC, PWM, I2C, SPI）

**开发框架：**
- ESP-IDF (官方)
- Arduino Core
- MicroPython

---

### Raspberry Pi
**官网：** https://www.raspberrypi.org/

**简介：**
单板计算机，运行完整Linux系统。

**热门型号：**
- Raspberry Pi 4 (8GB RAM)
- Raspberry Pi 5 (2023)
- Raspberry Pi Zero 2 W (小型化)

**应用：** ROS主控、视觉处理、边缘计算

---

## 🧠 机器学习

### PyTorch
**官网：** https://pytorch.org/  
**GitHub：** https://github.com/pytorch/pytorch

**简介：**
深度学习框架，动态计算图，易于调试。

**机器人应用：**
- 强化学习（RL）
- 视觉感知
- 端到端控制

---

### TensorFlow
**官网：** https://www.tensorflow.org/  
**GitHub：** https://github.com/tensorflow/tensorflow

**简介：**
Google开源深度学习框架。

**机器人工具：**
- TensorFlow Lite (嵌入式部署)
- TensorFlow.js (浏览器)
- TF-Agents (强化学习)

---

### Stable-Baselines3
**GitHub：** https://github.com/DLR-RM/stable-baselines3  
**文档：** https://stable-baselines3.readthedocs.io/

**简介：**
强化学习算法库，基于PyTorch。

**算法：**
- PPO, A2C, SAC, TD3, DQN
- 易于使用的API
- 预训练模型

**应用：** 机器人控制策略学习

---

## 📊 数据处理

### ROS Bag
**工具：** rosbag (ROS 1), ros2 bag (ROS 2)

**简介：**
ROS数据记录与回放工具。

**用途：**
- 传感器数据记录
- 算法离线测试
- 数据集制作

---

### Foxglove Studio
**官网：** https://foxglove.dev/  
**GitHub：** https://github.com/foxglove/studio

**简介：**
现代化机器人数据可视化工具，支持ROS 1/2。

**特点：**
- 实时数据可视化
- 3D场景渲染
- 自定义面板
- 云端协作

---

## 🛠️ 开发工具

### Visual Studio Code
**官网：** https://code.visualstudio.com/

**ROS扩展：**
- ROS Extension (Microsoft)
- C/C++ Extension
- Python Extension

---

### Docker
**官网：** https://www.docker.com/

**ROS镜像：**
- osrf/ros:noetic-desktop-full
- osrf/ros:jazzy-desktop-full

**用途：** 环境隔离、快速部署

---

## 📚 学习资源

### The Construct
**官网：** https://www.theconstructsim.com/

**简介：**
在线ROS学习平台，提供云端仿真环境。

**课程：**
- ROS基础
- Navigation
- MoveIt
- 机器人项目

---

### ROS Industrial
**官网：** https://rosindustrial.org/  
**GitHub：** https://github.com/ros-industrial

**简介：**
工业机器人ROS支持，包含多个品牌机械臂驱动。

**支持品牌：**
- ABB, KUKA, Fanuc
- Universal Robots
- Yaskawa, Motoman

---

## 🌟 明星项目

### TurtleBot
**官网：** https://www.turtlebot.com/  
**GitHub：** https://github.com/turtlebot

**简介：**
教育/研究移动机器人平台。

**版本：**
- TurtleBot 2 (Kobuki底盘)
- TurtleBot 3 (Burger/Waffle)
- TurtleBot 4 (iRobot Create 3)

---

### Fetch & Freight
**GitHub：** https://github.com/fetchrobotics

**简介：**
商用移动操作机器人，完整ROS支持。

**特点：**
- 移动底盘 + 机械臂
- 丰富传感器
- 开源软件栈

---

### Spot SDK (Boston Dynamics)
**GitHub：** https://github.com/boston-dynamics/spot-sdk  
**文档：** https://dev.bostondynamics.com/

**简介：**
Spot四足机器人Python SDK。

**功能：**
- 运动控制
- 自主导航
- 机械臂操作
- 计算机视觉

---

## 🔗 社区与论坛

### ROS Discourse
**链接：** https://discourse.ros.org/

**简介：** ROS官方论坛，技术讨论、问题求助。

---

### Robotics Stack Exchange
**链接：** https://robotics.stackexchange.com/

**简介：** 机器人技术问答社区。

---

### GitHub Awesome Lists
- **Awesome Robotics：** https://github.com/kiloreux/awesome-robotics
- **Awesome ROS2：** https://github.com/fkromer/awesome-ros2
- **Awesome SLAM：** https://github.com/kanster/awesome-slam

---

## 📖 如何贡献开源项目？

### 1. 从使用开始
- 阅读文档
- 运行示例
- 提交bug报告

### 2. 小贡献起步
- 修复文档错误
- 改进示例代码
- 翻译文档

### 3. 代码贡献
- Fork项目
- 创建分支
- 提交Pull Request

### 4. 长期维护
- 回答issue
- Review PR
- 发布新版本

---

## 🎯 项目选择建议

### 初学者
- **ROS Tutorials** - 官方教程
- **TurtleBot3** - 完整机器人平台
- **Arduino** - 硬件入门

### 进阶开发者
- **Nav2** - 导航算法
- **MoveIt 2** - 机械臂控制
- **ORB-SLAM3** - SLAM算法

### 研究人员
- **Drake** - 优化与控制
- **Isaac Sim** - 高保真仿真
- **PyTorch** - 深度学习

### 工业应用
- **ROS Industrial** - 工业机器人
- **ros2_control** - 硬件抽象
- **Docker** - 部署方案

---

*本索引持续更新，欢迎提交PR补充新项目！*

**最后更新：** 2024年6月
