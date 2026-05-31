# 第10章：传感器集成与数据处理

## 学习目标

- 掌握常用传感器的接口和通信协议
- 学会在 ROS 2 中集成传感器
- 理解传感器数据的处理和滤波
- 掌握传感器标定方法
- 能够实现多传感器融合
- 学会使用 ROS 2 的 tf2 坐标变换

## 10.1 传感器通信协议

### I2C（Inter-Integrated Circuit）

I2C 是常用的传感器通信协议，使用两根线：SDA（数据）和 SCL（时钟）。

**特点**：
- 多主多从
- 地址寻址（7位或10位）
- 速度：标准模式 100kHz，快速模式 400kHz
- 距离：短（<1m）

**常用传感器**：MPU6050、BNO055、VL53L0X

**Python 示例（使用 smbus2）**：

```python
from smbus2 import SMBus

# MPU6050 地址
MPU6050_ADDR = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

# 初始化
bus = SMBus(1)  # I2C 总线 1
bus.write_byte_data(MPU6050_ADDR, PWR_MGMT_1, 0)  # 唤醒

# 读取加速度
def read_accel():
    data = bus.read_i2c_block_data(MPU6050_ADDR, ACCEL_XOUT_H, 6)
    ax = (data[0] << 8) | data[1]
    ay = (data[2] << 8) | data[3]
    az = (data[4] << 8) | data[5]
    
    # 转换为有符号数
    if ax > 32767:
        ax -= 65536
    if ay > 32767:
        ay -= 65536
    if az > 32767:
        az -= 65536
    
    # 转换为 g（重力加速度）
    ax = ax / 16384.0
    ay = ay / 16384.0
    az = az / 16384.0
    
    return ax, ay, az
```

### UART（串口）

串口是最简单的通信方式，使用 TX（发送）和 RX（接收）两根线。

**特点**：
- 点对点
- 异步通信
- 速度：9600 - 921600 bps（常用 115200）
- 距离：中（<15m）

**常用传感器**：GPS、激光雷达、超声波

**Python 示例（使用 pyserial）**：

```python
import serial

# 打开串口
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

# 发送数据
ser.write(b'Hello\n')

# 接收数据
line = ser.readline().decode('utf-8').strip()
print(line)

ser.close()
```

### SPI（Serial Peripheral Interface）

SPI 是高速通信协议，使用四根线：MOSI、MISO、SCK、CS。

**特点**：
- 主从模式
- 全双工
- 速度：高（MHz 级）
- 距离：短（<1m）

**常用传感器**：高速 ADC、SD 卡、显示屏

### USB

USB 是最常用的接口，即插即用。

**常用传感器**：摄像头、激光雷达、深度相机

**Python 示例（使用 pyusb）**：

```python
import usb.core

# 查找设备
dev = usb.core.find(idVendor=0x1234, idProduct=0x5678)

if dev is None:
    raise ValueError('Device not found')

# 读取数据
data = dev.read(0x81, 64)
```

## 10.2 IMU 集成

IMU（惯性测量单元）是机器人的核心传感器，提供姿态和加速度信息。

### MPU6050 ROS 2 节点

创建 `imu_node.py`：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
from smbus2 import SMBus
import numpy as np

