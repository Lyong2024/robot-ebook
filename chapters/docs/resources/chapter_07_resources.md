# 第7章拓展资源：Linux命令行基础

> 本页面为第7章提供深度拓展资源，涵盖Linux系统管理、Shell编程和ROS开发环境配置。

---

## 📖 7.1 Linux学习资源

### 《鸟哥的Linux私房菜》
**作者：** 鸟哥  
**出版社：** 人民邮电出版社  
**简介：** 中文Linux入门经典教材，深入浅出。

**核心章节：**
- 第5章：首次登录与在线求助
- 第6章：Linux文件权限与目录配置
- 第10章：vim程序编辑器
- 第11章：认识与学习BASH

**在线版：** http://linux.vbird.org/

---

### Linux Command Line官方文档
**链接：** https://www.gnu.org/software/bash/manual/  
**简介：** Bash官方手册，权威参考。

---

### 《The Linux Command Line》
**作者：** William Shotts  
**简介：** 英文Linux命令行经典教材。

**免费PDF：** http://linuxcommand.org/tlcl.php

---

## 🎓 7.2 在线课程

### "Linux for Robotics" - The Construct
**链接：** https://www.theconstructsim.com/  
**简介：** 专门为机器人开发者设计的Linux课程。

### "Introduction to Linux" - edX (Linux Foundation)
**时长：** 14周  
**简介：** Linux基金会官方课程，免费。

**链接：** https://www.edx.org/course/introduction-to-linux

---

## 💻 7.3 常用命令速查

### 文件操作
```bash
# 列出文件
ls -la

# 切换目录
cd /path/to/directory

# 创建目录
mkdir -p my_project/src

# 复制文件
cp source.txt destination.txt

# 移动/重命名
mv old_name.txt new_name.txt

# 删除文件
rm file.txt
rm -rf directory/  # 递归删除目录
```

### 文件权限
```bash
# 修改权限
chmod 755 script.sh
chmod +x script.sh  # 添加执行权限

# 修改所有者
chown user:group file.txt
```

### 进程管理
```bash
# 查看进程
ps aux | grep ros

# 终止进程
kill PID
killall process_name

# 后台运行
command &

# 查看系统资源
top
htop
```

---

## 🛠️ 7.4 Shell脚本编程

### Bash脚本基础

**示例：ROS环境配置脚本**
```bash
#!/bin/bash

# ROS 2环境配置脚本
echo "配置ROS 2环境..."

# 设置ROS 2版本
ROS_DISTRO="humble"

# Source ROS 2
source /opt/ros/${ROS_DISTRO}/setup.bash

# Source工作空间
if [ -f ~/ros2_ws/install/setup.bash ]; then
    source ~/ros2_ws/install/setup.bash
    echo "工作空间已加载"
fi

# 设置环境变量
export ROS_DOMAIN_ID=42
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

echo "ROS 2环境配置完成！"
```

---

## 📚 7.5 进阶主题

### 系统管理

#### systemd服务管理
```bash
# 启动服务
sudo systemctl start service_name

# 停止服务
sudo systemctl stop service_name

# 开机自启
sudo systemctl enable service_name

# 查看服务状态
sudo systemctl status service_name
```

#### 网络配置
```bash
# 查看网络接口
ip addr show

# 测试连接
ping google.com

# 查看端口占用
netstat -tulpn
ss -tulpn
```

---

## 🎥 7.6 视频教程

### "Linux命令行基础" - 中国大学MOOC
**平台：** 中国大学MOOC  
**简介：** 中文Linux命令行教程。

### "Linux Tutorial for Beginners" - freeCodeCamp
**平台：** YouTube  
**时长：** 2小时  
**简介：** 完整的Linux入门教程。

---

**最后更新：** 2024年6月
