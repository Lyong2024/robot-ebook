# 资源链接更新说明

本文档记录了电子书中需要更新的外部资源链接，以及推荐的替代资源。

**最后验证日期**：2026年5月31日

---

## 📋 需要立即更新的链接

### 1. SLAM相关资源

#### Cartographer（已弃用）

**原链接**：
- `https://github.com/cartographer-project/cartographer`
- 状态：2025年1月已弃用

**推荐替代方案**：

**方案A：SLAM Toolbox（推荐）**
```markdown
- GitHub: https://github.com/SteveMacenski/slam_toolbox
- Stars: 2.5k+
- 状态：活跃维护
- 优点：专为ROS 2设计，性能优秀，易于使用
- 适用场景：2D SLAM，室内导航
```

**方案B：Cartographer ROS 2（有限维护）**
```markdown
- GitHub: https://github.com/ros2/cartographer_ros
- 状态：有限维护
- 优点：经典算法，文档完善
- 缺点：更新较慢
```

**修改位置**：第13章 SLAM与地图构建

---

### 2. Gazebo仿真

#### gazebo_ros_pkgs（已弃用）

**原链接**：
- `https://github.com/ros-simulation/gazebo_ros_pkgs`
- 状态：2025年1月弃用（Gazebo Classic停止维护）

**推荐替代方案**：

**新版Gazebo（原Ignition Gazebo）**
```markdown
- 官网: https://gazebosim.org/
- 文档: https://gazebosim.org/docs
- ROS 2集成: https://github.com/gazebosim/ros_gz
- 优点：现代化架构，更好的性能，持续维护
- 注意：API与Gazebo Classic不兼容，需要迁移
```

**修改位置**：第10章 仿真环境

---

### 3. ROSbot描述文件

#### husarion/rosbot_description（已归档）

**原链接**：
- `https://github.com/husarion/rosbot_description`
- 状态：2022年6月归档

**推荐替代方案**：
```markdown
- 新仓库: https://github.com/husarion/rosbot_ros
- 状态：活跃维护
- 包含：完整的ROS 2支持，更新的URDF模型
```

**修改位置**：第18章 综合项目

---

### 4. 社区论坛

#### ROS Discourse（已重定向）

**原链接**：
- `https://discourse.ros.org/`
- 状态：301重定向

**新链接**：
```markdown
- https://discourse.openrobotics.org/
- 说明：ROS社区论坛已迁移到Open Robotics
```

**修改位置**：附录D 社区资源

---

### 5. TurtleBot3文档

#### TurtleBot3 e-Manual（404错误）

**原链接**：
- `https://emanual.robotis.com/docs/en/platform/turtlebot3/`
- 状态：404错误

**推荐替代方案**：
```markdown
- 官网: https://turtlebot3.robotis.com/
- 主文档: https://emanual.robotis.com/
- GitHub: https://github.com/ROBOTIS-GIT/turtlebot3
- 说明：文档结构已重组，建议使用官网
```

**修改位置**：第10章、第18章

---

### 6. Navigation2文档

#### navigation.ros.org（连接被拒绝）

**原链接**：
- `https://navigation.ros.org/`
- 状态：无法访问

**新链接**：
```markdown
- https://docs.nav2.org/
- 说明：Nav2文档已迁移到新域名
```

**修改位置**：第14章 导航系统

---

### 7. MoveIt文档

#### moveit.picknik.ai（无法访问）

**原链接**：
- `https://moveit.picknik.ai/`
- 状态：无法访问

**推荐替代方案**：
```markdown
- 官网: https://moveit.ros.org/
- 文档: https://moveit.picknik.ai/main/index.html（如果可访问）
- GitHub文档: https://github.com/moveit/moveit2/tree/main/moveit_docs
- 教程: https://moveit.picknik.ai/main/doc/tutorials/tutorials.html
```

**修改位置**：第15章 机械臂控制

---

### 8. Linux学习资源

#### Linux Journey（已迁移）

**原链接**：
- `https://linuxjourney.com/`
- 状态：301重定向到labex.io，但返回403

**推荐替代方案**：
```markdown
- Linux Command: https://linuxcommand.org/
- The Linux Documentation Project: https://tldp.org/
- Ubuntu官方教程: https://ubuntu.com/tutorials
```

**修改位置**：第7章 Linux基础

---

