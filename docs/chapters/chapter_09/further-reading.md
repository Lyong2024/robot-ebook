# 第9章 拓展阅读

正文已拆到 [9.0 全景](./index.md) 至 [9.8 多机与真机话题](./08-dds-robot-interface.md)。下面保留原来整理的课程、社区和开源项目索引。官方教程以各子章节文末列出的 docs.ros.org 页面为准。

ROS 2是现代机器人开发的核心框架。为了帮助你深入掌握ROS 2，我们整理了官方文档、在线课程、开源项目、社区资源等多维度的学习资料。

### 📚 官方文档（必读）

#### ROS 2 Documentation
- **链接**: https://docs.ros.org/en/humble/
- **语言**: 英文
- **核心价值**: 这是ROS 2最权威的文档，涵盖安装、教程、API参考、设计文档等所有内容
- **推荐章节**:
  - Installation（安装指南）
  - Tutorials（官方教程）
  - Concepts（核心概念）
  - How-to Guides（实用指南）
- **为什么必读**: 所有ROS 2的特性和最佳实践都在这里，遇到问题首先查阅官方文档

#### ROS 2 Tutorials
- **链接**: https://docs.ros.org/en/humble/Tutorials.html
- **语言**: 英文
- **核心内容**:
  - Beginner: CLI tools（命令行工具）
  - Beginner: Client libraries（客户端库）
  - Intermediate（中级教程）
  - Advanced（高级教程）
- **学习路径**: 按顺序完成所有Beginner教程，然后根据需要学习Intermediate和Advanced

#### ROS 2 Design
- **链接**: https://design.ros2.org/
- **语言**: 英文
- **核心价值**: 深入了解ROS 2的设计理念和架构决策，理解"为什么这样设计"
- **推荐文章**:
  - "Why ROS 2?"
  - "DDS and ROS middleware implementations"
  - "ROS 2 Client Library API"

### 📖 经典书籍

#### 《Programming Robots with ROS》
- **作者**: Morgan Quigley, Brian Gerkey, William D. Smart
- **出版年份**: 2015年
- **语言**: 英文
- **适合人群**: ROS初学者
- **核心价值**: 虽然讲的是ROS 1，但核心概念（节点、话题、服务、TF等）在ROS 2中同样适用。这本书用通俗的语言和丰富的示例帮助读者理解ROS的设计哲学。
- **注意**: 代码示例是ROS 1的，需要转换到ROS 2

#### 《ROS Robotics Projects》
- **作者**: Lentin Joseph
- **出版年份**: 2017年第2版
- **语言**: 英文
- **适合人群**: 希望通过项目学习的开发者
- **核心价值**: 通过14个实战项目学习ROS，涵盖导航、视觉、语音等多个领域
- **推荐项目**:
  - 移动机器人导航
  - 机械臂控制
  - 计算机视觉应用

#### 《A Concise Introduction to Robot Programming with ROS2》
- **作者**: Francisco Martín Rico
- **出版年份**: 2022年
- **语言**: 英文
- **在线免费版**: https://github.com/fmrico/book_ros2
- **适合人群**: ROS 2初学者
- **核心价值**: 专门为ROS 2编写的入门书籍，内容简洁实用，有配套的GitHub代码仓库
- **推荐章节**:
  - Chapter 3: ROS 2 Basics
  - Chapter 4: ROS 2 Programming
  - Chapter 5: ROS 2 Tools

### 🎓 在线课程

#### ROS 2 For Beginners (Udemy)
- **讲师**: Edouard Renard
- **平台**: Udemy
- **时长**: 约17小时
- **费用**: 约¥79（经常打折）
- **语言**: 英文
- **评分**: 4.6/5.0（超过1万学习者）
- **核心内容**:
  - ROS 2基础概念
  - Python和C++客户端库
  - 实战项目
  - 调试技巧
- **为什么推荐**: 讲师经验丰富，讲解清晰，有大量实例和练习

