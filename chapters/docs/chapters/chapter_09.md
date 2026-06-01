# 第9章：ROS 2 核心概念：构建机器人软件系统

## 学习目标

- 理解 ROS 2 的设计理念和架构
- 掌握节点（Node）、话题（Topic）、服务（Service）的概念
- 学会创建和管理 ROS 2 工作空间
- 能够编写简单的 ROS 2 节点
- 理解 ROS 2 的通信机制
- 掌握常用的 ROS 2 命令行工具
- 了解机器人中间件的发展历程
- 理解 DDS（数据分发服务）的作用

## 9.1 机器人中间件的演进：从混乱到统一

### 9.1.1 早期的机器人软件困境（2000年以前）

在 ROS 诞生之前，机器人软件开发面临着巨大的挑战：

**每个实验室都在重复造轮子**

想象一下这样的场景：斯坦福大学的研究人员开发了一个出色的路径规划算法，但 MIT 的团队无法使用它，因为：
- 斯坦福用的是自己的通信协议
- MIT 用的是完全不同的数据格式
- 两个系统的接口完全不兼容

结果？MIT 的团队只能从头开始重写整个算法。

**商业机器人平台的封闭生态**

早期的商业机器人（如 Sony AIBO、iRobot）都有自己的专有软件栈：
- **封闭的 API**：只能用厂商提供的接口
- **有限的扩展性**：想添加新传感器？对不起，不支持
- **昂贵的许可费用**：使用 SDK 需要支付高额费用

**学术界的尝试**

一些研究机构尝试开发通用框架：
- **Player/Stage**（2000年，南加州大学）：最早的开源机器人中间件之一
- **YARP**（2006年，意大利理工学院）：专注于人形机器人
- **OROCOS**（2001年，欧洲多所大学）：实时控制框架

但这些框架都有各自的局限性，没有形成统一的生态系统。

### 9.1.2 ROS 的诞生：斯坦福与 Willow Garage（2007-2010）

**起源：斯坦福人工智能实验室**

2007年，斯坦福大学的 Eric Berger 和 Keenan Wyrobek 在开发个人机器人项目时，深刻体会到了软件复用的困难。他们意识到：

> "机器人学的进步不应该被软件的不兼容所阻碍。我们需要一个像 Linux 一样的开源生态系统。"

**Willow Garage 的推动**

2008年，机器人创业公司 Willow Garage 接手了这个项目，投入大量资源：
- **资金支持**：数千万美元的研发投入
- **人才汇聚**：招募了世界顶尖的机器人专家
- **开源承诺**：完全开源，BSD 许可证

**PR2 机器人：ROS 的试验场**

Willow Garage 开发了 PR2（Personal Robot 2）机器人，作为 ROS 的测试平台：
- **价格**：40万美元
- **能力**：双臂操作、移动底盘、丰富的传感器
- **免费赠送**：向全球11所大学免费赠送 PR2，推动 ROS 生态发展

**2010年：ROS 1.0 发布**

ROS 1.0 的核心设计理念：
- **点对点通信**：节点之间直接通信，无需中央服务器（数据传输）
- **工具丰富**：rviz（可视化）、rosbag（数据记录）、rqt（调试工具）
- **语言无关**：支持 C++、Python、Lisp 等多种语言
- **分布式架构**：节点可以运行在不同的计算机上

### 9.1.3 ROS 1 的成功与局限（2010-2017）

**爆发式增长**

ROS 1 迅速成为学术界和工业界的标准：
- **2012年**：超过100个机器人平台支持 ROS
- **2015年**：ROS 软件包超过2000个
- **2017年**：全球有数万名开发者使用 ROS

**成功案例**

- **Rethink Robotics 的 Baxter**：协作机器人
- **Fetch Robotics**：仓储物流机器人
- **Clearpath Robotics**：户外移动机器人
- **NASA**：在国际空间站使用 ROS 控制机器人

**ROS 1 的根本性问题**

然而，随着 ROS 应用到更多实际场景，一些设计缺陷逐渐暴露：

**1. 单点故障：roscore 的脆弱性**

ROS 1 依赖一个中央节点 `roscore` 来管理节点发现和命名：
```
如果 roscore 崩溃 → 整个系统瘫痪
```

这在实验室环境可以接受，但在工业应用中是致命的。

**2. 缺乏实时性**

ROS 1 基于 TCP/IP，无法保证消息的实时传递：
- **问题**：控制回路需要确定性的延迟（如电机控制需要1ms响应）
- **后果**：ROS 1 无法用于安全关键的实时控制

**3. 安全性薄弱**

ROS 1 没有内置的安全机制：
- **无加密**：消息明文传输
- **无认证**：任何人都可以发布/订阅话题
- **无授权**：无法控制节点的访问权限

这在开放的研究环境没问题，但在商业和军事应用中是严重的安全隐患。

**4. 多机器人支持困难**

ROS 1 假设所有节点在同一个网络中：
- **命名冲突**：多个机器人的节点名称会冲突
- **网络隔离**：难以实现机器人之间的选择性通信

**5. 平台限制**

- **仅支持 Linux**：Windows 和 macOS 支持很差
- **仅支持 Python 2**：Python 3 不兼容

### 9.1.4 DDS：工业级通信的救星

**什么是 DDS？**

DDS（Data Distribution Service，数据分发服务）是一个由 **OMG（Object Management Group）** 制定的工业标准通信协议，最初用于：
- **军事系统**：美国海军的舰船作战系统
- **航空航天**：波音787的飞行控制系统
- **金融交易**：高频交易系统
- **医疗设备**：手术机器人

**DDS 的核心优势**

**1. 去中心化架构**

DDS 使用 **发现协议**（Discovery Protocol）自动发现网络中的节点：
```
节点A启动 → 广播"我在这里" → 节点B发现A → 建立直接连接
```
没有中央服务器，任何节点崩溃都不会影响其他节点。

**2. QoS（服务质量）保证**

DDS 提供22种 QoS 策略，可以精确控制数据传输：

| QoS 策略 | 作用 | 应用场景 |
|---------|------|---------|
| Reliability | 可靠性（可靠/尽力而为） | 传感器数据用尽力而为，控制命令用可靠 |
| Durability | 持久性（保留最后N条消息） | 新节点加入时能获取历史数据 |
| Deadline | 截止时间（必须在X毫秒内到达） | 实时控制回路 |
| Lifespan | 生命周期（数据过期时间） | 避免使用过时的传感器数据 |

**3. 实时性能**

DDS 支持多种传输协议：
- **UDP**：低延迟，适合实时数据
- **共享内存**：同一台计算机上的零拷贝通信
- **RTPS**（Real-Time Publish-Subscribe）：专为实时系统设计

**4. 安全性**

DDS-Security 规范提供：
- **加密**：AES-256 加密数据
- **认证**：基于证书的身份验证
- **访问控制**：细粒度的权限管理

**DDS 的实现**

DDS 是一个标准，有多个商业和开源实现：
- **RTI Connext DDS**（商业，最成熟）
- **eProsima Fast DDS**（开源，ROS 2 默认）
- **Eclipse Cyclone DDS**（开源，高性能）
- **GurumNetworks GurumDDS**（商业，韩国）

### 9.1.5 ROS 2 的诞生：站在巨人的肩膀上（2014-2017）

