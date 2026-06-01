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

### Python 的诞生与发展

**Python的创造者**：1989年圣诞节期间，荷兰程序员**Guido van Rossum**（吉多·范罗苏姆）在阿姆斯特丹开始编写Python。他当时在CWI（荷兰国家数学与计算机科学研究中心）工作，想创造一种易读、易学的编程语言。

Python的名字来自Guido喜爱的英国喜剧团体"Monty Python"（巨蟒剧团），而不是蟒蛇。这也体现了Python社区的幽默文化。

**设计哲学 - The Zen of Python**（Python之禅）：

在Python解释器中输入 `import this`，会看到Tim Peters总结的Python设计哲学：

```python
import this
```

核心思想包括：
- **Beautiful is better than ugly**（优美胜于丑陋）
- **Explicit is better than implicit**（明确胜于隐晦）
- **Simple is better than complex**（简单胜于复杂）
- **Readability counts**（可读性很重要）
- **There should be one-- and preferably only one --obvious way to do it**（应该有一种，最好只有一种明显的方法来做一件事）

这些哲学深刻影响了Python的语法设计。例如，Python强制使用缩进来表示代码块，这让代码天然具有良好的可读性。

**关键里程碑**：
- **1991**：Python 0.9.0发布，包含类、异常处理、函数和模块
- **1994**：Python 1.0发布，加入lambda、map、filter、reduce
- **2000**：Python 2.0发布，引入列表推导式和垃圾回收
- **2008**：Python 3.0发布，不向后兼容，修正了许多设计缺陷
- **2020**：Python 2正式停止支持，Python 3成为唯一版本
- **2021**：Python成为TIOBE编程语言排行榜第一名
- **2022**：Guido van Rossum加入微软，继续推动Python发展

**BDFL（Benevolent Dictator For Life）**：Guido长期担任Python的"仁慈的终身独裁者"，对语言设计有最终决定权。2018年，他宣布退休，Python转由指导委员会管理。

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

### Python在机器人领域的成功案例

**NASA的火星探测器**
- NASA使用Python进行数据分析和任务规划
- 火星车的科学数据处理大量使用Python
- JPL（喷气推进实验室）是Python的重度用户

**Boston Dynamics**
- 虽然底层控制用C++，但高层规划和测试工具大量使用Python
- Python用于机器人行为的快速原型开发

**工业机器人**
- ABB、KUKA等工业机器人厂商提供Python API
- 用于机器人编程、路径规划和视觉集成

**自动驾驶**
- Waymo、Tesla等公司的仿真和测试工具大量使用Python
- 深度学习模型训练主要用Python（TensorFlow/PyTorch）

**学术研究**
- 几乎所有机器人学术论文的算法实现都提供Python版本
- 便于复现和比较

### Python生态系统在机器人中的应用

**科学计算栈**：
- **NumPy**：矩阵运算、坐标变换
- **SciPy**：优化、信号处理、滤波
- **SymPy**：符号计算、运动学推导

**计算机视觉**：
- **OpenCV**：图像处理、特征检测
- **PIL/Pillow**：图像读写和基本操作
- **scikit-image**：高级图像处理算法

**机器学习/深度学习**：
- **TensorFlow/Keras**：深度学习框架
- **PyTorch**：研究和原型开发
- **scikit-learn**：传统机器学习算法

**数据可视化**：
- **Matplotlib**：2D绘图
- **Plotly**：交互式可视化
- **RViz**：ROS的3D可视化工具（支持Python）

**机器人专用库**：
- **ROS 2 Python API**：机器人操作系统
- **PyBullet**：物理仿真
- **MoveIt**：运动规划（支持Python）
- **transforms3d**：3D变换计算

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

### 扩展项目：完整的机器人仿真器

让我们扩展上面的代码，添加传感器模拟、障碍物检测和简单的避障行为。

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle
from matplotlib.animation import FuncAnimation

class Environment:
    """环境类，包含障碍物"""
    
    def __init__(self, width=10, height=10):
        self.width = width
        self.height = height
        self.obstacles = []
    
    def add_obstacle(self, x, y, radius):
        """添加圆形障碍物"""
        self.obstacles.append({'x': x, 'y': y, 'radius': radius})
    
    def is_collision(self, x, y, robot_radius=0.2):
        """检查位置是否与障碍物碰撞"""
        for obs in self.obstacles:
            dist = np.sqrt((x - obs['x'])**2 + (y - obs['y'])**2)
            if dist < (robot_radius + obs['radius']):
                return True
        return False

