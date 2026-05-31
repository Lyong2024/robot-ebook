# 第13章：机械臂与操作

## 学习目标

- 理解机械臂的运动学基础
- 掌握 MoveIt 2 框架
- 学会机械臂轨迹规划
- 理解抓取规划
- 能够控制真实机械臂
- 了解常见的机械臂应用

## 13.1 机械臂基础

### 机械臂结构

```
基座（Base）
  │
  ├─ 关节1（Joint 1）─ 连杆1（Link 1）
  │
  ├─ 关节2（Joint 2）─ 连杆2（Link 2）
  │
  ├─ 关节3（Joint 3）─ 连杆3（Link 3）
  │
  └─ 末端执行器（End Effector）
```

### 关节类型

**旋转关节（Revolute）**：
- 绕轴旋转
- 范围：通常 ±180°
- 最常见

**平移关节（Prismatic）**：
- 沿轴滑动
- 范围：有限距离
- 较少见

### 自由度（DOF）

- **3 DOF**：位置控制（x, y, z）
- **6 DOF**：位置 + 姿态控制（x, y, z, roll, pitch, yaw）
- **7+ DOF**：冗余自由度，更灵活

### 工作空间

- **可达空间**：末端能到达的所有位置
- **灵巧空间**：末端能以任意姿态到达的位置

## 13.2 运动学

### 正运动学（Forward Kinematics）

已知关节角度，计算末端位置。

**DH 参数法**：

```python
import numpy as np

def dh_transform(theta, d, a, alpha):
    """DH 变换矩阵"""
    ct = np.cos(theta)
    st = np.sin(theta)
    ca = np.cos(alpha)
    sa = np.sin(alpha)
    
    return np.array([
        [ct, -st*ca,  st*sa, a*ct],
        [st,  ct*ca, -ct*sa, a*st],
        [0,   sa,     ca,    d   ],
        [0,   0,      0,     1   ]
    ])

def forward_kinematics(joint_angles, dh_params):
    """
    计算正运动学
    joint_angles: 关节角度列表
    dh_params: DH 参数 [(theta, d, a, alpha), ...]
    """
    T = np.eye(4)
    
    for i, (theta_offset, d, a, alpha) in enumerate(dh_params):
        theta = joint_angles[i] + theta_offset
        T = T @ dh_transform(theta, d, a, alpha)
    
    return T

# 示例：2 自由度平面机械臂
dh_params = [
    (0, 0, 1.0, 0),  # 连杆1：长度 1m
    (0, 0, 0.5, 0)   # 连杆2：长度 0.5m
]

joint_angles = [np.pi/4, np.pi/6]  # 45°, 30°
T = forward_kinematics(joint_angles, dh_params)

print("末端位置:")
print(f"x = {T[0, 3]:.3f}")
print(f"y = {T[1, 3]:.3f}")
```

### 逆运动学（Inverse Kinematics）

已知末端位置，计算关节角度。

**解析解（2D 平面机械臂）**：

```python
def inverse_kinematics_2d(x, y, l1, l2):
    """
    2 自由度平面机械臂逆运动学
    x, y: 目标位置
    l1, l2: 连杆长度
    """
    # 检查是否可达
    distance = np.sqrt(x**2 + y**2)
    if distance > l1 + l2 or distance < abs(l1 - l2):
        return None  # 不可达
    
    # 余弦定理
    cos_theta2 = (x**2 + y**2 - l1**2 - l2**2) / (2 * l1 * l2)
    
    # 两个解（肘部向上/向下）
    theta2_1 = np.arccos(cos_theta2)
    theta2_2 = -theta2_1
    
    # 对应的 theta1
    k1 = l1 + l2 * np.cos(theta2_1)
    k2 = l2 * np.sin(theta2_1)
    theta1_1 = np.arctan2(y, x) - np.arctan2(k2, k1)
    
    k1 = l1 + l2 * np.cos(theta2_2)
    k2 = l2 * np.sin(theta2_2)
    theta1_2 = np.arctan2(y, x) - np.arctan2(k2, k1)
    
    return [(theta1_1, theta2_1), (theta1_2, theta2_2)]

# 示例
solutions = inverse_kinematics_2d(1.2, 0.5, 1.0, 0.5)
if solutions:
    for i, (theta1, theta2) in enumerate(solutions):
        print(f"解 {i+1}: theta1={np.degrees(theta1):.1f}°, theta2={np.degrees(theta2):.1f}°")
```

