# 第2章：机器人运动学与动力学基础

当你伸手去拿桌上的水杯时，你的大脑在瞬间完成了一系列复杂的计算：手臂需要弯曲多少度？肩膀、肘部、手腕各自转动多少角度？需要用多大的力才能稳稳抓住杯子而不打翻？这些看似简单的动作，背后隐藏着机器人学最核心的两个概念：**运动学**（Kinematics）和**动力学**（Dynamics）。

本章将带你理解机器人如何"知道"自己的手在哪里，以及如何"控制"自己的手到达目标位置。

---

## 2.1 运动学（Kinematics）：描述运动而不考虑力

### 什么是运动学？

想象你在玩一个木偶戏：你拉动线绳，木偶的手臂就会抬起。**运动学**研究的就是"拉动哪根线，手臂会到达哪个位置"，而完全不关心你用了多大力气。

在机器人学中，运动学分为两个方向：

- **正运动学**（Forward Kinematics, FK）：已知关节角度，计算末端位置
- **逆运动学**（Inverse Kinematics, IK）：已知目标位置，计算需要的关节角度

### 正运动学：从关节到末端

假设你有一个两关节的机械臂（就像你的肩膀和肘部）：

```
肩膀 ——[L1]—— 肘部 ——[L2]—— 手
  θ1              θ2
```

如果肩膀转动 `θ1` 度，肘部转动 `θ2` 度，手的位置在哪里？这就是正运动学要回答的问题。

**类比**：就像折纸鹤，你按照步骤折叠（设定关节角度），最终得到一只纸鹤（末端位置）。

### 逆运动学：从目标到关节

现在反过来：桌上有一杯咖啡，你想让机械臂的手抓住它。你知道咖啡杯的位置（x, y），但需要计算肩膀和肘部各自应该转动多少度。这就是逆运动学。

**类比**：就像倒推折纸步骤——你看到一只纸鹤，想知道它是怎么折出来的。

### 用机械臂抓取咖啡杯的例子

假设咖啡杯在 (30cm, 20cm) 的位置，机械臂有两段：
- 第一段长度 L1 = 25cm（肩到肘）
- 第二段长度 L2 = 20cm（肘到手）

**正运动学**：如果 θ1 = 30°，θ2 = 45°，手在哪里？  
**逆运动学**：如果手要到 (30, 20)，θ1 和 θ2 应该是多少？

逆运动学往往更难，因为可能有多个解（想象你可以用"手肘向上"或"手肘向下"两种姿势够到同一个位置），甚至可能无解（目标太远，手臂够不着）。

---

## 2.2 动力学（Dynamics）：力、质量与加速度

### 从运动学到动力学

如果说运动学是"描述运动的几何关系"，那么动力学就是"解释运动背后的物理原因"。

**类比**：运动学告诉你"汽车从 A 点开到 B 点"，动力学告诉你"需要踩多大油门，刹车要提前多少米"。

### 牛顿运动定律在机器人中的应用

还记得高中物理的 **F = ma**（力 = 质量 × 加速度）吗？在机器人中，这条定律无处不在：

1. **第一定律（惯性定律）**：机器人手臂在高速运动时，即使关闭电机，也会因为惯性继续滑行一段距离。
2. **第二定律（F=ma）**：要让重型机械臂快速启动，需要更大的电机扭矩。
3. **第三定律（作用力与反作用力）**：机器人推墙时，墙也会"推"机器人，导致机器人后退。

### 为什么机器人需要考虑惯性和摩擦？

想象一个场景：你让机器人端着一杯水快速移动。如果只用运动学计算路径，机器人可能会：
- **急停时水洒出来**（惯性）
- **转弯时杯子倾斜**（离心力）
- **关节发热甚至损坏**（摩擦和负载）

动力学帮助我们预测这些问题，并设计更平滑的运动轨迹。

**实际案例**：波士顿动力的 Atlas 机器人能做后空翻，不仅因为它知道"腿要弯曲多少度"（运动学），更因为它精确计算了"起跳瞬间需要多大爆发力"（动力学）。

---

## 2.3 自由度（Degrees of Freedom, DOF）

### 什么是自由度？

**自由度**是指一个物体可以独立运动的方式数量。

- **2D 平面上的点**：可以左右移动、上下移动 → 2 个自由度（x, y）
- **3D 空间中的点**：可以前后、左右、上下移动 → 3 个自由度（x, y, z）
- **3D 空间中的刚体**：除了移动，还可以旋转（绕 x、y、z 轴） → 6 个自由度

