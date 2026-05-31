# 开源项目索引

本索引整理了书中提到的所有开源项目，按难度分级，帮助你找到适合自己水平的学习资源。

---

## 📊 项目难度说明

- ⭐ **入门级**：适合完全零基础，有详细教程
- ⭐⭐ **初级**：需要基本的编程或硬件知识
- ⭐⭐⭐ **中级**：需要理解 ROS 或机器人基础概念
- ⭐⭐⭐⭐ **高级**：需要深入的技术背景
- ⭐⭐⭐⭐⭐ **专家级**：研究级项目，需要论文阅读能力

---

## 🤖 按章节分类

### 第3章：硬件基础

#### Arduino 官方示例
- **难度**：⭐
- **链接**：https://github.com/arduino/Arduino
- **描述**：Arduino IDE 内置示例，涵盖基础输入输出、通信、传感器
- **适用场景**：学习 Arduino 编程基础
- **语言**：C/C++

#### ESP32 Arduino 核心
- **难度**：⭐⭐
- **链接**：https://github.com/espressif/arduino-esp32
- **描述**：ESP32 的 Arduino 框架支持，包含 WiFi、蓝牙示例
- **适用场景**：ESP32 开发入门
- **语言**：C/C++

---

### 第5章：ROS 2 基础

#### ROS 2 官方文档
- **难度**：⭐⭐
- **链接**：https://github.com/ros2/ros2_documentation
- **描述**：ROS 2 官方教程和文档源码
- **适用场景**：系统学习 ROS 2 概念
- **语言**：Python/C++

#### ROS 2 示例
- **难度**：⭐⭐
- **链接**：https://github.com/ros2/examples
- **描述**：ROS 2 各种功能的示例代码
- **适用场景**：学习话题、服务、动作、参数等
- **语言**：Python/C++

#### micro-ROS
- **难度**：⭐⭐⭐
- **链接**：https://github.com/micro-ROS/micro_ros_arduino
- **描述**：在微控制器上运行 ROS 2 节点
- **适用场景**：将 Arduino/ESP32 集成到 ROS 2 系统
- **语言**：C/C++

---

### 第6章：传感器与执行器

#### Adafruit 传感器库
- **难度**：⭐
- **链接**：https://github.com/adafruit/Adafruit_Sensor
- **描述**：统一的传感器接口库
- **适用场景**：使用 Adafruit 传感器模块
- **语言**：C/C++

#### MPU6050 库
- **难度**：⭐⭐
- **链接**：https://github.com/jrowberg/i2cdevlib
- **描述**：MPU6050 IMU 传感器的完整驱动
- **适用场景**：读取加速度计和陀螺仪数据
- **语言**：C/C++

---

### 第8章：仿真环境

#### Gazebo 官方教程
- **难度**：⭐⭐⭐
- **链接**：https://github.com/gazebosim/gz-sim
- **描述**：Gazebo 仿真器（新版 Ignition）
- **适用场景**：机器人仿真、物理引擎测试
- **语言**：C++/Python

#### TurtleBot3 仿真
- **难度**：⭐⭐
- **链接**：https://github.com/ROBOTIS-GIT/turtlebot3_simulations
- **描述**：TurtleBot3 的 Gazebo 仿真包
- **适用场景**：学习移动机器人导航
- **语言**：Python/C++

---

### 第9章：移动机器人基础

#### TurtleBot3
- **难度**：⭐⭐⭐
- **链接**：https://github.com/ROBOTIS-GIT/turtlebot3
- **描述**：开源移动机器人平台
- **适用场景**：学习 ROS 2 导航和 SLAM
- **语言**：Python/C++

#### Nav2（Navigation 2）
- **难度**：⭐⭐⭐⭐
- **链接**：https://github.com/ros-planning/navigation2
- **描述**：ROS 2 导航框架
- **适用场景**：路径规划、避障、定位
- **语言**：C++

---

### 第11章：SLAM 与建图

#### Cartographer
- **难度**：⭐⭐⭐⭐
- **链接**：https://github.com/cartographer-project/cartographer
- **描述**：Google 开发的 2D/3D SLAM 算法
- **适用场景**：高精度建图
- **语言**：C++

