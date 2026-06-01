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

## 拓展阅读

本章介绍了Linux命令行的基础知识。为了帮助你深入掌握这些技能，我们精心整理了以下拓展资源，涵盖经典书籍、在线课程、视频教程、实践平台等多个维度。

### 📚 经典书籍

#### 《The Linux Command Line》（Linux命令行大全）
- **作者**: William Shotts
- **出版年份**: 2019年第2版
- **语言**: 英文（有中文译本）
- **适合人群**: 完全零基础到中级用户
- **核心价值**: 这是学习Linux命令行的圣经级著作，从最基础的命令讲起，逐步深入到Shell脚本编程。作者用通俗易懂的语言和大量实例，让读者真正理解命令行的强大之处。
- **在线免费版**: https://linuxcommand.org/tlcl.php
- **推荐章节**: 
  - Part 1: Learning the Shell（学习Shell基础）
  - Part 2: Configuration and the Environment（配置和环境）
  - Part 3: Common Tasks and Essential Tools（常见任务和必备工具）
  - Part 4: Writing Shell Scripts（编写Shell脚本）

#### 《Linux Bible》（Linux宝典）
- **作者**: Christopher Negus
- **出版年份**: 2020年第10版
- **语言**: 英文
- **适合人群**: 希望全面掌握Linux系统的用户
- **核心价值**: 超过900页的综合性Linux指南，不仅涵盖命令行，还包括系统管理、网络配置、安全等方面。特别适合需要在机器人项目中进行系统级配置的开发者。
- **推荐章节**:
  - Chapter 4: Moving Around the Filesystem
  - Chapter 5: Working with Text Files
  - Chapter 6: Managing Running Processes
  - Chapter 13: Understanding Server Administration

#### 《Unix and Linux System Administration Handbook》
- **作者**: Evi Nemeth, Garth Snyder, Trent R. Hein, Ben Whaley, Dan Mackin
- **出版年份**: 2017年第5版
- **语言**: 英文
- **适合人群**: 中高级用户，特别是需要管理机器人系统的开发者
- **核心价值**: 被誉为"UNIX/Linux系统管理员的必读之书"，深入讲解系统管理的方方面面。对于需要在机器人上部署和维护复杂系统的开发者来说，这本书提供了宝贵的实战经验。

### 🎓 在线课程

#### Linux for Developers (Linux Foundation)
- **平台**: edX / Linux Foundation
- **链接**: https://www.edx.org/course/introduction-to-linux
- **时长**: 约14周，每周2-3小时
- **费用**: 免费旁听，证书需付费
- **语言**: 英文（有中文字幕）
- **核心内容**:
  - Linux文件系统和命令行基础
  - 文本处理和Shell脚本
  - 进程管理和系统监控
  - 网络配置和安全
- **为什么推荐**: 这是Linux基金会官方课程，内容权威且系统。课程设计考虑了开发者的实际需求，特别适合机器人开发者。

#### The Linux Command Line Bootcamp (Udemy)
- **讲师**: Colt Steele
- **平台**: Udemy
- **时长**: 约11小时视频
- **费用**: 约¥79（经常打折）
- **语言**: 英文
- **评分**: 4.7/5.0（超过2万评价）
- **核心内容**:
  - 50+个最常用的Linux命令
  - 文件权限和用户管理
  - 进程管理和后台任务
  - Shell脚本编程基础
- **为什么推荐**: 讲师风格幽默生动，通过大量实例和练习帮助学习者快速上手。课程节奏适中，非常适合初学者。

#### Linux Command Line Basics (Pluralsight)
- **讲师**: Shawn Powers
- **平台**: Pluralsight
- **时长**: 约3小时
- **费用**: 需订阅（有10天免费试用）
- **语言**: 英文
- **核心内容**:
  - 命令行导航和文件操作
  - 文本处理工具（grep, sed, awk）
  - 进程和系统管理
  - SSH和远程管理
- **为什么推荐**: 课程简洁高效，适合已有一定基础的学习者快速提升。

### 🎬 视频教程

#### Linux Tutorial for Beginners (freeCodeCamp)
- **平台**: YouTube
- **链接**: https://www.youtube.com/watch?v=sWbUDq4S6Y8
- **时长**: 约1小时
- **语言**: 英文
- **观看次数**: 超过200万次
- **核心内容**: 从零开始的Linux命令行入门，涵盖最常用的命令和操作
- **为什么推荐**: 完全免费，内容精炼，适合快速入门