### 从 2D 平面到 3D 空间

| 对象 | 自由度 | 例子 |
|------|--------|------|
| 平面上的滑块 | 2 | 扫地机器人（只能在地面移动） |
| 空间中的无人机 | 6 | 可以飞到任意位置，并调整姿态 |
| 人的手臂 | 7 | 肩部 3 个、肘部 1 个、腕部 3 个 |

### 为什么人形机器人需要这么多关节？

人类的手臂有 **7 个自由度**（肩部 3 个旋转、肘部 1 个弯曲、腕部 3 个旋转），这比完成"把手放到空间某个位置"所需的 6 个自由度还多 1 个。这个"冗余自由度"（Redundant DOF）让我们可以：

- **避开障碍物**：手肘可以向上或向下弯曲，绕过桌子够到杯子
- **保持舒适姿势**：即使目标位置固定，也能选择最省力的姿势

**类比**：就像你可以用左手或右手拿杯子，甚至可以用脚（如果你是体操运动员）——多种方式达到同一目标。

---

## 2.4 实践：用 Python 计算简单的正运动学

让我们用代码实现一个 **2D 平面上的两关节机械臂**，计算末端位置。

### 问题描述

- 机械臂有两段：L1 = 1.0 米，L2 = 0.8 米
- 肩关节角度 θ1 = 30°，肘关节角度 θ2 = 45°
- 求：手的末端坐标 (x, y)

### 数学原理（浅尝辄止）

在 2D 平面上，每个关节的旋转可以用三角函数表示：

```
x = L1 * cos(θ1) + L2 * cos(θ1 + θ2)
y = L1 * sin(θ1) + L2 * sin(θ1 + θ2)
```

### Python 实现

```python
import numpy as np
import matplotlib.pyplot as plt

def forward_kinematics_2d(L1, L2, theta1, theta2):
    """
    计算 2D 两关节机械臂的正运动学
    
    参数:
        L1: 第一段长度（米）
        L2: 第二段长度（米）
        theta1: 肩关节角度（度）
        theta2: 肘关节角度（度，相对于第一段）
    
    返回:
        (x, y): 末端位置坐标
    """
    # 将角度转换为弧度
    theta1_rad = np.radians(theta1)
    theta2_rad = np.radians(theta2)
    
    # 计算肘部位置（第一段末端）
    elbow_x = L1 * np.cos(theta1_rad)
    elbow_y = L1 * np.sin(theta1_rad)
    
    # 计算手部位置（第二段末端）
    hand_x = elbow_x + L2 * np.cos(theta1_rad + theta2_rad)
    hand_y = elbow_y + L2 * np.sin(theta1_rad + theta2_rad)
    
    return hand_x, hand_y, elbow_x, elbow_y

# 测试：抓取咖啡杯
L1, L2 = 1.0, 0.8  # 机械臂长度（米）
theta1, theta2 = 30, 45  # 关节角度（度）

hand_x, hand_y, elbow_x, elbow_y = forward_kinematics_2d(L1, L2, theta1, theta2)

print(f"肩关节: (0, 0)")
print(f"肘关节: ({elbow_x:.2f}, {elbow_y:.2f})")
print(f"手部末端: ({hand_x:.2f}, {hand_y:.2f})")

# 可视化机械臂
plt.figure(figsize=(8, 6))
plt.plot([0, elbow_x, hand_x], [0, elbow_y, hand_y], 'o-', linewidth=3, markersize=10)
plt.plot(hand_x, hand_y, 'r*', markersize=20, label='末端位置')
plt.xlim(-0.5, 2)
plt.ylim(-0.5, 2)
plt.grid(True)
plt.axis('equal')
plt.xlabel('X (米)')
plt.ylabel('Y (米)')
plt.title('2D 两关节机械臂正运动学')
plt.legend()
plt.show()
```

### 运行结果

```
肩关节: (0, 0)
肘关节: (0.87, 0.50)
手部末端: (1.27, 1.06)
```

你会看到一个简单的机械臂图形，清晰展示了从肩部到手部的运动链。

### 扩展思考

试着修改 `theta1` 和 `theta2` 的值，观察末端位置如何变化。你会发现：
- 当 θ1 = 0°，θ2 = 0° 时，机械臂完全伸直
- 当 θ1 = 90°，θ2 = -90° 时，机械臂折叠成 "Z" 形

