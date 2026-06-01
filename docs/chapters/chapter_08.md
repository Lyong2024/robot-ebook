# 第8章：Python 编程：机器人的通用语言

## 学习目标

- 理解为什么 Python 是机器人开发的首选语言
- 掌握 Python 基础语法
- 学会使用 NumPy 进行数值计算
- 理解面向对象编程
- 能够编写机器人控制程序
- 掌握 Python 虚拟环境管理

## 8.1 为什么选择 Python？

在机器人领域，Python 已经成为事实上的标准语言。

### Python 的优势

**简单易学**：语法接近自然语言，初学者友好。

**丰富的库**：
- **NumPy**：数值计算
- **OpenCV**：计算机视觉
- **Matplotlib**：数据可视化
- **SciPy**：科学计算
- **TensorFlow/PyTorch**：深度学习

**ROS 2 的首选**：ROS 2 的 Python API 非常完善，大多数教程都用 Python。

**快速原型**：可以快速验证想法，迭代速度快。

### Python vs C++

在机器人开发中，Python 和 C++ 各有用途：

**Python**：
- 高层逻辑（决策、规划）
- 快速原型
- 数据处理和可视化
- 机器学习

**C++**：
- 实时控制（需要低延迟）
- 高性能计算（图像处理、SLAM）
- 硬件驱动

对于初学者，**先学 Python，再学 C++** 是最佳路径。

## 8.2 Python 环境搭建

### 安装 Python

Ubuntu 22.04 默认安装了 Python 3.10，检查版本：

```bash
python3 --version
```

如果需要安装：

```bash
sudo apt update
sudo apt install python3 python3-pip
```

### pip：Python 包管理器

pip 用于安装 Python 库：

```bash
pip3 install numpy
pip3 install opencv-python
pip3 install matplotlib
```

查看已安装的包：

```bash
pip3 list
```

### 虚拟环境

虚拟环境可以为不同项目创建独立的 Python 环境，避免依赖冲突。

**创建虚拟环境**：

```bash
python3 -m venv robot_env
```

**激活虚拟环境**：

```bash
source robot_env/bin/activate
# 提示符会变成 (robot_env) user@host:~$
```

**退出虚拟环境**：

```bash
deactivate
```

**在虚拟环境中安装包**：

```bash
source robot_env/bin/activate
pip install numpy opencv-python
```

## 8.3 Python 基础语法

### Hello World

```python
print("Hello, Robot!")
```

运行：

```bash
python3 hello.py
```

### 变量和数据类型

```python
# 整数
age = 25
motor_speed = 100

# 浮点数
voltage = 7.4
distance = 1.5

# 字符串
robot_name = "R2D2"
status = 'running'

# 布尔值
is_moving = True
has_obstacle = False

# 列表（可变）
sensors = ['lidar', 'camera', 'imu']
positions = [0.0, 1.5, 2.3]

# 元组（不可变）
coordinates = (10, 20, 30)

# 字典
robot_config = {
    'name': 'MyRobot',
    'max_speed': 2.0,
    'sensors': ['lidar', 'camera']
}

# 打印变量
print(f"Robot name: {robot_name}")
print(f"Voltage: {voltage}V")
```

### 运算符

```python
# 算术运算
a = 10 + 5      # 15
b = 10 - 5      # 5
c = 10 * 5      # 50
d = 10 / 5      # 2.0（浮点除法）
e = 10 // 3     # 3（整数除法）
f = 10 % 3      # 1（取余）
g = 2 ** 3      # 8（幂运算）

# 比较运算
x = 10
y = 20
print(x == y)   # False
print(x != y)   # True
print(x < y)    # True
print(x <= y)   # True

# 逻辑运算
has_power = True
has_connection = False
print(has_power and has_connection)  # False
print(has_power or has_connection)   # True
print(not has_power)                 # False
```

### 条件语句

```python
battery_voltage = 7.2

if battery_voltage > 7.5:
    print("Battery OK")
elif battery_voltage > 7.0:
    print("Battery Low")
else:
    print("Battery Critical!")
    
# 三元运算符
status = "OK" if battery_voltage > 7.0 else "Low"
```

### 循环

```python
# for 循环
for i in range(5):
    print(f"Count: {i}")

# 遍历列表
sensors = ['lidar', 'camera', 'imu']
for sensor in sensors:
    print(f"Checking {sensor}...")

# 遍历字典
robot_config = {'name': 'R2D2', 'speed': 2.0}
for key, value in robot_config.items():
    print(f"{key}: {value}")

# while 循环
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# break 和 continue
for i in range(10):
    if i == 3:
        continue  # 跳过 3
    if i == 7:
        break     # 在 7 停止
    print(i)
```