class IMUNode(Node):
    def __init__(self):
        super().__init__('imu_node')
        
        # 参数
        self.declare_parameter('i2c_bus', 1)
        self.declare_parameter('address', 0x68)
        self.declare_parameter('publish_rate', 50.0)
        
        bus_num = self.get_parameter('i2c_bus').value
        self.address = self.get_parameter('address').value
        rate = self.get_parameter('publish_rate').value
        
        # I2C 初始化
        self.bus = SMBus(bus_num)
        self.init_mpu6050()
        
        # 发布者
        self.publisher = self.create_publisher(Imu, 'imu/data_raw', 10)
        
        # 定时器
        self.timer = self.create_timer(1.0 / rate, self.publish_imu)
        
        self.get_logger().info('IMU node started')
    
    def init_mpu6050(self):
        # 唤醒 MPU6050
        self.bus.write_byte_data(self.address, 0x6B, 0)
        
        # 配置加速度计（±2g）
        self.bus.write_byte_data(self.address, 0x1C, 0x00)
        
        # 配置陀螺仪（±250°/s）
        self.bus.write_byte_data(self.address, 0x1B, 0x00)
    
    def read_raw_data(self, addr):
        high = self.bus.read_byte_data(self.address, addr)
        low = self.bus.read_byte_data(self.address, addr + 1)
        value = (high << 8) | low
        
        if value > 32767:
            value -= 65536
        
        return value
    
    def publish_imu(self):
        # 读取加速度（单位：g）
        ax = self.read_raw_data(0x3B) / 16384.0
        ay = self.read_raw_data(0x3D) / 16384.0
        az = self.read_raw_data(0x3F) / 16384.0
        
        # 读取陀螺仪（单位：°/s）
        gx = self.read_raw_data(0x43) / 131.0
        gy = self.read_raw_data(0x45) / 131.0
        gz = self.read_raw_data(0x47) / 131.0
        
        # 转换为 rad/s
        gx = np.radians(gx)
        gy = np.radians(gy)
        gz = np.radians(gz)
        
        # 转换为 m/s²
        ax = ax * 9.81
        ay = ay * 9.81
        az = az * 9.81
        
        # 创建消息
        msg = Imu()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'imu_link'
        
        msg.linear_acceleration.x = ax
        msg.linear_acceleration.y = ay
        msg.linear_acceleration.z = az
        
        msg.angular_velocity.x = gx
        msg.angular_velocity.y = gy
        msg.angular_velocity.z = gz
        
        # 协方差（未知）
        msg.orientation_covariance[0] = -1
        
        self.publisher.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = IMUNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### IMU 标定

IMU 需要标定以消除偏差和噪声。

**加速度计标定**：

```python
# 六面法标定
# 将 IMU 分别放在六个面上，记录读数

import numpy as np

# 记录数据（每个面 100 个样本）
data_x_up = []    # X 轴向上
data_x_down = []  # X 轴向下
data_y_up = []    # Y 轴向上
data_y_down = []  # Y 轴向下
data_z_up = []    # Z 轴向上
data_z_down = []  # Z 轴向下

# 计算偏差
bias_x = (np.mean(data_x_up) + np.mean(data_x_down)) / 2
bias_y = (np.mean(data_y_up) + np.mean(data_y_down)) / 2
bias_z = (np.mean(data_z_up) + np.mean(data_z_down)) / 2

# 计算缩放因子
scale_x = 2.0 / (np.mean(data_x_up) - np.mean(data_x_down))
scale_y = 2.0 / (np.mean(data_y_up) - np.mean(data_y_down))
scale_z = 2.0 / (np.mean(data_z_up) - np.mean(data_z_down))

# 应用标定
ax_calibrated = (ax - bias_x) * scale_x
ay_calibrated = (ay - bias_y) * scale_y
az_calibrated = (az - bias_z) * scale_z
```

**陀螺仪标定**：

```python
# 静止标定
# 将 IMU 静止放置，记录 1000 个样本

gyro_samples = []
for i in range(1000):
    gx, gy, gz = read_gyro()
    gyro_samples.append([gx, gy, gz])

# 计算偏差
gyro_bias = np.mean(gyro_samples, axis=0)

# 应用标定
gx_calibrated = gx - gyro_bias[0]
gy_calibrated = gy - gyro_bias[1]
gz_calibrated = gz - gyro_bias[2]
```

## 10.3 激光雷达集成

激光雷达是移动机器人的核心传感器。

### RPLIDAR ROS 2 驱动

RPLIDAR 有官方 ROS 2 驱动包。

**安装**：

```bash
cd ~/robot_ws/src
git clone https://github.com/Slamtec/rplidar_ros.git -b ros2
cd ~/robot_ws
colcon build --packages-select rplidar_ros
source install/setup.bash
```

**运行**：

```bash
ros2 run rplidar_ros rplidar_node --ros-args -p serial_port:=/dev/ttyUSB0
```

**查看数据**：

```bash
ros2 topic echo /scan
```

### 自定义激光雷达节点

如果需要自定义处理，可以订阅 `/scan` 话题：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
import numpy as np