#### Self-Driving Cars with ROS 2 (The Construct)
- **平台**: The Construct
- **链接**: https://www.theconstructsim.com/
- **时长**: 约40小时
- **费用**: 需订阅（有免费试用）
- **语言**: 英文
- **核心内容**:
  - ROS 2基础
  - 导航和SLAM
  - 计算机视觉
  - 在线仿真环境
- **为什么推荐**: 提供在线ROS 2环境，无需本地安装即可学习，有真实的机器人仿真

#### ROS 2 Basics in 5 Days (The Construct)
- **平台**: The Construct
- **时长**: 约20小时
- **费用**: 部分免费
- **语言**: 英文
- **核心内容**:
  - ROS 2核心概念
  - 话题、服务、动作
  - Launch文件
  - 实战练习
- **为什么推荐**: 结构化的5天学习计划，适合快速入门

#### ROS 2 Tutorial (freeCodeCamp)
- **平台**: YouTube
- **链接**: https://www.youtube.com/watch?v=Gg25GfA456o
- **时长**: 约2小时
- **费用**: 完全免费
- **语言**: 英文
- **观看次数**: 超过50万次
- **核心内容**: ROS 2快速入门
- **为什么推荐**: 完全免费，适合快速了解ROS 2

### 🎬 视频教程

#### ROS 2 Tutorial for Beginners (Articulated Robotics)
- **平台**: YouTube
- **频道**: Articulated Robotics
- **链接**: https://www.youtube.com/c/ArticulatedRobotics
- **语言**: 英文
- **核心内容**:
  - ROS 2基础教程系列
  - URDF机器人建模
  - 导航和SLAM
  - 实际机器人项目
- **为什么推荐**: 讲解非常清晰，有大量实际机器人的演示，社区评价很高

#### 【中文】ROS 2从入门到精通（古月居）
- **平台**: B站
- **UP主**: 古月居
- **时长**: 约30小时
- **语言**: 中文
- **观看量**: 超过100万
- **核心内容**:
  - ROS 2基础概念
  - 通信机制
  - 常用工具
  - 实战项目
- **为什么推荐**: 国内最权威的ROS中文教程，古月居是ROS中文社区的核心贡献者

#### 【中文】ROS 2机器人开发实战（赵虚左）
- **平台**: B站
- **时长**: 约20小时
- **语言**: 中文
- **核心内容**:
  - ROS 2环境搭建
  - 节点编程
  - 机器人仿真
  - 实际项目
- **为什么推荐**: 实战导向，有完整的项目案例

### 🌐 社区和论坛

#### ROS Discourse
- **链接**: https://discourse.ros.org/
- **类型**: 官方论坛
- **语言**: 英文
- **核心价值**: ROS官方社区，可以提问、分享经验、了解最新动态
- **推荐板块**:
  - ROS 2 General
  - ROS 2 Projects
  - ROS 2 News

#### ROS Answers
- **链接**: https://answers.ros.org/
- **类型**: 问答平台
- **语言**: 英文
- **核心价值**: ROS版的Stack Overflow，大量问题和解答

#### ROS中文社区（古月居）
- **链接**: https://www.guyuehome.com/
- **类型**: 中文社区
- **语言**: 中文
- **核心价值**: 国内最活跃的ROS中文社区，有教程、论坛、资源下载

#### ROS 2 GitHub Discussions
- **链接**: https://github.com/ros2/ros2/discussions
- **类型**: GitHub讨论区
- **语言**: 英文
- **核心价值**: 与ROS 2开发团队直接交流，了解开发进展

### 🚀 优秀开源项目

#### TurtleBot3
- **链接**: https://github.com/ROBOTIS-GIT/turtlebot3
- **Star数**: 超过1.5k
- **核心价值**: 最流行的ROS 2教学机器人，有完整的软件栈和文档
- **学习价值**:
  - 完整的ROS 2包结构
  - 导航和SLAM实现
  - 硬件集成示例