**数值解（通用方法）**：

```python
from scipy.optimize import minimize

def ik_numerical(target_pos, initial_guess, fk_func):
    """
    数值逆运动学
    target_pos: 目标位置 [x, y, z]
    initial_guess: 初始关节角度
    fk_func: 正运动学函数
    """
    def objective(joint_angles):
        T = fk_func(joint_angles)
        current_pos = T[:3, 3]
        error = np.linalg.norm(current_pos - target_pos)
        return error
    
    result = minimize(objective, initial_guess, method='SLSQP')
    
    if result.success:
        return result.x
    else:
        return None
```

### 雅可比矩阵

雅可比矩阵描述关节速度和末端速度的关系。

```python
def numerical_jacobian(joint_angles, fk_func, epsilon=1e-6):
    """数值计算雅可比矩阵"""
    n = len(joint_angles)
    J = np.zeros((6, n))  # 6D 速度（3 平移 + 3 旋转）
    
    T0 = fk_func(joint_angles)
    pos0 = T0[:3, 3]
    
    for i in range(n):
        # 扰动第 i 个关节
        joint_angles_perturbed = joint_angles.copy()
        joint_angles_perturbed[i] += epsilon
        
        T = fk_func(joint_angles_perturbed)
        pos = T[:3, 3]
        
        # 平移部分
        J[:3, i] = (pos - pos0) / epsilon
        
        # 旋转部分（简化）
        # 实际应该计算旋转矩阵的差异
    
    return J
```

## 13.3 MoveIt 2

MoveIt 2 是 ROS 2 的机械臂控制框架。

### 安装

```bash
sudo apt install ros-humble-moveit
```

### 创建机械臂描述

**URDF 文件（simple_arm.urdf.xacro）**：

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="simple_arm">
  
  <!-- 基座 -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.1"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
  </link>
  
  <!-- 连杆1 -->
  <link name="link1">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.5"/>
      </geometry>
      <origin xyz="0 0 0.25" rpy="0 0 0"/>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
  </link>
  
  <!-- 关节1 -->
  <joint name="joint1" type="revolute">
    <parent link="base_link"/>
    <child link="link1"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-3.14" upper="3.14" effort="10" velocity="1"/>
  </joint>
  
  <!-- 连杆2 -->
  <link name="link2">
    <visual>
      <geometry>
        <cylinder radius="0.04" length="0.4"/>
      </geometry>
      <origin xyz="0 0 0.2" rpy="0 0 0"/>
      <material name="green">
        <color rgba="0 1 0 1"/>
      </material>
    </visual>
  </link>
  
  <!-- 关节2 -->
  <joint name="joint2" type="revolute">
    <parent link="link1"/>
    <child link="link2"/>
    <origin xyz="0 0 0.5" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="10" velocity="1"/>
  </joint>
  
  <!-- 末端执行器 -->
  <link name="end_effector">
    <visual>
      <geometry>
        <sphere radius="0.03"/>
      </geometry>
      <material name="red">
        <color rgba="1 0 0 1"/>
      </material>
    </visual>
  </link>
  
  <joint name="joint_ee" type="fixed">
    <parent link="link2"/>
    <child link="end_effector"/>
    <origin xyz="0 0 0.4" rpy="0 0 0"/>
  </joint>
  