class LaserScanner:
    """激光扫描仪模拟"""
    
    def __init__(self, max_range=5.0, num_beams=360):
        self.max_range = max_range
        self.num_beams = num_beams
        self.angles = np.linspace(-np.pi, np.pi, num_beams)
    
    def scan(self, robot_x, robot_y, robot_theta, environment):
        """执行激光扫描"""
        ranges = []
        
        for angle in self.angles:
            # 激光束的全局角度
            beam_angle = robot_theta + angle
            
            # 沿激光束搜索障碍物
            min_range = self.max_range
            
            for distance in np.linspace(0, self.max_range, 100):
                # 激光束上的点
                x = robot_x + distance * np.cos(beam_angle)
                y = robot_y + distance * np.sin(beam_angle)
                
                # 检查是否碰到障碍物
                if environment.is_collision(x, y, robot_radius=0.01):
                    min_range = distance
                    break
            
            ranges.append(min_range)
        
        return np.array(ranges)

class AdvancedRobot(DifferentialDriveRobot):
    """带传感器的高级机器人"""
    
    def __init__(self, wheel_base, wheel_radius, environment):
        super().__init__(wheel_base, wheel_radius)
        self.environment = environment
        self.laser = LaserScanner(max_range=3.0, num_beams=360)
        self.radius = 0.2
    
    def get_laser_scan(self):
        """获取激光扫描数据"""
        x, y, theta = self.state
        return self.laser.scan(x, y, theta, self.environment)
    
    def obstacle_avoidance(self):
        """简单的避障行为"""
        ranges = self.get_laser_scan()
        
        # 分析前方、左侧、右侧的障碍物
        front = ranges[len(ranges)//2 - 30:len(ranges)//2 + 30]
        left = ranges[len(ranges)//4:len(ranges)//4 + 60]
        right = ranges[3*len(ranges)//4:3*len(ranges)//4 + 60]
        
        min_front = np.min(front)
        min_left = np.min(left)
        min_right = np.min(right)
        
        # 决策逻辑
        if min_front > 1.0:
            # 前方安全，直行
            return 0.5, 0.0
        elif min_left > min_right:
            # 左侧更开阔，左转
            return 0.2, 0.5
        else:
            # 右侧更开阔，右转
            return 0.2, -0.5
    
    def autonomous_navigation(self, duration, dt=0.1):
        """自主导航"""
        steps = int(duration / dt)
        
        for _ in range(steps):
            # 获取避障指令
            v, omega = self.obstacle_avoidance()
            
            # 执行运动
            v_left, v_right = self.inverse_kinematics(v, omega)
            self.forward_kinematics(v_left, v_right, dt)
            
            # 检查碰撞
            x, y, _ = self.state
            if self.environment.is_collision(x, y, self.radius):
                print("Collision detected!")
                break

# 使用示例
if __name__ == '__main__':
    # 创建环境
    env = Environment(width=10, height=10)
    env.add_obstacle(3, 3, 0.5)
    env.add_obstacle(5, 5, 0.7)
    env.add_obstacle(7, 2, 0.4)
    env.add_obstacle(2, 7, 0.6)
    
    # 创建机器人
    robot = AdvancedRobot(wheel_base=0.3, wheel_radius=0.05, environment=env)
    
    # 自主导航
    print("Starting autonomous navigation...")
    robot.autonomous_navigation(duration=30.0, dt=0.1)
    
    # 可视化
    trajectory = np.array(robot.trajectory)
    
    fig, ax = plt.subplots(figsize=(10, 10))
    
    # 绘制障碍物
    for obs in env.obstacles:
        circle = Circle((obs['x'], obs['y']), obs['radius'], 
                       color='red', alpha=0.5)
        ax.add_patch(circle)
    
    # 绘制轨迹
    ax.plot(trajectory[:, 0], trajectory[:, 1], 'b-', linewidth=2, label='Trajectory')
    ax.plot(trajectory[0, 0], trajectory[0, 1], 'go', markersize=10, label='Start')
    ax.plot(trajectory[-1, 0], trajectory[-1, 1], 'ro', markersize=10, label='End')
    
    ax.set_xlim(0, env.width)
    ax.set_ylim(0, env.height)
    ax.set_xlabel('X (m)')
    ax.set_ylabel('Y (m)')
    ax.set_title('Autonomous Navigation with Obstacle Avoidance')
    ax.legend()
    ax.grid(True)
    ax.set_aspect('equal')
    plt.show()
```

这个扩展版本添加了：
1. **环境类**：管理障碍物和碰撞检测
2. **激光扫描仪**：模拟2D激光雷达
3. **避障行为**：基于传感器数据的简单避障
4. **自主导航**：机器人自主探索环境

### Python与ROS 2集成预览

虽然我们将在后续章节详细学习ROS 2，这里先预览一下Python在ROS 2中的应用。

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan

class SimpleController(Node):
    """简单的ROS 2控制器节点"""
    
    def __init__(self):
        super().__init__('simple_controller')
        
        # 创建发布者（发送速度命令）
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        
        # 创建订阅者（接收激光数据）
        self.scan_sub = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )
        
        # 创建定时器（10Hz控制循环）
        self.timer = self.create_timer(0.1, self.control_loop)
        
        self.obstacle_detected = False
    
    def scan_callback(self, msg):
        """处理激光扫描数据"""
        # 检查前方是否有障碍物
        front_ranges = msg.ranges[len(msg.ranges)//2 - 10:len(msg.ranges)//2 + 10]
        min_distance = min(front_ranges)
        
        self.obstacle_detected = min_distance < 1.0
    
    def control_loop(self):
        """控制循环"""
        cmd = Twist()
        
        if self.obstacle_detected:
            # 有障碍物，停止并旋转
            cmd.linear.x = 0.0
            cmd.angular.z = 0.5
        else:
            # 无障碍物，前进
            cmd.linear.x = 0.5
            cmd.angular.z = 0.0
        
        self.cmd_vel_pub.publish(cmd)

def main():
    rclpy.init()
    controller = SimpleController()
    rclpy.spin(controller)
    controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

这个ROS 2节点展示了：
- 发布速度命令
- 订阅传感器数据
- 定时控制循环
- 简单的避障逻辑

## 推荐资源

### 经典书籍

**《Python编程：从入门到实践》（Python Crash Course）** - Eric Matthes
- 最适合完全初学者的Python书籍
- 分为基础篇和项目篇，循序渐进
- 项目包括游戏、数据可视化和Web应用
- 中文版由袁国忠翻译

**《流畅的Python》（Fluent Python）** - Luciano Ramalho
- 深入理解Python的高级特性
- 适合有一定基础后进阶学习
- 涵盖数据模型、函数、对象、并发等核心主题
- 被誉为"Python进阶必读"

**《Python数据科学手册》（Python Data Science Handbook）** - Jake VanderPlas
- 专注于NumPy、Pandas、Matplotlib、Scikit-Learn
- 适合机器人开发中的数据处理和分析
- 全书代码可在GitHub获取
- 免费在线阅读：https://jakevdp.github.io/PythonDataScienceHandbook/

**《Effective Python》** - Brett Slatkin
- 90个具体建议，提升Python代码质量
- 涵盖最佳实践、常见陷阱和高级技巧
- 适合已经会写Python但想写得更好的开发者
- 第2版更新到Python 3.8+

**《Python Cookbook》** - David Beazley & Brian K. Jones
- 大量实用的Python代码片段和技巧
- 适合作为参考手册查阅
- 涵盖数据结构、函数、类、并发等各个方面

**《Automate the Boring Stuff with Python》** - Al Sweigart
- 学习用Python自动化日常任务
- 包括文件操作、网页抓取、Excel处理等
- 免费在线阅读：https://automatetheboringstuff.com/
- 非常实用，适合提高工作效率

**《Python机器人编程》（Programming Robots with ROS）** - Morgan Quigley等
- ROS创始人之一编写
- 虽然是ROS 1，但概念依然适用
- 深入讲解机器人软件架构

### Python重要人物

**Guido van Rossum**（1956-）
- Python之父，语言的原始设计者和实现者
- 曾在Google（2005-2012）和Dropbox（2013-2019）工作
- 2019年加入微软，继续推动Python发展
- 以"BDFL"（仁慈的终身独裁者）身份领导Python社区直到2018年
- 他的决策风格：倾听社区，但保持语言的一致性和简洁性

**Tim Peters**
- Python核心开发者，"Python之禅"的作者
- 编写了Timsort排序算法（Python和Java的默认排序）
- 对Python的性能优化和算法实现贡献巨大

**Raymond Hettinger**
- Python核心开发者，多个内置数据结构的作者
- 著名的Python演讲者，YouTube上有很多精彩演讲
- 推荐观看他的"Beyond PEP 8"和"Modern Python Dictionaries"

**David Beazley**
- Python专家，《Python Cookbook》作者
- 深入研究Python内部机制
- 他的课程和演讲深受欢迎

**Wes McKinney**
- Pandas库的创造者
- 著有《利用Python进行数据分析》
- 推动Python在数据科学领域的应用

**Travis Oliphant**
- NumPy的主要作者，SciPy的创始人之一
- 创建了Anaconda公司，推广科学Python
- 对Python在科学计算领域的贡献巨大

### Python设计哲学在机器人开发中的应用

**1. 可读性优先**
```python
# Python方式：清晰易读
def calculate_distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

# 而不是晦涩的单字母变量
def d(a,b,c,d):
    return math.sqrt((c-a)**2+(d-b)**2)
```

**2. 明确胜于隐晦**
```python
# 明确指定参数名
robot.move(distance=10, speed=1.5, direction='forward')

# 而不是依赖位置参数
robot.move(10, 1.5, 'forward')
```

**3. 简单胜于复杂**
```python
# Python的列表推导式
squares = [x**2 for x in range(10)]

# 而不是冗长的循环
squares = []
for x in range(10):
    squares.append(x**2)
```

### 在线教程

**Python 官方教程**：https://docs.python.org/3/tutorial/
- 最权威的 Python 教程，由Python核心团队维护
- 涵盖所有基础知识，适合系统学习

**Real Python**：https://realpython.com/
- 高质量的 Python 教程和文章
- 涵盖从基础到高级的各个主题
- 有免费和付费内容

**Python for Everybody**：https://www.py4e.com/
- 密歇根大学Charles Severance教授的免费课程
- 配套书籍、视频和练习
- 非常适合完全初学者

**Corey Schafer的Python教程**：YouTube
- 清晰、系统的Python视频教程
- 涵盖基础、OOP、装饰器、生成器等
- 免费且质量极高

### 中文学习资源

**廖雪峰的Python教程**：https://www.liaoxuefeng.com/wiki/1016959663602400
- 最受欢迎的中文Python教程
- 从零基础到进阶，循序渐进
- 免费在线阅读

**菜鸟教程Python**：https://www.runoob.com/python3/
- 简洁的Python参考手册
- 适合快速查阅语法

**B站推荐视频**：
- **黑马程序员Python教程**：系统全面，适合零基础
- **小甲鱼Python教程**：生动有趣，适合入门
- **莫烦Python**：专注于数据科学和机器学习

### NumPy 资源

**NumPy 官方教程**：https://numpy.org/doc/stable/user/quickstart.html
- 官方快速入门指南

**NumPy for MATLAB users**：https://numpy.org/doc/stable/user/numpy-for-matlab-users.html
- 如果你熟悉 MATLAB，这个对照表很有用
- 帮助快速从MATLAB过渡到NumPy

**From Python to Numpy**：https://www.labri.fr/perso/nrougier/from-python-to-numpy/
- Nicolas Rougier的免费电子书
- 深入讲解NumPy的高效使用

### 视频课程

**YouTube英文频道**：

**Corey Schafer**
- 最受欢迎的Python教程频道之一
- 清晰、系统、深入
- 涵盖Python基础到高级主题

**sentdex**
- 专注于Python在机器学习、数据科学、机器人中的应用
- 有完整的ROS教程系列

**Tech With Tim**
- 适合初学者的Python项目教程
- 涵盖游戏开发、Web开发等

**ArjanCodes**
- 专注于Python代码质量和软件设计
- 讲解设计模式、重构技巧

**中文视频资源**：

**B站：黑马程序员Python**
- 600+集完整教程
- 从基础到项目实战

**B站：小甲鱼零基础入门Python**
- 生动有趣的讲解风格
- 适合完全零基础

**慕课网：Python工程师**
- 系统的职业路径课程
- 包含实战项目

### 交互式学习平台

**Codecademy Python Course**：https://www.codecademy.com/learn/learn-python-3
- 交互式学习，边学边练
- 适合完全初学者

**DataCamp**：https://www.datacamp.com/
- 专注于数据科学的Python课程
- 交互式练习，即时反馈

**LeetCode**：https://leetcode.com/
- 通过算法题练习Python
- 提升编程能力和问题解决能力

**HackerRank**：https://www.hackerrank.com/domains/python
- Python练习题库
- 从基础到高级

### 代码风格和最佳实践

**PEP 8 -- Style Guide for Python Code**：https://pep8.org/
- Python官方代码风格指南
- 所有Python开发者必读

**Google Python Style Guide**：https://google.github.io/styleguide/pyguide.html
- Google的Python代码规范
- 更详细的最佳实践

**工具推荐**：
- **Black**：自动代码格式化工具
- **pylint**：代码质量检查
- **flake8**：代码风格检查
- **mypy**：静态类型检查

### 社区和论坛

**Stack Overflow**：https://stackoverflow.com/questions/tagged/python
- 最大的编程问答社区
- 几乎所有问题都能找到答案

**r/Python**：https://reddit.com/r/learnpython
- Reddit上的Python学习社区
- 新手友好，可以提问

**Python Discord**：https://pythondiscord.com/
- 活跃的Python Discord服务器
- 实时交流和答疑

**Python官方论坛**：https://discuss.python.org/
- Python核心开发者参与的官方论坛

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

**练习 4：机器人路径跟踪**

实现Pure Pursuit算法，让机器人跟踪预定义路径。

提示：
- 定义一条路径（如圆形、8字形）
- 计算机器人到路径的最近点
- 根据前视距离计算目标点
- 计算转向角度

**练习 5：多机器人协调**

模拟多个机器人避免碰撞的场景。

提示：
- 创建多个Robot对象
- 实现简单的碰撞检测
- 使用势场法或速度障碍法避障
- 可视化所有机器人的运动

### Python进阶主题

**装饰器（Decorators）**

装饰器是Python的强大特性，在机器人开发中常用于日志、性能测试、权限检查等。

```python
import time
import functools

def timing_decorator(func):
    """测量函数执行时间的装饰器"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def calculate_trajectory(waypoints):
    """计算轨迹"""
    time.sleep(0.1)  # 模拟计算
    return waypoints

# 使用
trajectory = calculate_trajectory([(0, 0), (1, 1), (2, 0)])
```

**生成器（Generators）**

生成器用于处理大量数据或无限序列，在机器人数据流处理中很有用。

```python
def sensor_data_stream():
    """模拟传感器数据流"""
    import random
    while True:
        # 生成模拟的传感器数据
        distance = random.uniform(0.1, 5.0)
        angle = random.uniform(-180, 180)
        yield {'distance': distance, 'angle': angle}

# 使用生成器
sensor = sensor_data_stream()
for _ in range(5):
    data = next(sensor)
    print(f"Distance: {data['distance']:.2f}m, Angle: {data['angle']:.2f}°")
```

**上下文管理器（Context Managers）**

用于资源管理，确保资源正确释放。

```python
class RobotConnection:
    """机器人连接上下文管理器"""
    
    def __init__(self, robot_ip):
        self.robot_ip = robot_ip
        self.connected = False
    
    def __enter__(self):
        print(f"Connecting to robot at {self.robot_ip}...")
        self.connected = True
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Disconnecting from robot...")
        self.connected = False
        return False
    
    def send_command(self, command):
        if self.connected:
            print(f"Sending command: {command}")

# 使用
with RobotConnection("192.168.1.100") as robot:
    robot.send_command("move_forward")
    robot.send_command("rotate_left")
# 自动断开连接
```

**多线程和异步编程**

机器人系统常需要并发处理多个任务。

```python
import threading
import time

class SensorReader(threading.Thread):
    """传感器读取线程"""
    
    def __init__(self, sensor_name):
        super().__init__()
        self.sensor_name = sensor_name
        self.running = True
        self.data = None
    
    def run(self):
        while self.running:
            # 模拟读取传感器
            self.data = f"{self.sensor_name}: {time.time():.2f}"
            time.sleep(0.1)
    
    def stop(self):
        self.running = False

# 使用多线程
lidar = SensorReader("LIDAR")
camera = SensorReader("Camera")

lidar.start()
camera.start()

time.sleep(1)

print(lidar.data)
print(camera.data)

lidar.stop()
camera.stop()
lidar.join()
camera.join()
```

**类型提示（Type Hints）**

Python 3.5+支持类型提示，提高代码可读性和可维护性。

```python
from typing import List, Tuple, Optional
import numpy as np

def calculate_path(
    start: Tuple[float, float],
    goal: Tuple[float, float],
    obstacles: List[Tuple[float, float]]
) -> Optional[List[Tuple[float, float]]]:
    """
    计算从起点到终点的路径
    
    Args:
        start: 起点坐标 (x, y)
        goal: 终点坐标 (x, y)
        obstacles: 障碍物列表
    
    Returns:
        路径点列表，如果无法找到路径则返回None
    """
    # 路径规划算法
    if start == goal:
        return [start]
    return [start, goal]

# 使用类型提示
path = calculate_path((0.0, 0.0), (10.0, 10.0), [(5.0, 5.0)])
```

**数据类（Dataclasses）**

Python 3.7+引入的dataclass简化了数据容器的定义。

```python
from dataclasses import dataclass
from typing import List

@dataclass
class RobotState:
    """机器人状态"""
    x: float
    y: float
    theta: float
    velocity: float
    timestamp: float

@dataclass
class SensorReading:
    """传感器读数"""
    sensor_type: str
    value: float
    unit: str
    timestamp: float

# 使用
state = RobotState(x=1.5, y=2.3, theta=0.785, velocity=1.0, timestamp=123.45)
print(state)
# 输出: RobotState(x=1.5, y=2.3, theta=0.785, velocity=1.0, timestamp=123.45)
```

### Python性能优化技巧

**1. 使用NumPy向量化操作**

```python
import numpy as np
import time

# 慢速：Python循环
def slow_distance_calculation(points):
    distances = []
    for point in points:
        dist = (point[0]**2 + point[1]**2)**0.5
        distances.append(dist)
    return distances

# 快速：NumPy向量化
def fast_distance_calculation(points):
    return np.sqrt(np.sum(points**2, axis=1))

# 测试
points = np.random.rand(100000, 2)

start = time.time()
slow_result = slow_distance_calculation(points)
print(f"Slow: {time.time() - start:.4f}s")

start = time.time()
fast_result = fast_distance_calculation(points)
print(f"Fast: {time.time() - start:.4f}s")
```

**2. 使用列表推导式代替循环**

```python
# 慢
squares = []
for x in range(1000):
    squares.append(x**2)

# 快
squares = [x**2 for x in range(1000)]

# 更快（生成器，节省内存）
squares = (x**2 for x in range(1000))
```

**3. 使用内置函数**

```python
# 慢
def find_max(numbers):
    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val

# 快
max_val = max(numbers)
```

**4. 避免全局变量查找**

```python
import math

# 慢
def calculate_distances(points):
    return [math.sqrt(x**2 + y**2) for x, y in points]

# 快（局部变量查找更快）
def calculate_distances_fast(points):
    sqrt = math.sqrt  # 局部引用
    return [sqrt(x**2 + y**2) for x, y in points]
```

### Python调试技巧

**使用pdb调试器**

```python
import pdb

def buggy_function(x, y):
    result = x + y
    pdb.set_trace()  # 设置断点
    result = result * 2
    return result

# 运行时会进入交互式调试
```

**使用logging模块**

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def move_robot(distance):
    logger.debug(f"Starting to move {distance}m")
    # 移动逻辑
    logger.info(f"Moved {distance}m successfully")
    
# 使用
move_robot(10.0)
```

**使用assert进行断言**

```python
def set_speed(speed):
    assert 0 <= speed <= 10, f"Speed {speed} out of range [0, 10]"
    # 设置速度
    
# 使用
set_speed(5)   # OK
set_speed(15)  # 抛出AssertionError
```

---

## 📚 拓展资源

想要深入学习Python编程和机器人应用？查看我们精心整理的[第8章拓展资源](../resources/chapter_08_resources.md)，包括：

- 📖 **推荐教材**：《Python编程：从入门到实践》、《流畅的Python》、《Python数据科学手册》
- 📄 **技术文档**：Python官方文档、NumPy用户指南、SciPy参考手册
- 🌐 **优质博客**：Real Python、Python Weekly、PyImageSearch
- 🎥 **视频教程**：Python基础、NumPy科学计算、机器人算法实现
- 💻 **开源项目**：scikit-learn、OpenCV-Python、PyRobot
- 🎓 **在线课程**：MIT Python课程、Coursera Python专项课程
- 🛠️ **实用工具**：Jupyter Notebook、IPython、pytest测试框架
- 💬 **活跃社区**：r/Python、Python Discord、Stack Overflow

[→ 查看完整资源列表](../resources/chapter_08_resources.md)