### 函数

```python
def calculate_speed(distance, time):
    """计算速度"""
    if time == 0:
        return 0
    return distance / time

# 调用函数
speed = calculate_speed(10.0, 5.0)
print(f"Speed: {speed} m/s")

# 默认参数
def move_robot(distance, speed=1.0):
    time = distance / speed
    print(f"Moving {distance}m at {speed}m/s, takes {time}s")

move_robot(10)           # 使用默认速度
move_robot(10, 2.0)      # 指定速度

# 返回多个值
def get_position():
    x = 1.5
    y = 2.3
    z = 0.0
    return x, y, z

x, y, z = get_position()
print(f"Position: ({x}, {y}, {z})")

# Lambda 函数（匿名函数）
square = lambda x: x ** 2
print(square(5))  # 25
```

### 列表操作

```python
# 创建列表
numbers = [1, 2, 3, 4, 5]

# 访问元素
print(numbers[0])      # 1（第一个）
print(numbers[-1])     # 5（最后一个）
print(numbers[1:3])    # [2, 3]（切片）

# 修改列表
numbers.append(6)      # 添加到末尾
numbers.insert(0, 0)   # 在索引 0 插入
numbers.remove(3)      # 删除值为 3 的元素
numbers.pop()          # 删除并返回最后一个元素

# 列表推导式
squares = [x**2 for x in range(10)]
even_numbers = [x for x in range(20) if x % 2 == 0]
```

### 字典操作

```python
# 创建字典
robot = {
    'name': 'R2D2',
    'type': 'astromech',
    'speed': 2.0
}

# 访问
print(robot['name'])
print(robot.get('speed', 0))  # 安全访问，不存在返回默认值

# 修改
robot['speed'] = 2.5
robot['battery'] = 7.4

# 删除
del robot['type']

# 遍历
for key, value in robot.items():
    print(f"{key}: {value}")

# 检查键是否存在
if 'battery' in robot:
    print(f"Battery: {robot['battery']}V")
```

## 8.4 面向对象编程

面向对象编程（OOP）是组织代码的强大方式。

### 类和对象

```python
class Robot:
    """机器人类"""
    
    def __init__(self, name, max_speed):
        """构造函数"""
        self.name = name
        self.max_speed = max_speed
        self.current_speed = 0.0
        self.position = [0.0, 0.0]
    
    def accelerate(self, delta_speed):
        """加速"""
        self.current_speed += delta_speed
        if self.current_speed > self.max_speed:
            self.current_speed = self.max_speed
        print(f"{self.name} speed: {self.current_speed} m/s")
    
    def move(self, distance):
        """移动"""
        if self.current_speed == 0:
            print("Robot is not moving!")
            return
        
        time = distance / self.current_speed
        self.position[0] += distance
        print(f"{self.name} moved {distance}m in {time}s")
    
    def get_status(self):
        """获取状态"""
        return {
            'name': self.name,
            'speed': self.current_speed,
            'position': self.position
        }

# 创建对象
my_robot = Robot("R2D2", max_speed=3.0)

# 调用方法
my_robot.accelerate(1.0)
my_robot.move(10.0)
status = my_robot.get_status()
print(status)
```

### 继承

```python
class MobileRobot(Robot):
    """移动机器人（继承自 Robot）"""
    
    def __init__(self, name, max_speed, wheel_radius):
        super().__init__(name, max_speed)
        self.wheel_radius = wheel_radius
    
    def rotate(self, angle):
        """旋转"""
        print(f"{self.name} rotating {angle} degrees")
        # 旋转逻辑

class ArmRobot(Robot):
    """机械臂机器人"""
    
    def __init__(self, name, num_joints):
        super().__init__(name, max_speed=0)  # 机械臂不移动
        self.num_joints = num_joints
        self.joint_angles = [0.0] * num_joints
    
    def move_joint(self, joint_id, angle):
        """移动关节"""
        if 0 <= joint_id < self.num_joints:
            self.joint_angles[joint_id] = angle
            print(f"Joint {joint_id} moved to {angle} degrees")

# 使用
mobile = MobileRobot("Rover", 2.0, 0.05)
mobile.accelerate(1.5)
mobile.rotate(90)

arm = ArmRobot("UR5", 6)
arm.move_joint(0, 45)
```