#### Linux Command Line Full Course (Bro Code)
- **平台**: YouTube
- **链接**: https://www.youtube.com/watch?v=iwolPf6kN-k
- **时长**: 约5小时
- **语言**: 英文
- **观看次数**: 超过50万次
- **核心内容**: 全面的Linux命令行教程，包括Shell脚本编程
- **为什么推荐**: 讲解详细，示例丰富，适合系统学习

#### 【中文】Linux命令行与Shell脚本编程（慕课网）
- **平台**: 慕课网 / B站
- **时长**: 约10小时
- **语言**: 中文
- **核心内容**:
  - Linux基础命令
  - 文本处理三剑客（grep、sed、awk）
  - Shell脚本编程
  - 实战项目
- **为什么推荐**: 中文讲解，适合国内学习者，有配套练习

### 🌐 互动学习平台

#### Linux Journey
- **链接**: https://linuxjourney.com/
- **类型**: 互动式网页教程
- **费用**: 完全免费
- **语言**: 英文
- **核心特点**:
  - 分为初级、中级、高级三个阶段
  - 每个主题都有详细讲解和练习
  - 可以在浏览器中直接练习命令
- **推荐学习路径**:
  1. Grasshopper（入门）: 命令行基础、文件系统、文本处理
  2. Journeyman（进阶）: 进程管理、包管理、设备管理
  3. Networking Nomad（网络）: 网络配置、DNS、路由

#### OverTheWire: Bandit
- **链接**: https://overthewire.org/wargames/bandit/
- **类型**: 游戏化学习平台
- **费用**: 完全免费
- **语言**: 英文
- **核心特点**:
  - 通过解谜游戏学习Linux命令
  - 34个关卡，难度递增
  - 需要SSH连接到真实的Linux服务器
  - 每个关卡都需要使用特定的命令或技巧
- **为什么推荐**: 寓教于乐，通过实战学习，印象深刻。许多专业开发者都推荐这个平台作为Linux入门的练习场。

#### Terminus (The Command Line Murder Mystery)
- **链接**: https://github.com/veltman/clmystery
- **类型**: 命令行侦探游戏
- **费用**: 完全免费（开源）
- **语言**: 英文
- **核心特点**:
  - 通过破案学习grep、cat、head、tail等命令
  - 有趣的故事情节
  - 适合初学者练习文本处理命令

### 📖 在线文档和参考

#### Linux man pages online
- **链接**: https://man7.org/linux/man-pages/
- **类型**: 官方手册页
- **语言**: 英文
- **核心价值**: 这是Linux命令的官方文档，每个命令的详细说明、参数、示例都在这里。虽然初学者可能觉得枯燥，但这是最权威的参考资料。
- **使用技巧**: 
  - 在终端中使用 `man command` 查看
  - 在线版本方便搜索和跨平台访问
  - 重点关注 SYNOPSIS（语法）、DESCRIPTION（描述）、EXAMPLES（示例）部分

#### TLDR Pages
- **链接**: https://tldr.sh/
- **类型**: 简化版命令手册
- **语言**: 多语言（包括中文）
- **核心价值**: 相比冗长的man pages，TLDR提供简洁的命令示例，适合快速查询。
- **安装使用**:
  ```bash
  npm install -g tldr
  tldr tar  # 查看tar命令的简明示例
  ```

#### ExplainShell
- **链接**: https://explainshell.com/
- **类型**: 命令解析工具
- **语言**: 英文
- **核心价值**: 输入任何Shell命令，网站会逐个解释每个参数的含义。对于理解复杂的命令行非常有帮助。
- **使用示例**: 输入 `tar -xzvf file.tar.gz`，网站会解释每个参数的作用

### 🎯 实战项目和练习

#### The Art of Command Line (GitHub)
- **链接**: https://github.com/jlevy/the-art-of-command-line
- **类型**: GitHub开源项目
- **语言**: 多语言（包括中文）
- **Star数**: 超过150k
- **核心价值**: 这是一份精心整理的命令行使用指南，涵盖了从基础到高级的各种技巧。特别适合已经入门的开发者进一步提升。
- **推荐章节**:
  - Basics（基础）
  - Everyday use（日常使用）
  - Processing files and data（文件和数据处理）
  - System debugging（系统调试）

