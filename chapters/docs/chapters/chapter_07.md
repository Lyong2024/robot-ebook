# 第7章：Linux 命令行：机器人开发者的必备技能

## 学习目标

- 理解为什么机器人开发需要 Linux
- 掌握基本的 Linux 命令行操作
- 学会文件和目录管理
- 理解 Linux 权限系统
- 掌握进程管理和系统监控
- 能够使用 SSH 远程控制机器人

## 7.1 为什么机器人开发需要 Linux？

如果你之前只用过 Windows，可能会疑惑：为什么机器人开发要用 Linux？

### Unix/Linux 的历史传承

要理解为什么Linux如此强大，我们需要回到1969年。那一年，贝尔实验室的**Ken Thompson**和**Dennis Ritchie**创造了Unix操作系统。Unix的设计哲学深刻影响了整个计算机世界：

**Unix哲学核心思想**（Doug McIlroy总结）：
1. **做一件事，做好它**：每个程序只做一件事，但做到极致
2. **程序协作**：通过管道（pipe）连接程序，让它们协同工作
3. **文本流**：使用文本作为通用接口，便于处理和传输
4. **快速原型**：优先构建原型，而不是过度设计

这些思想在今天的机器人开发中依然适用。ROS 2的节点通信、Linux的管道机制、配置文件的文本格式，都是Unix哲学的体现。

**Linux的诞生**：1991年，芬兰大学生**Linus Torvalds**在赫尔辛基大学宿舍里，出于对Unix的热爱和对Minix的不满，开始编写自己的操作系统内核。他在comp.os.minix新闻组发布了著名的公告：

> "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu)..."

这个"小爱好"最终成为了世界上最成功的开源项目之一。今天，Linux运行在超过90%的云服务器、所有的Android手机、大多数超级计算机，以及无数的机器人系统上。

**关键里程碑**：
- **1969**：Unix诞生于贝尔实验室
- **1973**：Unix用C语言重写，实现跨平台移植
- **1983**：Richard Stallman发起GNU项目，创建自由软件运动
- **1991**：Linus Torvalds发布Linux 0.01版本
- **2004**：Ubuntu发布，让Linux走向大众
- **2007**：ROS（Robot Operating System）发布，基于Linux
- **2017**：ROS 2发布，继续以Linux为主要平台

### Linux 在机器人领域的优势

**开源免费**：Linux 是开源的，可以自由修改和分发，非常适合嵌入式系统。

**轻量高效**：Linux 可以运行在资源有限的设备上（如树莓派），而 Windows 太臃肿。

**强大的命令行**：Linux 的命令行工具非常强大，适合自动化和远程操作。

**ROS 2 的原生平台**：ROS 2 在 Linux 上开发和测试，虽然也支持 Windows，但 Linux 体验最好。

**社区支持**：几乎所有机器人开源项目都优先支持 Linux。

### 常见的 Linux 发行版

**Ubuntu**：最流行的桌面 Linux，用户友好，软件丰富。ROS 2 官方推荐 Ubuntu 22.04。

**Raspberry Pi OS**：树莓派的官方系统，基于 Debian，专为树莓派优化。

**Jetson Linux**：NVIDIA Jetson 系列的官方系统，针对 AI 和机器人优化。

对于机器人开发，**Ubuntu 22.04 LTS** 是最佳选择。

## 7.2 Linux 文件系统结构

Linux 的文件系统与 Windows 完全不同，没有 C 盘、D 盘的概念，而是一个树状结构。

### 根目录（/）

所有文件和目录都从根目录（`/`）开始。

**重要目录**：

- `/home`：用户的家目录，类似 Windows 的"我的文档"
  - `/home/username`：你的个人目录
- `/root`：root 用户（超级管理员）的家目录
- `/bin`：基本命令（如 ls, cp, mv）
- `/usr`：用户程序和数据
  - `/usr/bin`：用户命令
  - `/usr/local`：本地安装的软件
- `/etc`：系统配置文件
- `/var`：可变数据（日志、缓存等）
- `/tmp`：临时文件
- `/dev`：设备文件（硬盘、USB 等）
- `/proc`：进程信息（虚拟文件系统）

### 路径表示

**绝对路径**：从根目录开始，如 `/home/user/robot_ws`