## 8.5 NumPy：数值计算的基石

NumPy 是 Python 科学计算的核心库，在机器人学中无处不在。

### 安装

```bash
pip3 install numpy
```

### 数组基础

```python
import numpy as np

# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]])

# 特殊数组
zeros = np.zeros((3, 3))           # 全零
ones = np.ones((2, 4))             # 全一
identity = np.eye(3)               # 单位矩阵
random = np.random.rand(3, 3)      # 随机数

# 数组属性
print(a.shape)      # (5,)
print(b.shape)      # (2, 3)
print(b.dtype)      # int64
print(b.size)       # 6
```

### 数组运算

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 元素级运算
print(a + b)        # [5 7 9]
print(a * b)        # [4 10 18]
print(a ** 2)       # [1 4 9]

# 矩阵运算
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A + B)        # 矩阵加法
print(A @ B)        # 矩阵乘法（Python 3.5+）
print(np.dot(A, B)) # 矩阵乘法（传统方式）

# 转置
print(A.T)

# 逆矩阵
print(np.linalg.inv(A))
```

### 机器人学应用：旋转矩阵

```python
import numpy as np

def rotation_matrix_z(angle_deg):
    """绕 Z 轴旋转的旋转矩阵"""
    angle_rad = np.radians(angle_deg)
    cos_a = np.cos(angle_rad)
    sin_a = np.sin(angle_rad)
    
    R = np.array([
        [cos_a, -sin_a, 0],
        [sin_a,  cos_a, 0],
        [0,      0,     1]
    ])
    return R

# 旋转一个点
point = np.array([1, 0, 0])
R = rotation_matrix_z(90)
rotated_point = R @ point
print(f"Original: {point}")
print(f"Rotated 90°: {rotated_point}")
```

### 机器人学应用：齐次变换矩阵

```python
import numpy as np

def homogeneous_transform(x, y, theta_deg):
    """2D 齐次变换矩阵"""
    theta_rad = np.radians(theta_deg)
    cos_t = np.cos(theta_rad)
    sin_t = np.sin(theta_rad)
    
    T = np.array([
        [cos_t, -sin_t, x],
        [sin_t,  cos_t, y],
        [0,      0,     1]
    ])
    return T

# 机器人在 (1, 2) 位置，朝向 45°
T_robot = homogeneous_transform(1, 2, 45)

# 传感器在机器人坐标系中的位置 (0.5, 0)
sensor_local = np.array([0.5, 0, 1])

# 传感器在世界坐标系中的位置
sensor_world = T_robot @ sensor_local
print(f"Sensor position in world: ({sensor_world[0]:.2f}, {sensor_world[1]:.2f})")
```

## 8.6 文件操作

### 读写文本文件

```python
# 写入文件
with open('robot_log.txt', 'w') as f:
    f.write("Robot started\n")
    f.write("Speed: 1.5 m/s\n")

# 读取文件
with open('robot_log.txt', 'r') as f:
    content = f.read()
    print(content)

# 逐行读取
with open('robot_log.txt', 'r') as f:
    for line in f:
        print(line.strip())

# 追加内容
with open('robot_log.txt', 'a') as f:
    f.write("Robot stopped\n")
```

### JSON 文件

```python
import json

# 写入 JSON
robot_config = {
    'name': 'R2D2',
    'max_speed': 2.0,
    'sensors': ['lidar', 'camera']
}

with open('config.json', 'w') as f:
    json.dump(robot_config, f, indent=2)

# 读取 JSON
with open('config.json', 'r') as f:
    config = json.load(f)
    print(config['name'])
```

### CSV 文件

```python
import csv

# 写入 CSV
data = [
    ['time', 'x', 'y', 'speed'],
    [0.0, 0.0, 0.0, 0.0],
    [1.0, 1.5, 0.5, 1.5],
    [2.0, 3.0, 1.0, 1.5]
]