- **文档**: https://emanual.robotis.com/docs/en/platform/turtlebot3/

#### Nav2 (Navigation 2)
- **链接**: https://github.com/ros-planning/navigation2
- **Star数**: 超过2k
- **核心价值**: ROS 2的官方导航框架，包含路径规划、避障、定位等功能
- **学习价值**:
  - 大型ROS 2项目的架构
  - 插件系统设计
  - 行为树应用
- **文档**: https://navigation.ros.org/

#### MoveIt 2
- **链接**: https://github.com/ros-planning/moveit2
- **Star数**: 超过1k
- **核心价值**: ROS 2的机械臂运动规划框架
- **学习价值**:
  - 机械臂控制
  - 运动规划算法
  - 碰撞检测
- **文档**: https://moveit.ros.org/

#### ros2_control
- **链接**: https://github.com/ros-controls/ros2_control
- **Star数**: 超过500
- **核心价值**: ROS 2的实时控制框架
- **学习价值**:
  - 硬件抽象层设计
  - 控制器实现
  - 实时系统
- **文档**: https://control.ros.org/

#### micro-ROS
- **链接**: https://github.com/micro-ROS
- **核心价值**: 在微控制器上运行ROS 2，支持Arduino、ESP32等
- **学习价值**:
  - 嵌入式ROS 2应用
  - 资源受限环境下的ROS 2
- **文档**: https://micro.ros.org/

### 🛠️ 实用工具

#### RQt
- **文档**: https://docs.ros.org/en/humble/Concepts/About-RQt.html
- **核心价值**: ROS 2的图形化工具集
- **常用工具**:
  - rqt_graph: 可视化节点和话题关系
  - rqt_plot: 实时绘制话题数据
  - rqt_console: 查看日志
  - rqt_reconfigure: 动态参数调整

#### RViz2
- **文档**: https://github.com/ros2/rviz
- **核心价值**: ROS 2的3D可视化工具
- **应用场景**:
  - 机器人模型可视化
  - 传感器数据显示
  - 路径规划可视化
  - 调试和演示

#### Gazebo
- **链接**: https://gazebosim.org/
- **核心价值**: 机器人仿真环境，与ROS 2深度集成
- **学习资源**: https://gazebosim.org/docs

#### Colcon
- **文档**: https://colcon.readthedocs.io/
- **核心价值**: ROS 2的构建工具
- **常用命令**:
  ```bash
  colcon build
  colcon test
  colcon build --packages-select <package>
  ```

### 📦 ROS 2发行版和包索引

#### ROS 2 Packages Index
- **链接**: https://index.ros.org/
- **核心价值**: 搜索和浏览所有可用的ROS 2包
- **使用技巧**: 在开发前先搜索是否有现成的包可用

#### ROS 2 Humble Hawksbill (LTS)
- **发布时间**: 2022年5月
- **支持期限**: 2027年5月
- **推荐理由**: 长期支持版本，稳定可靠，适合生产环境

#### ROS 2 Iron Irwini
- **发布时间**: 2023年5月
- **支持期限**: 2024年11月
- **推荐理由**: 较新的特性，适合学习和实验

### 🌏 中文资源

#### 《ROS 2机器人开发从入门到实践》
- **作者**: 古月居（胡春旭）
- **出版社**: 机械工业出版社
- **出版年份**: 2022年
- **语言**: 中文
- **核心价值**: 国内第一本系统的ROS 2中文教材，从基础到实战的完整内容，配有大量代码示例
- **推荐章节**:
  - 第3章：ROS 2核心概念
  - 第5章：话题通信
  - 第8章：机器人导航

#### 《ROS 2入门教程》（古月居在线版）
- **链接**: https://book.guyuehome.com/
- **类型**: 在线教程
- **语言**: 中文
- **核心价值**: 系统的ROS 2中文教程，从安装到进阶，持续更新