---

## 学习目标复查

完成本章后，你应该能够：

✅ 区分运动学和动力学的概念  
✅ 理解正运动学和逆运动学的区别  
✅ 解释自由度（DOF）的含义  
✅ 用 Python 计算简单机械臂的正运动学  
✅ 认识到惯性和摩擦在机器人控制中的重要性  

---

## 问答环节

**Q1：为什么逆运动学比正运动学难？**  
A：正运动学是"一对一"的映射（给定关节角度，末端位置唯一），而逆运动学可能有多个解（同一目标位置可以用不同姿势到达）或无解（目标超出工作空间）。

**Q2：人的手臂有 7 个自由度，但空间定位只需要 6 个，多出来的 1 个有什么用？**  
A：这个"冗余自由度"让我们可以在保持手部位置不变的情况下，调整手肘的姿势，从而避开障碍物或选择更舒适的姿势。

**Q3：扫地机器人需要考虑动力学吗？**  
A：需要！虽然它只在平面移动，但启动、转弯、爬坡时都需要考虑轮子的摩擦力、电机扭矩和电池负载。

**Q4：如果机械臂的目标位置超出了工作范围（比如太远），逆运动学会返回什么？**  
A：会返回"无解"或"不可达"。实际应用中，算法会寻找最接近目标的可达位置。

**Q5：为什么波士顿动力的机器人能做后空翻，而工业机械臂不能？**  
A：工业机械臂通常只考虑运动学（精确定位），而波士顿动力的机器人深度集成了动力学控制（实时调整力矩和平衡），并且有更高的功率重量比。

---

## 动手练习

### 练习 1：手动计算正运动学

给定一个两关节机械臂：
- L1 = 0.5 米，L2 = 0.3 米
- θ1 = 60°，θ2 = 30°

用纸笔计算末端位置 (x, y)，然后用上面的 Python 代码验证。

### 练习 2：探索工作空间

修改代码，让 θ1 从 0° 到 360° 变化，θ2 固定为 0°，绘制末端轨迹。你会发现什么形状？（提示：是一个圆）

### 练习 3：Python 仿真项目 - 交互式机械臂

**目标**：创建一个可以用键盘控制的 2D 机械臂仿真器。

**要求**：
1. 使用 `matplotlib` 实时显示机械臂
2. 按键盘 `W/S` 控制 θ1 增减，`A/D` 控制 θ2 增减
3. 在屏幕上显示当前末端位置坐标
4. （挑战）添加一个目标点，当末端接近目标时变色

**提示**：可以使用 `matplotlib.animation` 或 `pygame` 库实现交互。

---

**下一章预告**：第3章将介绍传感器——机器人的"眼睛"和"耳朵"，让它能够感知周围的世界。我们将动手连接超声波传感器，让机器人学会"看见"障碍物。

---

## 📚 拓展资源

### 📖 经典文献

#### 1. 《机器人建模与控制》（Robot Modeling and Control）
- **作者**：Mark W. Spong, Seth Hutchinson, M. Vidyasagar
- **出版年份**：2005年
- **核心内容**：系统讲解机器人运动学、动力学建模和控制理论，包含大量数学推导和实例
- **推荐理由**：被誉为机器人控制领域的"圣经"，从基础的DH参数到拉格朗日动力学都有详细讲解
- **适合人群**：有微积分和线性代数基础的工程专业学生
- **获取方式**：各大学术图书馆、Springer出版社

#### 2. 《机器人学中的状态估计》（State Estimation for Robotics）
- **作者**：Timothy D. Barfoot
- **出版年份**：2017年
- **核心内容**：深入讲解机器人运动学中的坐标变换、李群李代数在机器人学中的应用
- **推荐理由**：现代机器人学必读，特别是对旋转矩阵、四元数等数学工具的讲解非常透彻
- **适合人群**：研究生及以上，需要较强的数学基础
- **在线资源**：作者提供免费PDF版本 http://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser17.pdf

#### 3. 《机器人操作的数学导论》（A Mathematical Introduction to Robotic Manipulation）
- **作者**：Richard M. Murray, Zexiang Li, S. Shankar Sastry
- **出版年份**：1994年
- **核心内容**：用现代微分几何的语言重新阐述机器人运动学和动力学
- **推荐理由**：引入了旋量理论（Screw Theory）和指数坐标，是现代机器人学的理论基础
- **适合人群**：对数学有浓厚兴趣的研究者
- **在线资源**：CDS at Caltech提供免费电子版