**相对路径**：从当前目录开始，如 `robot_ws/src`

**特殊符号**：
- `~`：当前用户的家目录（`/home/username`）
- `.`：当前目录
- `..`：上一级目录
- `-`：上一次所在的目录

## 7.3 基本命令

### 导航命令

**pwd**（Print Working Directory）：显示当前目录

```bash
pwd
# 输出：/home/user
```

**cd**（Change Directory）：切换目录

```bash
cd /home/user/robot_ws    # 切换到指定目录
cd ~                       # 切换到家目录
cd ..                      # 切换到上一级目录
cd -                       # 切换到上一次的目录
```

**ls**（List）：列出文件和目录

```bash
ls                # 列出当前目录
ls -l             # 详细列表（权限、大小、时间）
ls -a             # 显示隐藏文件（以 . 开头）
ls -lh            # 人类可读的大小（KB, MB）
ls -lt            # 按时间排序
ls *.py           # 列出所有 .py 文件
```

### 文件操作

**touch**：创建空文件或更新时间戳

```bash
touch test.txt
```

**mkdir**（Make Directory）：创建目录

```bash
mkdir my_project
mkdir -p path/to/deep/directory  # 创建多级目录
```

**cp**（Copy）：复制文件或目录

```bash
cp file1.txt file2.txt           # 复制文件
cp -r dir1 dir2                  # 复制目录（递归）
cp *.py backup/                  # 复制所有 .py 文件
```

**mv**（Move）：移动或重命名

```bash
mv old_name.txt new_name.txt     # 重命名
mv file.txt /path/to/directory/  # 移动文件
```

**rm**（Remove）：删除文件或目录

```bash
rm file.txt                      # 删除文件
rm -r directory                  # 删除目录（递归）
rm -f file.txt                   # 强制删除（不询问）
rm -rf directory                 # 强制递归删除（危险！）
```

**⚠️ 警告**：`rm -rf` 非常危险，删除的文件无法恢复！使用前务必确认路径。

### 查看文件内容

**cat**：显示整个文件

```bash
cat file.txt
```

**less**：分页查看（适合大文件）

```bash
less large_file.txt
# 空格：下一页
# b：上一页
# q：退出
```

**head**：显示文件开头

```bash
head file.txt          # 默认前 10 行
head -n 20 file.txt    # 前 20 行
```

**tail**：显示文件结尾

```bash
tail file.txt          # 默认后 10 行
tail -n 20 file.txt    # 后 20 行
tail -f log.txt        # 实时跟踪文件更新（查看日志）
```

**grep**：搜索文本

```bash
grep "error" log.txt              # 搜索包含 "error" 的行
grep -i "error" log.txt           # 忽略大小写
grep -r "TODO" .                  # 递归搜索当前目录
grep -n "error" log.txt           # 显示行号
```

## 7.4 文件权限

Linux 是多用户系统，每个文件都有权限控制。

### 查看权限

```bash
ls -l file.txt
# 输出：-rw-r--r-- 1 user group 1234 Jan 1 12:00 file.txt
```

解析：
```
-rw-r--r--
│││││││││└─ 其他用户权限（r--：只读）
││││││└└└── 组权限（r--：只读）
│││└└└───── 所有者权限（rw-：读写）
│└───────── 文件类型（-：普通文件，d：目录，l：链接）
```

**权限字母**：
- `r`（read）：读权限（4）
- `w`（write）：写权限（2）
- `x`（execute）：执行权限（1）
- `-`：无权限（0）

### 修改权限

**chmod**（Change Mode）：

```bash
chmod +x script.sh              # 添加执行权限
chmod -x script.sh              # 移除执行权限
chmod 755 script.sh             # 设置为 rwxr-xr-x
chmod 644 file.txt              # 设置为 rw-r--r--
```

**数字表示法**：
- 7 = 4+2+1 = rwx
- 6 = 4+2 = rw-
- 5 = 4+1 = r-x
- 4 = r--

**常用组合**：
- `755`：所有者全权限，其他人只读和执行（脚本）
- `644`：所有者读写，其他人只读（文档）
- `600`：只有所有者能读写（私密文件）

### 修改所有者

**chown**（Change Owner）：

```bash
sudo chown user:group file.txt
sudo chown -R user:group directory/
```