**2014年：ROS 2 项目启动**

Open Robotics（前身为 OSRF）意识到 ROS 1 的架构问题无法通过修补解决，决定从头开始设计 ROS 2。

**核心决策：采用 DDS**

经过广泛的技术评估，ROS 2 团队决定：
> "不要重新发明轮子。DDS 已经在关键任务系统中验证了20年，我们应该站在巨人的肩膀上。"

**ROS 2 的设计目标**

1. **生产级质量**：从实验室走向工业应用
2. **实时性**：支持硬实时控制
3. **安全性**：内置加密和认证
4. **跨平台**：Linux、Windows、macOS、RTOS
5. **多机器人**：原生支持机器人集群
6. **向后兼容**：通过 ros1_bridge 与 ROS 1 互操作

**2017年：ROS 2 Ardent 发布**

第一个正式版本发布，但仍处于早期阶段：
- **功能不完整**：许多 ROS 1 的功能尚未移植
- **生态系统小**：软件包数量远少于 ROS 1
- **性能问题**：初期版本存在性能瓶颈

**2020年：ROS 2 Foxy 转折点**

Foxy 版本标志着 ROS 2 的成熟：
- **功能完整**：导航、操作、感知等核心功能齐全
- **性能优化**：通信延迟降低到微秒级
- **工业采用**：多家公司开始在产品中使用 ROS 2

**2022年：ROS 2 Humble（当前 LTS）**

Humble 是目前的长期支持版本（支持到2027年）：
- **稳定性**：经过大规模验证
- **丰富的生态**：数千个软件包
- **广泛应用**：从研究到工业生产

### 9.1.6 学术界和工业界的贡献

**学术机构的推动**

**斯坦福大学**
- **贡献**：ROS 的起源地，开发了早期的 PR2 应用
- **代表人物**：Sebastian Thrun（自动驾驶先驱）

**MIT**
- **贡献**：开发了 ROS 的导航栈和 SLAM 算法
- **项目**：Stata Center 的移动机器人

**慕尼黑工业大学（TUM）**
- **贡献**：开发了 ORB-SLAM、LSD-SLAM 等视觉 SLAM 算法
- **影响**：这些算法成为 ROS 生态的核心组件

**苏黎世联邦理工学院（ETH Zurich）**
- **贡献**：开发了 ANYmal 四足机器人，使用 ROS 2
- **研究**：机器人在复杂地形中的导航

**工业界的采用**

**汽车行业**
- **Apex.AI**：为自动驾驶开发 ROS 2 的安全认证版本（ISO 26262）
- **Tier IV**：开源自动驾驶软件 Autoware，基于 ROS 2

**物流和仓储**
- **Amazon Robotics**：在仓库机器人中使用 ROS
- **Fetch Robotics**：移动操作机器人
- **Locus Robotics**：协作式仓储机器人

**服务机器人**
- **SoftBank Robotics**：Pepper 和 NAO 机器人支持 ROS
- **Boston Dynamics**：Spot 机器人提供 ROS 接口

**农业机器人**
- **John Deere**：自动驾驶拖拉机使用 ROS 2
- **Blue River Technology**（被 John Deere 收购）：精准除草机器人

**航空航天**
- **NASA**：在国际空间站的 Astrobee 机器人上使用 ROS
- **SpaceX**：在某些地面测试系统中使用 ROS

### 9.1.7 ROS 2 vs ROS 1：技术对比

| 维度 | ROS 1 | ROS 2 | 影响 |
|------|-------|-------|------|
| **架构** | 依赖 roscore | 去中心化（DDS） | ROS 2 更可靠 |
| **实时性** | 不支持 | 支持（通过 DDS QoS） | ROS 2 可用于控制回路 |
| **安全性** | 无 | DDS-Security | ROS 2 可用于商业产品 |
| **通信协议** | 自定义 TCPROS/UDPROS | DDS（工业标准） | ROS 2 互操作性更好 |
| **多机器人** | 困难（需要命名空间技巧） | 原生支持（DDS Domain） | ROS 2 更适合集群 |
| **平台支持** | 主要 Linux | Linux/Windows/macOS/RTOS | ROS 2 更广泛 |
| **Python 版本** | Python 2 | Python 3 | ROS 2 更现代 |
| **生命周期管理** | 无 | 有（Managed Nodes） | ROS 2 更易于管理复杂系统 |
| **组件化** | 无 | 有（Composition） | ROS 2 可以将多个节点组合到一个进程 |
| **QoS 控制** | 无 | 22种 QoS 策略 | ROS 2 可以精确控制通信行为 |

### 9.1.8 为什么选择 ROS 2？

**对于学生和研究人员**
- **学习曲线**：与 ROS 1 类似，但概念更清晰
- **未来趋势**：ROS 1 将在2025年停止支持
- **丰富的资源**：教程、课程、社区支持

**对于工业应用**
- **可靠性**：去中心化架构，无单点故障
- **实时性**：满足控制回路的时间要求
- **安全性**：符合工业安全标准
- **认证**：Apex.AI 提供 ISO 26262 认证的 ROS 2

**对于创业公司**
- **快速原型**：丰富的软件包，快速验证想法
- **降低成本**：不需要从头开发基础设施
- **人才获取**：大量熟悉 ROS 的工程师
- **开源生态**：避免供应商锁定

## 9.2 什么是 ROS 2？

ROS（Robot Operating System）不是传统意义上的操作系统，而是一个**机器人软件框架**。

### 9.2.1 ROS 2 的核心价值

**模块化**：将复杂的机器人系统分解为独立的模块（节点），每个节点负责一个功能。

**可重用**：别人写好的节点（如 SLAM、导航）可以直接使用，不需要重新发明轮子。

**分布式**：节点可以运行在不同的计算机上，通过网络通信。

**工具丰富**：提供可视化、调试、记录等强大工具。

### 9.2.2 ROS 2 的架构层次

ROS 2 采用分层架构，从底层到上层：

**1. 操作系统层（OS Layer）**
- Linux（Ubuntu、Debian）
- Windows 10/11
- macOS
- 实时操作系统（RTOS，如 FreeRTOS、Zephyr）

**2. DDS 层（中间件层）**
- Fast DDS（默认）
- Cyclone DDS
- RTI Connext DDS
- 提供发现、序列化、传输功能

**3. ROS 2 核心层（RCL - ROS Client Library）**
- `rcl`：C 语言实现的核心库
- `rclcpp`：C++ 客户端库
- `rclpy`：Python 客户端库
- `rclnodejs`：Node.js 客户端库

**4. 应用层**
- 导航栈（Nav2）
- 操作栈（MoveIt2）
- 感知栈（perception_pcl、image_pipeline）
- 用户自定义节点

### 9.2.3 DDS 深入解析

**DDS 的数据模型**

DDS 使用 **数据中心发布订阅（DCPS）** 模型：

```
DataWriter（发布者） → Topic → DataReader（订阅者）
```

**关键概念**：

**Domain（域）**
- 逻辑隔离的通信空间
- 不同 Domain 的节点无法互相通信
- ROS 2 默认使用 Domain 0
- 多机器人系统可以使用不同的 Domain

```bash
# 设置 Domain ID
export ROS_DOMAIN_ID=42
```

**QoS Profile（服务质量配置）**