class LidarProcessor(Node):
    def __init__(self):
        super().__init__('lidar_processor')
        
        self.subscription = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )
        
        self.get_logger().info('Lidar processor started')
    
    def scan_callback(self, msg):
        # 提取距离数据
        ranges = np.array(msg.ranges)
        
        # 过滤无效数据
        valid_ranges = ranges[(ranges > msg.range_min) & (ranges < msg.range_max)]
        
        if len(valid_ranges) == 0:
            return
        
        # 计算最近障碍物
        min_distance = np.min(valid_ranges)
        min_index = np.argmin(ranges)
        min_angle = msg.angle_min + min_index * msg.angle_increment
        
        self.get_logger().info(
            f'Closest obstacle: {min_distance:.2f}m at {np.degrees(min_angle):.1f}°'
        )
        
        # 检测前方障碍物（±30°）
        angle_range = 30  # 度
        angle_range_rad = np.radians(angle_range)
        
        front_indices = []
        for i, angle in enumerate(np.arange(msg.angle_min, msg.angle_max, msg.angle_increment)):
            if abs(angle) < angle_range_rad:
                front_indices.append(i)
        
        front_ranges = ranges[front_indices]
        front_valid = front_ranges[(front_ranges > msg.range_min) & (front_ranges < msg.range_max)]
        
        if len(front_valid) > 0:
            front_min = np.min(front_valid)
            if front_min < 0.5:  # 50cm
                self.get_logger().warn(f'Obstacle ahead: {front_min:.2f}m')

def main(args=None):
    rclpy.init(args=args)
    node = LidarProcessor()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 10.4 摄像头集成

### USB 摄像头

使用 `usb_cam` 包：

```bash
sudo apt install ros-humble-usb-cam

ros2 run usb_cam usb_cam_node_exe --ros-args -p video_device:=/dev/video0
```

### Raspberry Pi Camera

使用 `v4l2_camera` 包：

```bash
sudo apt install ros-humble-v4l2-camera

ros2 run v4l2_camera v4l2_camera_node --ros-args -p video_device:=/dev/video0
```

### 图像处理节点

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import numpy as np

class ImageProcessor(Node):
    def __init__(self):
        super().__init__('image_processor')
        
        self.bridge = CvBridge()
        
        # 订阅原始图像
        self.subscription = self.create_subscription(
            Image,
            'image_raw',
            self.image_callback,
            10
        )
        
        # 发布处理后的图像
        self.publisher = self.create_publisher(Image, 'image_processed', 10)
        
        self.get_logger().info('Image processor started')
    
    def image_callback(self, msg):
        # ROS Image -> OpenCV
        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
        
        # 图像处理
        processed = self.process_image(cv_image)
        
        # OpenCV -> ROS Image
        processed_msg = self.bridge.cv2_to_imgmsg(processed, encoding='bgr8')
        processed_msg.header = msg.header
        
        self.publisher.publish(processed_msg)
    
    def process_image(self, image):
        # 转换为灰度
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # 边缘检测
        edges = cv2.Canny(gray, 50, 150)
        
        # 转回 BGR
        edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        
        return edges_bgr

def main(args=None):
    rclpy.init(args=args)
    node = ImageProcessor()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 10.5 传感器数据滤波

传感器数据通常包含噪声，需要滤波。

### 低通滤波器

```python
class LowPassFilter:
    def __init__(self, alpha=0.1):
        self.alpha = alpha
        self.value = None
    
    def update(self, measurement):
        if self.value is None:
            self.value = measurement
        else:
            self.value = self.alpha * measurement + (1 - self.alpha) * self.value
        return self.value
```

### 卡尔曼滤波器

```python
import numpy as np

class KalmanFilter:
    def __init__(self, process_variance, measurement_variance, initial_value=0):
        self.process_variance = process_variance
        self.measurement_variance = measurement_variance
        self.estimate = initial_value
        self.estimate_error = 1.0
    
    def update(self, measurement):
        # 预测
        prediction = self.estimate
        prediction_error = self.estimate_error + self.process_variance
        
        # 更新
        kalman_gain = prediction_error / (prediction_error + self.measurement_variance)
        self.estimate = prediction + kalman_gain * (measurement - prediction)
        self.estimate_error = (1 - kalman_gain) * prediction_error
        
        return self.estimate
```