#### Cartographer ROS 2
- **难度**：⭐⭐⭐
- **链接**：https://github.com/ros2/cartographer_ros
- **描述**：Cartographer 的 ROS 2 集成
- **适用场景**：在 ROS 2 中使用 Cartographer
- **语言**：C++

#### SLAM Toolbox
- **难度**：⭐⭐⭐
- **链接**：https://github.com/SteveMacenski/slam_toolbox
- **描述**：ROS 2 的 SLAM 工具箱
- **适用场景**：2D SLAM、地图保存和加载
- **语言**：C++

#### ORB-SLAM3
- **难度**：⭐⭐⭐⭐⭐
- **链接**：https://github.com/UZ-SLAMLab/ORB_SLAM3
- **描述**：视觉 SLAM 的经典算法
- **适用场景**：单目/双目/RGB-D 相机 SLAM
- **语言**：C++

---

### 第12章：计算机视觉

#### OpenCV
- **难度**：⭐⭐
- **链接**：https://github.com/opencv/opencv
- **描述**：开源计算机视觉库
- **适用场景**：图像处理、特征检测、目标跟踪
- **语言**：C++/Python

#### YOLO（Ultralytics）
- **难度**：⭐⭐⭐
- **链接**：https://github.com/ultralytics/ultralytics
- **描述**：YOLOv8 目标检测框架
- **适用场景**：实时目标检测
- **语言**：Python

#### MediaPipe
- **难度**：⭐⭐
- **链接**：https://github.com/google/mediapipe
- **描述**：Google 的多媒体机器学习框架
- **适用场景**：手势识别、姿态估计、人脸检测
- **语言**：Python/C++

---

### 第13章：机械臂与控制

#### MoveIt 2
- **难度**：⭐⭐⭐⭐
- **链接**：https://github.com/ros-planning/moveit2
- **描述**：ROS 2 的机械臂运动规划框架
- **适用场景**：机械臂路径规划、逆运动学
- **语言**：C++/Python

#### Thor 开源机械臂
- **难度**：⭐⭐⭐
- **链接**：https://github.com/AngelLM/Thor
- **描述**：低成本 6-DOF 机械臂
- **适用场景**：DIY 机械臂项目
- **语言**：C++

#### Open Manipulator
- **难度**：⭐⭐⭐
- **链接**：https://github.com/ROBOTIS-GIT/open_manipulator
- **描述**：ROBOTIS 的开源机械臂
- **适用场景**：学习机械臂控制和 MoveIt
- **语言**：C++

---

### 第16章：具身智能与大模型

#### LeRobot
- **难度**：⭐⭐⭐⭐
- **链接**：https://github.com/huggingface/lerobot
- **描述**：Hugging Face 的机器人学习平台
- **适用场景**：端到端机器人学习、数据集管理
- **语言**：Python

#### RT-1 / RT-2（Robotics Transformer）
- **难度**：⭐⭐⭐⭐⭐
- **链接**：https://robotics-transformer2.github.io/
- **描述**：Google 的机器人大模型（论文和演示）
- **适用场景**：研究视觉-语言-动作模型
- **语言**：研究论文

#### Open X-Embodiment
- **难度**：⭐⭐⭐⭐⭐
- **链接**：https://robotics-transformer-x.github.io/
- **描述**：跨机器人平台的数据集和模型
- **适用场景**：大规模机器人学习研究
- **语言**：Python

#### Octo
- **难度**：⭐⭐⭐⭐
- **链接**：https://octo-models.github.io/
- **描述**：通用机器人策略模型
- **适用场景**：迁移学习、零样本机器人控制
- **语言**：Python

---

### 第17章：人形机器人

#### Unitree 机器人 SDK
- **难度**：⭐⭐⭐
- **链接**：https://github.com/unitreerobotics
- **描述**：宇树科技的机器人 SDK（Go1、H1）
- **适用场景**：控制 Unitree 四足和人形机器人
- **语言**：C++/Python

#### OpenDog
- **难度**：⭐⭐⭐⭐
- **链接**：https://github.com/XRobots/openDog
- **描述**：James Bruton 的开源四足机器人
- **适用场景**：DIY 四足机器人
- **语言**：C++