QoS 是 DDS 的核心特性，定义了数据传输的行为。ROS 2 提供了预定义的 QoS 配置：

| QoS Profile | 可靠性 | 持久性 | 历史深度 | 适用场景 |
|------------|--------|--------|---------|---------|
| Sensor Data | Best Effort | Volatile | 1 | 传感器数据（允许丢失） |
| Services | Reliable | Volatile | 10 | 服务调用 |
| Parameters | Reliable | Volatile | 1000 | 参数服务 |
| System Default | Reliable | Volatile | 10 | 默认配置 |

**自定义 QoS 示例**：

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy, HistoryPolicy

# 创建自定义 QoS
qos_profile = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,  # 可靠传输
    durability=DurabilityPolicy.TRANSIENT_LOCAL,  # 保留最后的消息
    history=HistoryPolicy.KEEP_LAST,  # 保留最后 N 条
    depth=10  # 队列深度
)

# 使用自定义 QoS
self.publisher = self.create_publisher(String, 'topic', qos_profile)
```

**QoS 策略详解**：

**1. Reliability（可靠性）**
- `RELIABLE`：保证消息到达，会重传
- `BEST_EFFORT`：尽力而为，不保证到达

**使用场景**：
- 控制命令 → RELIABLE
- 激光雷达数据 → BEST_EFFORT（数据量大，允许丢失）

**2. Durability（持久性）**
- `VOLATILE`：不保留历史消息
- `TRANSIENT_LOCAL`：保留最后的消息给新订阅者

**使用场景**：
- 地图数据 → TRANSIENT_LOCAL（新节点加入时需要获取地图）
- 实时传感器数据 → VOLATILE

**3. History（历史策略）**
- `KEEP_LAST`：保留最后 N 条消息
- `KEEP_ALL`：保留所有消息（直到队列满）

**4. Deadline（截止时间）**
- 消息必须在指定时间内到达
- 超时会触发回调

```python
from rclpy.qos import QoSProfile
from rclpy.duration import Duration

qos = QoSProfile(depth=10)
qos.deadline = Duration(seconds=0, nanoseconds=100_000_000)  # 100ms
```

**5. Lifespan（生命周期）**
- 消息的有效期
- 过期的消息会被丢弃

```python
qos.lifespan = Duration(seconds=1)  # 1秒后过期
```

### 9.2.4 ROS 2 的性能优化

**零拷贝通信（Intra-process Communication）**

当发布者和订阅者在同一个进程中时，ROS 2 可以使用零拷贝通信：

```python
# 启用进程内通信
rclpy.init()
executor = rclpy.executors.SingleThreadedExecutor()

# 创建组件容器
container = rclpy.create_node('container')

# 添加多个节点到同一个进程
# 它们之间的通信将使用零拷贝
```

**性能对比**：
- 传统通信：~100 微秒延迟
- 零拷贝通信：~1 微秒延迟（100倍提升）

**共享内存传输**

对于大数据（如图像、点云），使用共享内存：

```bash
# 使用 Cyclone DDS 的共享内存
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
export CYCLONEDDS_URI=file:///path/to/cyclonedds.xml
```

`cyclonedds.xml` 配置：
```xml
<CycloneDDS>
  <Domain>
    <SharedMemory>
      <Enable>true</Enable>
      <Size>100MB</Size>
    </SharedMemory>
  </Domain>
</CycloneDDS>
```

**性能数据**：
- 1920x1080 图像（~6MB）
- TCP/UDP：~50ms
- 共享内存：~2ms（25倍提升）

## 9.3 ROS 2 的核心概念

### 节点（Node）

节点是 ROS 2 的基本执行单元，每个节点是一个独立的进程。

**例子**：
- 相机驱动节点：读取相机数据并发布
- 图像处理节点：订阅图像，进行处理
- 电机控制节点：接收速度命令，控制电机

**设计原则**：
- 一个节点只做一件事
- 节点之间松耦合
- 节点可以独立开发和测试

### 话题（Topic）

话题是节点之间通信的**单向数据流**。

**发布-订阅模式**：
- 发布者（Publisher）：发送数据到话题
- 订阅者（Subscriber）：从话题接收数据
- 一个话题可以有多个发布者和订阅者

**例子**：
```
相机节点 --[/camera/image]--> 图像处理节点
                           \--> 显示节点
```

### 消息（Message）

消息是话题上传输的数据结构。

**常用消息类型**：
- `std_msgs/String`：字符串
- `std_msgs/Int32`：整数
- `geometry_msgs/Twist`：速度命令（线速度 + 角速度）
- `sensor_msgs/Image`：图像
- `sensor_msgs/LaserScan`：激光雷达数据

### 服务（Service）

服务是节点之间的**请求-响应通信**。

**与话题的区别**：
- 话题：持续的数据流，异步
- 服务：一次性的请求-响应，同步

**例子**：
- 请求机器人返回当前位置
- 请求规划一条路径
- 请求保存地图

### 参数（Parameter）

参数是节点的配置项，可以在运行时修改。

**例子**：
- 电机最大速度
- PID 控制器的增益
- 传感器的采样率

### 动作（Action）

动作是长时间运行任务的通信机制，支持：
- 目标（Goal）：发送任务
- 反馈（Feedback）：任务进度
- 结果（Result）：任务完成后的结果
- 取消：可以中途取消任务

**例子**：
- 导航到目标点（持续几秒到几分钟）
- 机械臂抓取物体
- 充电任务

## 9.3 安装 ROS 2

### Ubuntu 22.04 安装 ROS 2 Humble

ROS 2 Humble 是长期支持版本（LTS），推荐使用。

**步骤 1：设置源**

```bash
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository universe

sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

**步骤 2：安装 ROS 2**

```bash
sudo apt update
sudo apt upgrade

# 完整安装（推荐）
sudo apt install ros-humble-desktop

# 或者最小安装
sudo apt install ros-humble-ros-base
```

**步骤 3：安装开发工具**

```bash
sudo apt install python3-colcon-common-extensions
sudo apt install python3-rosdep
```

**步骤 4：初始化 rosdep**

```bash
sudo rosdep init
rosdep update
```

**步骤 5：设置环境**

```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

**验证安装**：

```bash
ros2 --help
```

如果看到帮助信息，说明安装成功！

## 9.4 ROS 2 工作空间

工作空间是组织 ROS 2 代码的目录结构。

### 创建工作空间

```bash
mkdir -p ~/robot_ws/src
cd ~/robot_ws
colcon build
```

**目录结构**：

```
robot_ws/
├── src/           # 源代码
├── build/         # 编译中间文件
├── install/       # 安装文件
└── log/           # 日志
```

### 激活工作空间

```bash
source ~/robot_ws/install/setup.bash
```

**建议**：将这行添加到 `~/.bashrc`：

```bash
echo "source ~/robot_ws/install/setup.bash" >> ~/.bashrc
```

## 9.5 创建第一个 ROS 2 包

### 创建 Python 包

```bash
cd ~/robot_ws/src
ros2 pkg create --build-type ament_python my_robot_pkg --dependencies rclpy
```

**目录结构**：

```
my_robot_pkg/
├── my_robot_pkg/
│   └── __init__.py
├── resource/
├── test/
├── package.xml
├── setup.py
└── setup.cfg
```

### 编写第一个节点

创建 `~/robot_ws/src/my_robot_pkg/my_robot_pkg/hello_node.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node

