# 第11章：导航与路径规划

## 学习目标

- 理解机器人导航的基本概念
- 掌握 ROS 2 Navigation2 框架
- 学会使用 SLAM 建图
- 理解路径规划算法
- 能够配置和调优导航参数
- 实现自主导航功能

## 11.1 导航系统概览

### 导航流程

```
1. 建图（SLAM）
   ↓
2. 定位（Localization）
   ↓
3. 路径规划（Path Planning）
   ↓
4. 运动控制（Motion Control）
   ↓
5. 避障（Obstacle Avoidance）
```

### Navigation2 架构

```
┌─────────────────────────────────────┐
│         Navigation2 Stack           │
├─────────────────────────────────────┤
│  Behavior Trees (行为树)             │
├─────────────────────────────────────┤
│  Planner Server (全局规划器)         │
│  Controller Server (局部控制器)      │
│  Recovery Server (恢复行为)          │
├─────────────────────────────────────┤
│  Costmap 2D (代价地图)               │
├─────────────────────────────────────┤
│  AMCL (定位) / SLAM Toolbox (建图)  │
└─────────────────────────────────────┘
```

## 11.2 SLAM 建图

SLAM（Simultaneous Localization and Mapping）同时定位与建图。

### 安装 SLAM Toolbox

```bash
sudo apt install ros-humble-slam-toolbox
```

### 配置文件（slam_toolbox.yaml）

```yaml
slam_toolbox:
  ros__parameters:
    # 基本参数
    odom_frame: odom
    map_frame: map
    base_frame: base_link
    scan_topic: /scan
    
    # SLAM 模式
    mode: mapping  # mapping 或 localization
    
    # 分辨率
    resolution: 0.05  # 5cm
    
    # 更新频率
    map_update_interval: 5.0
    
    # 传感器参数
    minimum_travel_distance: 0.5  # 移动 0.5m 才更新
    minimum_travel_heading: 0.5   # 旋转 0.5rad 才更新
    
    # 扫描匹配
    scan_buffer_size: 10
    scan_buffer_maximum_scan_distance: 10.0
    
    # 回环检测
    do_loop_closing: true
    loop_search_maximum_distance: 3.0
```

### 运行 SLAM

**启动机器人**：

```bash
# 启动激光雷达
ros2 run rplidar_ros rplidar_node

# 启动底盘控制
ros2 run my_robot base_controller
```

**启动 SLAM**：

```bash
ros2 launch slam_toolbox online_async_launch.py \
  params_file:=slam_toolbox.yaml \
  use_sim_time:=false
```

**启动 RViz**：

```bash
ros2 run rviz2 rviz2
```

**RViz 配置**：
- 添加 Map 显示（话题：/map）
- 添加 LaserScan 显示（话题：/scan）
- 添加 TF 显示
- 固定坐标系：map

**手动驾驶建图**：

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

**保存地图**：

```bash
ros2 service call /slam_toolbox/save_map slam_toolbox/srv/SaveMap \
  "{name: {data: 'my_map'}}"
```

地图会保存为两个文件：
- `my_map.pgm`：图像文件
- `my_map.yaml`：元数据

### 地图文件格式

**my_map.yaml**：

```yaml
image: my_map.pgm
resolution: 0.05
origin: [-10.0, -10.0, 0.0]
negate: 0
occupied_thresh: 0.65
free_thresh: 0.196
```

**地图值**：
- 0：自由空间（白色）
- 100：占据空间（黑色）
- -1：未知空间（灰色）

## 11.3 定位（AMCL）

AMCL（Adaptive Monte Carlo Localization）是基于粒子滤波的定位算法。

### 安装

```bash
sudo apt install ros-humble-navigation2 ros-humble-nav2-bringup
```

### 配置文件（amcl.yaml）

```yaml
amcl:
  ros__parameters:
    # 坐标系
    odom_frame_id: odom
    base_frame_id: base_link
    global_frame_id: map
    
    # 粒子滤波器
    min_particles: 500
    max_particles: 2000
    
    # 更新阈值
    update_min_d: 0.2  # 移动 0.2m 才更新
    update_min_a: 0.5  # 旋转 0.5rad 才更新
    
    # 激光模型
    laser_model_type: likelihood_field
    laser_likelihood_max_dist: 2.0
    
    # 里程计模型
    odom_model_type: diff
    odom_alpha1: 0.2  # 旋转噪声（旋转部分）
    odom_alpha2: 0.2  # 旋转噪声（平移部分）
    odom_alpha3: 0.2  # 平移噪声（平移部分）
    odom_alpha4: 0.2  # 平移噪声（旋转部分）
```