---

## 🛠️ 按技术栈分类

### 硬件控制
- Arduino 官方示例 ⭐
- ESP32 Arduino 核心 ⭐⭐
- micro-ROS ⭐⭐⭐
- Adafruit 传感器库 ⭐

### ROS 2 生态
- ROS 2 官方文档 ⭐⭐
- ROS 2 示例 ⭐⭐
- Nav2 ⭐⭐⭐⭐
- MoveIt 2 ⭐⭐⭐⭐

### SLAM 与定位
- Cartographer ⭐⭐⭐⭐
- SLAM Toolbox ⭐⭐⭐
- ORB-SLAM3 ⭐⭐⭐⭐⭐

### 计算机视觉
- OpenCV ⭐⭐
- YOLO ⭐⭐⭐
- MediaPipe ⭐⭐

### 机器人学习
- LeRobot ⭐⭐⭐⭐
- RT-2 ⭐⭐⭐⭐⭐
- Octo ⭐⭐⭐⭐

### 机械臂
- MoveIt 2 ⭐⭐⭐⭐
- Thor 机械臂 ⭐⭐⭐
- Open Manipulator ⭐⭐⭐

---

## 🎯 学习路径推荐

### 路径 1：从零开始的硬件爱好者
1. Arduino 官方示例 ⭐
2. ESP32 Arduino 核心 ⭐⭐
3. Adafruit 传感器库 ⭐
4. micro-ROS ⭐⭐⭐
5. TurtleBot3 ⭐⭐⭐

### 路径 2：软件工程师转机器人
1. ROS 2 官方文档 ⭐⭐
2. TurtleBot3 仿真 ⭐⭐
3. Nav2 ⭐⭐⭐⭐
4. MoveIt 2 ⭐⭐⭐⭐
5. LeRobot ⭐⭐⭐⭐

### 路径 3：计算机视觉方向
1. OpenCV ⭐⭐
2. YOLO ⭐⭐⭐
3. MediaPipe ⭐⭐
4. ORB-SLAM3 ⭐⭐⭐⭐⭐
5. RT-2 ⭐⭐⭐⭐⭐

### 路径 4：机械臂专精
1. Open Manipulator ⭐⭐⭐
2. MoveIt 2 ⭐⭐⭐⭐
3. Thor 机械臂 ⭐⭐⭐
4. LeRobot（抓取任务）⭐⭐⭐⭐

---

## 📚 额外资源

### 无人机
- **PX4 Autopilot** ⭐⭐⭐⭐
  - https://github.com/PX4/PX4-Autopilot
  - 开源飞控系统

### 仿真工具
- **Webots** ⭐⭐⭐
  - https://github.com/cyberbotics/webots
  - 开源机器人仿真器
  
- **PyBullet** ⭐⭐⭐
  - https://github.com/bulletphysics/bullet3
  - Python 物理仿真库

### 机器人操作系统
- **ROS 1 Noetic** ⭐⭐⭐
  - https://github.com/ros
  - ROS 1 的最后一个版本（仍广泛使用）

---

## 🔍 如何使用本索引

1. **按章节查找**：根据你正在学习的章节，找到对应的项目
2. **按难度筛选**：选择适合你当前水平的项目
3. **按技术栈分类**：如果你对某个技术方向特别感兴趣，直接查看该分类
4. **跟随学习路径**：如果不确定从哪里开始，选择一条推荐路径

---

## ⚠️ 使用建议

1. **先看文档**：每个项目都有 README 和文档，先阅读再动手
2. **从示例开始**：不要直接修改核心代码，先运行官方示例
3. **加入社区**：大多数项目都有 Discord、论坛或 GitHub Discussions
4. **贡献代码**：当你熟悉项目后，尝试提交 PR 或报告 Bug
5. **保持更新**：机器人技术发展快，定期检查项目更新

---

**最后提醒**：开源项目的质量和维护状态各不相同。选择项目时，注意查看：
- ⭐ Star 数量（社区活跃度）
- 📅 最后更新时间（是否还在维护）
- 📖 文档完整性（是否有详细教程）
- 💬 Issue 响应速度（社区是否活跃）

祝你在开源世界中探索愉快！