</robot>
```

### MoveIt 配置

使用 MoveIt Setup Assistant：

```bash
ros2 launch moveit_setup_assistant setup_assistant.launch.py
```

步骤：
1. 加载 URDF
2. 定义规划组（Planning Group）
3. 定义末端执行器
4. 配置碰撞检测
5. 生成配置文件

### 使用 MoveIt 规划

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from moveit_msgs.msg import MoveItErrorCodes
from moveit.planning import MoveItPy
from geometry_msgs.msg import PoseStamped
import numpy as np

class ArmController(Node):
    def __init__(self):
        super().__init__('arm_controller')
        
        # 初始化 MoveIt
        self.moveit = MoveItPy(node_name="moveit_py")
        self.arm = self.moveit.get_planning_component("arm")
        
        self.get_logger().info('Arm controller ready')
    
    def move_to_pose(self, x, y, z, roll=0, pitch=0, yaw=0):
        """移动到指定位姿"""
        # 创建目标位姿
        pose = PoseStamped()
        pose.header.frame_id = "base_link"
        pose.pose.position.x = x
        pose.pose.position.y = y
        pose.pose.position.z = z
        
        # 欧拉角转四元数
        qx = np.sin(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) - np.cos(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
        qy = np.cos(roll/2) * np.sin(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.cos(pitch/2) * np.sin(yaw/2)
        qz = np.cos(roll/2) * np.cos(pitch/2) * np.sin(yaw/2) - np.sin(roll/2) * np.sin(pitch/2) * np.cos(yaw/2)
        qw = np.cos(roll/2) * np.cos(pitch/2) * np.cos(yaw/2) + np.sin(roll/2) * np.sin(pitch/2) * np.sin(yaw/2)
        
        pose.pose.orientation.x = qx
        pose.pose.orientation.y = qy
        pose.pose.orientation.z = qz
        pose.pose.orientation.w = qw
        
        # 设置目标
        self.arm.set_goal_state(pose_stamped_msg=pose, pose_link="end_effector")
        
        # 规划
        plan_result = self.arm.plan()
        
        if plan_result:
            self.get_logger().info('Planning succeeded, executing...')
            # 执行
            self.arm.execute()
            return True
        else:
            self.get_logger().error('Planning failed')
            return False
    
    def move_to_joint_values(self, joint_values):
        """移动到指定关节角度"""
        self.arm.set_goal_state(configuration_name="joint_values", 
                                 joint_values=joint_values)
        
        plan_result = self.arm.plan()
        
        if plan_result:
            self.arm.execute()
            return True
        else:
            return False
    
    def move_to_named_target(self, target_name):
        """移动到预定义位置"""
        self.arm.set_goal_state(configuration_name=target_name)
        
        plan_result = self.arm.plan()
        
        if plan_result:
            self.arm.execute()
            return True
        else:
            return False

def main():
    rclpy.init()
    controller = ArmController()
    
    # 移动到 home 位置
    controller.move_to_named_target("home")
    
    # 移动到指定位姿
    controller.move_to_pose(0.3, 0.2, 0.5)
    
    # 移动到指定关节角度
    controller.move_to_joint_values([0.5, -0.5, 0.0, 0.0])
    
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 13.4 轨迹规划

### 笛卡尔路径

沿直线移动末端执行器。

```python
def plan_cartesian_path(self, waypoints):
    """
    规划笛卡尔路径
    waypoints: 位姿列表
    """
    # 设置路径约束
    self.arm.set_path_constraints(...)
    
    # 计算笛卡尔路径
    (plan, fraction) = self.arm.compute_cartesian_path(
        waypoints,
        0.01,  # 步长（m）
        0.0    # 跳跃阈值
    )
    
    if fraction > 0.95:  # 95% 的路径可行
        self.arm.execute(plan)
        return True
    else:
        self.get_logger().warn(f'Only {fraction*100:.1f}% of path is feasible')
        return False
```

### 速度和加速度限制

```python
# 设置速度缩放
self.arm.set_max_velocity_scaling_factor(0.5)  # 50% 最大速度

# 设置加速度缩放
self.arm.set_max_acceleration_scaling_factor(0.3)  # 30% 最大加速度
```

## 13.5 抓取规划

### 夹爪控制

```python
class GripperController:
    def __init__(self, node):
        self.node = node
        self.gripper_pub = node.create_publisher(
            Float64MultiArray,
            '/gripper_controller/commands',
            10
        )
    
    def open(self):
        """打开夹爪"""
        msg = Float64MultiArray()
        msg.data = [0.04, 0.04]  # 两个手指的位置
        self.gripper_pub.publish(msg)
    
    def close(self):
        """关闭夹爪"""
        msg = Float64MultiArray()
        msg.data = [0.0, 0.0]
        self.gripper_pub.publish(msg)
    
    def set_position(self, position):
        """设置夹爪位置"""
        msg = Float64MultiArray()
        msg.data = [position, position]
        self.gripper_pub.publish(msg)