### 中值滤波器

```python
from collections import deque

class MedianFilter:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.buffer = deque(maxlen=window_size)
    
    def update(self, measurement):
        self.buffer.append(measurement)
        return np.median(list(self.buffer))
```

### 应用示例

```python
class FilteredIMUNode(Node):
    def __init__(self):
        super().__init__('filtered_imu_node')
        
        # 创建滤波器
        self.accel_x_filter = KalmanFilter(0.01, 0.1)
        self.accel_y_filter = KalmanFilter(0.01, 0.1)
        self.accel_z_filter = KalmanFilter(0.01, 0.1)
        
        self.gyro_x_filter = LowPassFilter(0.2)
        self.gyro_y_filter = LowPassFilter(0.2)
        self.gyro_z_filter = LowPassFilter(0.2)
        
        # 订阅原始 IMU 数据
        self.subscription = self.create_subscription(
            Imu,
            'imu/data_raw',
            self.imu_callback,
            10
        )
        
        # 发布滤波后的数据
        self.publisher = self.create_publisher(Imu, 'imu/data_filtered', 10)
    
    def imu_callback(self, msg):
        # 滤波
        ax = self.accel_x_filter.update(msg.linear_acceleration.x)
        ay = self.accel_y_filter.update(msg.linear_acceleration.y)
        az = self.accel_z_filter.update(msg.linear_acceleration.z)
        
        gx = self.gyro_x_filter.update(msg.angular_velocity.x)
        gy = self.gyro_y_filter.update(msg.angular_velocity.y)
        gz = self.gyro_z_filter.update(msg.angular_velocity.z)
        
        # 创建新消息
        filtered_msg = Imu()
        filtered_msg.header = msg.header
        filtered_msg.linear_acceleration.x = ax
        filtered_msg.linear_acceleration.y = ay
        filtered_msg.linear_acceleration.z = az
        filtered_msg.angular_velocity.x = gx
        filtered_msg.angular_velocity.y = gy
        filtered_msg.angular_velocity.z = gz
        
        self.publisher.publish(filtered_msg)
```

## 10.6 坐标变换（tf2）

机器人有多个坐标系（base_link、imu_link、laser_link 等），需要进行坐标变换。

### tf2 基础

**坐标系树**：

```
map
 └─ odom
     └─ base_link
         ├─ imu_link
         ├─ laser_link
         └─ camera_link
```

### 发布静态变换

```python
from geometry_msgs.msg import TransformStamped
from tf2_ros import StaticTransformBroadcaster

class TFPublisher(Node):
    def __init__(self):
        super().__init__('tf_publisher')
        
        self.tf_broadcaster = StaticTransformBroadcaster(self)
        
        # 发布 base_link -> laser_link 变换
        self.publish_laser_tf()
        
        # 发布 base_link -> imu_link 变换
        self.publish_imu_tf()
    
    def publish_laser_tf(self):
        t = TransformStamped()
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'base_link'
        t.child_frame_id = 'laser_link'
        
        # 激光雷达位置（相对于 base_link）
        t.transform.translation.x = 0.1  # 前方 10cm
        t.transform.translation.y = 0.0
        t.transform.translation.z = 0.2  # 上方 20cm
        
        # 无旋转
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = 0.0
        t.transform.rotation.w = 1.0
        
        self.tf_broadcaster.sendTransform(t)
    
    def publish_imu_tf(self):
        t = TransformStamped()
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'base_link'
        t.child_frame_id = 'imu_link'
        
        # IMU 位置
        t.transform.translation.x = 0.0
        t.transform.translation.y = 0.0
        t.transform.translation.z = 0.05  # 上方 5cm
        
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = 0.0
        t.transform.rotation.w = 1.0
        
        self.tf_broadcaster.sendTransform(t)
```

### 查询变换

