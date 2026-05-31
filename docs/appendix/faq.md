# 常见问题解答（FAQ）

本FAQ整理了机器人开发过程中最常遇到的问题和解决方案。

---

## 📋 目录

- [硬件相关](#硬件相关)
- [软件相关](#软件相关)
- [ROS 2 相关](#ros-2-相关)
- [传感器相关](#传感器相关)
- [导航与SLAM](#导航与slam)
- [计算机视觉](#计算机视觉)
- [系统集成](#系统集成)
- [调试与故障排除](#调试与故障排除)

---

## 硬件相关

### Q1: 如何选择合适的电机？

**答**：根据应用场景选择：

| 应用场景 | 推荐电机 | 理由 |
|---------|---------|------|
| 小车轮子驱动 | 直流减速电机（带编码器） | 速度可控，有位置反馈 |
| 机械臂关节 | 伺服电机或步进电机 | 精确角度控制 |
| 3D打印机 | 步进电机 | 精确定位，开环控制 |
| 无人机螺旋桨 | 无刷电机 | 高效率，大功率 |

**关键参数**：
- **扭矩**：能否带动负载？（计算公式：扭矩 = 力 × 力臂）
- **转速**：是否满足速度要求？
- **电压/电流**：电源能否提供？
- **控制方式**：是否有合适的驱动器？

### Q2: 电池容量如何计算？

**答**：使用以下公式：

```
运行时间（小时）= 电池容量（mAh）/ 平均电流（mA）
```

**示例**：
- 电池：7.4V 2200mAh
- 电机平均电流：500mA × 2 = 1000mA
- 树莓派：500mA
- 传感器：200mA
- **总电流**：1700mA
- **理论运行时间**：2200 / 1700 ≈ 1.3小时

**实际运行时间**约为理论值的 **70-80%**（考虑放电曲线和安全余量）。

**建议**：
- 留 20-30% 安全余量（避免过放）
- 使用电压监测模块实时监控
- 准备备用电池

### Q3: 为什么我的传感器读数不稳定？

**常见原因**：

1. **电源噪声**
   - 症状：读数跳动、出现尖峰
   - 解决：在传感器电源引脚加 0.1μF 和 10μF 电容滤波

2. **接线松动**
   - 症状：间歇性失效
   - 解决：检查所有连接，使用杜邦线卡扣或焊接

3. **电磁干扰**
   - 症状：电机运行时读数异常
   - 解决：传感器线远离电机线，使用屏蔽线

4. **采样频率过高**
   - 症状：读数噪声大
   - 解决：降低采样频率，增加软件滤波

5. **传感器未校准**
   - 症状：读数偏移
   - 解决：按照传感器手册进行校准

### Q4: 如何解决电机抖动问题？

**可能原因**：

1. **电源不足**
   - 检查：电机启动时电压是否下降
   - 解决：使用更大容量的电源，加大电容（1000μF以上）

2. **PWM频率过低**
   - 检查：是否听到电机"嗡嗡"声
   - 解决：提高PWM频率到20kHz以上

3. **驱动电流不足**
   - 检查：驱动器是否发热严重
   - 解决：更换更大电流的驱动器

4. **机械问题**
   - 检查：轴承是否卡滞，齿轮是否松动
   - 解决：润滑轴承，紧固螺丝

### Q5: 锂电池使用有哪些注意事项？

**⚠️ 安全警告**：锂电池使用不当可能引发火灾！

**必须遵守**：
1. **充电**：
   - 使用专用锂电池充电器
   - 充电时放在防火容器中
   - 不要过充（单节不超过4.2V）

2. **放电**：
   - 不要过放（单节不低于3.0V）
   - 使用电压监测模块
   - 设置低压报警

3. **存储**：
   - 长期不用时保持50-60%电量
   - 存放在阴凉干燥处
   - 使用防火袋

4. **损坏处理**：
   - 电池鼓包、变形、漏液立即停用
   - 不要拆解或短路
   - 送到专业回收点

---

## 软件相关

### Q6: Python代码运行很慢怎么办？

**优化方法**：

1. **使用NumPy向量化**
```python
# 慢（循环）
result = []
for i in range(1000000):
    result.append(i * 2)

# 快（向量化）
import numpy as np
result = np.arange(1000000) * 2
```

2. **避免重复计算**
```python
# 慢
for i in range(len(data)):
    if expensive_function(data[i]) > threshold:
        process(data[i])

# 快
results = [expensive_function(d) for d in data]
for i, r in enumerate(results):
    if r > threshold:
        process(data[i])
```

3. **使用生成器**
```python
# 慢（占用大量内存）
data = [process(i) for i in range(1000000)]

# 快（按需生成）
data = (process(i) for i in range(1000000))
```

4. **使用多进程**
```python
from multiprocessing import Pool

def process_data(x):
    return x * x

with Pool(4) as p:
    results = p.map(process_data, range(1000000))
```

### Q7: 如何调试Python代码？

**方法1：使用print调试**
```python
print(f"变量x的值: {x}")
print(f"函数返回: {my_function()}")
```

**方法2：使用pdb调试器**
```python
import pdb

def my_function():
    x = 10
    pdb.set_trace()  # 在这里暂停
    y = x * 2
    return y
```

**方法3：使用日志**
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息")
```

**方法4：使用IDE调试器**
- VS Code：按F5启动调试
- PyCharm：点击行号设置断点

---

## ROS 2 相关

### Q8: ROS 2节点无法通信怎么办？

**排查步骤**：

1. **检查节点是否运行**
```bash
ros2 node list
```

2. **检查话题是否存在**
```bash
ros2 topic list
```

3. **检查话题类型是否匹配**
```bash
ros2 topic info /my_topic
```

4. **检查QoS设置**
```python
# 发布者
publisher = self.create_publisher(
    String, 
    'topic', 
    qos_profile=QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)
)

# 订阅者（QoS必须兼容）
subscription = self.create_subscription(
    String,
    'topic',
    callback,
    qos_profile=QoSProfile(depth=10, reliability=ReliabilityPolicy.RELIABLE)
)
```

5. **检查网络配置**
```bash
# 查看ROS_DOMAIN_ID
echo $ROS_DOMAIN_ID

# 如果多台机器通信，确保在同一网段
ping <other_machine_ip>
```

### Q9: 为什么source setup.bash后还是找不到包？

**可能原因**：

1. **没有编译**
```bash
cd ~/robot_ws
colcon build
source install/setup.bash
```

2. **编译失败但没注意**
```bash
# 查看编译日志
colcon build --event-handlers console_direct+
```

3. **包名或路径错误**
```bash
# 检查包是否存在
ros2 pkg list | grep my_package
```

4. **环境变量冲突**
```bash
# 清除环境变量重新source
unset ROS_DISTRO
source /opt/ros/humble/setup.bash
source ~/robot_ws/install/setup.bash
```

### Q10: 如何查看ROS 2的日志？

**方法1：终端输出**
```bash
ros2 run my_package my_node
```

**方法2：使用rqt_console**
```bash
ros2 run rqt_console rqt_console
```

**方法3：查看日志文件**
```bash
cd ~/.ros/log/
ls -lt  # 按时间排序
tail -f latest/my_node/stdout.log
```

**方法4：在代码中设置日志级别**
```python
self.get_logger().debug("调试信息")
self.get_logger().info("普通信息")
self.get_logger().warn("警告信息")
self.get_logger().error("错误信息")
```

---

## 传感器相关

### Q11: IMU数据为什么会漂移？

**原因**：
- 陀螺仪积分误差累积
- 温度变化导致零点漂移
- 磁场干扰（如果使用磁力计）

**解决方案**：

1. **传感器融合**
```python
# 互补滤波器
alpha = 0.98
angle = alpha * (angle + gyro * dt) + (1 - alpha) * accel_angle
```

2. **定期校准**
```python
# 静止时重置陀螺仪零点
if is_stationary():
    gyro_offset = current_gyro_reading
```

3. **使用卡尔曼滤波**
```python
from filterpy.kalman import KalmanFilter
kf = KalmanFilter(dim_x=2, dim_z=1)
# 配置卡尔曼滤波器...
```

### Q12: 激光雷达数据有噪点怎么办？

**滤波方法**：

1. **距离滤波**
```python
# 过滤掉过近或过远的点
valid_ranges = [r for r in ranges if 0.1 < r < 10.0]
```

2. **中值滤波**
```python
import numpy as np
filtered = np.median(ranges.reshape(-1, 5), axis=1)
```

3. **统计滤波**
```python
# 移除离群点
mean = np.mean(ranges)
std = np.std(ranges)
filtered = [r for r in ranges if abs(r - mean) < 2 * std]
```

---

## 导航与SLAM

### Q13: SLAM建图效果不好怎么办？

**改进方法**：

1. **降低速度**
   - 建图时速度不超过0.3 m/s
   - 转弯时更慢（0.1-0.2 m/s）

2. **增加环境特征**
   - 避免长走廊、空旷区域
   - 添加临时标记物

3. **闭环检测**
   - 回到起点让系统识别
   - 使用Cartographer的闭环优化

4. **调整参数**
```yaml
# Cartographer参数示例
TRAJECTORY_BUILDER_2D.min_range = 0.1
TRAJECTORY_BUILDER_2D.max_range = 10.0
TRAJECTORY_BUILDER_2D.num_accumulated_range_data = 10
```

### Q14: 导航时机器人总是撞墙？

**排查步骤**：

1. **检查代价地图**
```bash
ros2 run rviz2 rviz2
# 添加 /local_costmap/costmap 和 /global_costmap/costmap
```

2. **调整膨胀半径**
```yaml
inflation_layer:
  inflation_radius: 0.5  # 增大这个值
  cost_scaling_factor: 3.0
```

3. **检查传感器数据**
```bash
ros2 topic echo /scan
# 确认激光雷达数据正常
```

4. **降低速度**
```yaml
max_vel_x: 0.3  # 降低最大速度
max_vel_theta: 0.5
```

---

## 计算机视觉

### Q15: 为什么颜色检测不准确？

**原因**：光照条件变化

**解决方案**：

1. **使用HSV而不是RGB**
```python
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
# HSV对光照变化更鲁棒
```

2. **自适应阈值**
```python
# 根据当前光照调整阈值
brightness = np.mean(frame)
if brightness < 100:
    lower_threshold = lower_threshold * 0.8
```

3. **白平衡**
```python
# 自动白平衡
balanced = cv2.xphoto.createSimpleWB().balanceWhite(frame)
```

4. **标定工具**
```python
# 使用滑动条实时调整
cv2.createTrackbar('H_min', 'window', 0, 179, lambda x: None)
```

### Q16: YOLO检测速度太慢？

**优化方法**：

1. **使用更小的模型**
   - YOLOv8n（nano）：最快
   - YOLOv8s（small）：平衡
   - YOLOv8m（medium）：准确

2. **降低输入分辨率**
```python
model = YOLO('yolov8n.pt')
results = model(frame, imgsz=320)  # 默认640
```

3. **使用GPU**
```python
model = YOLO('yolov8n.pt')
model.to('cuda')  # 需要CUDA支持
```

4. **跳帧处理**
```python
frame_count = 0
if frame_count % 3 == 0:  # 每3帧检测一次
    results = model(frame)
frame_count += 1
```

---

## 系统集成

### Q17: 多个传感器如何同步？

**方法1：时间戳同步**
```python
from message_filters import ApproximateTimeSynchronizer, Subscriber

image_sub = Subscriber('/camera/image', Image)
depth_sub = Subscriber('/camera/depth', Image)

sync = ApproximateTimeSynchronizer(
    [image_sub, depth_sub],
    queue_size=10,
    slop=0.1  # 允许0.1秒的时间差
)
sync.registerCallback(callback)
```

**方法2：硬件触发**
- 使用外部信号同时触发多个传感器
- 适用于高精度应用

### Q18: 如何优化系统性能？

**CPU优化**：
```bash
# 查看CPU使用率
top
htop

# 降低进程优先级
nice -n 10 ros2 run my_package my_node
```

**内存优化**：
```python
# 及时释放大对象
del large_array
import gc
gc.collect()
```

**网络优化**：
```yaml
# 使用更高效的QoS
qos_profile:
  reliability: best_effort  # 而不是reliable
  history: keep_last
  depth: 1  # 只保留最新数据
```

---

## 调试与故障排除

### Q19: 系统突然卡死怎么办？

**排查步骤**：

1. **检查CPU/内存**
```bash
top
free -h
```

2. **检查日志**
```bash
dmesg | tail
journalctl -xe
```

3. **检查ROS 2节点**
```bash
ros2 node list
ros2 topic hz /important_topic  # 检查话题频率
```

4. **重启相关节点**
```bash
ros2 lifecycle set /my_node shutdown
ros2 run my_package my_node
```

### Q20: 如何系统化地排查问题？

**通用排查流程**：

1. **复现问题**
   - 记录触发条件
   - 尝试稳定复现

2. **隔离问题**
   - 逐个禁用模块
   - 找到最小复现场景

3. **收集信息**
   - 日志文件
   - 错误信息
   - 系统状态

4. **假设验证**
   - 提出可能原因
   - 逐个验证

5. **修复验证**
   - 实施修复
   - 长时间测试
   - 记录解决方案

---

## 📚 更多资源

- [ROS 2官方文档](https://docs.ros.org/)
- [ROS Answers](https://answers.ros.org/)
- [Stack Overflow - ROS标签](https://stackoverflow.com/questions/tagged/ros)
- [GitHub Issues](https://github.com/ros2)

**提示**：遇到问题时，先搜索是否有人遇到过类似问题。90%的问题都能在网上找到答案！