```

### 抓取流程

```python
def pick_and_place(self, pick_pose, place_pose):
    """抓取和放置"""
    # 1. 移动到抓取预备位置
    pre_grasp_pose = pick_pose.copy()
    pre_grasp_pose.position.z += 0.1  # 上方 10cm
    self.move_to_pose_msg(pre_grasp_pose)
    
    # 2. 打开夹爪
    self.gripper.open()
    time.sleep(1)
    
    # 3. 下降到抓取位置
    self.move_to_pose_msg(pick_pose)
    
    # 4. 关闭夹爪
    self.gripper.close()
    time.sleep(1)
    
    # 5. 提升
    self.move_to_pose_msg(pre_grasp_pose)
    
    # 6. 移动到放置预备位置
    pre_place_pose = place_pose.copy()
    pre_place_pose.position.z += 0.1
    self.move_to_pose_msg(pre_place_pose)
    
    # 7. 下降到放置位置
    self.move_to_pose_msg(place_pose)
    
    # 8. 打开夹爪
    self.gripper.open()
    time.sleep(1)
    
    # 9. 提升
    self.move_to_pose_msg(pre_place_pose)
    
    # 10. 回到 home
    self.move_to_named_target("home")
```

## 13.6 真实机械臂控制

### 常见机械臂

**UR 系列（Universal Robots）**：
- UR3、UR5、UR10
- 6 DOF
- 价格：$20k - $50k
- ROS 2 支持好

**Franka Emika Panda**：
- 7 DOF
- 力控
- 价格：$25k
- 研究常用

**Dobot 系列**：
- Magician、M1
- 4 DOF
- 价格：$1k - $5k
- 入门级

### 连接真实机械臂

```python
# UR 机械臂示例
from ur_rtde import RTDEControlInterface, RTDEReceiveInterface

class URController:
    def __init__(self, robot_ip):
        self.rtde_c = RTDEControlInterface(robot_ip)
        self.rtde_r = RTDEReceiveInterface(robot_ip)
    
    def move_j(self, joint_angles, speed=1.0, acceleration=1.0):
        """关节空间运动"""
        self.rtde_c.moveJ(joint_angles, speed, acceleration)
    
    def move_l(self, pose, speed=0.5, acceleration=0.5):
        """笛卡尔空间运动"""
        self.rtde_c.moveL(pose, speed, acceleration)
    
    def get_joint_positions(self):
        """获取当前关节角度"""
        return self.rtde_r.getActualQ()
    
    def get_tcp_pose(self):
        """获取末端位姿"""
        return self.rtde_r.getActualTCPPose()

# 使用
robot = URController("192.168.1.100")
robot.move_j([0, -1.57, 1.57, -1.57, -1.57, 0])
```

## 13.7 碰撞检测

### 自碰撞检测

MoveIt 自动检测机械臂各部分之间的碰撞。

```python
# 禁用特定连杆之间的碰撞检测
self.arm.set_allowed_collision_matrix([
    ("link1", "link2", True),  # 允许 link1 和 link2 碰撞
])
```

### 环境碰撞检测

```python
from moveit_msgs.msg import CollisionObject
from shape_msgs.msg import SolidPrimitive

def add_box_obstacle(self, name, pose, size):
    """添加盒子障碍物"""
    collision_object = CollisionObject()
    collision_object.header.frame_id = "base_link"
    collision_object.id = name
    
    box = SolidPrimitive()
    box.type = SolidPrimitive.BOX
    box.dimensions = size
    
    collision_object.primitives.append(box)
    collision_object.primitive_poses.append(pose)
    collision_object.operation = CollisionObject.ADD
    
    self.planning_scene.add_object(collision_object)