```python
from tf2_ros import Buffer, TransformListener

class TFListener(Node):
    def __init__(self):
        super().__init__('tf_listener')
        
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)
        
        self.timer = self.create_timer(1.0, self.query_transform)
    
    def query_transform(self):
        try:
            # 查询 base_link 到 laser_link 的变换
            transform = self.tf_buffer.lookup_transform(
                'base_link',
                'laser_link',
                rclpy.time.Time()
            )
            
            self.get_logger().info(
                f'Transform: x={transform.transform.translation.x:.2f}, '
                f'y={transform.transform.translation.y:.2f}, '
                f'z={transform.transform.translation.z:.2f}'
            )
        except Exception as e:
            self.get_logger().warn(f'Transform lookup failed: {e}')
```

## 10.7 多传感器融合

### 互补滤波（姿态估计）

```python
class ComplementaryFilter:
    def __init__(self, alpha=0.98):
        self.alpha = alpha
        self.roll = 0.0
        self.pitch = 0.0
        self.yaw = 0.0
    
    def update(self, accel, gyro, dt):
        # 从加速度计计算倾角
        accel_roll = np.arctan2(accel[1], accel[2])
        accel_pitch = np.arctan2(-accel[0], np.sqrt(accel[1]**2 + accel[2]**2))
        
        # 从陀螺仪积分
        self.roll += gyro[0] * dt
        self.pitch += gyro[1] * dt
        self.yaw += gyro[2] * dt
        
        # 互补滤波
        self.roll = self.alpha * self.roll + (1 - self.alpha) * accel_roll
        self.pitch = self.alpha * self.pitch + (1 - self.alpha) * accel_pitch
        
        return self.roll, self.pitch, self.yaw
```

### robot_localization 包

`robot_localization` 是 ROS 2 的传感器融合包，使用扩展卡尔曼滤波（EKF）。

**安装**：

```bash
sudo apt install ros-humble-robot-localization
```

**配置文件（ekf.yaml）**：

```yaml
ekf_filter_node:
  ros__parameters:
    frequency: 30.0
    sensor_timeout: 0.1
    two_d_mode: true
    
    odom0: /odom
    odom0_config: [false, false, false,
                   false, false, false,
                   true,  true,  false,
                   false, false, true,
                   false, false, false]
    
    imu0: /imu/data
    imu0_config: [false, false, false,
                  true,  true,  true,
                  false, false, false,
                  true,  true,  true,
                  true,  true,  true]
```

**运行**：

```bash
ros2 run robot_localization ekf_node --ros-args --params-file ekf.yaml
```

## 本章小结

在本章中，我们学习了：

- 传感器通信协议（I2C、UART、SPI、USB）
- IMU 集成和标定
- 激光雷达集成
- 摄像头集成和图像处理
- 传感器数据滤波
- tf2 坐标变换
- 多传感器融合

传感器是机器人感知世界的窗口，正确集成和处理传感器数据是机器人开发的关键。

## 推荐资源

- **robot_localization 文档**：http://docs.ros.org/en/humble/p/robot_localization/
- **tf2 教程**：https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Tf2-Main.html
- **OpenCV 教程**：https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html

## 动手练习

**练习 1：IMU 姿态估计**

实现互补滤波，融合加速度计和陀螺仪数据，估计机器人的姿态（roll、pitch、yaw）。

**练习 2：激光雷达避障**

订阅激光雷达数据，检测前方障碍物，当距离小于阈值时发布停止命令。

**练习 3：视觉跟踪**

使用摄像头检测特定颜色的物体，计算其位置，发布到话题。

## 学习目标复查

完成本章学习后，请通过以下问题检查自己的掌握程度：

- [ ] 你能否解释 I2C、SPI、UART 和 CAN 总线的主要区别，并说明在什么场景下选择哪种通信协议？

- [ ] 你能否编写一个 ROS 2 节点来读取 IMU 数据（加速度、角速度、方向），并将其发布为 `sensor_msgs/msg/Imu` 消息？

- [ ] 你能否使用卡尔曼滤波或互补滤波器对传感器数据进行滤波处理，并解释为什么需要对原始传感器数据进行滤波？

- [ ] 你能否使用 `tf2` 库在代码中查询两个坐标系之间的变换关系，并将一个点从传感器坐标系转换到机器人基座坐标系？