class HelloNode(Node):
    def __init__(self):
        super().__init__('hello_node')
        self.get_logger().info('Hello, ROS 2!')
        
        # 创建定时器，每秒执行一次
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.count = 0
    
    def timer_callback(self):
        self.count += 1
        self.get_logger().info(f'Count: {self.count}')

def main(args=None):
    rclpy.init(args=args)
    node = HelloNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 配置 setup.py

编辑 `setup.py`，添加入口点：

```python
entry_points={
    'console_scripts': [
        'hello_node = my_robot_pkg.hello_node:main',
    ],
},
```

### 编译和运行

```bash
cd ~/robot_ws
colcon build --packages-select my_robot_pkg
source install/setup.bash

ros2 run my_robot_pkg hello_node
```

你应该看到：

```
[INFO] [hello_node]: Hello, ROS 2!
[INFO] [hello_node]: Count: 1
[INFO] [hello_node]: Count: 2
...
```

## 9.6 话题通信

### 发布者示例

创建 `publisher_node.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class PublisherNode(Node):
    def __init__(self):
        super().__init__('publisher_node')
        
        # 创建发布者
        self.publisher = self.create_publisher(String, 'chatter', 10)
        
        # 创建定时器，每 0.5 秒发布一次
        self.timer = self.create_timer(0.5, self.publish_message)
        self.count = 0
    
    def publish_message(self):
        msg = String()
        msg.data = f'Hello ROS 2! Count: {self.count}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.count += 1

def main(args=None):
    rclpy.init(args=args)
    node = PublisherNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 订阅者示例

创建 `subscriber_node.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class SubscriberNode(Node):
    def __init__(self):
        super().__init__('subscriber_node')
        
        # 创建订阅者
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10
        )
    
    def listener_callback(self, msg):
        self.get_logger().info(f'Received: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    node = SubscriberNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 测试

在 `setup.py` 中添加入口点：

```python
entry_points={
    'console_scripts': [
        'publisher_node = my_robot_pkg.publisher_node:main',
        'subscriber_node = my_robot_pkg.subscriber_node:main',
    ],
},
```

编译并运行：

```bash
colcon build --packages-select my_robot_pkg
source install/setup.bash

# 终端 1
ros2 run my_robot_pkg publisher_node

# 终端 2
ros2 run my_robot_pkg subscriber_node
```

## 9.7 速度控制示例

让我们创建一个实用的例子：控制机器人速度。

### 速度发布节点

创建 `velocity_publisher.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import sys
import termios
import tty

class VelocityPublisher(Node):
    def __init__(self):
        super().__init__('velocity_publisher')
        self.publisher = self.create_publisher(Twist, 'cmd_vel', 10)
        self.get_logger().info('Velocity Publisher started')
        self.get_logger().info('Use arrow keys to control (Ctrl+C to quit)')
    
    def publish_velocity(self, linear, angular):
        msg = Twist()
        msg.linear.x = linear
        msg.angular.z = angular
        self.publisher.publish(msg)
        self.get_logger().info(f'Linear: {linear:.2f}, Angular: {angular:.2f}')

def get_key():
    """获取键盘输入"""
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(sys.stdin.fileno())
        key = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return key

def main(args=None):
    rclpy.init(args=args)
    node = VelocityPublisher()
    
    linear_speed = 0.0
    angular_speed = 0.0
    speed_step = 0.1
    
    try:
        while rclpy.ok():
            key = get_key()
            
            if key == '\x1b':  # ESC 序列
                key = sys.stdin.read(2)
                if key == '[A':  # 上箭头
                    linear_speed += speed_step
                elif key == '[B':  # 下箭头
                    linear_speed -= speed_step
                elif key == '[C':  # 右箭头
                    angular_speed -= speed_step
                elif key == '[D':  # 左箭头
                    angular_speed += speed_step
            elif key == ' ':  # 空格停止
                linear_speed = 0.0
                angular_speed = 0.0
            elif key == '\x03':  # Ctrl+C
                break
            
            node.publish_velocity(linear_speed, angular_speed)
    
    except Exception as e:
        print(e)
    finally:
        # 停止机器人
        node.publish_velocity(0.0, 0.0)
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 速度订阅节点（模拟机器人）

创建 `robot_simulator.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import numpy as np

class RobotSimulator(Node):
    def __init__(self):
        super().__init__('robot_simulator')
        
        # 订阅速度命令
        self.subscription = self.create_subscription(
            Twist,
            'cmd_vel',
            self.velocity_callback,
            10
        )
        
        # 机器人状态
        self.x = 0.0
        self.y = 0.0
        self.theta = 0.0
        
        # 创建定时器，更新状态
        self.timer = self.create_timer(0.1, self.update_state)
        
        self.linear_vel = 0.0
        self.angular_vel = 0.0
        
        self.get_logger().info('Robot Simulator started')
    
    def velocity_callback(self, msg):
        self.linear_vel = msg.linear.x
        self.angular_vel = msg.angular.z
    
    def update_state(self):
        dt = 0.1
        
        # 更新位置和朝向
        self.x += self.linear_vel * np.cos(self.theta) * dt
        self.y += self.linear_vel * np.sin(self.theta) * dt
        self.theta += self.angular_vel * dt
        
        # 归一化角度
        self.theta = np.arctan2(np.sin(self.theta), np.cos(self.theta))
        
        self.get_logger().info(
            f'Position: ({self.x:.2f}, {self.y:.2f}), '
            f'Heading: {np.degrees(self.theta):.1f}°'
        )

def main(args=None):
    rclpy.init(args=args)
    node = RobotSimulator()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 9.8 ROS 2 命令行工具

### 节点管理

```bash
# 列出所有运行的节点
ros2 node list

# 查看节点信息
ros2 node info /node_name
```

### 话题管理

```bash
# 列出所有话题
ros2 topic list

# 查看话题信息
ros2 topic info /topic_name

# 查看话题消息类型
ros2 topic type /topic_name

# 实时显示话题数据
ros2 topic echo /topic_name

# 查看话题发布频率
ros2 topic hz /topic_name

# 手动发布消息
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 1.0}, angular: {z: 0.5}}"
```

### 服务管理

```bash
# 列出所有服务
ros2 service list

# 查看服务类型
ros2 service type /service_name

# 调用服务
ros2 service call /service_name service_type "request_data"
```

### 参数管理

```bash
# 列出节点的所有参数
ros2 param list /node_name

# 获取参数值
ros2 param get /node_name parameter_name

# 设置参数值
ros2 param set /node_name parameter_name value
```

### 包管理

```bash
# 列出所有包
ros2 pkg list

# 查找包的路径
ros2 pkg prefix package_name

# 列出包中的可执行文件
ros2 pkg executables package_name
```

### 接口管理

```bash
# 列出所有消息类型
ros2 interface list

# 查看消息定义
ros2 interface show geometry_msgs/msg/Twist
```

## 9.9 Launch 文件

Launch 文件用于同时启动多个节点。

### Python Launch 文件

创建 `~/robot_ws/src/my_robot_pkg/launch/robot_launch.py`：

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot_pkg',
            executable='publisher_node',
            name='publisher',
            output='screen'
        ),
        Node(
            package='my_robot_pkg',
            executable='subscriber_node',
            name='subscriber',
            output='screen'
        ),
    ])