with open('trajectory.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)

# 读取 CSV
with open('trajectory.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

## 8.7 异常处理

```python
def read_sensor():
    try:
        # 可能出错的代码
        value = int(input("Enter sensor value: "))
        result = 100 / value
        return result
    except ValueError:
        print("Invalid input! Please enter a number.")
        return None
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
    finally:
        print("Sensor read attempt completed.")

# 使用
result = read_sensor()
if result is not None:
    print(f"Result: {result}")
```

## 8.8 实践项目：差速驱动运动学

让我们用 Python 实现一个完整的差速驱动机器人模拟器。

```python
import numpy as np
import matplotlib.pyplot as plt

class DifferentialDriveRobot:
    """差速驱动机器人"""
    
    def __init__(self, wheel_base, wheel_radius):
        """
        参数:
            wheel_base: 轮距（米）
            wheel_radius: 轮子半径（米）
        """
        self.L = wheel_base
        self.r = wheel_radius
        
        # 状态：[x, y, theta]
        self.state = np.array([0.0, 0.0, 0.0])
        
        # 轨迹记录
        self.trajectory = [self.state.copy()]
    
    def forward_kinematics(self, v_left, v_right, dt):
        """
        正运动学：根据左右轮速度计算机器人运动
        
        参数:
            v_left: 左轮线速度（m/s）
            v_right: 右轮线速度（m/s）
            dt: 时间步长（秒）
        """
        x, y, theta = self.state
        
        # 计算线速度和角速度
        v = (v_right + v_left) / 2.0
        omega = (v_right - v_left) / self.L
        
        # 更新状态
        if abs(omega) < 1e-6:
            # 直线运动
            x += v * np.cos(theta) * dt
            y += v * np.sin(theta) * dt
        else:
            # 圆弧运动
            R = v / omega
            x += R * (np.sin(theta + omega * dt) - np.sin(theta))
            y += R * (-np.cos(theta + omega * dt) + np.cos(theta))
            theta += omega * dt
        
        # 归一化角度到 [-pi, pi]
        theta = np.arctan2(np.sin(theta), np.cos(theta))
        
        self.state = np.array([x, y, theta])
        self.trajectory.append(self.state.copy())
    
    def inverse_kinematics(self, v, omega):
        """
        逆运动学：根据期望的线速度和角速度计算左右轮速度
        
        参数:
            v: 期望线速度（m/s）
            omega: 期望角速度（rad/s）
        
        返回:
            (v_left, v_right): 左右轮速度
        """
        v_left = v - (omega * self.L / 2.0)
        v_right = v + (omega * self.L / 2.0)
        return v_left, v_right
    
    def move(self, v, omega, duration, dt=0.1):
        """
        移动机器人
        
        参数:
            v: 线速度（m/s）
            omega: 角速度（rad/s）
            duration: 持续时间（秒）
            dt: 时间步长（秒）
        """
        v_left, v_right = self.inverse_kinematics(v, omega)
        
        steps = int(duration / dt)
        for _ in range(steps):
            self.forward_kinematics(v_left, v_right, dt)
    
    def plot_trajectory(self):
        """绘制轨迹"""
        trajectory = np.array(self.trajectory)
        
        plt.figure(figsize=(10, 10))
        plt.plot(trajectory[:, 0], trajectory[:, 1], 'b-', linewidth=2)
        plt.plot(trajectory[0, 0], trajectory[0, 1], 'go', markersize=10, label='Start')
        plt.plot(trajectory[-1, 0], trajectory[-1, 1], 'ro', markersize=10, label='End')
        
        # 绘制机器人朝向
        for i in range(0, len(trajectory), len(trajectory)//10):
            x, y, theta = trajectory[i]
            dx = 0.3 * np.cos(theta)
            dy = 0.3 * np.sin(theta)
            plt.arrow(x, y, dx, dy, head_width=0.1, head_length=0.1, fc='r', ec='r')
        
        plt.xlabel('X (m)')
        plt.ylabel('Y (m)')
        plt.title('Robot Trajectory')
        plt.legend()
        plt.grid(True)
        plt.axis('equal')
        plt.show()

# 使用示例
if __name__ == '__main__':
    # 创建机器人（轮距 0.3m，轮半径 0.05m）
    robot = DifferentialDriveRobot(wheel_base=0.3, wheel_radius=0.05)
    
    # 测试 1：直线前进
    print("Moving forward...")
    robot.move(v=1.0, omega=0.0, duration=3.0)
    
    # 测试 2：原地旋转
    print("Rotating...")
    robot.move(v=0.0, omega=np.pi/2, duration=2.0)
    
    # 测试 3：圆弧运动
    print("Arc motion...")
    robot.move(v=1.0, omega=0.5, duration=4.0)
    
    # 测试 4：8 字形
    print("Figure-8...")
    robot.move(v=1.0, omega=1.0, duration=np.pi)
    robot.move(v=1.0, omega=-1.0, duration=np.pi)
    
    # 打印最终位置
    x, y, theta = robot.state
    print(f"\nFinal position: ({x:.2f}, {y:.2f})")
    print(f"Final orientation: {np.degrees(theta):.2f}°")
    
    # 绘制轨迹
    robot.plot_trajectory()
```

这个程序实现了：
1. 差速驱动的正运动学（轮速 → 机器人运动）
2. 差速驱动的逆运动学（期望运动 → 轮速）
3. 轨迹记录和可视化
4. 多种运动模式测试

## 拓展阅读

Python是机器人开发的核心语言。为了帮助你从入门到精通，我们整理了涵盖官方文档、经典书籍、在线课程、机器人专用库等多个维度的学习资源。

### 📚 经典书籍

#### 《Python Crash Course》（Python编程：从入门到实践）
- **作者**: Eric Matthes
- **出版年份**: 2023年第3版
- **语言**: 英文（有中文译本）
- **适合人群**: 完全零基础的初学者
- **核心价值**: 这是最受欢迎的Python入门书籍之一，前半部分讲解Python基础，后半部分通过三个实战项目（游戏、数据可视化、Web应用）巩固知识。语言通俗易懂，代码示例丰富。
- **推荐章节**:
  - Part I: Basics（基础语法）
  - Chapter 9: Classes（面向对象编程）
  - Chapter 10: Files and Exceptions（文件和异常处理）
- **为什么适合机器人开发**: 书中的面向对象编程章节对于设计机器人控制系统非常有帮助

#### 《Automate the Boring Stuff with Python》（Python编程快速上手）
- **作者**: Al Sweigart
- **出版年份**: 2019年第2版
- **语言**: 英文（有中文译本）
- **在线免费版**: https://automatetheboringstuff.com/
- **适合人群**: 希望快速掌握Python实用技能的开发者
- **核心价值**: 通过自动化日常任务学习Python，包括文件操作、网络爬虫、Excel处理等。对于机器人开发中的数据处理和自动化脚本编写非常实用。
- **推荐章节**:
  - Chapter 6: Manipulating Strings（字符串处理）
  - Chapter 9: Reading and Writing Files（文件操作）
  - Chapter 16: Working with CSV Files and JSON Data（数据格式处理）

#### 《Fluent Python》（流畅的Python）
- **作者**: Luciano Ramalho
- **出版年份**: 2022年第2版
- **语言**: 英文（有中文译本）
- **适合人群**: 有一定Python基础，希望深入理解Python的开发者
- **核心价值**: 深入讲解Python的高级特性和最佳实践，帮助你写出更Pythonic的代码。对于大型机器人项目的代码质量提升很有帮助。
- **推荐章节**:
  - Chapter 2: An Array of Sequences（序列类型）
  - Chapter 5: Data Class Builders（数据类）
  - Chapter 17: Iterators, Generators, and Classic Coroutines（迭代器和生成器）

#### 《Python for Data Analysis》（利用Python进行数据分析）
- **作者**: Wes McKinney（pandas库的创始人）
- **出版年份**: 2022年第3版
- **语言**: 英文（有中文译本）
- **适合人群**: 需要处理机器人传感器数据的开发者
- **核心价值**: 深入讲解NumPy、pandas等数据处理库，对于处理机器人的传感器数据、日志分析非常有用。
- **推荐章节**:
  - Chapter 4: NumPy Basics（NumPy基础）
  - Chapter 5: Getting Started with pandas（pandas入门）
  - Chapter 8: Data Wrangling（数据整理）

### 🎓 在线课程

#### Python for Everybody Specialization (Coursera)
- **讲师**: Dr. Charles Severance (University of Michigan)
- **平台**: Coursera
- **时长**: 约8个月（每周2-4小时）
- **费用**: 免费旁听，证书需付费（约$49/月）
- **语言**: 英文（有中文字幕）
- **评分**: 4.8/5.0（超过40万学习者）
- **核心内容**:
  - Python基础语法
  - 数据结构（列表、字典、元组）
  - 网络编程和数据库
  - 数据可视化
- **为什么推荐**: 这是最受欢迎的Python在线课程之一，讲师风格幽默，讲解清晰，完全免费旁听

#### Complete Python Bootcamp (Udemy)
- **讲师**: Jose Portilla
- **平台**: Udemy
- **时长**: 约22小时视频
- **费用**: 约¥79（经常打折）
- **语言**: 英文
- **评分**: 4.6/5.0（超过150万学习者）
- **核心内容**:
  - Python 3基础到高级
  - 面向对象编程
  - 装饰器和生成器
  - 实战项目
- **为什么推荐**: 内容全面，项目丰富，适合系统学习

#### Scientific Computing with Python (freeCodeCamp)
- **平台**: freeCodeCamp
- **链接**: https://www.freecodecamp.org/learn/scientific-computing-with-python/
- **时长**: 约300小时
- **费用**: 完全免费
- **语言**: 英文
- **核心内容**:
  - Python基础
  - 数据结构和算法
  - 5个认证项目
- **为什么推荐**: 完全免费，有认证证书，适合自学

#### Python for Robotics (The Construct)
- **平台**: The Construct
- **链接**: https://www.theconstructsim.com/robotigniteacademy_learnros/ros-courses-library/python-robotics/
- **时长**: 约40小时
- **费用**: 需订阅（有免费试用）
- **语言**: 英文
- **核心内容**:
  - Python在ROS中的应用
  - 机器人控制算法
  - 传感器数据处理
  - 实际机器人项目
- **为什么推荐**: 专门针对机器人开发，有在线仿真环境

### 🎬 视频教程

#### Python Tutorial for Beginners (Programming with Mosh)
- **平台**: YouTube
- **链接**: https://www.youtube.com/watch?v=_uQrJ0TkZlc
- **时长**: 6小时
- **语言**: 英文
- **观看次数**: 超过3000万次
- **核心内容**: 从零开始的Python完整教程
- **为什么推荐**: 讲解清晰，节奏适中，适合初学者

#### Python Full Course (Bro Code)
- **平台**: YouTube
- **链接**: https://www.youtube.com/watch?v=XKHEtdqhLK8
- **时长**: 12小时
- **语言**: 英文
- **观看次数**: 超过1000万次
- **核心内容**: Python基础到高级的完整课程
- **为什么推荐**: 内容全面，示例丰富

#### 【中文】Python从入门到精通（黑马程序员）
- **平台**: B站
- **时长**: 约50小时
- **语言**: 中文
- **观看量**: 超过500万
- **核心内容**:
  - Python基础语法
  - 面向对象编程
  - 文件操作和异常处理
  - 实战项目
- **为什么推荐**: 中文讲解，内容系统，适合国内学习者

#### 【中文】Python数据分析与机器学习实战（唐宇迪）
- **平台**: B站 / 网易云课堂
- **时长**: 约30小时
- **语言**: 中文
- **核心内容**:
  - NumPy和pandas
  - 数据可视化
  - 机器学习基础
- **为什么推荐**: 适合需要处理机器人数据的开发者

### 📖 官方文档和教程

#### Python官方教程
- **链接**: https://docs.python.org/3/tutorial/
- **语言**: 英文（有中文翻译）
- **核心价值**: 最权威的Python学习资源，涵盖所有基础知识
- **推荐章节**:
  - 3. An Informal Introduction to Python
  - 4. More Control Flow Tools
  - 5. Data Structures
  - 9. Classes

#### Real Python
- **链接**: https://realpython.com/
- **类型**: 在线教程网站
- **语言**: 英文
- **核心价值**: 高质量的Python教程和文章，涵盖从基础到高级的各个主题
- **推荐文章**:
  - "Python Virtual Environments: A Primer"
  - "Object-Oriented Programming (OOP) in Python 3"
  - "Working With Files in Python"
  - "Python Debugging With pdb"

#### Python官方文档（中文）
- **链接**: https://docs.python.org/zh-cn/3/
- **语言**: 简体中文
- **核心价值**: Python官方文档的中文翻译版本

### 🔢 NumPy专项资源

#### NumPy官方教程
- **链接**: https://numpy.org/doc/stable/user/quickstart.html
- **语言**: 英文
- **核心价值**: NumPy的官方入门教程，必读
- **推荐章节**:
  - Quickstart tutorial
  - NumPy basics
  - Array creation
  - Indexing and slicing

#### NumPy for MATLAB Users
- **链接**: https://numpy.org/doc/stable/user/numpy-for-matlab-users.html
- **语言**: 英文
- **核心价值**: 如果你熟悉MATLAB，这个对照表能帮你快速上手NumPy

#### From Python to NumPy
- **作者**: Nicolas P. Rougier
- **链接**: https://www.labri.fr/perso/nrougier/from-python-to-numpy/
- **类型**: 免费电子书
- **语言**: 英文
- **核心价值**: 深入讲解如何用NumPy优化Python代码，提升性能

#### 100 NumPy Exercises
- **链接**: https://github.com/rougier/numpy-100
- **类型**: GitHub练习项目
- **语言**: 英文
- **Star数**: 超过11k
- **核心价值**: 100个NumPy练习题，从简单到复杂，适合巩固知识

### 🤖 机器人专用Python库

#### robotics-toolbox-python
- **链接**: https://github.com/petercorke/robotics-toolbox-python
- **作者**: Peter Corke教授
- **Star数**: 超过1.5k
- **核心功能**:
  - 机器人运动学和动力学
  - 轨迹规划
  - 机器人可视化
- **文档**: https://petercorke.github.io/robotics-toolbox-python/
- **为什么推荐**: Peter Corke是机器人学领域的权威，这个库是他MATLAB工具箱的Python版本

#### PyRobot
- **链接**: https://github.com/facebookresearch/pyrobot
- **开发者**: Facebook AI Research
- **Star数**: 超过2k
- **核心功能**:
  - 统一的机器人控制接口
  - 支持多种机器人平台
  - 集成深度学习
- **为什么推荐**: 简化了机器人控制代码，适合快速原型开发

#### Modern Robotics Python Library
- **链接**: https://github.com/NxRLab/ModernRobotics
- **配套书籍**: 《Modern Robotics: Mechanics, Planning, and Control》
- **Star数**: 超过800
- **核心功能**:
  - 机器人运动学
  - 动力学
  - 轨迹规划
  - 控制
- **为什么推荐**: 基于经典教材，理论严谨，代码清晰

### 🛠️ 实用工具和库

#### IPython / Jupyter Notebook
- **链接**: https://jupyter.org/
- **核心价值**: 交互式Python开发环境，非常适合数据分析和算法调试
- **安装**:
  ```bash
  pip install jupyter
  jupyter notebook
  ```

#### Black (代码格式化工具)
- **链接**: https://github.com/psf/black
- **核心价值**: 自动格式化Python代码，保持代码风格一致
- **安装**:
  ```bash
  pip install black
  black your_script.py
  ```

#### pylint / flake8 (代码检查工具)
- **链接**: https://pylint.org/ / https://flake8.pycqa.org/
- **核心价值**: 检查代码质量，发现潜在问题
- **安装**:
  ```bash
  pip install pylint flake8
  pylint your_script.py
  ```

### 📊 数据可视化资源

#### Matplotlib官方教程
- **链接**: https://matplotlib.org/stable/tutorials/index.html
- **语言**: 英文
- **核心价值**: Python最常用的绘图库，机器人数据可视化必备

#### Seaborn教程
- **链接**: https://seaborn.pydata.org/tutorial.html
- **语言**: 英文
- **核心价值**: 基于Matplotlib的高级绘图库，适合统计图表

#### Plotly
- **链接**: https://plotly.com/python/
- **语言**: 英文
- **核心价值**: 交互式图表库，适合机器人轨迹可视化

### 🌏 中文资源

#### 《Python编程：从入门到实践》（中文版）
- **译者**: 袁国忠
- **出版社**: 人民邮电出版社
- **核心价值**: Python Crash Course的中文译本，翻译质量高

#### 廖雪峰的Python教程
- **链接**: https://www.liaoxuefeng.com/wiki/1016959663602400
- **类型**: 在线教程
- **语言**: 中文
- **核心价值**: 国内最受欢迎的Python中文教程之一，讲解清晰

#### 菜鸟教程 - Python 3
- **链接**: https://www.runoob.com/python3/python3-tutorial.html
- **类型**: 在线教程
- **语言**: 中文
- **核心价值**: 适合快速查询Python语法和示例

### 🎯 实战项目和练习

#### Python练习册
- **链接**: https://github.com/Yixiaohan/show-me-the-code
- **类型**: GitHub项目
- **语言**: 中文
- **Star数**: 超过10k
- **核心价值**: 100+个Python练习题，涵盖各个难度级别

#### LeetCode Python题解
- **链接**: https://leetcode.com/
- **类型**: 在线编程平台
- **语言**: 多语言
- **核心价值**: 通过算法题提升Python编程能力

#### Project Euler
- **链接**: https://projecteuler.net/
- **类型**: 数学编程挑战
- **语言**: 英文
- **核心价值**: 通过数学问题学习编程，适合提升算法思维

### 💡 学习建议

1. **先基础后高级**: 先掌握基础语法，再学习NumPy、面向对象等高级特性
2. **多写代码**: Python只能通过实践掌握，建议每天至少写30分钟代码
3. **阅读优秀代码**: 阅读开源项目的代码，学习最佳实践
4. **使用虚拟环境**: 养成为每个项目创建虚拟环境的习惯
5. **遵循PEP 8**: 学习并遵循Python代码风格指南
6. **调试技能**: 学会使用pdb调试器和print调试
7. **文档习惯**: 为函数和类编写docstring

### 🔗 相关章节

- 第7章：Linux命令行 - 学习在Linux环境下使用Python
- 第9章：ROS 2核心概念 - 学习用Python编写ROS 2节点
- 第10章：计算机视觉基础 - 学习用Python处理图像
- 第11章：SLAM基础 - 学习用Python实现SLAM算法

---

**版权说明**: 以上资源仅供个人学习使用。部分资源可能需要付费或注册。请尊重知识产权，支持正版。

## 本章小结

在本章中，我们学习了：

- Python 在机器人开发中的重要性
- Python 基础语法（变量、控制流、函数）
- 面向对象编程
- NumPy 数值计算
- 文件操作和异常处理
- 完整的差速驱动运动学实现

Python 是机器人开发的核心技能，熟练掌握它将让你的开发效率大大提升。在下一章，我们将学习 ROS 2 的核心概念。

## 问答环节

**Q1：Python 慢吗？会影响机器人性能吗？**

A：Python 确实比 C++ 慢，但：
1. 对于高层逻辑（决策、规划），速度足够
2. NumPy 底层是 C 实现的，数值计算很快
3. 真正需要高性能的部分（如图像处理），可以用 C++ 实现，Python 调用
4. 现代机器人系统是分层的，不同层用不同语言

**Q2：应该用 Python 2 还是 Python 3？**

A：**必须用 Python 3**！Python 2 已经在 2020 年停止支持，ROS 2 也只支持 Python 3。

**Q3：为什么要用虚拟环境？**

A：虚拟环境可以：
1. 隔离不同项目的依赖
2. 避免版本冲突
3. 方便部署（导出依赖列表）
4. 不污染系统 Python

**Q4：如何学习 Python 的最佳实践？**

A：
1. 阅读 PEP 8（Python 代码风格指南）
2. 使用 pylint 或 flake8 检查代码
3. 阅读优秀开源项目的代码
4. 参与代码审查

**Q5：NumPy 和 Python 列表有什么区别？**

A：
- **NumPy 数组**：固定类型、高效、支持向量化运算
- **Python 列表**：可变类型、灵活、但慢

对于数值计算，**总是用 NumPy**。

## 学习目标复查

完成本章学习后，请通过以下问题检查自己的掌握程度：

- [ ] 你能解释为什么Python是机器人开发的首选语言之一，并列举至少三个优势吗？
- [ ] 你能独立搭建Python虚拟环境，并使用pip安装和管理第三方库吗？
- [ ] 你能编写包含函数、类和异常处理的Python程序，并遵循PEP 8代码风格规范吗？
- [ ] 你能使用NumPy进行矩阵运算、数组操作和向量化计算吗？
- [ ] 你能实现一个完整的差速驱动机器人运动学模型，包括正运动学和逆运动学吗？
- [ ] 你能使用Python的文件操作功能读写配置文件、日志文件和数据文件吗？
- [ ] 你能在代码中正确使用try-except处理异常，并编写健壮的错误处理逻辑吗？

## 动手练习

**练习 1：PID 控制器**

实现一个 PID 控制器类：

```python
class PIDController:
    def __init__(self, kp, ki, kd):
        # 初始化参数
        pass
    
    def update(self, error, dt):
        # 计算控制输出
        pass
```

用它控制一个简单的系统（如温度控制）。

**练习 2：路径规划**

实现 A* 算法，在网格地图上规划路径。

提示：
- 用 2D NumPy 数组表示地图（0=空闲，1=障碍）
- 用优先队列（heapq）实现开放列表
- 用 Matplotlib 可视化结果

**练习 3：传感器融合**

模拟两个有噪声的传感器测量同一个值，用卡尔曼滤波融合数据。

提示：
- 用 `np.random.normal()` 生成噪声
- 实现简单的 1D 卡尔曼滤波
- 绘制原始数据和融合结果