- [ ] 你能否配置并广播一个静态坐标变换（例如激光雷达相对于机器人基座的位置），并使用 `ros2 run tf2_tools view_frames` 验证坐标树的正确性？

- [ ] 你能否解释传感器标定的目的，并完成至少一种传感器（如摄像头或 IMU）的标定过程？

- [ ] 你能否设计一个多传感器融合方案，例如融合 IMU 和轮式里程计数据来提高位姿估计的准确性，并说明融合的基本原理？

## 问答环节

### Q1: 在 ROS 2 中集成 IMU 传感器时，如何选择合适的通信协议？串口、I2C 和 SPI 各有什么优缺点？

**答**：选择 IMU 通信协议需要综合考虑数据速率、距离、实时性和系统复杂度。串口（UART）是最常用的选择，因为它实现简单、调试方便，支持较长距离传输（可达数米），且大多数 IMU 都提供串口接口。对于 100Hz 采样率的 IMU，9600 或 115200 波特率通常足够。串口的缺点是占用两个 GPIO 引脚，且在高速传输时可能出现数据丢失。

I2C 协议适合短距离、多设备场景，只需两根线（SDA 和 SCL）就能连接多个传感器，非常适合空间受限的机器人。但 I2C 的标准速率（100kHz）和快速模式（400kHz）可能限制高频采样，且总线长度不宜超过 1 米。如果你的机器人需要集成多个传感器（IMU、磁力计、气压计等），I2C 是理想选择。

SPI 提供最高的数据传输速率（可达数 MHz），适合高频采样（如 1kHz 以上）的应用场景，如无人机姿态控制。但 SPI 需要至少 4 根线（MISO、MOSI、SCK、CS），每个设备需要独立的片选信号，布线复杂。在 ROS 2 中，建议优先使用串口进行原型开发，确认性能瓶颈后再考虑切换到 SPI。同时要注意，选择通信协议后，需要在驱动节点中正确配置超时、错误处理和数据校验机制。

### Q2: 使用卡尔曼滤波处理 IMU 数据时，如何调整过程噪声协方差（Q）和测量噪声协方差（R）矩阵？调整不当会导致什么问题？

**答**：Q 和 R 矩阵的调整是卡尔曼滤波器性能的关键，它们反映了对系统模型和传感器测量的信任程度。过程噪声协方差 Q 描述系统模型的不确定性，如果 Q 设置过大，滤波器会认为模型不可靠，更依赖测量值，导致输出跟随测量值快速变化，滤波效果减弱；如果 Q 过小，滤波器过度信任模型，对测量值反应迟钝，可能无法跟踪真实状态变化。测量噪声协方差 R 描述传感器的噪声水平，R 过大会使滤波器不信任测量，输出过于平滑但响应慢；R 过小则会让噪声通过滤波器，失去平滑效果。

实践中，可以通过以下步骤调整：首先，从传感器数据手册获取噪声参数作为 R 的初始值（如 IMU 的角速度噪声密度）；然后，将 Q 初始化为较小值，逐步增大直到滤波器能够跟踪快速变化；最后，通过实际测试数据进行微调。一个有效的方法是记录静止状态下的传感器数据，计算方差作为 R 的参考值，然后在已知运动轨迹上测试滤波器性能。

在 ROS 2 中实现时，建议将 Q 和 R 作为参数暴露出来，使用 `ros2 param` 命令动态调整，避免每次修改都重新编译。对于 IMU 融合，通常 Q 的对角线元素在 0.001 到 0.1 之间，R 根据传感器精度在 0.01 到 1 之间。调整不当的典型症状包括：输出震荡（R 过小）、响应迟缓（Q 过小）、无法收敛（Q 和 R 比例失调）。可以通过绘制估计误差协方差的迹（trace）来监控滤波器健康状态，如果协方差持续增长，说明参数设置有问题。

### Q3: 在多传感器融合系统中，如何使用 tf2 管理不同传感器的坐标系？如果激光雷达和摄像头的时间戳不同步，会导致什么问题？如何解决？