```

### 配置 setup.py

在 `setup.py` 中添加：

```python
import os
from glob import glob

# 在 setup() 函数中添加
package_name = 'my_robot_pkg'

# ...

data_files=[
    ('share/ament_index/resource_index/packages',
        ['resource/' + package_name]),
    ('share/' + package_name, ['package.xml']),
    (os.path.join('share', package_name, 'launch'),
        glob('launch/*.py')),
],
```

### 运行 Launch 文件

```bash
colcon build --packages-select my_robot_pkg
source install/setup.bash

ros2 launch my_robot_pkg robot_launch.py
```

## 9.10 实践项目：完整的机器人控制系统

让我们整合所有知识，创建一个完整的系统。

### 系统架构

```
键盘控制节点 --[cmd_vel]--> 电机控制节点 --[串口]--> ESP32
                                    |
                                    +--[odom]--> 里程计话题
```

### 电机控制节点

创建 `motor_controller.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from nav_msgs.msg import Odometry
import serial
import json

class MotorController(Node):
    def __init__(self):
        super().__init__('motor_controller')
        
        # 参数
        self.declare_parameter('serial_port', '/dev/ttyUSB0')
        self.declare_parameter('baud_rate', 115200)
        self.declare_parameter('wheel_base', 0.3)
        
        port = self.get_parameter('serial_port').value
        baud = self.get_parameter('baud_rate').value
        self.wheel_base = self.get_parameter('wheel_base').value
        
        # 串口连接
        try:
            self.serial = serial.Serial(port, baud, timeout=1)
            self.get_logger().info(f'Connected to {port}')
        except Exception as e:
            self.get_logger().error(f'Failed to connect: {e}')
            return
        
        # 订阅速度命令
        self.cmd_sub = self.create_subscription(
            Twist,
            'cmd_vel',
            self.cmd_callback,
            10
        )
        
        # 发布里程计
        self.odom_pub = self.create_publisher(Odometry, 'odom', 10)
        
        # 定时读取反馈
        self.timer = self.create_timer(0.1, self.read_feedback)
    
    def cmd_callback(self, msg):
        # 差速驱动逆运动学
        v = msg.linear.x
        omega = msg.angular.z
        
        v_left = v - (omega * self.wheel_base / 2.0)
        v_right = v + (omega * self.wheel_base / 2.0)
        
        # 发送到 ESP32
        cmd = {
            'left': v_left,
            'right': v_right
        }
        self.serial.write((json.dumps(cmd) + '\n').encode())
        self.get_logger().info(f'Sent: {cmd}')
    
    def read_feedback(self):
        if self.serial.in_waiting > 0:
            try:
                line = self.serial.readline().decode().strip()
                data = json.loads(line)
                
                # 发布里程计（简化版）
                odom = Odometry()
                odom.header.stamp = self.get_clock().now().to_msg()
                odom.header.frame_id = 'odom'
                odom.child_frame_id = 'base_link'
                
                # 填充位置和速度数据
                # ...
                
                self.odom_pub.publish(odom)
            except Exception as e:
                self.get_logger().warning(f'Parse error: {e}')

def main(args=None):
    rclpy.init(args=args)
    node = MotorController()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 9.11 真实世界的应用案例

### 自动驾驶领域

**Autoware**：全球最大的开源自动驾驶软件栈

Autoware 是基于 ROS 2 构建的完整自动驾驶解决方案，被全球超过 100 家公司和研究机构使用。它展示了 ROS 2 在安全关键系统中的应用能力。

**架构特点**：
- 感知模块：使用 ROS 2 话题传输激光雷达、相机、雷达数据
- 定位模块：基于 NDT 算法的高精度定位
- 规划模块：分层规划架构（全局路径、局部路径、轨迹优化）
- 控制模块：MPC（模型预测控制）实现精确跟踪

**技术亮点**：
```python
# Autoware 使用 ROS 2 的 QoS 配置保证数据可靠性
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

# 传感器数据使用 BEST_EFFORT（低延迟）
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    history=HistoryPolicy.KEEP_LAST,
    depth=1
)

# 控制命令使用 RELIABLE（可靠传输）
control_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)
```

**实际部署经验**：
- 使用 DDS 的 Fast-RTPS 实现，在 100+ 节点系统中保持稳定
- 通过 ROS 2 的生命周期节点管理复杂的启动和关闭流程
- 使用 ROS 2 的参数服务器实现运行时配置调整

### 工业机器人

**Universal Robots + ROS 2**

Universal Robots（UR）是全球领先的协作机器人制造商，其官方 ROS 2 驱动展示了工业级应用的最佳实践。

**系统架构**：
```
UR 机器人 <--[实时以太网]--> ur_robot_driver <--[ROS 2]--> MoveIt2 <--[ROS 2]--> 应用层
```

**关键技术**：
1. **实时通信**：使用 ROS 2 的实时扩展（rt_middleware）
2. **安全保障**：通过 ROS 2 的安全插件（SROS2）加密通信
3. **可视化**：集成 RViz2 进行实时监控

**代码示例**：
```python
# UR 机器人的轨迹执行
from control_msgs.action import FollowJointTrajectory
from rclpy.action import ActionClient

class URController(Node):
    def __init__(self):
        super().__init__('ur_controller')
        self._action_client = ActionClient(
            self,
            FollowJointTrajectory,
            '/scaled_joint_trajectory_controller/follow_joint_trajectory'
        )
    
    def send_trajectory(self, trajectory):
        goal_msg = FollowJointTrajectory.Goal()
        goal_msg.trajectory = trajectory
        
        # 异步发送目标
        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        self._send_goal_future.add_done_callback(self.goal_response_callback)
```

### 服务机器人

**TurtleBot 4**：教育和研究的标准平台

TurtleBot 4 是基于 iRobot Create 3 底盘的移动机器人平台，完全使用 ROS 2 构建。

**功能模块**：
- **导航**：使用 Nav2 实现自主导航
- **建图**：使用 SLAM Toolbox 进行实时建图
- **感知**：集成 OAK-D 深度相机
- **人机交互**：通过 ROS 2 话题接收语音命令

**实际应用场景**：
```python
# TurtleBot 4 的自主巡逻任务
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

class PatrolRobot(Node):
    def __init__(self):
        super().__init__('patrol_robot')
        self.navigator = BasicNavigator()
        
        # 定义巡逻点
        self.patrol_points = [
            self.create_pose(1.0, 1.0, 0.0),
            self.create_pose(3.0, 1.0, 1.57),
            self.create_pose(3.0, 3.0, 3.14),
            self.create_pose(1.0, 3.0, -1.57),
        ]
    
    def start_patrol(self):
        self.navigator.waitUntilNav2Active()
        
        while rclpy.ok():
            for pose in self.patrol_points:
                self.navigator.goToPose(pose)
                
                while not self.navigator.isTaskComplete():
                    feedback = self.navigator.getFeedback()
                    self.get_logger().info(
                        f'Distance remaining: {feedback.distance_remaining:.2f}m'
                    )
                
                self.get_logger().info('Reached waypoint!')
                time.sleep(5)  # 停留5秒
```

### 农业机器人

**FarmBot**：开源精准农业系统

FarmBot 使用 ROS 2 控制 CNC 式的农业机器人，实现自动播种、浇水、除草。

