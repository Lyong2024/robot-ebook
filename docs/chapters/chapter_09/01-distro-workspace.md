# 9.1 发行版、安装与工作空间

上一节是 [全景](./index.md)。这一节结束时，你能在 Ubuntu 上选出一个还在维护的发行版，创建一个工作空间，并让 `ros2 run` 找到你自己的 Python 节点。

## 学习目标

- 按支持期限而不是按博客年份选发行版
- 用当前官方方式安装 Humble Desktop
- 分清 `src`、`build`、`install`、`log`，以及 underlay 和 overlay
- 交得出一个 `ament_python` 包，入口点、`setup.cfg`、`package.xml` 三者一致

## 9.1.1 2026 年 11 月还活着的发行版

ROS 2 每年五月左右发一版。偶数年是长期支持（LTS，大约五年），奇数年是普通版（大约一年半）。下面这张表按 [发行说明](https://docs.ros.org/en/rolling/Releases.html) 在 2026-11-25 的记录整理。EOL 只精确到月份。

| 发行版 | 发布 | 主要 Ubuntu | Python | EOL | 类型 |
| --- | --- | --- | --- | --- | --- |
| Humble Hawksbill | 2022-05 | 22.04 | 3.10 | 2027-05 | LTS |
| Jazzy Jalisco | 2024-05 | 24.04 | 3.12 | 2029-05 | LTS |
| Kilted Kaiju | 2025-05 | 24.04 | 3.12 | 2026-12 | 非 LTS |
| Lyrical Luth | 2026-05-22 | 26.04 | 3.12–3.14 | 2031-05 | LTS |

Rolling Ridley 是开发分支，允许原地不兼容更新，不适合拿来做产品基线。

不同发行版的节点不保证能互相发现。不要让 Humble 的驱动去连 Jazzy 的导航。

**怎么选：**

- 新机器、新项目，系统可以是 Ubuntu 26.04：用 **Lyrical**。它是 2026 年最新的 LTS。
- 机器已经是 Ubuntu 24.04，暂时不能升级：用 **Jazzy**（支持到 2029-05）。
- 课程、旧驱动或公司镜像锁在 Ubuntu 22.04：用 **Humble**。它仍受支持，但只到 2027-05。本章的命令按 Humble 写，包名里的 `humble` 换成你的发行版即可。
- 不要为新项目选 Kilted。2026 年 12 月它就到期。

Iron 及更早的发行版已经停止更新。

## 9.1.2 在 Ubuntu 22.04 上安装 Humble

官方安装页是 [Ubuntu (deb packages)](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)。仓库密钥现在由 `ros2-apt-source` 这个包安装，不要再抄 `apt-key adv` 的旧文章。

系统语言要是 UTF-8，并打开 Universe 仓库：

```bash
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

sudo apt install software-properties-common
sudo add-apt-repository universe
```

然后安装 ROS 的 apt 源。版本号取自 `ros-infrastructure/ros-apt-source` 的最新发布，deb 文件名带上 Ubuntu 代号（22.04 是 `jammy`）：

```bash
sudo apt update && sudo apt install curl -y
export ROS_APT_SOURCE_VERSION=$(curl -fsSL -o /dev/null -w '%{url_effective}' \
  https://github.com/ros-infrastructure/ros-apt-source/releases/latest | awk -F/ '{print $NF}')
curl -L -o /tmp/ros2-apt-source.deb \
  "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

22.04 的早期镜像要先 `sudo apt upgrade`，把 `systemd` 和 `udev` 升上去，再装 ROS。否则依赖求解可能卸掉系统关键包。见 [ros2/ros2#1272](https://github.com/ros2/ros2/issues/1272)。

```bash
sudo apt update
sudo apt install ros-humble-desktop
sudo apt install ros-dev-tools
```

`ros-humble-desktop` 含通信库、命令行、RViz 和教程。只要库、不要图形界面时用 `ros-humble-ros-base`。编译工具在 `ros-dev-tools` 里，desktop 不能代替它。

每个新终端都要加载环境。写进 `~/.bashrc` 可以少打一次，但工作空间的 overlay 不要写死在 bashrc 里和系统安装抢：

```bash
source /opt/ros/humble/setup.bash
```

装依赖索引用的 rosdep。注意包名是 `python3-rosdep`，不是容易混淆的 `python3-rosdep2`：

```bash
sudo apt install python3-rosdep
sudo rosdep init   # 一台机器只做一次
rosdep update
```

用 `ros2` 能打出用法、`ros2 doctor` 没有红字，安装就完成了。排错表在 [9.7](./07-cli-debugging.md)。

## 9.1.3 工作空间是一层覆盖

`/opt/ros/humble` 是 **underlay**：发行版装好的包。你自己的代码放在 **overlay**，编译后盖住同名包，但不改 `/opt/ros`。

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build
```

根目录会变成：

```text
ros2_ws/
  src/       只放包，一个包一个目录，禁止包里再套包
  build/     编译中间文件
  install/   安装前缀，运行前 source 这里
  log/       构建日志；屏幕上看不到的编译错误在这里
```

在**新终端**里按这个顺序加载：

```bash
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/setup.bash
```

`install/setup.bash` 会连带加载当初构建它的 underlay。`install/local_setup.bash` 只加入这一层工作空间，underlay 要你自己先 source。

官方教程要求：编过这个工作空间的终端不要再拿来 source 它；已经 source 了 overlay 的终端不要再拿来 `colcon build`。构建和运行分成两个终端。

常用参数：

| 命令 | 作用 |
| --- | --- |
| `colcon build --symlink-install` | 把 Python 文件以链接装进 `install/`，改 `.py` 后不用为这一文件重装 |
| `colcon build --packages-select my_pkg` | 只编这一个包 |
| `colcon build --packages-up-to my_pkg` | 编这个包和它在本工作空间里的依赖 |
| `colcon build --event-handlers console_direct+` | 编译输出打到终端 |

依赖从 `package.xml` 来，不要靠记忆 `apt install`：

```bash
cd ~/ros2_ws
rosdep install -i --from-path src --rosdistro humble -y
```

`-i` 表示工作空间里已有源码的包不要再从 apt 装一遍。

## 9.1.4 一个能跑起来的 Python 包

在已 source 的终端：

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python --license Apache-2.0 \
  --node-name hello_node my_robot_pkg
```

生成物：

```text
my_robot_pkg/
  package.xml
  setup.py
  setup.cfg
  resource/my_robot_pkg     空文件，给 ament 索引用
  my_robot_pkg/__init__.py
  my_robot_pkg/hello_node.py
  test/
```

`package.xml` 用 format 3。纯 Python 包对 `rclpy` 用 `exec_depend`，因为没有单独的编译期：

```xml
<depend>rclpy</depend>
```

应改成：

```xml
<exec_depend>rclpy</exec_depend>
```

`setup.py` 里的包名、版本、维护者、许可证要和 `package.xml` 逐字相同。入口点决定 `ros2 run` 的可执行名：

```python
entry_points={
    'console_scripts': [
        'hello_node = my_robot_pkg.hello_node:main',
    ],
},
```

`setup.cfg` 必须把脚本装到 `lib/<包名>`，否则 `ros2 run` 找不到：

```ini
[develop]
script_dir=$base/lib/my_robot_pkg
[install]
install_scripts=$base/lib/my_robot_pkg
```

节点本体保持官方教程的形状。定时器每秒记一次数，用来证明进程活着：

```python
import rclpy
from rclpy.node import Node


class HelloNode(Node):

    def __init__(self):
        super().__init__('hello_node')
        self.count = 0
        self.timer = self.create_timer(1.0, self.on_timer)
        self.get_logger().info('Hello, ROS 2')

    def on_timer(self):
        self.count += 1
        self.get_logger().info('count: %d' % self.count)


def main(args=None):
    rclpy.init(args=args)
    node = HelloNode()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

另开一个终端：

```bash
cd ~/ros2_ws
colcon build --symlink-install --packages-select my_robot_pkg
source install/setup.bash
ros2 run my_robot_pkg hello_node
```

应看到 `Hello, ROS 2`，然后每秒一行 `count`。`Ctrl-C` 结束。

## 9.1.5 什么时候改用 ament_cmake

C++ 节点用 `ament_cmake`。消息、服务、动作的定义包也只能是 `ament_cmake`，即使用它们的节点是 Python。接口包的写法在 [9.3](./03-interfaces-services-actions.md)。

同一个 `src/` 里可以同时放两种包，只要它们不是嵌套关系。

## 9.1.6 和 ROS 1 不同的地方

- 没有 `roscore`。发现由 DDS 完成，第一个节点自己就能跑。
- 构建工具是 `colcon`，不是 `catkin_make`。没有 `devel/` 目录。
- `source devel/setup.bash` 要换成 `source install/setup.bash`。
- 工作空间是 overlay，同名包会盖住 `/opt/ros` 里的包。

## 练习

在 `my_robot_pkg` 里加第二个入口 `hello_twice`，节点名用命令行改掉：

```bash
ros2 run my_robot_pkg hello_node --ros-args -r __node:=greeter
ros2 node list
```

`ros2 node list` 里应出现 `/greeter`。若仍是 `/hello_node`，说明重映射写在了 `--ros-args` 前面，或者运行的是没重新 source 的旧安装。

## 本节最常见的失败

| 现象 | 原因 |
| --- | --- |
| `ros2: command not found` | 这个终端没 source `/opt/ros/humble/setup.bash` |
| `Package 'my_robot_pkg' not found` | 没 source `install/setup.bash`，或包不在 `src/` |
| 改了 `.py` 但行为不变 | 没加 `--symlink-install`，或 source 的是另一份 `install/` |
| `colcon` 说找不到 `rclpy` | 构建终端没 source underlay |
| `ros2 run` 说找不到可执行文件 | `setup.cfg` 的 `lib/` 路径或 `console_scripts` 左值写错 |

## 来源

- [Releases](https://docs.ros.org/en/rolling/Releases.html)
- [REP 2000](https://www.ros.org/reps/rep-2000.html)
- [Humble Ubuntu 安装](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)
- [ros-apt-source](https://github.com/ros-infrastructure/ros-apt-source/)
- [创建工作空间](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-A-Workspace/Creating-A-Workspace.html)
- [创建包](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.html)
- [colcon 教程](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Colcon-Tutorial.html)

下一节：[9.2 计算图、话题与 QoS](./02-graph-topics-qos.md)。
