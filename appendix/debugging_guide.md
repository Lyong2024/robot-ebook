# 调试指南与故障排除

机器人开发中，调试占据了大量时间。本指南将帮助你系统化地排查和解决问题。

---

## 📋 目录

- [调试思维](#调试思维)
- [调试工具](#调试工具)
- [硬件调试](#硬件调试)
- [软件调试](#软件调试)
- [ROS 2 调试](#ros-2-调试)
- [系统集成调试](#系统集成调试)
- [常见故障案例](#常见故障案例)

---

## 调试思维

### 通用排查流程

```
1. 复现问题
   ↓
2. 隔离问题模块
   ↓
3. 收集信息（日志、错误信息、系统状态）
   ↓
4. 提出假设
   ↓
5. 验证假设
   ↓
6. 实施修复
   ↓
7. 验证修复
   ↓
8. 记录解决方案
```

### 调试的黄金法则

1. **改变一次只改一个变量**
   - 错误：同时修改代码、更换硬件、调整参数
   - 正确：每次只改一个，观察效果

2. **记录所有尝试**
   - 记录：改了什么、结果如何、为什么有效/无效
   - 避免重复尝试失败的方案

3. **从简单到复杂**
   - 先检查电源、接线等基础问题
   - 再检查代码逻辑、算法参数

4. **相信数据，不相信直觉**
   - 用万用表测量，不要猜测电压
   - 用日志记录，不要猜测程序流程

5. **休息一下**
   - 卡住超过1小时？休息10分钟
   - 新鲜的大脑更容易发现问题

---

## 调试工具

### 硬件调试工具

#### 1. 万用表（必备）

**用途**：
- 测量电压、电流、电阻
- 检查导通性（蜂鸣档）
- 检测二极管、三极管

**使用技巧**：
```
测量电压：
1. 选择直流电压档（DCV）
2. 红表笔接正极，黑表笔接负极
3. 读取数值

检查短路：
1. 选择蜂鸣档（♪）
2. 两表笔接触待测点
3. 有蜂鸣声 = 导通 = 可能短路

测量电流：
1. 断开电路
2. 万用表串联在电路中
3. 选择合适的电流档
4. 读取数值
```

**常见错误**：
- ❌ 测电流时并联（会烧毁万用表）
- ❌ 选错档位（如用电阻档测电压）
- ❌ 超量程（如用200mA档测5A电流）

#### 2. 示波器（进阶）

**用途**：
- 观察信号波形
- 测量频率、占空比
- 检测噪声、干扰

**典型应用**：
- 检查PWM信号是否正常
- 观察传感器输出波形
- 分析通信协议（I2C、SPI、UART）

#### 3. 逻辑分析仪（进阶）

**用途**：
- 同时捕获多路数字信号
- 解码通信协议
- 分析时序问题

**推荐**：
- Saleae Logic（软件友好）
- 便宜的8通道USB逻辑分析仪（50-100元）

#### 4. 其他工具

- **热成像仪**：找出发热的元件
- **电源分析仪**：测量功耗、电池容量
- **USB转TTL模块**：查看串口输出

### 软件调试工具

#### 1. 串口监视器

**Arduino IDE**：
```cpp
void setup() {
  Serial.begin(115200);
  Serial.println("程序启动");
}

void loop() {
  int value = analogRead(A0);
  Serial.print("传感器值: ");
  Serial.println(value);
  delay(100);
}
```

**技巧**：
- 在关键位置打印变量值
- 打印时间戳，分析执行顺序
- 使用不同的前缀区分不同模块

#### 2. Python调试器（pdb）

**基础用法**：
```python
import pdb

def my_function(x, y):
    result = x + y
    pdb.set_trace()  # 在这里暂停
    return result * 2

# 调试命令：
# n - 下一行
# s - 进入函数
# c - 继续执行
# p variable - 打印变量
# q - 退出
```

**更好的选择：ipdb**：
```bash
pip install ipdb
```

```python
import ipdb
ipdb.set_trace()  # 更友好的界面
```

#### 3. 日志系统

**Python logging**：
```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('robot.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# 使用
logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.critical("严重错误")
```

**日志级别选择**：
- DEBUG：详细的调试信息
- INFO：正常的运行信息
- WARNING：警告，但程序继续运行
- ERROR：错误，某个功能失败
- CRITICAL：严重错误，程序可能崩溃

---

## 硬件调试

### 问题1：设备不工作

**排查步骤**：

```
1. 检查电源
   ├─ 电池有电吗？（用万用表测量）
   ├─ 电压正确吗？（5V设备不能接12V）
   └─ 电流足够吗？（电源能提供足够电流吗？）

2. 检查接线
   ├─ 正负极接对了吗？
   ├─ 信号线接对引脚了吗？
   └─ 有松动吗？

3. 检查元件
   ├─ LED会亮吗？（测试电源）
   ├─ 芯片发热吗？（可能短路或损坏）
   └─ 有烧焦味吗？（元件烧毁）
```

**案例：Arduino不工作**

```
症状：上传代码后，Arduino没有反应

排查：
1. 检查电源LED是否亮 → 亮
2. 检查TX/RX LED是否闪烁 → 不闪烁
3. 重新上传代码 → 失败，提示"端口不存在"

诊断：USB连接问题或驱动问题

解决：
1. 更换USB线（很多USB线只能充电，不能传数据）
2. 重新安装驱动（CH340驱动）
3. 尝试其他USB端口
```

### 问题2：电机不转

**排查步骤**：

```
1. 电机本身正常吗？
   └─ 直接接电池，电机转吗？

2. 驱动器正常吗？
   ├─ 驱动器有电吗？
   ├─ 使能引脚设置了吗？
   └─ 方向引脚设置了吗？

3. PWM信号正常吗？
   └─ 用示波器或LED测试PWM输出

4. 电源足够吗？
   └─ 电机启动瞬间，电压是否下降？
```

**案例：L298N驱动电机不转**

```cpp
// 错误代码
const int ENA = 9;
const int IN1 = 7;
const int IN2 = 8;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  // 忘记设置ENA！
}

// 正确代码
void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 255);  // 必须设置使能引脚
}
```

### 问题3：传感器读数异常

**排查步骤**：

```
1. 传感器有电吗？
   └─ 测量VCC和GND之间的电压

2. 接线正确吗？
   ├─ I2C：SDA和SCL接对了吗？有上拉电阻吗？
   ├─ SPI：MOSI、MISO、SCK、CS接对了吗？
   └─ 模拟：接到模拟引脚了吗？

3. 地址/配置正确吗？
   └─ I2C设备地址对吗？（用i2c扫描工具检查）

4. 代码正确吗？
   └─ 初始化了吗？延时够吗？
```

**I2C设备扫描工具**：

```cpp
#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Serial.println("I2C扫描开始...");
  
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("发现设备，地址: 0x");
      Serial.println(addr, HEX);
    }
  }
  Serial.println("扫描完成");
}

void loop() {}
```

---

## 软件调试

### 问题1：程序卡死

**可能原因**：

1. **死循环**
```python
# 错误
while True:
    if condition:
        break
    # 忘记更新condition，永远为False
```

2. **阻塞操作**
```python
# 错误：等待串口数据，但数据永远不来
data = serial.read()  # 阻塞

# 正确：设置超时
data = serial.read(timeout=1.0)
```

3. **死锁**
```python
# 两个线程互相等待对方释放锁
```

**调试方法**：

```python
# 方法1：添加打印
while True:
    print("循环开始")
    # ...
    print("循环结束")

# 方法2：使用超时
import signal

def timeout_handler(signum, frame):
    raise TimeoutError("函数执行超时")

signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(5)  # 5秒超时
try:
    my_function()
finally:
    signal.alarm(0)
```

### 问题2：内存泄漏

**症状**：程序运行一段时间后变慢或崩溃

**排查**：

```python
import tracemalloc

# 开始跟踪
tracemalloc.start()

# 运行代码
my_function()

# 查看内存使用
current, peak = tracemalloc.get_traced_memory()
print(f"当前内存: {current / 1024 / 1024:.2f} MB")
print(f"峰值内存: {peak / 1024 / 1024:.2f} MB")

# 查看内存增长最多的地方
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
for stat in top_stats[:10]:
    print(stat)
```

**常见原因**：
- 忘记关闭文件
- 忘记释放大对象
- 循环中不断创建对象

---

## ROS 2 调试

### 工具1：ros2 命令行工具

```bash
# 查看所有节点
ros2 node list

# 查看节点信息
ros2 node info /my_node

# 查看所有话题
ros2 topic list

# 查看话题信息
ros2 topic info /my_topic

# 查看话题数据
ros2 topic echo /my_topic

# 查看话题频率
ros2 topic hz /my_topic

# 发布测试数据
ros2 topic pub /my_topic std_msgs/msg/String "data: 'test'"

# 查看所有服务
ros2 service list

# 调用服务
ros2 service call /my_service std_srvs/srv/Trigger

# 查看参数
ros2 param list
ros2 param get /my_node my_param
ros2 param set /my_node my_param 42
```

### 工具2：rqt工具集

```bash
# 节点图
ros2 run rqt_graph rqt_graph

# 日志查看器
ros2 run rqt_console rqt_console

# 话题监视器
ros2 run rqt_topic rqt_topic

# 参数编辑器
ros2 run rqt_reconfigure rqt_reconfigure

# 绘图工具
ros2 run rqt_plot rqt_plot
```

### 工具3：RViz2

```bash
ros2 run rviz2 rviz2
```

**常用显示**：
- TF：查看坐标变换
- LaserScan：查看激光雷达数据
- Image：查看摄像头图像
- Map：查看地图
- Path：查看路径规划

### 常见问题

**问题：节点无法通信**

```bash
# 1. 检查节点是否运行
ros2 node list

# 2. 检查话题是否存在
ros2 topic list

# 3. 检查QoS设置
ros2 topic info /my_topic -v

# 4. 检查网络
echo $ROS_DOMAIN_ID  # 确保相同
ping <other_machine>  # 如果是多机通信
```

**问题：TF变换错误**

```bash
# 查看TF树
ros2 run tf2_tools view_frames

# 查看特定变换
ros2 run tf2_ros tf2_echo base_link camera_link

# 检查TF是否有断裂
ros2 run tf2_tools tf2_monitor
```

---

## 系统集成调试

### 性能分析

**CPU使用率**：
```bash
# Linux
top
htop

# 查看特定进程
top -p $(pgrep -f my_node)
```

**内存使用**：
```bash
free -h
```

**网络带宽**：
```bash
# 安装iftop
sudo apt install iftop

# 监控网络
sudo iftop -i eth0
```

**ROS 2性能分析**：
```bash
# 安装
sudo apt install ros-humble-ros2-tracing

# 记录trace
ros2 trace

# 分析trace
ros2 trace-analysis
```

### 日志分析

**查看ROS 2日志**：
```bash
cd ~/.ros/log/
ls -lt  # 按时间排序
tail -f latest/my_node/stdout.log
```

**系统日志**：
```bash
# 查看系统日志
dmesg | tail

# 查看服务日志
journalctl -u my_service.service

# 实时查看
journalctl -f
```

---

## 常见故障案例

### 案例1：机器人突然重启

**症状**：机器人运行时突然重启，没有错误信息

**排查**：
1. 检查电源：电机启动时电压是否下降？
2. 检查日志：重启前有什么异常？
3. 检查温度：CPU或驱动器是否过热？

**解决**：
- 增大电源容量
- 增加电容滤波
- 改善散热

### 案例2：导航时机器人乱转

**症状**：发送导航目标后，机器人原地打转或走错方向

**排查**：
1. 检查TF：`ros2 run tf2_ros tf2_echo map base_link`
2. 检查定位：在RViz中查看机器人位姿是否正确
3. 检查地图：地图是否正确加载？
4. 检查代价地图：是否有异常障碍物？

**解决**：
- 重新定位：`ros2 service call /reinitialize_global_localization`
- 调整AMCL参数
- 重新建图

### 案例3：摄像头图像延迟

**症状**：摄像头图像延迟严重，实时性差

**排查**：
1. 检查分辨率：是否过高？
2. 检查帧率：是否设置合理？
3. 检查网络：如果是网络传输，带宽够吗？
4. 检查CPU：图像处理是否占用过多CPU？

**解决**：
- 降低分辨率：从1080p降到720p或480p
- 降低帧率：从30fps降到15fps
- 使用硬件编码：H.264而不是原始图像
- 优化算法：使用GPU加速

---

## 调试检查清单

### 硬件检查清单

- [ ] 电源电压正确
- [ ] 电源电流足够
- [ ] 所有接线牢固
- [ ] 极性正确
- [ ] 没有短路
- [ ] 没有松动
- [ ] 没有过热
- [ ] 传感器有响应

### 软件检查清单

- [ ] 代码编译通过
- [ ] 没有语法错误
- [ ] 变量初始化
- [ ] 数组不越界
- [ ] 指针不为空
- [ ] 文件正确关闭
- [ ] 资源正确释放
- [ ] 异常正确处理

### ROS 2检查清单

- [ ] 节点正常运行
- [ ] 话题正常发布/订阅
- [ ] QoS设置兼容
- [ ] TF树完整
- [ ] 参数正确设置
- [ ] 时间同步正常
- [ ] 网络连接正常

---

## 寻求帮助

### 提问的艺术

**好的问题**：
```
标题：ROS 2 Humble中AMCL定位失败

环境：
- Ubuntu 22.04
- ROS 2 Humble
- TurtleBot3 Burger

问题描述：
运行AMCL后，机器人位姿估计不准确，在RViz中看到粒子云分散。

已尝试：
1. 检查TF树，完整无断裂
2. 检查激光雷达数据，正常
3. 调整了initial_pose，无改善

日志：
[粘贴相关日志]

代码：
[粘贴相关配置文件]
```

**不好的问题**：
```
标题：AMCL不工作

问题：我的AMCL不工作，怎么办？
```

### 资源

- **ROS Answers**：https://answers.ros.org/
- **Stack Overflow**：https://stackoverflow.com/
- **GitHub Issues**：相关项目的Issue页面
- **Discord/Slack**：ROS社区频道

---

**记住**：调试是一项技能，需要练习。每次成功解决问题，都是一次学习机会。记录下来，下次遇到类似问题就能快速解决！