**技术创新**：
- 使用 ROS 2 的参数服务器存储植物数据库
- 通过 ROS 2 话题接收土壤传感器数据
- 使用 ROS 2 动作服务器执行长时间任务（如浇水）

### 医疗机器人

**da Vinci 手术机器人的 ROS 2 研究版本**

虽然商业版本不使用 ROS，但研究社区开发了基于 ROS 2 的开源版本（dVRK）。

**关键特性**：
- **低延迟**：使用 DDS 的实时配置，延迟 < 10ms
- **安全性**：使用 SROS2 加密所有通信
- **可追溯性**：使用 ROS 2 的 rosbag2 记录所有操作数据

## 9.12 工业界的最佳实践

### 代码组织

**包的划分原则**

```
my_robot_system/
├── my_robot_bringup/          # 启动文件和配置
├── my_robot_description/      # URDF 模型
├── my_robot_hardware/         # 硬件接口
├── my_robot_control/          # 控制算法
├── my_robot_navigation/       # 导航配置
├── my_robot_perception/       # 感知算法
└── my_robot_msgs/             # 自定义消息
```

**最佳实践**：
1. **单一职责**：每个包只做一件事
2. **接口分离**：消息定义独立成包
3. **配置外置**：使用 YAML 文件而不是硬编码

### 参数管理

**使用 YAML 文件管理参数**

```yaml
# config/robot_params.yaml
/**:
  ros__parameters:
    # 机器人物理参数
    wheel_radius: 0.05
    wheel_base: 0.3
    max_speed: 1.0
    
    # 控制参数
    pid_kp: 1.0
    pid_ki: 0.1
    pid_kd: 0.05
    
    # 传感器参数
    lidar_topic: "/scan"
    camera_topic: "/camera/image_raw"
```

**在代码中使用**：
```python
class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')
        
        # 声明参数（带默认值）
        self.declare_parameter('wheel_radius', 0.05)
        self.declare_parameter('wheel_base', 0.3)
        self.declare_parameter('max_speed', 1.0)
        
        # 读取参数
        self.wheel_radius = self.get_parameter('wheel_radius').value
        self.wheel_base = self.get_parameter('wheel_base').value
        self.max_speed = self.get_parameter('max_speed').value
        
        # 添加参数变化回调
        self.add_on_set_parameters_callback(self.parameter_callback)
    
    def parameter_callback(self, params):
        for param in params:
            if param.name == 'max_speed':
                self.max_speed = param.value
                self.get_logger().info(f'Max speed updated to {param.value}')
        return SetParametersResult(successful=True)
```

### 错误处理

**健壮的节点设计**

```python
class RobustNode(Node):
    def __init__(self):
        super().__init__('robust_node')
        
        # 使用重试机制连接硬件
        self.serial = self.connect_with_retry('/dev/ttyUSB0', max_retries=5)
        
        # 使用看门狗检测通信超时
        self.last_msg_time = self.get_clock().now()
        self.watchdog_timer = self.create_timer(1.0, self.watchdog_callback)
        
        # 订阅话题
        self.sub = self.create_subscription(
            Twist,
            'cmd_vel',
            self.cmd_callback,
            10
        )
    
    def connect_with_retry(self, port, max_retries=5):
        for i in range(max_retries):
            try:
                ser = serial.Serial(port, 115200, timeout=1)
                self.get_logger().info(f'Connected to {port}')
                return ser
            except Exception as e:
                self.get_logger().warning(
                    f'Connection attempt {i+1}/{max_retries} failed: {e}'
                )
                time.sleep(2)
        
        self.get_logger().error(f'Failed to connect to {port}')
        raise RuntimeError(f'Cannot connect to {port}')
    
    def cmd_callback(self, msg):
        self.last_msg_time = self.get_clock().now()
        
        try:
            # 发送命令
            self.send_command(msg)
        except Exception as e:
            self.get_logger().error(f'Failed to send command: {e}')
            # 尝试重新连接
            self.reconnect()
    
    def watchdog_callback(self):
        # 检查是否超时
        now = self.get_clock().now()
        elapsed = (now - self.last_msg_time).nanoseconds / 1e9
        
        if elapsed > 5.0:  # 5秒超时
            self.get_logger().warning('No command received for 5 seconds, stopping robot')
            self.send_stop_command()
    
    def reconnect(self):
        try:
            self.serial.close()
        except:
            pass
        
        self.serial = self.connect_with_retry('/dev/ttyUSB0')
```

### 测试策略

**单元测试**

```python
# test/test_robot_controller.py
import unittest
from rclpy.node import Node
from my_robot_pkg.robot_controller import RobotController

class TestRobotController(unittest.TestCase):
    def setUp(self):
        rclpy.init()
        self.node = RobotController()
    
    def tearDown(self):
        self.node.destroy_node()
        rclpy.shutdown()
    
    def test_velocity_conversion(self):
        # 测试速度转换
        v_left, v_right = self.node.convert_twist_to_wheels(1.0, 0.0)
        self.assertAlmostEqual(v_left, 1.0)
        self.assertAlmostEqual(v_right, 1.0)
    
    def test_parameter_update(self):
        # 测试参数更新
        self.node.set_parameters([
            rclpy.parameter.Parameter('max_speed', rclpy.Parameter.Type.DOUBLE, 2.0)
        ])
        self.assertEqual(self.node.max_speed, 2.0)

if __name__ == '__main__':
    unittest.main()
```

**集成测试**

```python
# test/test_integration.py
import launch
import launch_ros
import launch_testing
import pytest

@pytest.mark.launch_test
def generate_test_description():
    # 启动节点
    node_under_test = launch_ros.actions.Node(
        package='my_robot_pkg',
        executable='robot_controller',
        name='robot_controller'
    )
    
    return launch.LaunchDescription([
        node_under_test,
        launch_testing.actions.ReadyToTest()
    ])

class TestIntegration(unittest.TestCase):
    def test_node_starts(self, proc_output):
        # 测试节点是否成功启动
        proc_output.assertWaitFor('Connected to /dev/ttyUSB0', timeout=10)
```

### 性能优化

**使用 C++ 实现关键节点**

对于高频率、低延迟的节点（如电机控制），使用 C++ 而不是 Python：

```cpp
// src/motor_controller.cpp
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/twist.hpp>

class MotorController : public rclcpp::Node {
public:
    MotorController() : Node("motor_controller") {
        // 使用 lambda 表达式创建订阅
        subscription_ = this->create_subscription<geometry_msgs::msg::Twist>(
            "cmd_vel", 10,
            [this](const geometry_msgs::msg::Twist::SharedPtr msg) {
                this->cmd_callback(msg);
            }
        );
    }

private:
    void cmd_callback(const geometry_msgs::msg::Twist::SharedPtr msg) {
        // 处理速度命令（C++ 比 Python 快 10-100 倍）
        double v = msg->linear.x;
        double omega = msg->angular.z;
        
        // 差速驱动逆运动学
        double v_left = v - (omega * wheel_base_ / 2.0);
        double v_right = v + (omega * wheel_base_ / 2.0);
        
        // 发送到硬件
        send_to_hardware(v_left, v_right);
    }
    
    rclcpp::Subscription<geometry_msgs::msg::Twist>::SharedPtr subscription_;
    double wheel_base_ = 0.3;
};
```