**答**：tf2 是 ROS 2 中管理坐标变换的核心工具，在多传感器系统中扮演关键角色。正确的做法是为每个传感器定义独立的坐标系（frame），并通过 `static_transform_publisher` 或 URDF 发布它们与机器人基座坐标系（base_link）的固定变换关系。例如，激光雷达坐标系命名为 `laser_frame`，摄像头为 `camera_frame`，IMU 为 `imu_frame`。这些传感器坐标系的原点通常位于传感器的物理中心，方向遵循 ROS 约定（X 前、Y 左、Z 上）。通过 tf2，你可以轻松将激光雷达扫描点从 `laser_frame` 转换到 `base_link`，或将摄像头检测到的物体位置转换到地图坐标系。

时间戳不同步是多传感器融合的常见问题，会导致严重的数据关联错误。假设机器人以 1m/s 速度移动，如果激光雷达和摄像头的时间戳相差 100ms，对应的空间位置误差就达到 10cm，这在障碍物检测和定位中是不可接受的。时间戳不同步的原因包括：传感器驱动未正确设置时间戳、使用了不同的时钟源（系统时间 vs 硬件时间）、网络延迟、或传感器本身的采样时间不一致。

解决方案有多个层次：首先，确保所有传感器驱动使用统一的时钟源，ROS 2 推荐使用 `this->now()` 获取当前时间，而不是传感器自带的时间戳；其次，使用 `message_filters` 包中的 `ApproximateTimeSynchronizer` 或 `TimeSynchronizer` 来同步不同话题的消息，前者允许一定的时间容差（如 100ms），后者要求精确匹配；第三，对于硬件时间戳，可以使用 PTP（精确时间协议）或 NTP 同步多个设备的时钟；最后，在融合算法中使用 tf2 的 `lookupTransform` 时，指定目标时间戳，让 tf2 自动插值计算该时刻的坐标变换。在实现中，务必检查 `lookupTransform` 的返回值，处理 `ExtrapolationException`（时间戳超出 tf 缓存范围）和 `ConnectivityException`（坐标系未连接）等异常。

### Q4: 激光雷达数据中经常出现噪点和异常值，如何设计一个鲁棒的滤波流程？除了简单的距离阈值，还有哪些有效方法？

**答**：激光雷达噪点来源多样：镜面反射、透明物体、灰尘、阳光干扰、多径效应等，单一的距离阈值滤波往往不够。一个鲁棒的滤波流程应该是多层次的。第一层是基础的范围滤波，剔除超出传感器有效量程的点（如 0.1m 以下和 30m 以上），以及强度值异常的点（如果激光雷达提供强度信息）。这一步可以快速去除明显的错误数据。

第二层是统计滤波，利用点云的空间分布特性。PCL（点云库）提供的 `StatisticalOutlierRemoval` 滤波器是经典方法：对每个点，计算其 k 近邻的平均距离，如果该距离超过全局平均值加若干倍标准差，则判定为离群点。这种方法对孤立噪点非常有效。参数 k 通常设为 10-50，标准差倍数设为 1.0-2.0，需要根据实际数据调整。另一个有效方法是 `RadiusOutlierRemoval`，剔除在指定半径内邻居数量少于阈值的点，适合处理稀疏噪点。

第三层是时序滤波，利用连续帧之间的相关性。可以维护一个占据栅格地图，只有在多帧中反复出现的点才被认为是真实障碍物。或者使用卡尔曼滤波跟踪每个扫描点的位置，预测下一帧的位置，如果实际测量与预测偏差过大，则判定为噪点。这种方法对动态环境特别有效，但计算开销较大。

在 ROS 2 中实现时，建议使用 `pcl_ros` 包提供的滤波器节点，或自己编写滤波节点订阅 `sensor_msgs/msg/LaserScan` 或 `sensor_msgs/msg/PointCloud2`。要注意滤波的实时性，过于复杂的算法可能导致延迟。一个实用的技巧是先用快速的范围滤波处理全部数据，再对感兴趣区域（如机器人前方 5 米）应用更精细的统计滤波。同时，保留原始数据话题用于调试，发布滤波后的数据到新话题，方便对比效果。最后，不同环境需要不同的滤波参数，建议将参数暴露为 ROS 参数，支持动态调整。