## 7.5 进程管理

### 查看进程

**ps**（Process Status）：

```bash
ps                    # 当前终端的进程
ps aux                # 所有进程（详细）
ps aux | grep python  # 查找 Python 进程
```

**top**：实时进程监控

```bash
top
# q：退出
# k：杀死进程
# M：按内存排序
# P：按 CPU 排序
```

**htop**：更友好的 top（需要安装）

```bash
sudo apt install htop
htop
```

### 控制进程

**后台运行**：

```bash
python script.py &              # 后台运行
nohup python script.py &        # 后台运行，忽略挂断信号
```

**查看后台任务**：

```bash
jobs                            # 列出后台任务
fg %1                           # 将任务 1 调到前台
bg %1                           # 将任务 1 继续在后台运行
```

**杀死进程**：

```bash
kill 1234                       # 杀死进程 ID 1234
kill -9 1234                    # 强制杀死
killall python                  # 杀死所有名为 python 的进程
pkill -f "ros2 run"             # 杀死命令包含 "ros2 run" 的进程
```

## 7.6 系统信息

### 磁盘使用

```bash
df -h                           # 磁盘空间（人类可读）
du -sh directory                # 目录大小
du -h --max-depth=1             # 当前目录下各子目录大小
```

### 内存使用

```bash
free -h                         # 内存使用情况
```

### CPU 信息

```bash
lscpu                           # CPU 详细信息
cat /proc/cpuinfo               # CPU 信息（详细）
```

### 系统信息

```bash
uname -a                        # 系统信息
lsb_release -a                  # 发行版信息
uptime                          # 运行时间和负载
```

### USB 设备

```bash
lsusb                           # 列出 USB 设备
dmesg | grep tty                # 查看串口设备
ls /dev/tty*                    # 列出所有串口
```

## 7.7 网络命令

### 网络配置

```bash
ip addr                         # 显示 IP 地址
ifconfig                        # 旧版命令（可能需要安装）
ping google.com                 # 测试网络连接
```

### SSH 远程连接

SSH（Secure Shell）是远程控制 Linux 的标准方式。

**安装 SSH 服务器**（在机器人上）：

```bash
sudo apt update
sudo apt install openssh-server
sudo systemctl start ssh
sudo systemctl enable ssh       # 开机自启
```

**从另一台电脑连接**：

```bash
ssh username@192.168.1.100
# 输入密码后即可远程控制
```

**免密登录**（推荐）：

```bash
# 在本地电脑生成密钥
ssh-keygen -t rsa

# 复制公钥到机器人
ssh-copy-id username@192.168.1.100

# 现在可以免密登录
ssh username@192.168.1.100
```

**传输文件**：

```bash
# 从本地复制到远程
scp file.txt user@192.168.1.100:/home/user/

# 从远程复制到本地
scp user@192.168.1.100:/home/user/file.txt .

# 复制目录
scp -r directory user@192.168.1.100:/home/user/
```

## 7.8 包管理

Ubuntu 使用 APT（Advanced Package Tool）管理软件。

### 基本命令

```bash
sudo apt update                 # 更新软件列表
sudo apt upgrade                # 升级所有软件
sudo apt install package_name   # 安装软件
sudo apt remove package_name    # 卸载软件
sudo apt autoremove             # 删除不需要的依赖
sudo apt search keyword         # 搜索软件
```

### 常用软件

```bash
sudo apt install git            # 版本控制
sudo apt install vim            # 文本编辑器
sudo apt install htop           # 进程监控
sudo apt install tree           # 树状显示目录
sudo apt install net-tools      # 网络工具（ifconfig 等）
sudo apt install curl wget      # 下载工具
```

## 7.9 Shell 脚本基础

Shell 脚本可以自动化重复的命令。

### 创建脚本

```bash
nano start_robot.sh
```

内容：

```bash
#!/bin/bash
# 这是注释

echo "Starting robot system..."

# 启动 ROS 2 节点
source /opt/ros/humble/setup.bash
source ~/robot_ws/install/setup.bash

ros2 launch my_robot robot.launch.py &

echo "Robot started!"
```

### 使脚本可执行

```bash
chmod +x start_robot.sh
```

### 运行脚本

```bash
./start_robot.sh
```

### 常用语法

**变量**：

