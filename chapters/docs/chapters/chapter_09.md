# 第9章：ROS 2 核心概念：构建机器人软件系统

## 学习目标

- 理解 ROS 2 的设计理念和架构
- 掌握节点（Node）、话题（Topic）、服务（Service）的概念
- 学会创建和管理 ROS 2 工作空间
- 能够编写简单的 ROS 2 节点
- 理解 ROS 2 的通信机制
- 掌握常用的 ROS 2 命令行工具

## 9.1 什么是 ROS 2？

ROS（Robot Operating System）不是传统意义上的操作系统，而是一个**机器人软件框架**。

### ROS 2 的核心价值

**模块化**：将复杂的机器人系统分解为独立的模块（节点），每个节点负责一个功能。

**可重用**：别人写好的节点（如 SLAM、导航）可以直接使用，不需要重新发明轮子。

**分布式**：节点可以运行在不同的计算机上，通过网络通信。

**工具丰富**：提供可视化、调试、记录等强大工具。

### ROS 1 vs ROS 2

ROS 2 是 ROS 的下一代版本，解决了 ROS 1 的许多问题：

| 特性 | ROS 1 | ROS 2 |
|------|-------|-------|
| 实时性 | 不支持 | 支持 |
| 安全性 | 弱 | 强（DDS） |
| 多机器人 | 困难 | 容易 |
| Windows 支持 | 差 | 好 |
| Python 3 | 不支持 | 支持 |

对于新项目，**强烈推荐使用 ROS 2**。

## 9.2 ROS 2 的核心概念

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