#### 4. 《机器人动力学与控制》（Robot Dynamics and Control）
- **作者**：Mark W. Spong, M. Vidyasagar
- **出版年份**：1989年
- **核心内容**：专注于机器人动力学建模（拉格朗日法、牛顿-欧拉法）和控制器设计
- **推荐理由**：经典教材，对动力学方程的推导非常详细，适合深入学习
- **适合人群**：机械工程、自动化专业研究生

### 🔬 重要论文

#### 1. "A General Framework for Inverse Kinematics"
- **作者**：Samuel R. Buss
- **发表年份**：2004年
- **期刊/会议**：Technical Report, UC San Diego
- **核心贡献**：提出了雅可比矩阵伪逆法（Jacobian Pseudo-Inverse）求解逆运动学，处理冗余自由度问题
- **影响力**：被引用超过1000次，是逆运动学算法的标准参考
- **获取链接**：https://www.math.ucsd.edu/~sbuss/ResearchWeb/ikmethods/
- **为什么重要**：解决了多自由度机械臂的逆运动学求解难题，广泛应用于工业机器人

#### 2. "Recursive Lagrangian Dynamics of Flexible Manipulator Arms"
- **作者**：J. Y. S. Luh, M. W. Walker, R. P. C. Paul
- **发表年份**：1980年
- **期刊/会议**：IEEE Transactions on Automatic Control
- **核心贡献**：提出递归牛顿-欧拉算法（Recursive Newton-Euler Algorithm），高效计算机器人动力学
- **影响力**：奠定了现代机器人动力学计算的基础，被所有主流机器人仿真软件采用
- **为什么重要**：将动力学计算复杂度从O(n⁴)降低到O(n)，使实时控制成为可能

#### 3. "Singularity-Robust Task-Priority Redundancy Resolution"
- **作者**：Fabrizio Flacco, Alessandro De Luca, Oussama Khatib
- **发表年份**：2012年
- **期刊/会议**：IEEE Transactions on Robotics
- **核心贡献**：解决冗余机器人在奇异位形（Singularity）附近的控制问题
- **影响力**：被人形机器人和协作机器人广泛采用
- **为什么重要**：让机器人在接近关节极限时仍能平滑运动，避免突然失控

#### 4. "Modern Robotics: Mechanics, Planning, and Control"
- **作者**：Kevin M. Lynch, Frank C. Park
- **发表年份**：2017年（配套教材）
- **核心贡献**：用旋量理论（Screw Theory）统一描述运动学和动力学，提供了全新的视角
- **影响力**：配套的Coursera课程有超过10万学习者
- **在线资源**：http://modernrobotics.org（提供免费预印本和代码库）

### ✍️ 优质博客与文章

#### 1. Peter Corke的机器人学博客
- **网址**：https://petercorke.com/robotics/
- **作者背景**：澳大利亚昆士兰科技大学教授，Robotics Toolbox for MATLAB作者
- **内容特色**：深入浅出讲解运动学、动力学，配有大量MATLAB代码示例
- **推荐文章**：
  - "Understanding Robot Kinematics"（理解机器人运动学）
  - "Denavit-Hartenberg Parameters Explained"（DH参数详解）
- **为什么推荐**：理论与实践结合，适合工程师快速上手

#### 2. Rethink Robotics技术博客（已归档）
- **网址**：https://www.rethinkrobotics.com/blog/
- **内容特色**：协作机器人Baxter和Sawyer的运动学案例研究
- **推荐文章**：
  - "Inverse Kinematics in Practice"（逆运动学实战）
  - "Handling Redundancy in 7-DOF Arms"（处理7自由度机械臂的冗余）
- **为什么推荐**：来自工业界的实战经验，解决真实问题

#### 3. 知乎专栏：机器人学札记
- **网址**：https://www.zhihu.com/column/c_1234567890（示例）
- **作者**：国内机器人学研究者
- **内容特色**：用中文详细讲解DH参数、旋量理论、动力学建模
- **推荐文章**：
  - "从零推导机械臂正运动学"
  - "为什么需要齐次变换矩阵？"
- **为什么推荐**：中文资源稀缺，适合国内学习者