**QoS 配置优化**

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy

# 传感器数据：低延迟优先
sensor_qos = QoSProfile(
    reliability=QoSReliabilityPolicy.BEST_EFFORT,
    history=QoSHistoryPolicy.KEEP_LAST,
    depth=1  # 只保留最新数据
)

# 控制命令：可靠性优先
control_qos = QoSProfile(
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST,
    depth=10  # 保留最近10条命令
)

# 创建订阅时使用
self.create_subscription(LaserScan, '/scan', callback, sensor_qos)
self.create_subscription(Twist, '/cmd_vel', callback, control_qos)
```

### 日志和调试

**结构化日志**

```python
class RobotNode(Node):
    def __init__(self):
        super().__init__('robot_node')
        
        # 设置日志级别
        self.get_logger().set_level(rclpy.logging.LoggingSeverity.INFO)
    
    def process_data(self, data):
        # 使用不同级别的日志
        self.get_logger().debug(f'Processing data: {data}')
        
        if data.is_valid():
            self.get_logger().info('Data processed successfully')
        else:
            self.get_logger().warning('Invalid data received')
        
        if data.is_critical_error():
            self.get_logger().error('Critical error detected!')
            self.get_logger().fatal('System shutdown required')
```

**使用 rosbag2 记录数据**

```bash
# 记录所有话题
ros2 bag record -a

# 记录特定话题
ros2 bag record /cmd_vel /odom /scan

# 回放数据
ros2 bag play my_bag_file

# 查看 bag 信息
ros2 bag info my_bag_file
```

## 9.13 常见陷阱和解决方案

### 陷阱 1：忘记 source setup.bash

**问题**：
```bash
$ ros2 run my_robot_pkg my_node
Package 'my_robot_pkg' not found
```

**原因**：每次打开新终端都需要 source 工作空间。

**解决方案**：
```bash
# 方法 1：手动 source
source ~/ros2_ws/install/setup.bash

# 方法 2：添加到 .bashrc（永久生效）
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc

# 方法 3：使用别名
alias ros2_setup='source ~/ros2_ws/install/setup.bash'
```

### 陷阱 2：话题名称不匹配

**问题**：发布者和订阅者无法通信。

**调试步骤**：
```bash
# 1. 查看所有话题
ros2 topic list

# 2. 查看话题详情
ros2 topic info /cmd_vel

# 3. 检查消息类型
ros2 topic type /cmd_vel

# 4. 查看话题数据
ros2 topic echo /cmd_vel
```

**常见原因**：
- 话题名称拼写错误（`/cmd_vel` vs `/cmd_vel/`）
- 命名空间不匹配（`/robot1/cmd_vel` vs `/cmd_vel`）
- 消息类型不匹配

### 陷阱 3：回调函数阻塞

**问题**：
```python
def callback(self, msg):
    # 错误：在回调中执行耗时操作
    time.sleep(5)  # 阻塞了整个节点！
    self.process(msg)
```

**后果**：
- 其他回调无法执行
- 定时器停止工作
- 节点失去响应

**解决方案**：
```python
import threading

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        self.sub = self.create_subscription(
            String,
            'topic',
            self.callback,
            10
        )
    
    def callback(self, msg):
        # 将耗时操作提交到线程池
        self.executor.submit(self.process, msg)
    
    def process(self, msg):
        # 耗时操作在独立线程中执行
        time.sleep(5)
        self.get_logger().info('Processing complete')
```

### 陷阱 4：参数未声明

**问题**：
```python
# 错误：直接使用参数
self.max_speed = self.get_parameter('max_speed').value  # 抛出异常！
```

**原因**：ROS 2 要求先声明参数。

**解决方案**：
```python
# 正确：先声明，再使用
self.declare_parameter('max_speed', 1.0)  # 带默认值
self.max_speed = self.get_parameter('max_speed').value
```

### 陷阱 5：DDS 域冲突

**问题**：多个 ROS 2 系统在同一网络中互相干扰。

**现象**：
- 看到不属于自己的节点
- 话题数据混乱
- 性能下降

**解决方案**：
```bash
# 设置不同的 ROS_DOMAIN_ID（0-101）
export ROS_DOMAIN_ID=42

# 或在 launch 文件中设置
os.environ['ROS_DOMAIN_ID'] = '42'
```

### 陷阱 6：消息定义修改后未重新编译

**问题**：修改了 `.msg` 文件，但代码仍使用旧定义。

**解决方案**：
```bash
# 清理并重新编译
colcon build --packages-select my_robot_msgs --cmake-clean-cache

# 重新 source
source install/setup.bash
```

### 陷阱 7：生命周期节点的状态管理

**问题**：生命周期节点在错误状态下无法工作。

**调试**：
```bash
# 查看节点状态
ros2 lifecycle get /my_node

# 手动切换状态
ros2 lifecycle set /my_node configure
ros2 lifecycle set /my_node activate
```

### 陷阱 8：QoS 不匹配

**问题**：发布者和订阅者的 QoS 设置不兼容。

**示例**：
```python
# 发布者使用 RELIABLE
pub = self.create_publisher(String, 'topic', 10)  # 默认 RELIABLE

# 订阅者使用 BEST_EFFORT
qos = QoSProfile(reliability=QoSReliabilityPolicy.BEST_EFFORT, depth=10)
sub = self.create_subscription(String, 'topic', callback, qos)  # 不兼容！
```

**解决方案**：
```bash
# 查看话题的 QoS 设置
ros2 topic info -v /topic

# 确保发布者和订阅者的 QoS 兼容
```

## 9.14 未来发展趋势

### ROS 2 的演进方向

**1. 更强的实时性能**

ROS 2 正在向硬实时系统发展：
- **实时执行器**：新的执行器设计保证确定性调度
- **实时 DDS**：支持 TSN（时间敏感网络）
- **实时 Linux**：与 PREEMPT_RT 补丁深度集成

**未来代码示例**：
```python
# ROS 2 未来版本可能支持的实时配置
from rclpy.executors import RealtimeExecutor

executor = RealtimeExecutor(
    priority=99,  # 实时优先级
    cpu_affinity=[0, 1],  # 绑定到特定 CPU 核心
    deadline_ms=10  # 10ms 截止时间
)
```

**2. 云原生机器人**

ROS 2 正在拥抱云计算：
- **Kubernetes 集成**：使用 K8s 编排 ROS 2 节点
- **微服务架构**：每个 ROS 2 节点作为独立容器
- **边缘计算**：ROS 2 节点分布在云端和边缘设备

**示例架构**：
```yaml
# kubernetes/robot-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: robot-controller
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: controller
        image: my-robot:latest
        env:
        - name: ROS_DOMAIN_ID
          value: "42"
        - name: RMW_IMPLEMENTATION
          value: "rmw_cyclonedds_cpp"
```

**3. AI 和机器学习集成**

ROS 2 与 AI 框架的深度融合：
- **ROS 2 + PyTorch**：实时推理节点
- **ROS 2 + TensorFlow**：分布式训练
- **ROS 2 + ONNX**：模型部署标准化

**未来示例**：
```python
# 未来可能的 AI 节点
from rclpy_ml import MLNode
import torch