```bash
NAME="Robot"
echo "Hello, $NAME"
```

**条件判断**：

```bash
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File not found"
fi
```

**循环**：

```bash
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

for file in *.py; do
    echo "Processing $file"
done
```

**函数**：

```bash
function start_motor() {
    echo "Starting motor..."
    # 命令
}

start_motor
```

## 7.10 实践：远程控制机器人

让我们创建一个完整的远程控制系统。

### 场景

你的机器人（树莓派或 Jetson）在另一个房间，你想从笔记本电脑控制它。

### 步骤 1：配置 SSH

在机器人上：

```bash
sudo apt install openssh-server
sudo systemctl enable ssh
```

### 步骤 2：查找 IP 地址

在机器人上：

```bash
ip addr
# 找到类似 192.168.1.100 的地址
```

### 步骤 3：从笔记本连接

```bash
ssh pi@192.168.1.100
```

### 步骤 4：创建启动脚本

在机器人上创建 `~/robot_start.sh`：

```bash
#!/bin/bash

echo "=== Robot Startup Script ==="

# 检查 ROS 2 环境
if [ -z "$ROS_DISTRO" ]; then
    echo "Sourcing ROS 2..."
    source /opt/ros/humble/setup.bash
    source ~/robot_ws/install/setup.bash
fi

# 检查设备
echo "Checking devices..."
if [ ! -e "/dev/ttyUSB0" ]; then
    echo "ERROR: Arduino not found!"
    exit 1
fi

# 启动节点
echo "Starting ROS 2 nodes..."
ros2 launch my_robot robot.launch.py

echo "Robot system started!"
```

### 步骤 5：使用 tmux 管理会话

tmux 允许你断开 SSH 后程序继续运行。

```bash
# 安装 tmux
sudo apt install tmux

# 创建会话
tmux new -s robot

# 在 tmux 中启动机器人
./robot_start.sh

# 断开会话（Ctrl+B, 然后按 D）
# 程序继续运行

# 重新连接
tmux attach -t robot

# 列出所有会话
tmux ls

# 杀死会话
tmux kill-session -t robot
```

### 步骤 6：创建便捷别名

在 `~/.bashrc` 中添加：

```bash
alias robot-start='ssh pi@192.168.1.100 "tmux new -s robot ~/robot_start.sh"'
alias robot-attach='ssh pi@192.168.1.100 -t "tmux attach -t robot"'
alias robot-stop='ssh pi@192.168.1.100 "tmux kill-session -t robot"'
```

重新加载：

```bash
source ~/.bashrc
```

现在你可以用简单的命令控制机器人：

```bash
robot-start    # 启动机器人
robot-attach   # 连接到机器人
robot-stop     # 停止机器人
```

## 推荐资源

### 经典书籍

**《Unix编程艺术》（The Art of Unix Programming）** - Eric S. Raymond
- Unix哲学的权威阐述，讲解"做一件事并做好"的设计思想
- 适合理解为什么Linux工具设计成现在这样
- 中文版由姜宏、何源等翻译

**《鸟哥的Linux私房菜：基础学习篇》** - 鸟哥（蔡德明）
- 华语世界最受欢迎的Linux入门书
- 从零开始，循序渐进，适合完全新手
- 涵盖文件系统、Shell、权限、进程等核心概念

**《Linux命令行与Shell脚本编程大全》** - Richard Blum & Christine Bresnahan
- 全面覆盖命令行和Shell脚本
- 大量实用示例，适合作为参考手册
- 第4版已更新到最新Linux发行版

**《UNIX/Linux系统管理技术手册》** - Evi Nemeth等
- 系统管理员的圣经，深度和广度兼具
- 适合进阶学习，了解系统底层运作
- 第5版涵盖云计算和容器技术

**《Linux内核设计与实现》** - Robert Love
- 深入Linux内核源码，理解操作系统原理
- 适合想要深入理解Linux的开发者
- 对机器人实时性能优化有帮助

### Unix/Linux重要人物

**Ken Thompson**（1943-）
- Unix之父，与Dennis Ritchie共同创造Unix
- 发明了B语言（C语言前身）
- 后来参与Go语言设计
- 图灵奖得主（1983）