# 添加桌子
table_pose = PoseStamped()
table_pose.pose.position.z = -0.05
self.add_box_obstacle("table", table_pose.pose, [1.0, 1.0, 0.1])
```

## 本章小结

在本章中，我们学习了：

- 机械臂的基本结构和运动学
- 正运动学和逆运动学
- MoveIt 2 框架的使用
- 轨迹规划和执行
- 抓取规划
- 真实机械臂控制
- 碰撞检测

机械臂是机器人操作的核心，掌握机械臂控制将让你的机器人能够完成复杂的操作任务。

## 推荐资源

- **MoveIt 2 文档**：https://moveit.picknik.ai/
- **Modern Robotics 课程**：https://modernrobotics.northwestern.edu/
- **机器人学导论（Craig）**：经典教材

## 动手练习

**练习 1：运动学计算**

实现一个 3 自由度机械臂的正运动学和逆运动学。

**练习 2：MoveIt 规划**

使用 MoveIt 规划一个"画圆"的轨迹。

**练习 3：抓取任务**

实现一个完整的抓取任务：检测物体 → 规划抓取 → 执行 → 放置。

## 学习目标复查

完成本章学习后，请通过以下问题检查自己的掌握程度：

- [ ] 你能解释正运动学和逆运动学的区别，并说明在什么场景下需要使用逆运动学吗？
- [ ] 你能使用 MoveIt 2 为一个 6 自由度机械臂规划从当前位置到目标位置的无碰撞轨迹吗？
- [ ] 你能编写代码控制机械臂末端执行器移动到指定的笛卡尔空间坐标（x, y, z, roll, pitch, yaw）吗？
- [ ] 你能解释什么是碰撞检测，并在 MoveIt 2 中为机械臂添加障碍物以避免碰撞吗？
- [ ] 你能使用 MoveIt 2 的抓取规划功能，为机械臂规划一个完整的"接近-抓取-提升"动作序列吗？
- [ ] 你能说明如何将 MoveIt 2 中规划好的轨迹发送到真实机械臂硬件上执行，并解释其中涉及的关键步骤吗？
- [ ] 你能列举至少三个机械臂在实际应用中的场景，并说明每个场景对机械臂的特殊要求吗？

## 问答环节

### Q1: 在机械臂运动学中，正运动学和逆运动学各自解决什么问题？为什么逆运动学在实际应用中更具挑战性？

**答**：正运动学（Forward Kinematics）解决的是从关节空间到笛卡尔空间的映射问题，即给定所有关节的角度值，计算末端执行器在三维空间中的位置和姿态。这个过程通常通过连续的坐标变换矩阵相乘来实现，使用DH参数（Denavit-Hartenberg）建立每个连杆之间的关系。正运动学的解是唯一的，计算过程相对直接。

逆运动学（Inverse Kinematics）则相反，它要解决的是给定末端执行器期望的位置和姿态，反推出各个关节应该处于什么角度。这在实际应用中更为重要，因为我们通常知道想要抓取的物体位置，需要计算如何移动关节才能到达那里。逆运动学的挑战性主要体现在三个方面：首先，解可能不存在（目标点超出工作空间）；其次，解可能不唯一（多个关节配置可以达到同一末端位置，特别是对于冗余机械臂）；最后，求解过程涉及非线性方程组，通常需要数值迭代方法，计算复杂度高且可能陷入局部最优。

在ROS 2和MoveIt 2中，逆运动学求解器有多种选择，包括解析解（如KDL）和数值解（如TRAC-IK）。解析解速度快但只适用于特定机械臂构型，数值解更通用但计算开销更大。实际应用中还需要考虑关节限位、奇异点规避、碰撞检测等约束条件，这使得逆运动学求解成为机械臂控制中的核心难题。选择合适的求解器和调整求解参数（如超时时间、迭代次数）对系统性能有显著影响。

### Q2: MoveIt 2的运动规划流程涉及哪些关键组件？如果规划频繁失败，应该从哪些方面排查问题？

**答**：MoveIt 2的运动规划流程包含几个关键组件协同工作。首先是Planning Scene，它维护机器人的当前状态、环境中的障碍物信息以及碰撞检测模型。Planning Request包含目标位置、规划组（planning group）、约束条件等信息。Motion Planner是核心，常用的有OMPL（Open Motion Planning Library）库中的RRT、RRTConnect、PRM等算法，它们在配置空间中搜索无碰撞路径。Trajectory Processing负责对规划出的路径进行时间参数化、平滑处理和速度优化。最后，Controller Interface将轨迹发送给底层控制器执行。

当规划频繁失败时，应该系统性地排查以下方面。首先检查目标位置是否在工作空间内，可以通过正运动学验证目标关节配置是否合理，或者使用MoveIt的可达性分析工具。其次检查碰撞模型是否正确，过于保守的碰撞体积会导致本可行的路径被拒绝，可以在RViz中可视化碰撞网格进行调试。第三，调整规划器参数，如增加规划时间限制（默认5秒可能不够）、调整采样分辨率、选择更适合当前场景的规划算法（狭窄空间用RRTConnect，开阔空间用RRT）。

还需要检查关节限位配置是否与实际机械臂一致，URDF中的joint limits必须准确。如果使用了路径约束（如保持末端姿态），要确认约束不会过度限制解空间。对于冗余机械臂，可以尝试不同的IK求解器或调整冗余自由度的权重。最后，查看MoveIt的日志输出，它会提供失败原因的详细信息，如"No IK solution found"、"Path planning failed"或"Collision detected"，针对性地解决问题。在开发阶段，建议先在简单场景中验证基本功能，再逐步增加复杂度。

### Q3: 在实现机械臂抓取时，如何处理物体位置的不确定性？视觉伺服和预抓取姿态各起什么作用？

**答**：物体位置的不确定性是实际抓取任务中的常见挑战，来源包括视觉感知误差、物体放置的随机性、环境光照变化等。处理这种不确定性需要多层次的策略。首先在感知层面，使用高质量的视觉系统（如深度相机、立体视觉）并结合点云处理、物体识别算法来提高位置估计精度。可以采用多次测量取平均、卡尔曼滤波等方法减少噪声。对于已知物体，模板匹配或基于CAD模型的6D位姿估计能提供更准确的结果。

预抓取姿态（pre-grasp pose）是抓取规划中的重要概念，它是末端执行器在实际闭合夹爪之前应该到达的位置，通常距离物体表面几厘米。预抓取姿态的作用是提供一个安全的接近路径，避免在最后阶段发生碰撞，同时为后续的精细调整留出空间。在MoveIt 2中，典型的抓取流程是：规划到预抓取姿态 → 直线运动接近物体 → 闭合夹爪 → 提升物体。预抓取姿态还可以有多个候选，从不同角度接近物体，规划器会选择最容易到达且无碰撞的那个。

视觉伺服（Visual Servoing）则是在运动过程中持续使用视觉反馈来修正轨迹，分为基于图像的视觉伺服（IBVS）和基于位置的视觉伺服（PBVS）。IBVS直接在图像空间中定义误差并控制，不需要精确的3D重建，对标定误差鲁棒性好，但可能产生非直观的运动轨迹。PBVS在笛卡尔空间中工作，轨迹更直观但对标定精度要求高。在ROS 2中，可以使用visp_ros等包实现视觉伺服。实际应用中，常见的策略是先用开环规划到达预抓取姿态附近，然后切换到视觉伺服模式进行最后的精确对齐，这样结合了两种方法的优点，既保证了全局路径规划的效率，又实现了局部的高精度控制。

### Q4: 在控制真实机械臂时，仿真中运行良好的轨迹可能在实际执行中出现问题。这种"sim-to-real gap"的主要原因是什么？如何缩小这个差距？

**答**：仿真到现实的差距（sim-to-real gap）是机器人学中的经典问题，在机械臂控制中尤为明显。主要原因包括物理建模的简化、动力学参数的不准确、执行器响应特性的差异以及环境交互的复杂性。仿真中通常假设关节是理想的，没有摩擦、间隙和柔性，但真实机械臂存在齿轮间隙、轴承摩擦、连杆弹性变形等非理想因素。动力学参数如质量、惯性张量、摩擦系数很难精确测量，URDF中的值往往是近似的。此外，仿真器的时间步长、数值积分方法、碰撞检测算法都会引入误差。

控制器层面的差异也很显著。仿真中的控制器通常假设完美的状态反馈和瞬时响应，但真实系统存在传感器噪声、通信延迟、执行器带宽限制。例如，一个在仿真中以1kHz运行的控制器，在实际硬件上可能只能达到100Hz，这会影响轨迹跟踪精度。力控制和接触任务的差距更大，因为接触动力学（刚度、阻尼、摩擦）极难精确建模，仿真中的稳定抓取在现实中可能滑脱。

缩小sim-to-real gap需要多方面努力。首先是提高模型精度，通过系统辨识技术测量真实的动力学参数，使用更精细的碰撞网格，在URDF中添加摩擦和阻尼参数。其次是使用更真实的仿真器，如Gazebo的物理引擎可以配置更高的求解精度，或者使用专业的动力学仿真软件如MuJoCo、PyBullet。第三是在仿真中引入随机化（domain randomization），对物理参数、传感器噪声、环境条件添加随机扰动，训练出的控制策略会更鲁棒。第四是采用渐进式部署策略：先在仿真中验证基本功能，然后在真实机械臂上以低速、小幅度运动测试，逐步增加速度和复杂度。最后，使用闭环控制和传感器反馈来补偿模型误差，例如力/力矩传感器可以检测意外碰撞，视觉反馈可以修正位置偏差，这些在实际系统中比开环控制更可靠。

### Q5: 对于需要高精度操作的任务（如装配、精密抓取），除了运动规划，还需要考虑哪些关键技术？如何在ROS 2中实现力控制？

**答**：高精度操作任务对机械臂系统提出了超越基本运动规划的要求。首先是力/力矩控制，因为纯位置控制在接触任务中容易产生过大的接触力，导致物体损坏或抓取失败。力控制包括阻抗控制（Impedance Control）和混合力/位置控制。阻抗控制将机械臂建模为质量-弹簧-阻尼系统，通过调整虚拟刚度和阻尼来控制与环境的交互特性，适合装配、打磨等任务。混合控制则在不同方向上分别进行力控制和位置控制，例如在插入任务中，垂直方向用力控制保持恒定压力，水平方向用位置控制对齐。

精确的标定是高精度操作的基础，包括机械臂的运动学标定（修正DH参数误差）、手眼标定（确定相机与末端执行器的相对位姿）和工具标定（确定夹爪或工具的TCP位置）。即使是毫米级的标定误差，在长臂展机械臂上也会被放大为厘米级的末端误差。传感器融合也很重要，结合关节编码器、力/力矩传感器、视觉、触觉传感器的信息，可以实现更鲁棒的控制。例如，在精密装配中，力传感器检测接触，视觉提供粗定位，触觉传感器确认插入完成。

在ROS 2中实现力控制有几种途径。如果机械臂控制器支持，可以使用ros2_control框架的力矩控制接口（effort_controllers），直接发送关节力矩命令。对于不支持力矩控制的机械臂，可以在外部实现力控制算法：读取力/力矩传感器数据，计算期望的位置或速度修正量，通过位置或速度接口发送给控制器，形成外环力控制。MoveIt 2的Servo功能支持实时轨迹修正，可以结合传感器反馈实现闭环控制。对于需要高频控制的场景（>500Hz），可能需要使用实时操作系统（如RT-PREEMPT补丁的Linux）和实时通信协议（如EtherCAT）。

实际实现时，还需要注意安全性。力控制任务中，机械臂会主动施加力，必须设置力限制和碰撞检测，防止意外情况下的过载。可以使用MoveIt的碰撞检测功能，结合力传感器的阈值监控，一旦检测到异常立即停止运动。对于学习型方法（如强化学习），建议先在仿真中训练，然后在真实系统上进行有监督的微调，逐步放宽安全约束。高精度操作往往需要多次尝试和参数调优，记录每次执行的传感器数据和结果，进行离线分析和改进，是提高成功率的有效方法。