#### ROS 2中文文档
- **链接**: https://docs.ros.org/en/humble/
- **类型**: 社区翻译
- **语言**: 中文（部分）
- **核心价值**: 官方文档的中文翻译版本，权威且全面

#### 知乎 - ROS话题
- **链接**: https://www.zhihu.com/topic/19560141/hot
- **类型**: 问答社区
- **语言**: 中文
- **核心价值**: 大量ROS相关的问答和经验分享，活跃的中文技术社区

#### CSDN - ROS 2专栏
- **链接**: https://blog.csdn.net/
- **类型**: 技术博客
- **语言**: 中文
- **核心价值**: 大量ROS 2中文技术文章、项目案例、问题解决方案

#### 《ROS机器人开发实践》
- **作者**: 胡春旭
- **出版社**: 机械工业出版社
- **语言**: 中文
- **核心价值**: 虽然主要讲ROS 1，但基础概念和思想同样适用于ROS 2

### 🏢 国内公司和机构

#### 使用ROS的机器人公司

**思岚科技（SLAMTEC）**
- **领域**: 机器人定位导航、激光雷达
- **ROS应用**: 提供完整的ROS/ROS 2驱动和导航方案
- **产品**: RPLIDAR激光雷达、SLAMWARE导航系统
- **开源贡献**: rplidar_ros、slamtec_aurora等ROS包
- **学习资源**: https://github.com/Slamtec
- **为什么关注**: 国内SLAM技术领先企业，ROS生态的重要贡献者

**优必选科技（UBTECH）**
- **领域**: 人形机器人、教育机器人
- **ROS应用**: 基于ROS开发机器人控制系统
- **产品**: Walker人形机器人、Yanshee教育机器人
- **为什么关注**: 国内领先的人形机器人公司，在ROS应用方面有丰富经验

**越疆科技（Dobot）**
- **领域**: 协作机器人、机械臂
- **ROS应用**: 提供ROS/ROS 2驱动和MoveIt配置
- **产品**: Magician系列机械臂、CR系列协作机器人
- **开源贡献**: dobot_ros、dobot_moveit等
- **学习资源**: https://github.com/Dobot-Arm
- **为什么关注**: 产品适合教育和研发，ROS支持完善

**大疆创新（DJI）**
- **领域**: 无人机、地面机器人
- **ROS应用**: RoboMaster机器人基于ROS开发
- **产品**: RoboMaster EP、Tello EDU
- **学习资源**: https://github.com/dji-sdk
- **为什么关注**: 提供丰富的ROS教育资源和开发文档

**镁伽机器人（Megvii Robotics）**
- **领域**: 智能物流机器人
- **ROS应用**: 基于ROS 2开发自主导航系统
- **产品**: 智能搬运机器人、分拣机器人
- **为什么关注**: 在工业机器人ROS应用方面有深厚积累

#### 研究机构和高校

**清华大学智能技术与系统国家重点实验室**
- **研究方向**: 机器人、人工智能、ROS应用
- **知名项目**: 清华机器人足球队（基于ROS）
- **开源贡献**: 多个ROS相关开源项目
- **为什么关注**: 国内顶尖的机器人研究机构，ROS技术应用先驱

**北京航空航天大学机器人研究所**
- **研究方向**: 人形机器人、空间机器人
- **ROS应用**: BHR系列人形机器人使用ROS
- **为什么关注**: 在人形机器人ROS应用方面处于领先地位

**上海交通大学机器人研究所**
- **研究方向**: 服务机器人、医疗机器人
- **ROS应用**: 多个机器人项目基于ROS开发
- **为什么关注**: 在服务机器人领域有丰富的ROS实践经验

**中国科学院自动化研究所**
- **研究方向**: 智能机器人、模式识别
- **ROS应用**: 多个国家级机器人项目使用ROS
- **开源贡献**: ROS中文社区的重要支持者
- **为什么关注**: 国内人工智能和机器人研究的核心力量

#### 开源社区和学习平台