### Q5: 传感器标定是确保数据准确性的关键步骤。对于摄像头-激光雷达外参标定，如果标定结果不准确，会在实际应用中表现出什么症状？如何验证标定质量？

**答**：摄像头-激光雷达外参标定的目标是确定两个传感器坐标系之间的旋转和平移关系，标定不准确会导致数据融合时的空间对齐错误。典型症状包括：将激光雷达点云投影到图像上时，点云与对应的视觉特征错位（如点云明明扫描到了车辆，但投影位置却在车辆旁边的地面上）；基于视觉检测的 3D 定位不准确（如 YOLO 检测到行人，但根据激光雷达计算的距离明显偏差）；SLAM 建图时出现重影或地图不一致（视觉特征点和激光雷达扫描点对应的 3D 位置不匹配）。这些问题在近距离时可能不明显，但随着距离增加会迅速放大，例如 1 度的旋转误差在 10 米距离上会产生约 17cm 的位置偏差。

验证标定质量有多种方法。最直观的是重投影误差检查：将激光雷达点云投影到图像上，检查点云是否准确落在对应的物体边缘上。可以使用棋盘格或 ArUco 标记板作为标定目标，在标定完成后，将激光雷达扫描到的标定板角点投影到图像，计算与视觉检测到的角点的像素距离，误差应小于 5 像素。另一个方法是一致性检查：在不同距离和角度放置标定板，重复测量，计算标定参数的标准差，标准差越小说明标定越稳定。

定量验证可以使用 3D-2D 对应点的重投影误差（reprojection error）。选择场景中的明显特征点（如建筑物角点、路标等），手动标注其在图像中的位置，然后根据激光雷达数据和标定参数计算该点的投影位置，比较两者差异。优秀的标定结果重投影误差应小于 3 像素。还可以使用互信息（mutual information）评估：将激光雷达深度图和摄像头图像对齐后，计算两者的互信息，互信息越高说明对齐越好。

在 ROS 2 中，可以使用 `image_geometry` 和 `tf2_geometry_msgs` 包实现投影验证。编写一个验证节点，订阅点云和图像，使用 `cv::projectPoints` 或 `PinholeCameraModel::project3dToPixel` 将点云投影到图像，用不同颜色标记投影点，发布可视化图像。如果发现标定不准确，检查以下常见问题：标定板是否平整、标定时传感器和标定板的相对位置是否覆盖了工作空间、时间戳是否同步、相机内参是否准确。重新标定时，建议采集至少 20 组不同姿态的数据，确保标定板在视野中占据足够大的区域（至少 1/4 画面），并且包含不同的深度和角度。

## 动手练习

**练习 1：IMU 数据可视化**

编写一个 ROS 2 节点，订阅 IMU 数据并实时绘制加速度和角速度曲线。

**练习 2：激光雷达滤波**

实现一个激光雷达数据滤波节点，去除距离过近（< 0.1m）和过远（> 10m）的点。

**练习 3：多传感器时间同步**

使用 `message_filters` 同步摄像头和激光雷达数据，确保融合时使用相同时刻的数据。

---

## 📚 拓展资源

想要深入学习传感器集成与数据处理？查看我们精心整理的[第10章拓展资源](../resources/chapter_10_resources.md)，包括：

- 📖 **推荐教材**：《概率机器人学》、《多传感器数据融合》、《计算机视觉：算法与应用》
- 📄 **技术文档**：sensor_msgs接口、tf2库文档、PCL点云库、OpenCV文档
- 🌐 **优质博客**：点云处理教程、卡尔曼滤波详解、传感器标定指南
- 🎥 **视频教程**：ROS传感器集成、多传感器融合、SLAM传感器配置
- 💻 **开源项目**：robot_localization、imu_tools、laser_filters
- 🎓 **在线课程**：传感器融合专项课程、SLAM算法课程
- 🛠️ **实用工具**：RViz2传感器可视化、rqt_plot数据绘图、Kalibr标定工具
- 💬 **活跃社区**：ROS Answers、点云处理论坛、传感器技术交流群

[→ 查看完整资源列表](../resources/chapter_10_resources.md)