## 🆕 建议补充的优质资源

### ROS 2学习资源

```markdown
**官方资源**
- ROS 2 Humble文档: https://docs.ros.org/en/humble/
- ROS 2设计文档: https://design.ros2.org/
- ROS 2示例代码: https://github.com/ros2/examples

**社区教程**
- The Robotics Back-End: https://roboticsbackend.com/
- The Construct: https://theconstructsim.com/
- Articulated Robotics (YouTube): 搜索"Articulated Robotics ROS 2"

**中文资源**
- ROS 2中文教程: https://fishros.com/
- 古月居: https://www.guyuehome.com/
```

**建议添加位置**：第9章 ROS 2基础

---

### 具身智能与前沿项目

```markdown
**开源项目**
- Open X-Embodiment: https://robotics-transformer-x.github.io/
- OpenVLA: https://github.com/openvla/openvla
- Octo: https://github.com/octo-models/octo
- Mobile ALOHA: https://mobile-aloha.github.io/
- LeRobot: https://github.com/huggingface/lerobot

**论文与博客**
- Google DeepMind Blog: https://deepmind.google/discover/blog/
- Physical Intelligence: https://www.physicalintelligence.company/
- arXiv机器人分类: https://arxiv.org/list/cs.RO/recent
```

**建议添加位置**：第16章 具身智能

---

### 硬件平台

```markdown
**开发板**
- Raspberry Pi官方文档: https://www.raspberrypi.com/documentation/
- Jetson Nano开发者套件: https://developer.nvidia.com/embedded/jetson-nano-developer-kit
- ESP32官方文档: https://docs.espressif.com/

**机器人平台**
- TurtleBot3: https://turtlebot3.robotis.com/
- OpenManipulator: https://emanual.robotis.com/docs/en/platform/openmanipulator_x/
- ROSbot: https://husarion.com/manuals/rosbot/

**硬件供应商**
- Adafruit: https://www.adafruit.com/
- SparkFun: https://www.sparkfun.com/
- DFRobot: https://www.dfrobot.com/
```

**建议添加位置**：第4-6章 硬件基础

---

### 仿真工具

```markdown
**开源仿真器**
- Gazebo (新版): https://gazebosim.org/
- Webots: https://cyberbotics.com/
- CoppeliaSim: https://www.coppeliarobotics.com/
- MuJoCo: https://mujoco.org/

**商业仿真器**
- NVIDIA Isaac Sim: https://developer.nvidia.com/isaac-sim
- MATLAB Robotics Toolbox: https://www.mathworks.com/products/robotics.html
```

**建议添加位置**：第10章 仿真环境

---

### 计算机视觉

```markdown
**学习资源**
- OpenCV官方教程: https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html
- PyImageSearch: https://pyimagesearch.com/
- Roboflow: https://roboflow.com/

**预训练模型**
- Ultralytics YOLOv8: https://github.com/ultralytics/ultralytics
- Hugging Face Transformers: https://huggingface.co/models
- TensorFlow Model Garden: https://github.com/tensorflow/models
```

**建议添加位置**：第12章 计算机视觉

---

### 社区与论坛

```markdown
**英文社区**
- ROS Discourse: https://discourse.openrobotics.org/
- ROS Answers: https://answers.ros.org/
- Reddit r/robotics: https://www.reddit.com/r/robotics/
- Stack Overflow (ros标签): https://stackoverflow.com/questions/tagged/ros

**中文社区**
- 古月居论坛: https://www.guyuehome.com/
- ROS中国: http://www.ros.org.cn/
- 知乎机器人话题: https://www.zhihu.com/topic/19559424
- CSDN机器人专栏: 搜索"ROS"或"机器人"
```

**建议添加位置**：附录D 社区资源

---

### 在线课程

```markdown
**MOOC平台**
- Coursera - 机器人专项课程 (宾夕法尼亚大学)
- edX - 机器人课程 (MIT, Columbia)
- Udacity - 机器人软件工程师纳米学位
- The Construct - ROS在线学习平台

**视频教程**
- YouTube频道:
  - Articulated Robotics
  - The Construct
  - Robotics Back-End
  - MATLAB
- B站UP主:
  - 古月居
  - 鱼香ROS
  - 机器人学家
```

**建议添加位置**：附录D 学习资源

---

## 📊 资源质量评级