**古月居（Guyue Home）**
- **创始人**: 胡春旭（古月）
- **链接**: https://www.guyuehome.com/
- **类型**: ROS中文社区
- **核心内容**: ROS/ROS 2教程、机器人项目、技术博客、论坛
- **为什么推荐**: 国内最大、最活跃的ROS中文社区，提供系统的学习路径

**ROS中国用户组**
- **平台**: 微信群、QQ群
- **类型**: 用户社区
- **核心内容**: 技术交流、问题解答、资源分享
- **为什么推荐**: 活跃的中文ROS开发者社区

**机器人大讲堂（公众号）**
- **平台**: 微信公众号
- **核心内容**: ROS教程、机器人资讯、技术解析
- **为什么推荐**: 及时的中文ROS资讯和技术文章

**B站ROS学习UP主**
- **推荐UP主**: 
  - 古月居：系统的ROS教程
  - 赵虚左：ROS基础教程
  - 创客智造：ROS项目实战
- **为什么推荐**: 高质量的中文视频教程，适合视觉学习者

### 🎓 中文学习路径指南

#### 零基础入门路径（2-3个月）

**第1-2周：环境搭建和基础概念**
- 学习资源：古月居《ROS 2入门教程》第1-3章
- 学习内容：安装Ubuntu和ROS 2、理解节点、话题、服务概念
- 实践项目：运行turtlesim示例、编写第一个节点
- 每日练习：至少1小时

**第3-4周：话题通信**
- 学习资源：古月居教程第4-5章
- 学习内容：发布者、订阅者、自定义消息
- 实践项目：编写温度传感器节点、电机控制节点
- 调试工具：学习使用ros2 topic、rqt_graph

**第5-6周：服务和参数**
- 学习资源：古月居教程第6-7章
- 学习内容：服务通信、参数服务器、launch文件
- 实践项目：实现机器人控制服务、配置管理
- 代码规范：学习ROS 2代码风格

**第7-8周：TF坐标变换**
- 学习资源：ROS 2官方TF2教程（中文）
- 学习内容：坐标系、TF树、静态和动态变换
- 实践项目：发布机器人TF树、实现坐标转换
- 可视化：使用RViz2查看TF树

**第9-12周：综合项目**
- 项目选择：差速驱动机器人仿真
- 技术整合：话题、服务、TF、launch文件
- 仿真环境：Gazebo + ROS 2
- 代码管理：使用Git进行版本控制

#### 进阶提升路径（3-6个月）

**阶段1：导航系统（1-2个月）**
- 学习资源：Nav2官方文档（中文）
- 学习内容：SLAM建图、路径规划、避障
- 实践项目：实现自主导航机器人
- 工具使用：Nav2、Cartographer

**阶段2：机械臂控制（1-2个月）**
- 学习资源：MoveIt 2教程
- 学习内容：运动规划、逆运动学、轨迹执行
- 实践项目：机械臂抓取任务
- 工具使用：MoveIt 2、RViz2

**阶段3：计算机视觉（1个月）**
- 学习资源：OpenCV + ROS 2集成教程
- 学习内容：图像处理、目标检测、视觉伺服
- 实践项目：视觉跟踪、二维码识别
- 工具使用：cv_bridge、image_transport

**阶段4：多机器人系统（1个月）**
- 学习资源：ROS 2多机器人教程
- 学习内容：命名空间、多机通信、协同控制
- 实践项目：多机器人编队、协同搬运
- 工具使用：ROS 2 DDS

#### 推荐学习顺序

1. **先理论后实践**: 先理解ROS 2的设计理念，再动手编码
2. **从简单到复杂**: 先掌握话题通信，再学习服务、动作
3. **多用可视化工具**: RViz2、rqt_graph帮助理解系统结构
4. **阅读源码**: 阅读官方示例和优秀开源项目
5. **参与社区**: 加入古月居论坛，向他人学习

#### 常见问题和解决方案