**Dennis Ritchie**（1941-2011）
- Unix共同创造者，C语言之父
- 著有《C程序设计语言》（K&R C）
- 图灵奖得主（1983）
- 他的去世几乎与乔布斯同时，但媒体关注少得多

**Linus Torvalds**（1969-）
- Linux内核创始人和首席架构师
- Git版本控制系统的创造者
- 以直率的技术评论和"Talk is cheap, show me the code"著称
- 千禧年技术奖得主（2012）

**Richard Stallman**（1953-）
- 自由软件运动发起人，GNU项目创始人
- 创建了GPL许可证，影响整个开源世界
- 编写了Emacs、GCC等重要工具
- 坚定的软件自由倡导者

**Brian Kernighan**（1942-）
- Unix早期开发者，"K&R C"的K
- 著有多本经典著作：《C程序设计语言》《Unix编程环境》
- "Hello, World!"程序的创造者
- 普林斯顿大学计算机科学教授

**Doug McIlroy**（1932-）
- Unix管道（pipe）的发明者
- 总结了Unix哲学的核心思想
- 贝尔实验室计算科学研究中心主任

### Unix哲学在机器人开发中的应用

**1. 模块化设计**
```bash
# Unix方式：小工具组合
cat sensor_data.log | grep "error" | wc -l

# ROS 2方式：节点组合
ros2 run camera camera_node | ros2 run detector object_detector
```

**2. 文本作为通用接口**
```yaml
# ROS 2配置文件（YAML）
robot_params:
  max_speed: 1.0
  sensor_rate: 30
```

**3. 一切皆文件**
```bash
# 读取传感器数据
cat /dev/ttyUSB0

# 控制GPIO
echo "1" > /sys/class/gpio/gpio17/value
```

### 在线教程

**Linux Journey**：https://linuxjourney.com/
- 互动式 Linux 学习网站，从零开始

**The Linux Command Line**：https://linuxcommand.org/
- 免费电子书，深入讲解命令行

**The Linux Documentation Project**：https://tldp.org/
- 大量Linux文档、指南和HOWTO

### 视频资源

**YouTube频道推荐**：

**LearnLinuxTV**
- 系统的Linux教程系列
- 涵盖Ubuntu、命令行、服务器管理
- 适合视觉学习者

**The Linux Foundation**
- 官方培训视频
- 专业级系统管理课程
- 部分免费课程

**NetworkChuck**
- 生动有趣的Linux教程
- 结合网络和安全知识
- 适合初学者

**中文视频资源**：

**B站：韩顺平Linux教程**
- 全面系统的中文教程
- 从基础到高级，循序渐进

**慕课网：Linux达人养成计划**
- 实战导向的课程
- 适合快速上手

### 速查表

**Linux Command Cheat Sheet**：
- 搜索"Linux command cheat sheet"，有很多 PDF 可以打印出来

**tldr pages**：https://tldr.sh/
- 简化版man手册，提供实用示例
- 安装：`sudo apt install tldr`

**explainshell**：https://explainshell.com/
- 在线解释Shell命令
- 输入命令，自动分解每个部分的含义

### 练习平台

**OverTheWire**：https://overthewire.org/wargames/bandit/
- 通过游戏学习 Linux 命令

**Linux Survival**：https://linuxsurvival.com/
- 互动式命令行教程

### 社区资源

**Stack Overflow**：https://stackoverflow.com/questions/tagged/linux
- 最大的技术问答社区

**r/linux**：https://reddit.com/r/linux
- Reddit上的Linux社区

**Linux Questions**：https://www.linuxquestions.org/
- 老牌Linux论坛

## 本章小结

在本章中，我们学习了：

- Linux 在机器人开发中的重要性
- Linux 文件系统结构
- 基本的文件和目录操作
- 文件权限系统
- 进程管理和系统监控
- SSH 远程控制
- Shell 脚本基础
- 完整的远程控制机器人方案

命令行看起来可能有点吓人，但熟练后你会发现它比图形界面更高效。在下一章，我们将学习 Python 编程基础。

## 问答环节

**Q1：我必须记住所有命令吗？**

A：不需要！常用的命令用多了自然就记住了。不常用的可以：
- 用 `man command` 查看手册
- 用 `command --help` 查看帮助
- Google 搜索
- 保存常用命令到笔记

**Q2：如何在 Windows 上练习 Linux 命令？**