#### Linux Command Line Exercises
- **链接**: https://cmdchallenge.com/
- **类型**: 在线练习平台
- **费用**: 完全免费
- **语言**: 英文
- **核心特点**:
  - 浏览器中直接练习
  - 从简单到复杂的命令挑战
  - 实时反馈
  - 可以查看其他人的解决方案

### 🔧 工具和速查表

#### Linux Command Line Cheat Sheet (DaveChild)
- **链接**: https://cheatography.com/davechild/cheat-sheets/linux-command-line/
- **类型**: PDF速查表
- **语言**: 英文
- **核心价值**: 一页纸总结最常用的Linux命令，可以打印出来贴在桌面上

#### Oh My Zsh
- **链接**: https://ohmyz.sh/
- **类型**: Shell增强工具
- **核心价值**: 
  - 提供更强大的命令行体验
  - 自动补全和语法高亮
  - 丰富的插件生态
  - 美观的主题
- **安装**:
  ```bash
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  ```

#### tmux Cheat Sheet
- **链接**: https://tmuxcheatsheet.com/
- **类型**: 速查表
- **语言**: 英文
- **核心价值**: tmux是远程管理机器人的必备工具，这个速查表总结了所有常用快捷键

### 🌏 中文资源

#### 《鸟哥的Linux私房菜》
- **作者**: 鸟哥（蔡德明）
- **类型**: 在线教程 + 实体书
- **链接**: http://linux.vbird.org/
- **语言**: 繁体中文（有简体版）
- **核心价值**: 华语世界最知名的Linux教程，内容详实，讲解透彻。虽然部分内容略显陈旧，但基础知识依然适用。
- **推荐章节**:
  - 第6章：Linux的文件权限与目录配置
  - 第10章：认识与学习BASH
  - 第11章：正则表达式与文件格式化处理

#### Linux中国（开源社区）
- **链接**: https://linux.cn/
- **类型**: 中文Linux资讯和教程网站
- **核心价值**: 提供大量中文Linux教程、新闻和技术文章

#### 实验楼 - Linux基础入门
- **链接**: https://www.lanqiao.cn/courses/1
- **类型**: 在线实验平台
- **语言**: 中文
- **费用**: 部分免费
- **核心特点**:
  - 提供在线Linux环境
  - 边学边练
  - 有配套的实验指导

### 📺 B站推荐视频

#### 【韩顺平】一周学会Linux
- **UP主**: 韩顺平
- **时长**: 约30小时
- **观看量**: 超过500万
- **核心内容**: 从零基础到系统管理的完整课程
- **为什么推荐**: 讲解详细，适合中文学习者系统学习

#### 【黑马程序员】Linux从入门到精通
- **UP主**: 黑马程序员
- **时长**: 约20小时
- **观看量**: 超过300万
- **核心内容**: Linux基础 + Shell脚本 + 实战项目
- **为什么推荐**: 内容新颖，有实战项目，适合开发者

### 🤖 机器人开发专用资源

#### ROS 2 Documentation - Linux Prerequisites
- **链接**: https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debians.html
- **类型**: 官方文档
- **核心价值**: ROS 2官方文档中关于Linux环境配置的部分，专门针对机器人开发

#### Raspberry Pi Documentation
- **链接**: https://www.raspberrypi.com/documentation/computers/os.html
- **类型**: 官方文档
- **语言**: 英文
- **核心价值**: 如果你的机器人使用树莓派，这是必读的官方文档

#### NVIDIA Jetson Linux Developer Guide
- **链接**: https://docs.nvidia.com/jetson/
- **类型**: 官方文档
- **语言**: 英文
- **核心价值**: 使用Jetson系列开发板的开发者必读

### 💡 学习建议

1. **循序渐进**: 先掌握基础命令（cd, ls, cp, mv等），再学习高级工具（grep, sed, awk）
2. **多动手**: 命令行技能只能通过实践掌握，建议每天至少练习30分钟
3. **建立笔记**: 记录常用命令和技巧，形成自己的速查手册
4. **参与社区**: 加入Linux相关的论坛和社区，向他人学习
5. **实战项目**: 尝试用命令行完成实际的机器人开发任务

### 🔗 相关章节

- 第8章：Python编程 - 学习如何在Linux环境下进行Python开发
- 第9章：ROS 2核心概念 - ROS 2的安装和使用都依赖Linux命令行
- 第6章：Arduino编程 - 学习如何在Linux下使用Arduino CLI

---

**版权说明**: 以上资源仅供个人学习使用。部分资源可能需要付费或注册。请尊重知识产权，支持正版。

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