**Q: ROS 1还是ROS 2？**
A: 新项目必须选ROS 2！ROS 1将于2025年停止支持，ROS 2性能更好、架构更现代。

**Q: 如何在国内加速ROS 2安装？**
A: 使用国内镜像源：
- 清华大学镜像：https://mirrors.tuna.tsinghua.edu.cn/
- 中科大镜像：https://mirrors.ustc.edu.cn/
- 阿里云镜像：https://mirrors.aliyun.com/

**Q: 遇到问题如何寻求中文帮助？**
A: 推荐平台：
- 古月居论坛：https://www.guyuehome.com/
- 知乎ROS话题
- CSDN技术博客
- ROS中国用户组（微信/QQ群）

**Q: 推荐哪些中文学习资源？**
A: 
- 书籍：《ROS 2机器人开发从入门到实践》
- 在线：古月居教程、B站视频
- 实践：GitHub上的中文ROS项目
- 社区：古月居论坛、知乎

### 🎯 实战项目推荐

#### Awesome ROS 2
- **链接**: https://github.com/fkromer/awesome-ros2
- **类型**: GitHub资源列表
- **Star数**: 超过1.5k
- **核心价值**: 精选的ROS 2资源、工具、项目列表

#### ROS 2 Examples
- **链接**: https://github.com/ros2/examples
- **类型**: 官方示例代码
- **核心价值**: ROS 2官方提供的各种示例，涵盖所有核心功能

#### ROS 2 Demos
- **链接**: https://github.com/ros2/demos
- **类型**: 官方演示项目
- **核心价值**: 展示ROS 2特性的完整演示项目

### 📺 推荐YouTube频道

#### The Construct
- **链接**: https://www.youtube.com/c/TheConstruct
- **语言**: 英文
- **核心内容**: ROS 2教程、项目演示、最新动态

#### Articulated Robotics
- **链接**: https://www.youtube.com/c/ArticulatedRobotics
- **语言**: 英文
- **核心内容**: ROS 2教程、机器人项目、硬件集成

#### ROS Developers Podcast
- **链接**: https://www.theconstructsim.com/category/podcast/
- **类型**: 播客
- **语言**: 英文
- **核心内容**: 采访ROS开发者和机器人公司

### 💡 学习建议

1. **先理解概念**: 在写代码前，先理解节点、话题、服务等核心概念
2. **跟随官方教程**: 按顺序完成官方Beginner教程，不要跳过
3. **多看示例代码**: 阅读TurtleBot3、Nav2等优秀项目的代码
4. **实际动手**: 尝试控制真实的机器人或在Gazebo中仿真
5. **参与社区**: 在ROS Discourse提问和分享经验
6. **阅读源码**: 遇到问题时，阅读ROS 2的源码理解实现细节
7. **版本选择**: 新项目使用Humble（LTS），学习可以用最新版本

### 🔗 相关章节

- 第8章：Python编程 - ROS 2的Python客户端库基础
- 第10章：计算机视觉基础 - 在ROS 2中使用OpenCV
- 第11章：SLAM基础 - 使用ROS 2实现SLAM
- 第13章：路径规划 - 使用Nav2进行导航

### 🆚 ROS 1 vs ROS 2 迁移资源

#### ROS 1 to ROS 2 Migration Guide
- **链接**: https://docs.ros.org/en/humble/How-To-Guides/Migrating-from-ROS1.html
- **核心价值**: 官方迁移指南，帮助ROS 1用户过渡到ROS 2

#### ros1_bridge
- **链接**: https://github.com/ros2/ros1_bridge
- **核心价值**: 让ROS 1和ROS 2节点互相通信，适合渐进式迁移

---

**版权说明**: 以上资源仅供个人学习使用。部分资源可能需要付费或注册。请尊重知识产权，支持正版。

## 读完子章节之后

按 [9.0 的路线](./index.md) 做完练习，再回到这里挑一门课或一个开源包。传感器、导航和机械臂分别在第 10 章之后，不要在本章提前展开。

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