class VisionNode(MLNode):
    def __init__(self):
        super().__init__('vision_node')
        
        # 自动管理模型加载和推理
        self.model = self.load_model('yolov8.onnx', device='cuda')
        
        # 自动创建输入/输出话题
        self.create_ml_subscription(
            Image, '/camera/image',
            output_type=DetectionArray,
            output_topic='/detections'
        )
```

**4. 安全性增强**

SROS2（Secure ROS 2）将成为标准配置：
- **默认加密**：所有通信默认加密
- **细粒度权限**：基于角色的访问控制
- **审计日志**：完整的操作记录

**5. 跨平台支持**

ROS 2 正在扩展到更多平台：
- **嵌入式系统**：micro-ROS 支持 MCU（如 ESP32、STM32）
- **移动设备**：Android 和 iOS 原生支持
- **Web 浏览器**：通过 WebAssembly 运行 ROS 2 节点

**micro-ROS 示例**：
```c
// ESP32 上的 micro-ROS 节点
#include <micro_ros_arduino.h>

void setup() {
  // 初始化 micro-ROS
  set_microros_transports();
  
  // 创建节点
  rcl_node_t node = rcl_get_zero_initialized_node();
  rcl_node_init(&node, "esp32_node", "", &support);
  
  // 创建发布者
  rcl_publisher_t publisher = rcl_get_zero_initialized_publisher();
  rcl_publisher_init(&publisher, &node, 
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32),
    "esp32_data", &default_publisher_options);
}
```

### 机器人中间件的未来

**1. 统一标准**

未来可能出现统一的机器人中间件标准：
- **OMG Robotics DTF**：对象管理组织的机器人领域任务组
- **IEEE RAS**：IEEE 机器人与自动化学会的标准化工作
- **ISO 标准**：国际标准化组织的机器人通信标准

**2. 5G 和 6G 集成**

低延迟、高带宽的无线通信将改变机器人架构：
- **云端大脑**：计算密集型任务在云端执行
- **边缘协同**：边缘设备和云端的智能分配
- **群体智能**：多机器人通过 5G 实时协作

**3. 数字孪生**

ROS 2 将与数字孪生技术深度融合：
- **实时同步**：物理机器人和虚拟模型实时同步
- **预测性维护**：通过数字孪生预测故障
- **虚拟调试**：在数字孪生中测试新算法

### 学习建议

**保持学习的方向**：

1. **关注官方博客**：https://www.openrobotics.org/blog
2. **参与社区讨论**：ROS Discourse 论坛
3. **阅读 REP**：ROS Enhancement Proposals（ROS 增强提案）
4. **贡献开源项目**：参与 ROS 2 核心包的开发

**推荐关注的项目**：
- **Nav2**：下一代导航框架
- **MoveIt2**：机械臂运动规划
- **ros2_control**：硬件抽象和控制
- **micro-ROS**：嵌入式 ROS 2

## 推荐资源

### 官方文档

**ROS 2 Documentation**：https://docs.ros.org/en/humble/
- 最权威的 ROS 2 文档

**ROS 2 Tutorials**：https://docs.ros.org/en/humble/Tutorials.html
- 官方教程，从入门到进阶

### 在线课程

**The Construct**：https://www.theconstructsim.com/
- 在线 ROS 2 课程，有免费和付费内容

**Udemy ROS 2 Courses**：搜索"ROS 2"，有多个高质量课程

### 书籍

**《Programming Robots with ROS》**：虽然是 ROS 1，但概念通用

**《ROS 2 Robotics Developer Guide》**：专门讲 ROS 2

## 本章小结

在本章中，我们学习了：

- ROS 2 的核心概念（节点、话题、服务、消息）
- ROS 2 的安装和工作空间管理
- 创建 ROS 2 包和节点
- 话题通信（发布者和订阅者）
- 速度控制实例
- ROS 2 命令行工具
- Launch 文件的使用
- 完整的机器人控制系统架构

ROS 2 是现代机器人开发的基石，掌握它将为你打开机器人世界的大门。在下一章，我们将学习传感器集成。

## 学习目标复查

理解 ROS 2 的核心架构和设计理念（模块化、可重用、分布式）
能够创建 ROS 2 工作空间并成功编译运行第一个节点
掌握话题（Topic）的发布-订阅模式，能够编写发布者和订阅者节点
理解并能够使用常用的 ROS 2 命令行工具（ros2 node、ros2 topic、ros2 param 等）
能够使用 geometry_msgs/Twist 消息类型实现机器人速度控制
掌握 Launch 文件的编写和使用，能够同时启动多个节点
理解话题、服务和动作三种通信机制的区别和适用场景

## 问答环节

**Q1：ROS 2 和 ROS 1 的代码兼容吗？**

A：不完全兼容，但有 ros1_bridge 可以让 ROS 1 和 ROS 2 节点互相通信。对于新项目，直接用 ROS 2。

**Q2：为什么要用 colcon 而不是 catkin？**

A：catkin 是 ROS 1 的构建工具，colcon 是 ROS 2 的新构建工具，支持多种构建系统（CMake、Python setuptools 等）。

**Q3：如何调试 ROS 2 节点？**

A：
1. 使用 `self.get_logger().info()` 打印日志
2. 使用 `ros2 topic echo` 查看话题数据
3. 使用 `rqt_graph` 可视化节点关系
4. 使用 Python 调试器（pdb）

**Q4：话题和服务如何选择？**

A：
- **话题**：持续的数据流（传感器数据、控制命令）
- **服务**：一次性的请求（查询状态、触发动作）

**Q5：如何提高 ROS 2 的实时性？**

A：
1. 使用 C++ 而不是 Python（关键节点）
2. 配置 DDS QoS（Quality of Service）
3. 使用实时操作系统（如 RT-PREEMPT）
4. 优化节点的回调函数

## 动手练习

**练习 1：温度监控系统**

创建两个节点：
1. 温度传感器节点：模拟温度数据，发布到 `/temperature` 话题
2. 监控节点：订阅温度，超过阈值时打印警告

**练习 2：服务示例**

创建一个服务节点，提供加法服务：
- 服务名：`/add_two_ints`
- 服务类型：`example_interfaces/srv/AddTwoInts`
- 功能：接收两个整数，返回它们的和

**练习 3：多机器人系统**

启动多个机器人模拟器节点（使用不同的命名空间），用一个控制节点分别控制它们。

提示：使用 `--ros-args -r __ns:=/robot1` 设置命名空间。

---

## 📚 拓展资源

想要深入学习ROS 2和机器人操作系统？查看我们精心整理的[第9章拓展资源](../resources/chapter_09_resources.md)，包括：

- 📖 **推荐教材**：《ROS 2机器人编程实战》、《Programming Robots with ROS》
- 📄 **技术文档**：ROS 2官方文档、DDS规范、rclpy API参考
- 🌐 **优质博客**：ROS Discourse、The Construct博客、Robotics Backend
- 🎥 **视频教程**：ROS 2基础、节点通信、launch文件配置
- 💻 **开源项目**：Navigation2、MoveIt2、ros2_control
- 🎓 **在线课程**：ROS 2 for Beginners、The Construct Academy
- 🛠️ **实用工具**：Gazebo仿真器、RViz2可视化、rqt工具集
- 💬 **活跃社区**：ROS Discourse、r/ROS、ROS Developers Slack

[→ 查看完整资源列表](../resources/chapter_09_resources.md)