### ⭐⭐⭐⭐⭐ 强烈推荐（新手友好）

- **TurtleBot3官方教程** - 完整的机器人学习路径
- **LeRobot (Hugging Face)** - 开箱即用的机器人学习平台
- **Arduino官方文档** - 硬件入门首选
- **ROS 2 Humble教程** - 官方LTS版本
- **The Construct** - 在线ROS学习平台

### ⭐⭐⭐⭐ 推荐（需要一定基础）

- **MoveIt 2** - 机械臂运动规划
- **Nav2** - 移动机器人导航
- **SLAM Toolbox** - 2D SLAM
- **OpenCV** - 计算机视觉
- **Octo** - 开源机器人策略模型

### ⭐⭐⭐ 进阶（需要较强基础）

- **RT-2论文** - 视觉-语言-动作模型
- **Open X-Embodiment** - 大规模机器人数据集
- **Cartographer** - 复杂SLAM算法
- **Isaac Sim** - 高级仿真

---

## 🔄 维护建议

### 定期检查（每6个月）

1. **验证所有外部链接**
   - 使用自动化工具检查HTTP状态码
   - 确认GitHub仓库仍在维护
   - 检查文档网站是否可访问

2. **更新版本信息**
   - ROS 2发行版（当前推荐：Humble）
   - Python版本（当前：3.10+）
   - Ubuntu版本（当前：22.04）
   - 主要库的版本号

3. **补充新资源**
   - 关注机器人领域的新项目
   - 添加优质的中文资源
   - 更新前沿技术章节

### 资源评估标准

**保留资源的条件**：
- ✅ 最近6个月内有更新
- ✅ GitHub stars > 100（或官方项目）
- ✅ 文档完善，有示例代码
- ✅ 社区活跃，有问题能得到回答

**移除资源的条件**：
- ❌ 超过2年未更新
- ❌ 项目已归档或弃用
- ❌ 链接长期无法访问
- ❌ 有更好的替代方案

---

## 📝 修改清单

### 第4章：Arduino与ESP32
- [ ] 补充ESP32官方文档链接
- [ ] 补充PlatformIO IDE链接

### 第7章：Linux基础
- [x] 更新Linux Journey链接（或提供替代）
- [ ] 补充Linux Command链接

### 第9章：ROS 2基础
- [ ] 补充ROS 2设计文档
- [ ] 补充中文教程资源
- [ ] 补充视频教程链接

### 第10章：仿真环境
- [x] 更新Gazebo相关链接（Classic → 新版）
- [x] 更新gazebo_ros_pkgs链接
- [ ] 补充Webots、MuJoCo链接

### 第12章：计算机视觉
- [ ] 补充PyImageSearch链接
- [ ] 补充Roboflow链接

### 第13章：SLAM
- [x] 更新Cartographer链接（→ SLAM Toolbox）
- [ ] 补充SLAM算法对比

### 第14章：导航系统
- [x] 更新Navigation2文档链接
- [ ] 补充Nav2教程资源

### 第15章：机械臂控制
- [x] 更新MoveIt文档链接
- [ ] 补充OpenManipulator链接

### 第16章：具身智能
- [x] 补充π0相关内容
- [x] 扩展OpenVLA内容
- [ ] 补充Open X-Embodiment链接
- [ ] 补充Mobile ALOHA链接

### 第18章：综合项目
- [x] 更新ROSbot链接
- [x] 更新TurtleBot3文档链接

### 附录D：社区资源
- [x] 更新ROS Discourse链接
- [ ] 补充中文社区资源
- [ ] 补充视频教程频道
- [ ] 补充在线课程平台

---

## 🌐 中文资源补充

考虑到中文读者的需求，建议补充以下中文资源：

### 学习网站
- 鱼香ROS：https://fishros.com/
- 古月居：https://www.guyuehome.com/
- ROS中国：http://www.ros.org.cn/

### 视频教程
- B站UP主：古月居、鱼香ROS、机器人学家
- 网易云课堂：ROS机器人开发实践

### 社区论坛
- 知乎机器人话题
- CSDN机器人专栏
- 古月居论坛

### 书籍推荐
- 《ROS机器人开发实践》- 胡春旭
- 《机器人操作系统（ROS）浅析》- 古月
- 《Python机器人编程》- 中文版

---

**最后更新**：2026年5月31日  
**下次检查**：2026年11月30日