### 运行定位

```bash
ros2 run nav2_map_server map_server --ros-args \
  -p yaml_filename:=my_map.yaml

ros2 run nav2_amcl amcl --ros-args \
  --params-file amcl.yaml
```

### 设置初始位姿

在 RViz 中：
1. 点击 "2D Pose Estimate"
2. 在地图上点击机器人的大致位置
3. 拖动设置方向

或使用命令：

```bash
ros2 topic pub /initialpose geometry_msgs/msg/PoseWithCovarianceStamped \
  "{header: {frame_id: 'map'}, 
    pose: {pose: {position: {x: 0.0, y: 0.0, z: 0.0}, 
                  orientation: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}}}}"
```

## 11.4 Navigation2 导航

### 完整启动文件

创建 `nav2_bringup.launch.py`：

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    nav2_bringup_dir = get_package_share_directory('nav2_bringup')
    
    # 参数文件
    params_file = os.path.join(
        get_package_share_directory('my_robot'),
        'config',
        'nav2_params.yaml'
    )
    
    # 地图文件
    map_file = os.path.join(
        get_package_share_directory('my_robot'),
        'maps',
        'my_map.yaml'
    )
    
    return LaunchDescription([
        # 地图服务器
        Node(
            package='nav2_map_server',
            executable='map_server',
            name='map_server',
            output='screen',
            parameters=[{'yaml_filename': map_file}]
        ),
        
        # AMCL 定位
        Node(
            package='nav2_amcl',
            executable='amcl',
            name='amcl',
            output='screen',
            parameters=[params_file]
        ),
        
        # Navigation2
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(
                os.path.join(nav2_bringup_dir, 'launch', 'navigation_launch.py')
            ),
            launch_arguments={
                'params_file': params_file,
                'use_sim_time': 'false'
            }.items()
        ),
        
        # 生命周期管理器
        Node(
            package='nav2_lifecycle_manager',
            executable='lifecycle_manager',
            name='lifecycle_manager_navigation',
            output='screen',
            parameters=[{
                'autostart': True,
                'node_names': [
                    'map_server',
                    'amcl',
                    'controller_server',
                    'planner_server',
                    'recoveries_server',
                    'bt_navigator'
                ]
            }]
        )
    ])
```

### Navigation2 参数配置

创建 `nav2_params.yaml`（简化版）：

```yaml
bt_navigator:
  ros__parameters:
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    default_bt_xml_filename: navigate_w_replanning_and_recovery.xml

controller_server:
  ros__parameters:
    controller_frequency: 20.0
    FollowPath:
      plugin: "dwb_core::DWBLocalPlanner"
      min_vel_x: 0.0
      max_vel_x: 0.5
      min_vel_y: 0.0
      max_vel_y: 0.0
      max_vel_theta: 1.0
      min_speed_xy: 0.0
      max_speed_xy: 0.5
      acc_lim_x: 2.5
      acc_lim_y: 0.0
      acc_lim_theta: 3.2
      decel_lim_x: -2.5
      decel_lim_y: 0.0
      decel_lim_theta: -3.2

planner_server:
  ros__parameters:
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner/NavfnPlanner"
      tolerance: 0.5
      use_astar: false

local_costmap:
  local_costmap:
    ros__parameters:
      global_frame: odom
      robot_base_frame: base_link
      update_frequency: 5.0
      publish_frequency: 2.0
      width: 3
      height: 3
      resolution: 0.05
      robot_radius: 0.2
      plugins: ["obstacle_layer", "inflation_layer"]
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: true
          marking: true
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        inflation_radius: 0.5