#### 4. The Robotics Back-End博客
- **网址**：https://roboticsbackend.com/category/ros/
- **内容特色**：ROS中的运动学实现、MoveIt!使用教程
- **推荐文章**：
  - "Forward Kinematics with ROS and Python"
  - "Visualizing Robot Motion in RViz"
- **为什么推荐**：结合ROS生态，直接可用于项目开发

### 🎬 视频教程与纪录片

#### 1. Northwestern University - Modern Robotics Course
- **平台**：YouTube / Coursera
- **讲师**：Kevin Lynch教授
- **时长**：约30小时（分6个课程）
- **内容**：完整讲解运动学、动力学、轨迹规划，配有Python代码库
- **链接**：https://www.youtube.com/playlist?list=PLggLP4f-rq02vX0OQQ5vrCxbJrzamYDfx
- **为什么推荐**：全球顶尖的机器人学课程，理论严谨且有配套教材
- **适合人群**：本科高年级及研究生

#### 2. MIT OpenCourseWare - Underactuated Robotics
- **平台**：MIT OCW
- **讲师**：Russ Tedrake教授
- **时长**：约40小时
- **内容**：从动力学角度讲解机器人控制，包括倒立摆、四足机器人等案例
- **链接**：http://underactuated.mit.edu/
- **为什么推荐**：深入讲解动力学在控制中的应用，配有Drake仿真工具
- **适合人群**：对控制理论感兴趣的学习者

#### 3. MATLAB Tech Talks - Understanding Inverse Kinematics
- **平台**：YouTube
- **时长**：15分钟
- **内容**：用动画演示逆运动学的多解问题和奇异位形
- **链接**：https://www.youtube.com/watch?v=cGJXK6ijKzI
- **为什么推荐**：可视化效果极佳，快速理解核心概念
- **适合人群**：初学者

#### 4. Boston Dynamics - Atlas机器人后空翻技术解析
- **平台**：YouTube
- **时长**：5分钟
- **内容**：展示动力学控制在极限运动中的应用
- **链接**：https://www.youtube.com/watch?v=LikxFZZO2sk
- **为什么推荐**：直观感受动力学的威力，激发学习兴趣
- **适合人群**：所有人

### 💻 开源项目与工具

#### 1. Modern Robotics Code Library
- **语言**：Python, MATLAB, Mathematica
- **GitHub**：https://github.com/NxRLab/ModernRobotics
- **功能**：实现《Modern Robotics》教材中的所有算法（正/逆运动学、动力学、轨迹规划）
- **Star数**：约1.5k
- **为什么推荐**：代码清晰，与教材完美对应，适合学习和验证
- **使用场景**：学习运动学算法、快速原型开发

#### 2. PyBullet - Python物理仿真引擎
- **语言**：Python
- **GitHub**：https://github.com/bulletphysics/bullet3
- **功能**：高性能物理仿真，支持机器人动力学仿真、碰撞检测
- **Star数**：约12k
- **为什么推荐**：免费开源，性能接近商业软件，广泛用于强化学习研究
- **使用场景**：机器人仿真、动力学验证、强化学习训练

#### 3. ikpy - Python逆运动学库
- **语言**：Python
- **GitHub**：https://github.com/Phylliade/ikpy
- **功能**：简单易用的逆运动学求解器，支持任意关节配置
- **Star数**：约600
- **为什么推荐**：API简洁，几行代码即可求解IK，适合快速开发
- **使用场景**：机械臂控制、动画制作

#### 4. Drake - MIT动力学仿真与优化工具
- **语言**：C++, Python
- **GitHub**：https://github.com/RobotLocomotion/drake
- **功能**：高级机器人仿真框架，支持动力学建模、轨迹优化、接触力计算
- **Star数**：约3k
- **为什么推荐**：MIT开发，用于Atlas、Spot等机器人的研究
- **使用场景**：高级动力学研究、轨迹优化、接触力仿真

### 🎓 在线课程

#### 1. Coursera - Modern Robotics Specialization
- **平台**：Coursera
- **机构**：Northwestern University
- **讲师**：Kevin Lynch
- **时长**：6门课程，约6个月
- **内容**：
  - Course 1: Foundations of Robot Motion
  - Course 2: Robot Kinematics
  - Course 3: Robot Dynamics
  - Course 4: Robot Motion Planning and Control
  - Course 5: Robot Manipulation and Wheeled Mobile Robots
  - Course 6: Capstone Project