A：有几种方法：
1. **WSL**（Windows Subsystem for Linux）：在 Windows 上运行真正的 Linux
2. **虚拟机**：用 VirtualBox 安装 Ubuntu
3. **双系统**：安装 Ubuntu 和 Windows 双系统
4. **在线终端**：一些网站提供在线 Linux 终端

**Q3：什么时候用 sudo？**

A：当你需要管理员权限时，比如：
- 安装软件（`sudo apt install`）
- 修改系统文件（`/etc` 下的文件）
- 访问硬件设备
- 修改其他用户的文件

普通操作（在自己的家目录下）不需要 sudo。

**Q4：如何找回误删的文件？**

A：Linux 的 `rm` 命令是永久删除，没有回收站。预防措施：
1. 使用 `rm -i`（交互模式，删除前确认）
2. 重要文件定期备份
3. 使用版本控制（Git）
4. 可以安装 `trash-cli`，用 `trash` 代替 `rm`

**Q5：为什么有些命令需要 `./` 前缀？**

A：出于安全考虑，Linux 不会在当前目录查找可执行文件。`./` 明确表示"当前目录下的文件"。

如果想直接运行，可以：
1. 将文件移到 `/usr/local/bin`
2. 或将当前目录添加到 PATH（不推荐）

## 动手练习

**练习 1：文件管理**

创建以下目录结构：

```
robot_project/
├── src/
│   ├── main.py
│   └── utils.py
├── config/
│   └── settings.yaml
└── README.md
```

要求：
- 用命令行创建所有目录和文件
- 用 `tree` 命令查看结构
- 用 `ls -lR` 查看详细信息

**练习 2：日志分析**

创建一个模拟日志文件，然后：
- 用 `grep` 找出所有错误行
- 用 `grep -c` 统计错误数量
- 用 `tail -f` 模拟实时监控

**练习 3：自动化脚本**

编写一个脚本，自动完成：
1. 检查 ROS 2 是否安装
2. 检查工作空间是否存在
3. 编译工作空间
4. 启动一个节点

提示：用 `if [ -d "directory" ]` 检查目录是否存在。

## 学习目标复查

完成本章学习后，请通过以下问题检查自己的掌握程度：

- [ ] 你能解释为什么大多数机器人系统（如 ROS）选择 Linux 作为开发平台吗？至少说出三个关键原因。

- [ ] 你能使用命令行完成以下任务吗：创建目录结构、复制和移动文件、查找特定文件、修改文件权限（chmod）、查看文件内容？

- [ ] 你理解 Linux 权限系统吗？能够解释 `rwxr-xr--` 的含义，并知道如何使用 `chmod` 和 `chown` 修改权限和所有者？

- [ ] 你能使用 `ps`、`top`、`htop` 查看系统进程，并使用 `kill` 命令终止进程吗？你知道如何查看系统资源使用情况（CPU、内存、磁盘）？

- [ ] 你能通过 SSH 连接到远程机器人，并在远程终端中执行命令、传输文件（scp/rsync）吗？

- [ ] 你能使用包管理器（apt）安装、更新和卸载软件包吗？你知道如何搜索可用的软件包？

- [ ] 你能编写简单的 Shell 脚本来自动化常见任务吗？例如：批量处理文件、定时执行命令、启动多个 ROS 节点？

---

## 📚 拓展资源

想要深入学习Linux和命令行技术？查看我们精心整理的[第7章拓展资源](../resources/chapter_07_resources.md)，包括：

- 📖 **推荐教材**：《鸟哥的Linux私房菜》、《Linux命令行与Shell脚本编程大全》等经典书籍
- 📄 **技术文档**：Linux man pages、GNU Coreutils文档、Bash参考手册
- 🌐 **优质博客**：Linux Journey、The Linux Documentation Project
- 🎥 **视频教程**：Linux基础、Shell脚本编程、系统管理
- 💻 **开源项目**：Oh My Zsh、tmux、vim配置
- 🎓 **在线课程**：Linux Foundation培训、edX Linux课程
- 🛠️ **实用工具**：tldr命令速查、explainshell命令解释器
- 💬 **活跃社区**：r/linux、Unix & Linux Stack Exchange

[→ 查看完整资源列表](../resources/chapter_07_resources.md)