global_costmap:
  global_costmap:
    ros__parameters:
      global_frame: map
      robot_base_frame: base_link
      update_frequency: 1.0
      publish_frequency: 1.0
      resolution: 0.05
      robot_radius: 0.2
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: true
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: true
          marking: true
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        inflation_radius: 0.5
```

### 运行导航

```bash
ros2 launch my_robot nav2_bringup.launch.py
```

### 发送导航目标

**在 RViz 中**：
1. 点击 "2D Goal Pose"
2. 在地图上点击目标位置
3. 拖动设置方向

**使用命令**：

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator

class NavigationClient(Node):
    def __init__(self):
        super().__init__('navigation_client')
        self.navigator = BasicNavigator()
        
        # 等待导航系统准备好
        self.navigator.waitUntilNav2Active()
        
        self.get_logger().info('Navigation system ready')
    
    def go_to_pose(self, x, y, yaw):
        goal_pose = PoseStamped()
        goal_pose.header.frame_id = 'map'
        goal_pose.header.stamp = self.navigator.get_clock().now().to_msg()
        goal_pose.pose.position.x = x
        goal_pose.pose.position.y = y
        goal_pose.pose.position.z = 0.0
        
        # 将 yaw 转换为四元数
        goal_pose.pose.orientation.z = np.sin(yaw / 2)
        goal_pose.pose.orientation.w = np.cos(yaw / 2)
        
        self.navigator.goToPose(goal_pose)
        
        # 等待完成
        while not self.navigator.isTaskComplete():
            feedback = self.navigator.getFeedback()
            if feedback:
                self.get_logger().info(
                    f'Distance remaining: {feedback.distance_remaining:.2f}m'
                )
        
        result = self.navigator.getResult()
        if result == TaskResult.SUCCEEDED:
            self.get_logger().info('Goal reached!')
        else:
            self.get_logger().warn('Goal failed!')

def main():
    rclpy.init()
    client = NavigationClient()
    
    # 导航到目标点
    client.go_to_pose(2.0, 1.0, 0.0)
    
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 11.5 路径规划算法

### Dijkstra 算法

最短路径算法，保证找到最优解。

```python
import heapq

def dijkstra(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    distances = {start: 0}
    previous = {}
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current == goal:
            break
        
        if current_dist > distances.get(current, float('inf')):
            continue
        
        # 检查四个方向
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)
            
            if (0 <= neighbor[0] < rows and 
                0 <= neighbor[1] < cols and 
                grid[neighbor[0]][neighbor[1]] == 0):
                
                distance = current_dist + 1
                
                if distance < distances.get(neighbor, float('inf')):
                    distances[neighbor] = distance
                    previous[neighbor] = current
                    heapq.heappush(pq, (distance, neighbor))
    
    # 重建路径
    path = []
    current = goal
    while current in previous:
        path.append(current)
        current = previous[current]
    path.append(start)
    path.reverse()
    
    return path