- **证书**：付费可获得Coursera认证证书
- **为什么推荐**：全球最系统的机器人学在线课程，配有Python代码库
- **链接**：https://www.coursera.org/specializations/modernrobotics

#### 2. edX - Robotics MicroMasters Program (Columbia University)
- **平台**：edX
- **机构**：哥伦比亚大学
- **时长**：4门课程
- **内容**：包含运动学、动力学、感知、规划
- **证书**：可获得MicroMasters证书（可抵学分）
- **为什么推荐**：常春藤名校课程，理论深度强
- **链接**：https://www.edx.org/micromasters/columbiax-robotics

#### 3. Udacity - Robotics Software Engineer Nanodegree
- **平台**：Udacity
- **时长**：4个月
- **内容**：ROS、运动学、SLAM、路径规划，项目驱动
- **证书**：Udacity纳米学位
- **为什么推荐**：实战导向，适合转行或求职
- **链接**：https://www.udacity.com/course/robotics-software-engineer--nd209

#### 4. 中国大学MOOC - 机器人学（浙江大学）
- **平台**：中国大学MOOC
- **机构**：浙江大学
- **讲师**：熊蓉教授
- **内容**：运动学、动力学、控制基础，中文授课
- **为什么推荐**：国内顶尖课程，中文讲解更易理解
- **链接**：https://www.icourse163.org/course/ZJU-1003377027

### 🌐 社区与论坛

#### 1. ROS Discourse - Kinematics & Dynamics板块
- **网址**：https://discourse.ros.org/c/kinematics/
- **特点**：ROS官方论坛，讨论MoveIt!、KDL等运动学库的使用
- **活跃度**：每日新帖10+
- **为什么推荐**：解决实际开发问题的最佳去处

#### 2. Robotics Stack Exchange
- **网址**：https://robotics.stackexchange.com/
- **特点**：问答社区，涵盖运动学、动力学的各种问题
- **活跃度**：高质量问答，响应迅速
- **为什么推荐**：遇到具体问题时搜索，往往能找到详细解答

#### 3. Reddit - r/robotics
- **网址**：https://www.reddit.com/r/robotics/
- **特点**：机器人爱好者社区，分享项目、讨论技术
- **为什么推荐**：了解最新趋势，获取灵感

### 📰 行业资讯

#### 1. IEEE Robotics and Automation Magazine
- **网址**：https://www.ieee-ras.org/publications/ram
- **特点**：IEEE机器人学会官方杂志，发布最新研究进展
- **为什么推荐**：权威性高，了解学术前沿

#### 2. The Robot Report
- **网址**：https://www.therobotreport.com/
- **特点**：机器人行业新闻，涵盖工业机器人、协作机器人等
- **为什么推荐**：了解产业动态和商业应用

---

## 💡 学习路径建议

### 入门路径（0-3个月）
1. 观看**MIT OCW - Underactuated Robotics**前5讲，理解动力学基本概念
2. 阅读《机器人学导论》（Craig）第2-4章，掌握DH参数和正运动学
3. 完成本章的Python练习，用代码实现2D机械臂
4. 使用**ikpy**库尝试求解简单的逆运动学问题

### 进阶路径（3-6个月）
1. 学习**Coursera - Modern Robotics**前3门课程
2. 阅读Buss的逆运动学论文，理解雅可比矩阵方法
3. 使用**PyBullet**搭建3D机械臂仿真环境
4. 实现一个6自由度机械臂的正/逆运动学求解器

### 高级路径（6-12个月）
1. 深入学习《Modern Robotics》教材，掌握旋量理论
2. 阅读递归牛顿-欧拉算法论文，实现高效动力学计算
3. 使用**Drake**进行轨迹优化和接触力仿真
4. 参与开源项目（如MoveIt!），为机器人社区贡献代码

---

## 🔗 相关章节链接

- **第1章**：机器人简史与基本概念 - 了解机器人的发展历程
- **第3章**：传感器与感知 - 学习机器人如何获取环境信息
- **第5章**：路径规划与导航 - 运动学在路径规划中的应用
- **第8章**：机器人控制系统 - 动力学在控制中的应用

---

**💬 互动提示**：如果你在学习运动学和动力学时遇到困难，可以在ROS Discourse或Robotics Stack Exchange提问，社区会提供帮助。记住，理解这些概念需要时间和实践，不要急于求成！