```

### A* 算法

使用启发式函数加速搜索。

```python
def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    previous = {}
    pq = [(f_score[start], start)]
    
    while pq:
        _, current = heapq.heappop(pq)
        
        if current == goal:
            break
        
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)
            
            if (0 <= neighbor[0] < rows and 
                0 <= neighbor[1] < cols and 
                grid[neighbor[0]][neighbor[1]] == 0):
                
                tentative_g = g_score[current] + 1
                
                if tentative_g < g_score.get(neighbor, float('inf')):
                    previous[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(pq, (f_score[neighbor], neighbor))
    
    # 重建路径
    path = []
    current = goal
    while current in previous:
        path.append(current)
        current = previous[current]
    path.append(start)
    path.reverse()
    
    return path
```

### RRT（快速随机树）

适合高维空间和复杂环境。

```python
import numpy as np

class RRT:
    def __init__(self, start, goal, obstacles, bounds, step_size=0.5):
        self.start = np.array(start)
        self.goal = np.array(goal)
        self.obstacles = obstacles
        self.bounds = bounds
        self.step_size = step_size
        self.tree = {tuple(start): None}
    
    def sample(self):
        # 10% 概率采样目标点
        if np.random.random() < 0.1:
            return self.goal
        else:
            return np.array([
                np.random.uniform(self.bounds[0][0], self.bounds[0][1]),
                np.random.uniform(self.bounds[1][0], self.bounds[1][1])
            ])
    
    def nearest(self, point):
        min_dist = float('inf')
        nearest_node = None
        for node in self.tree.keys():
            dist = np.linalg.norm(np.array(node) - point)
            if dist < min_dist:
                min_dist = dist
                nearest_node = node
        return np.array(nearest_node)
    
    def steer(self, from_node, to_point):
        direction = to_point - from_node
        distance = np.linalg.norm(direction)
        if distance < self.step_size:
            return to_point
        else:
            return from_node + direction / distance * self.step_size
    
    def is_collision_free(self, from_node, to_node):
        # 简化：检查终点是否在障碍物中
        for obs in self.obstacles:
            if np.linalg.norm(to_node - obs['center']) < obs['radius']:
                return False
        return True
    
    def plan(self, max_iterations=1000):
        for i in range(max_iterations):
            # 采样
            random_point = self.sample()
            
            # 找最近节点
            nearest_node = self.nearest(random_point)
            
            # 扩展
            new_node = self.steer(nearest_node, random_point)
            
            # 碰撞检测
            if self.is_collision_free(nearest_node, new_node):
                self.tree[tuple(new_node)] = tuple(nearest_node)
                
                # 检查是否到达目标
                if np.linalg.norm(new_node - self.goal) < self.step_size:
                    self.tree[tuple(self.goal)] = tuple(new_node)
                    return self.extract_path()
        
        return None
    
    def extract_path(self):
        path = [self.goal]
        current = tuple(self.goal)
        while current is not None:
            path.append(np.array(current))
            current = self.tree[current]
        path.reverse()
        return path
```

## 11.6 调优技巧

### 代价地图调优

**膨胀半径**：
- 太小：机器人会撞到障碍物
- 太大：机器人无法通过狭窄通道
- 推荐：机器人半径 + 安全余量（5-10cm）

**更新频率**：
- 局部代价地图：5-10 Hz
- 全局代价地图：1 Hz

### 控制器调优

**速度限制**：
- 根据机器人性能设置
- 留有余量（80% 最大速度）

**加速度限制**：
- 太大：不平稳
- 太小：反应慢
- 推荐：实测最大加速度的 70%

### AMCL 调优

**粒子数量**：
- 太少：定位不准
- 太多：计算慢
- 推荐：500-2000

**更新阈值**：
- 太小：频繁更新，计算量大
- 太大：定位延迟
- 推荐：移动 0.2m 或旋转 0.5rad

## 本章小结

在本章中，我们学习了：

- 机器人导航系统的整体架构
- 使用 SLAM Toolbox 建图
- 使用 AMCL 定位
- Navigation2 框架的配置和使用
- 常见路径规划算法
- 导航参数调优

导航是移动机器人的核心功能，掌握导航系统将让你的机器人真正"智能"起来。

## 学习目标复查

理解机器人导航系统的完整流程(建图、定位、路径规划、运动控制、避障)和Navigation2架构的各个组件
能够使用SLAM Toolbox进行环境建图,包括配置参数、手动驾驶建图、保存地图文件,并理解地图文件格式(pgm/yaml)
掌握AMCL定位算法的配置和使用,能够设置初始位姿并理解粒子滤波器的关键参数
能够配置和启动完整的Navigation2导航系统,包括地图服务器、定位、规划器、控制器和代价地图
理解并能实现常见路径规划算法(Dijkstra、A*、RRT)的基本原理和代码实现
掌握导航参数调优技巧,包括代价地图的膨胀半径、更新频率、控制器速度限制和AMCL粒子数量的合理设置
能够编写Python程序使用nav2_simple_commander发送导航目标,实现单点导航和多点巡航功能

## 问答环节

**Q1: 什么是SLAM？请解释SLAM在机器人导航中的作用，并说明SLAM Toolbox中minimum_travel_distance和minimum_travel_heading参数的含义和作用。**

A: SLAM是Simultaneous Localization and Mapping（同时定位与建图）的缩写。它是机器人导航的第一步，允许机器人在未知环境中同时构建地图并确定自己的位置。

在导航流程中，SLAM处于最开始的建图阶段，为后续的定位、路径规划和运动控制提供环境地图基础。

SLAM Toolbox的关键参数：
- minimum_travel_distance: 0.5 表示机器人需要移动0.5米才会触发地图更新。这个参数防止机器人静止或微小移动时频繁更新地图，减少计算负担。
- minimum_travel_heading: 0.5 表示机器人需要旋转0.5弧度（约28.6度）才会触发地图更新。同样用于避免不必要的更新。

这两个参数需要平衡：设置太小会导致计算量过大，设置太大会导致地图更新不及时，影响建图质量。推荐值根据机器人速度和环境复杂度调整。

**Q2: Navigation2的代价地图（Costmap）分为局部代价地图和全局代价地图，请说明两者的区别、各自的作用，以及如何合理设置膨胀半径（inflation_radius）？**

A: 局部代价地图（Local Costmap）和全局代价地图（Global Costmap）的区别：

**局部代价地图**：
- 坐标系：odom（里程计坐标系）
- 范围：较小（如3m×3m），以机器人为中心
- 更新频率：较高（5-10 Hz）
- 作用：实时避障，用于局部路径规划和动态障碍物检测

**全局代价地图**：
- 坐标系：map（地图坐标系）
- 范围：整个已知地图
- 更新频率：较低（1 Hz）
- 作用：全局路径规划，包含静态地图层

**膨胀半径设置原则**：
膨胀半径决定了障碍物周围的"危险区域"大小。合理设置方法：
- 推荐值 = 机器人半径 + 安全余量（5-10cm）
- 太小：机器人会撞到障碍物
- 太大：机器人无法通过狭窄通道，路径规划失败
- 示例：机器人半径0.2m，设置inflation_radius为0.5m（包含0.3m安全余量）

需要根据实际环境和机器人尺寸进行测试调整。

**Q3: 比较Dijkstra算法和A*算法在路径规划中的异同。为什么A*算法通常比Dijkstra更快？在什么情况下应该选择使用Dijkstra而不是A*？**

A: **相同点**：
- 都是基于图搜索的最短路径算法
- 都使用优先队列（堆）来选择下一个扩展的节点
- 都能保证找到最优路径（在启发式函数可接受的情况下）
- 都需要记录已访问节点和路径信息

**不同点**：
- Dijkstra使用实际距离g(n)作为优先级：f(n) = g(n)
- A*使用实际距离+启发式估计：f(n) = g(n) + h(n)
- A*有方向性，优先探索朝向目标的节点
- Dijkstra是无方向的，均匀向外扩展

**A*更快的原因**：
启发式函数h(n)（如曼哈顿距离或欧几里得距离）提供了到目标的估计距离，引导搜索朝目标方向进行，大大减少了需要探索的节点数量。Dijkstra相当于h(n)=0的A*，会探索所有方向。

**选择Dijkstra的情况**：
1. 需要计算从起点到所有点的最短路径（不是单一目标）
2. 难以设计有效的启发式函数
3. 环境高度动态，启发式函数可能误导
4. Navigation2中use_astar: false就是使用Dijkstra（NavfnPlanner）

**Q4: AMCL（自适应蒙特卡洛定位）使用粒子滤波进行定位。请解释粒子数量（min_particles和max_particles）如何影响定位性能，以及odom_alpha1到odom_alpha4这四个参数分别代表什么噪声？**

A: **粒子数量的影响**：

AMCL使用粒子（particles）来表示机器人可能的位姿假设。每个粒子代表一个可能的位置和方向。

- **min_particles（推荐500）**：最少粒子数
  - 太少：定位不准确，无法覆盖足够的假设空间
  - 适中：保证基本定位精度

- **max_particles（推荐2000）**：最多粒子数
  - 太多：计算负担重，实时性差
  - 适中：在不确定性高时提供更多假设

AMCL会根据定位置信度动态调整粒子数量，在min和max之间自适应。

**里程计噪声参数（odom_alpha）**：

这四个参数描述差分驱动机器人的里程计误差模型（推荐值都是0.2）：

- **odom_alpha1**：旋转运动中的旋转噪声 - 机器人旋转时，旋转角度的误差
- **odom_alpha2**：平移运动中的旋转噪声 - 机器人直线行驶时产生的意外旋转
- **odom_alpha3**：平移运动中的平移噪声 - 机器人直线行驶时，距离的误差
- **odom_alpha4**：旋转运动中的平移噪声 - 机器人旋转时产生的意外平移

这些参数需要根据实际机器人的里程计精度进行标定和调整。值越大表示噪声越大，定位算法会更依赖激光扫描而非里程计。

**Q5: 在实际使用Navigation2时，机器人导航失败的常见原因有哪些？请列举至少5个常见问题及其解决方法，并说明如何通过RViz进行调试。**

A: **常见导航失败原因及解决方法**：

1. **定位不准确**
   - 现象：机器人在地图上的位置与实际不符
   - 原因：初始位姿设置错误或AMCL粒子发散
   - 解决：在RViz中使用"2D Pose Estimate"重新设置初始位姿；增加AMCL粒子数量；检查激光雷达数据质量

2. **膨胀半径设置不当**
   - 现象：机器人无法通过明显可以通过的通道，或者规划失败
   - 原因：inflation_radius太大
   - 解决：减小膨胀半径到合理值（机器人半径+5-10cm）

3. **速度和加速度限制过于保守**
   - 现象：机器人移动非常缓慢或反应迟钝
   - 原因：max_vel_x、acc_lim_x等参数设置过小
   - 解决：根据机器人实际性能调整速度和加速度限制到最大值的70-80%

4. **代价地图更新频率不合适**
   - 现象：动态障碍物检测延迟或计算负担过重
   - 原因：update_frequency设置不当
   - 解决：局部代价地图5-10Hz，全局代价地图1Hz

5. **TF坐标变换缺失或延迟**
   - 现象：导航系统报错"Transform timeout"或"No transform available"
   - 原因：odom→base_link或map→odom的TF未发布或频率太低
   - 解决：检查TF树完整性，确保所有必需的坐标变换都在发布

6. **目标点在障碍物中或地图外**
   - 现象：规划器直接失败
   - 原因：目标位姿不可达
   - 解决：选择地图中的自由空间作为目标

**RViz调试方法**：
- 添加Map显示查看全局地图
- 添加Local Costmap和Global Costmap显示查看代价地图（检查膨胀是否合理）
- 添加Path显示查看规划的全局路径
- 添加Local Plan显示查看局部路径
- 添加LaserScan显示查看激光雷达数据
- 添加TF显示查看坐标系关系
- 添加PoseArray显示查看AMCL粒子分布（粒子集中表示定位置信度高）
- 观察机器人在地图上的位置是否与实际一致

## 推荐资源

- **Navigation2 文档**：https://navigation.ros.org/
- **SLAM Toolbox**：https://github.com/SteveMacenski/slam_toolbox
- **路径规划算法可视化**：https://qiao.github.io/PathFinding.js/visual/

## 动手练习

**练习 1：建图**

使用 SLAM Toolbox 为你的房间建图，保存地图文件。

**练习 2：自主导航**

配置 Navigation2，让机器人自主导航到指定位置。

**练习 3：多点巡航**

编写程序，让机器人依次访问多个目标点。

---

## 深度问答环节

### Q1: SLAM建图时，为什么有时地图会出现"重影"或"错位"现象？如何诊断和解决这个问题？

**答**：地图重影或错位通常是由于里程计漂移、传感器数据质量差或闭环检测失败导致的。当机器人长时间运行时，轮式里程计会累积误差，如果激光雷达数据匹配不够准确，SLAM算法就无法正确估计机器人的真实位置，导致同一区域被重复绘制在不同位置。这在长走廊、对称环境或特征稀疏的场景中尤为常见。

诊断这个问题的第一步是检查里程计数据质量。可以通过`ros2 topic echo /odom`观察里程计是否有异常跳变，或者使用`rviz2`可视化`/odom`和`/map`坐标系之间的TF变换，看是否有突然的大幅度变化。同时要检查激光雷达数据，确保扫描范围内有足够的特征点，没有大量的噪点或无效数据。

解决方法包括：1) 降低建图速度，让机器人移动更慢、转弯更平滑，给SLAM算法更多时间进行数据匹配；2) 调整SLAM参数，如Cartographer的`TRAJECTORY_BUILDER_2D.min_range`和`max_range`来过滤无效数据，或调整`POSE_GRAPH.constraint_builder.min_score`提高闭环检测的置信度阈值；3) 改善环境特征，在特征稀疏的区域添加一些标志物；4) 如果使用`slam_toolbox`，可以启用`interactive mode`手动修正错误的闭环。

对于已经出现错位的地图，可以使用`slam_toolbox`的交互式工具在RViz中手动调整位姿图，或者重新建图时采用更保守的参数设置。记住，高质量的地图是后续定位和导航的基础，值得花时间仔细调优。

### Q2: Navigation2中的代价地图（Costmap）有哪些层（layers）？它们各自的作用是什么？在实际应用中如何权衡配置？

**答**：Navigation2的代价地图通常包含四个核心层：静态层（Static Layer）、障碍物层（Obstacle Layer）、膨胀层（Inflation Layer）和体素层（Voxel Layer，可选）。静态层从SLAM生成的地图中读取静态障碍物信息，这些是环境中固定不变的墙壁、家具等；障碍物层处理传感器实时检测到的动态障碍物，如移动的人或物体；膨胀层在障碍物周围创建一个代价梯度，使路径规划器能够生成与障碍物保持安全距离的路径；体素层则在3D空间中跟踪障碍物，可以处理悬空障碍物或地面清理问题。

每一层都有关键参数需要调优。静态层相对简单，主要是确保地图正确加载；障碍物层的`observation_sources`定义了使用哪些传感器，`obstacle_range`和`raytrace_range`决定了障碍物的检测和清除距离，这两个参数需要根据传感器性能和环境特点设置——检测距离太短会导致反应不及时，太长则可能引入噪声；膨胀层的`inflation_radius`定义了安全边界的大小，`cost_scaling_factor`控制代价衰减速度，较大的膨胀半径更安全但会限制通过狭窄空间的能力。

在实际应用中需要权衡安全性和灵活性。对于在人群中工作的服务机器人，应该使用较大的`inflation_radius`（如0.5-0.8米）和较高的`cost_scaling_factor`（如10.0），确保与人保持足够距离；而对于需要通过狭窄门道的仓储机器人，可能需要较小的膨胀半径（如0.2-0.3米）但要提高障碍物层的更新频率。另一个常见问题是"局部代价地图"和"全局代价地图"的配置差异——全局代价地图用于长距离路径规划，可以更新较慢、范围更大；局部代价地图用于实时避障，需要更高的更新频率（如5-10Hz）和较小的范围（如机器人周围3-5米）。

调优技巧：在RViz中同时可视化`/global_costmap/costmap`和`/local_costmap/costmap`，观察代价值的分布是否合理；使用`ros2 param set`动态调整参数，无需重启导航栈；记录不同场景下的最优配置，为不同任务创建配置文件。

### Q3: 为什么机器人有时会在目标点附近"震荡"或"打转"而无法精确到达？这涉及哪些导航参数？

**答**：这个问题通常与局部路径规划器（如DWB或TEB）的参数配置不当有关，特别是目标容差、速度限制和控制器增益的设置。当机器人接近目标时，如果`xy_goal_tolerance`（位置容差）和`yaw_goal_tolerance`（角度容差）设置得过小，机器人会不断尝试微调姿态以满足严格的精度要求，但由于运动学约束、传感器噪声和控制延迟，实际上无法达到如此高的精度，导致反复震荡。同时，如果`min_vel_x`（最小线速度）设置过大，机器人无法以足够慢的速度接近目标，每次都会"冲过头"然后回退。

另一个常见原因是控制器的增益参数不匹配。DWB控制器使用多个评分函数来评估候选轨迹，如`PathAlign`（路径对齐）、`GoalAlign`（目标对齐）和`PathDist`（路径距离）。如果`GoalAlign`的权重过高而`PathDist`权重过低，机器人会过度关注最终朝向而忽略平滑接近，导致在目标附近频繁转向。此外，`sim_time`（轨迹模拟时间）如果设置过长，规划器会过度预测未来状态，在近距离时产生过度反应。

解决方案包括：1) 放宽目标容差，对于大多数应用，`xy_goal_tolerance: 0.1`（10厘米）和`yaw_goal_tolerance: 0.15`（约8.6度）是合理的起点；2) 降低最小速度限制，设置`min_vel_x: 0.0`或一个很小的值（如0.05），允许机器人以极慢速度接近目标；3) 调整控制器权重，增加`PathDist`的权重，减少`GoalAlign`的权重，使机器人优先平滑接近而非精确对齐；4) 在接近目标时降低`sim_time`，可以通过配置`approach_velocity_scaling: true`实现自适应调整。

还有一个高级技巧是使用"分阶段目标"策略：先导航到目标附近（较宽松的容差），然后切换到精确对齐模式（严格的容差和更慢的速度限制）。这可以通过在代码中发送两个连续的导航目标或使用Nav2的行为树（Behavior Tree）来实现。

### Q4: 在多层建筑或大型场景中，如何设计和实现多地图导航系统？有哪些技术挑战和解决方案？

**答**：多地图导航是机器人在复杂环境中应用的重要需求，涉及地图管理、地图切换、跨地图路径规划等多个技术挑战。最直接的方法是为每一层或每个区域创建独立的地图文件，然后通过一个上层管理系统根据机器人当前位置或任务需求动态加载相应的地图。Navigation2本身支持通过`map_server`的服务接口动态加载新地图，但需要在应用层实现地图切换逻辑。

第一个技术挑战是地图间的坐标系对齐。不同地图可能有不同的原点和坐标系，需要建立一个全局参考系（如建筑物坐标系）并记录每个地图相对于全局参考系的变换关系。可以在每个地图的元数据中存储这个变换（如在YAML文件中添加`origin_x`、`origin_y`、`origin_theta`字段），或者使用一个独立的配置文件管理所有地图的空间关系。当机器人跨地图移动时（如通过电梯），需要更新其在新地图中的初始位姿。

第二个挑战是跨地图路径规划。如果目标点在另一张地图上，需要先规划到"过渡点"（如电梯入口），然后切换地图，再规划到最终目标。这需要一个高层路径规划器，维护一个"地图拓扑图"，其中节点是地图，边是连接点（电梯、楼梯、门）。可以使用A*或Dijkstra算法在拓扑图上规划，然后在每个地图内使用Navigation2进行局部导航。一些开源项目如`multi_floor_navigation`提供了这类功能的参考实现。

第三个挑战是定位连续性。当切换地图时，AMCL需要重新初始化粒子滤波器，这可能导致短暂的定位不确定性。解决方案包括：1) 在过渡点使用高精度定位方法（如二维码、UWB标签）提供准确的初始位姿；2) 在地图重叠区域使用两个AMCL实例并行运行，平滑过渡；3) 使用IMU和里程计在地图切换期间维持位姿估计。

实现建议：创建一个`MapManager`节点负责地图加载和切换；创建一个`GlobalPlanner`节点处理跨地图路径规划；使用Nav2的行为树插件系统添加自定义行为（如`CrossMapNavigation`）；在数据库或配置文件中维护地图元数据和拓扑关系。对于大型场景，还可以考虑"地图分块"策略，将单层大地图分割成多个小地图，减少内存占用和计算负担。

### Q5: 对比全局路径规划算法（如A*、Dijkstra、RRT）和局部路径规划算法（如DWB、TEB），它们的适用场景和优缺点是什么？如何选择？

**答**：全局路径规划和局部路径规划在导航系统中扮演不同角色，解决不同层次的问题。全局路径规划器在已知的静态地图上计算从起点到终点的完整路径，关注的是路径的全局最优性（如最短距离或最小代价）；局部路径规划器则在机器人周围的局部区域内，根据实时传感器数据生成短期轨迹，关注的是动态避障和运动学约束。两者通常协同工作：全局规划器提供"导航方向"，局部规划器负责"实际驾驶"。

在全局规划算法中，A*和Dijkstra是基于图搜索的经典算法。Dijkstra保证找到最优路径但计算量大，因为它会探索所有方向；A*通过启发式函数（如欧几里得距离）引导搜索方向，大幅提高效率，是Navigation2默认使用的算法。它们的优点是路径平滑、可预测，适合结构化环境；缺点是对地图分辨率敏感，在高分辨率地图上计算慢，且难以处理动态障碍物。RRT（快速随机树）及其变体（如RRT*）是基于采样的算法，通过随机探索空间构建路径树，优点是在高维空间和复杂约束下表现好，不依赖地图分辨率；缺点是路径不够平滑，需要后处理，且每次运行结果可能不同。

在局部规划算法中，DWB（Dynamic Window Approach）是速度空间采样方法，在机器人当前速度附近采样多个速度组合，模拟短期轨迹并评分选择最优。它的优点是计算高效、参数直观、对差速驱动机器人效果好；缺点是在狭窄空间或需要复杂机动时表现一般，因为采样空间有限。TEB（Timed Elastic Band）是基于优化的方法，将轨迹表示为一系列时间戳的位姿点，通过优化目标函数（考虑路径长度、速度、加速度、障碍物距离等）生成轨迹。它的优点是能生成更平滑、更符合运动学约束的轨迹，适合全向移动或汽车式机器人；缺点是计算量较大，参数调优复杂，在动态环境中可能陷入局部最优。

选择建议：对于室内服务机器人（差速驱动、结构化环境），使用A*全局规划器+DWB局部规划器是经典组合，调优相对简单；对于室外或非结构化环境，可以考虑RRT*全局规划器处理复杂地形；对于需要高质量轨迹的应用（如汽车式机器人、狭窄空间操作），TEB局部规划器是更好选择，但要投入时间调优；对于计算资源受限的平台，优先选择DWB；对于研究或特殊需求，Navigation2的插件架构允许实现自定义规划器。实际项目中，建议先使用默认组合（A*+DWB）建立基线，然后根据具体问题逐步优化或替换组件。
