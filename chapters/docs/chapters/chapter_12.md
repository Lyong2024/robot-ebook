# 第12章：计算机视觉基础

## 学习目标

- 掌握 OpenCV 基础操作
- 学会图像处理和特征提取
- 理解目标检测和跟踪
- 掌握深度学习视觉模型
- 能够在 ROS 2 中集成视觉功能
- 了解常见的视觉应用场景

## 12.1 OpenCV 基础

### 安装

```bash
pip3 install opencv-python opencv-contrib-python
```

### 读取和显示图像

```python
import cv2
import numpy as np

# 读取图像
image = cv2.imread('image.jpg')

# 显示图像
cv2.imshow('Image', image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# 保存图像
cv2.imwrite('output.jpg', image)

# 获取图像属性
height, width, channels = image.shape
print(f'Size: {width}x{height}, Channels: {channels}')
```

### 颜色空间转换

```python
# BGR to RGB
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# BGR to Gray
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# BGR to HSV
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
```

### 图像基本操作

```python
# 裁剪
cropped = image[100:300, 200:400]

# 缩放
resized = cv2.resize(image, (640, 480))

# 旋转
center = (width // 2, height // 2)
rotation_matrix = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(image, rotation_matrix, (width, height))

# 翻转
flipped_h = cv2.flip(image, 1)  # 水平翻转
flipped_v = cv2.flip(image, 0)  # 垂直翻转
```

### 绘图

```python
# 画线
cv2.line(image, (0, 0), (100, 100), (0, 255, 0), 2)

# 画矩形
cv2.rectangle(image, (50, 50), (200, 200), (255, 0, 0), 2)

# 画圆
cv2.circle(image, (150, 150), 50, (0, 0, 255), -1)

# 写文字
cv2.putText(image, 'Hello', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 
            1, (255, 255, 255), 2)
```

## 12.2 图像处理

### 滤波

```python
# 高斯模糊(去噪)
blurred = cv2.GaussianBlur(image, (5, 5), 0)

# 中值滤波(去椒盐噪声)
median = cv2.medianBlur(image, 5)

# 双边滤波(保边去噪)
bilateral = cv2.bilateralFilter(image, 9, 75, 75)
```

### 边缘检测

```python
# Canny 边缘检测
edges = cv2.Canny(gray, 50, 150)

# Sobel 边缘检测
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=5)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=5)
```

### 形态学操作

```python
# 定义核
kernel = np.ones((5, 5), np.uint8)

# 腐蚀
erosion = cv2.erode(image, kernel, iterations=1)

# 膨胀
dilation = cv2.dilate(image, kernel, iterations=1)

# 开运算(先腐蚀后膨胀，去除小噪点)
opening = cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

# 闭运算(先膨胀后腐蚀，填充小孔)
closing = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
```

### 阈值处理

```python
# 二值化
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# 自适应阈值
adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                  cv2.THRESH_BINARY, 11, 2)

# Otsu 阈值
_, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
```

## 12.3 颜色检测

### HSV 颜色空间

HSV(色调、饱和度、明度)比 RGB 更适合颜色检测。

```python
def detect_color(image, lower_hsv, upper_hsv):
    # 转换到 HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # 创建掩码
    mask = cv2.inRange(hsv, lower_hsv, upper_hsv)
    
    # 形态学操作去噪
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # 应用掩码
    result = cv2.bitwise_and(image, image, mask=mask)
    
    return mask, result

# 红色检测(红色在 HSV 中跨越 0°)
lower_red1 = np.array([0, 100, 100])
upper_red1 = np.array([10, 255, 255])
lower_red2 = np.array([160, 100, 100])
upper_red2 = np.array([180, 255, 255])

mask1, _ = detect_color(image, lower_red1, upper_red1)
mask2, _ = detect_color(image, lower_red2, upper_red2)
red_mask = cv2.bitwise_or(mask1, mask2)

# 绿色检测
lower_green = np.array([40, 40, 40])
upper_green = np.array([80, 255, 255])
green_mask, green_result = detect_color(image, lower_green, upper_green)

# 蓝色检测
lower_blue = np.array([100, 100, 100])
upper_blue = np.array([130, 255, 255])
blue_mask, blue_result = detect_color(image, lower_blue, upper_blue)
```

### 轮廓检测

```python
# 查找轮廓
contours, hierarchy = cv2.findContours(mask, cv2.RETR_EXTERNAL, 
                                        cv2.CHAIN_APPROX_SIMPLE)

# 绘制轮廓
cv2.drawContours(image, contours, -1, (0, 255, 0), 2)

# 分析轮廓
for contour in contours:
    # 面积
    area = cv2.contourArea(contour)
    
    # 周长
    perimeter = cv2.arcLength(contour, True)
    
    # 边界矩形
    x, y, w, h = cv2.boundingRect(contour)
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    # 最小外接圆
    (cx, cy), radius = cv2.minEnclosingCircle(contour)
    cv2.circle(image, (int(cx), int(cy)), int(radius), (255, 0, 0), 2)
    
    # 质心
    M = cv2.moments(contour)
    if M['m00'] != 0:
        cx = int(M['m10'] / M['m00'])
        cy = int(M['m01'] / M['m00'])
        cv2.circle(image, (cx, cy), 5, (0, 0, 255), -1)
```

## 12.4 特征检测

### ORB 特征

```python
# 创建 ORB 检测器
orb = cv2.ORB_create()

# 检测关键点和描述符
keypoints, descriptors = orb.detectAndCompute(gray, None)

# 绘制关键点
image_with_keypoints = cv2.drawKeypoints(image, keypoints, None, 
                                          flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
```

### 特征匹配

```python
# 读取两张图像
img1 = cv2.imread('image1.jpg', 0)
img2 = cv2.imread('image2.jpg', 0)

# 检测特征
orb = cv2.ORB_create()
kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)

# 创建匹配器
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

# 匹配
matches = bf.match(des1, des2)

# 排序
matches = sorted(matches, key=lambda x: x.distance)

# 绘制匹配
result = cv2.drawMatches(img1, kp1, img2, kp2, matches[:10], None, 
                          flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
```

## 12.5 目标检测

### ArUco 标记检测

ArUco 是一种常用的视觉标记，用于机器人定位和姿态估计。

```python
import cv2.aruco as aruco

def detect_aruco(image):
    # 转换为灰度
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # 创建字典
    aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_4X4_50)
    parameters = aruco.DetectorParameters()
    
    # 检测
    corners, ids, rejected = aruco.detectMarkers(gray, aruco_dict, parameters=parameters)
    
    # 绘制
    if ids is not None:
        aruco.drawDetectedMarkers(image, corners, ids)
        
        for i, corner in enumerate(corners):
            # 计算中心
            center = corner[0].mean(axis=0).astype(int)
            cv2.circle(image, tuple(center), 5, (0, 0, 255), -1)
            
            # 显示 ID
            cv2.putText(image, f'ID: {ids[i][0]}', tuple(center), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    return image, corners, ids

# 使用
result, corners, ids = detect_aruco(image)
cv2.imshow('ArUco Detection', result)
```

### 生成 ArUco 标记

```python
def generate_aruco(marker_id, size=200):
    aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_4X4_50)
    marker = aruco.generateImageMarker(aruco_dict, marker_id, size)
    cv2.imwrite(f'aruco_{marker_id}.png', marker)
    return marker

# 生成 ID 为 0 的标记
marker = generate_aruco(0)
```

### YOLO 目标检测

使用预训练的 YOLO 模型进行目标检测。

```python
# 加载 YOLO
net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

# 加载类别
with open('coco.names', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

def detect_objects(image):
    height, width = image.shape[:2]
    
    # 预处理
    blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    
    # 推理
    outputs = net.forward(output_layers)
    
    # 解析结果
    boxes = []
    confidences = []
    class_ids = []
    
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            
            if confidence > 0.5:
                # 边界框
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)
    
    # 非极大值抑制
    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    
    # 绘制
    for i in indices:
        box = boxes[i]
        x, y, w, h = box
        label = f'{classes[class_ids[i]]}: {confidences[i]:.2f}'
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(image, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                    0.5, (0, 255, 0), 2)
    
    return image

# 使用
result = detect_objects(image)
```

## 12.6 目标跟踪

### 单目标跟踪

```python
# 创建跟踪器
tracker = cv2.TrackerKCF_create()

# 初始化(选择 ROI)
bbox = cv2.selectROI('Tracking', frame, False)
tracker.init(frame, bbox)

# 跟踪循环
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # 更新跟踪器
    success, bbox = tracker.update(frame)
    
    if success:
        x, y, w, h = [int(v) for v in bbox]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
    else:
        cv2.putText(frame, 'Lost', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                    1, (0, 0, 255), 2)
    
    cv2.imshow('Tracking', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
```

### 多目标跟踪

```python
class MultiTracker:
    def __init__(self):
        self.trackers = []
        self.next_id = 0
    
    def add_tracker(self, frame, bbox):
        tracker = cv2.TrackerKCF_create()
        tracker.init(frame, bbox)
        self.trackers.append({
            'id': self.next_id,
            'tracker': tracker,
            'bbox': bbox
        })
        self.next_id += 1
    
    def update(self, frame):
        results = []
        for track in self.trackers:
            success, bbox = track['tracker'].update(frame)
            if success:
                track['bbox'] = bbox
                results.append({
                    'id': track['id'],
                    'bbox': bbox
                })
        return results
```

## 12.7 ROS 2 视觉节点

### 颜色跟踪节点

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import cv2
import numpy as np

class ColorTrackerNode(Node):
    def __init__(self):
        super().__init__('color_tracker')
        
        self.bridge = CvBridge()
        
        # 参数
        self.declare_parameter('target_color', 'red')
        self.declare_parameter('min_area', 1000)
        
        target_color = self.get_parameter('target_color').value
        self.min_area = self.get_parameter('min_area').value
        
        # 颜色范围
        self.color_ranges = {
            'red': [(np.array([0, 100, 100]), np.array([10, 255, 255])),
                    (np.array([160, 100, 100]), np.array([180, 255, 255]))],
            'green': [(np.array([40, 40, 40]), np.array([80, 255, 255]))],
            'blue': [(np.array([100, 100, 100]), np.array([130, 255, 255]))]
        }
        
        self.target_ranges = self.color_ranges[target_color]
        
        # 订阅和发布
        self.image_sub = self.create_subscription(
            Image, 'image_raw', self.image_callback, 10
        )
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.debug_pub = self.create_publisher(Image, 'debug_image', 10)
        
        self.get_logger().info(f'Tracking {target_color} objects')
    
    def image_callback(self, msg):
        # 转换图像
        cv_image = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
        hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)
        
        # 创建掩码
        mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
        for lower, upper in self.target_ranges:
            mask = cv2.bitwise_or(mask, cv2.inRange(hsv, lower, upper))
        
        # 形态学操作
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        
        # 查找轮廓
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, 
                                        cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # 找最大轮廓
            largest_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_contour)
            
            if area > self.min_area:
                # 计算质心
                M = cv2.moments(largest_contour)
                cx = int(M['m10'] / M['m00'])
                cy = int(M['m01'] / M['m00'])
                
                # 绘制
                cv2.drawContours(cv_image, [largest_contour], -1, (0, 255, 0), 2)
                cv2.circle(cv_image, (cx, cy), 5, (0, 0, 255), -1)
                
                # 计算控制命令
                height, width = cv_image.shape[:2]
                error_x = cx - width / 2
                
                twist = Twist()
                twist.linear.x = 0.2  # 前进
                twist.angular.z = -error_x / (width / 2) * 0.5  # 转向
                
                self.cmd_pub.publish(twist)
                
                self.get_logger().info(f'Target at ({cx}, {cy}), area: {area:.0f}')
            else:
                # 停止
                self.cmd_pub.publish(Twist())
        else:
            # 停止
            self.cmd_pub.publish(Twist())
        
        # 发布调试图像
        debug_msg = self.bridge.cv2_to_imgmsg(cv_image, 'bgr8')
        self.debug_pub.publish(debug_msg)

def main(args=None):
    rclpy.init(args=args)
    node = ColorTrackerNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 12.8 深度学习视觉

### 使用 PyTorch 进行推理

```python
import torch
import torchvision

# 加载预训练模型
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

def detect_with_pytorch(image):
    # 预处理
    transform = torchvision.transforms.Compose([
        torchvision.transforms.ToTensor()
    ])
    
    input_tensor = transform(image)
    input_batch = input_tensor.unsqueeze(0)
    
    # 推理
    with torch.no_grad():
        predictions = model(input_batch)
    
    # 解析结果
    boxes = predictions[0]['boxes'].numpy()
    labels = predictions[0]['labels'].numpy()
    scores = predictions[0]['scores'].numpy()
    
    # 绘制
    for box, label, score in zip(boxes, labels, scores):
        if score > 0.5:
            x1, y1, x2, y2 = box.astype(int)
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(image, f'{label}: {score:.2f}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    return image
```

## 本章小结

在本章中，我们学习了：

- OpenCV 基础操作
- 图像处理和滤波
- 颜色检测和轮廓分析
- 特征检测和匹配
- 目标检测（ArUco、YOLO）
- 目标跟踪
- ROS 2 视觉节点开发
- 深度学习视觉应用

计算机视觉是机器人感知的重要组成部分，掌握视觉技术将大大扩展机器人的能力。

## 推荐资源

- **OpenCV 文档**：https://docs.opencv.org/
- **PyImageSearch**：https://pyimagesearch.com/
- **YOLO**：https://pjreddie.com/darknet/yolo/

## 动手练习

**练习 1：颜色跟踪**

实现一个颜色跟踪节点，让机器人跟随特定颜色的物体。

**练习 2：ArUco 导航**

使用 ArUco 标记作为导航点，让机器人依次访问多个标记。

**练习 3：物体识别**

使用 YOLO 或其他模型识别常见物体，并语音播报。

## 学习目标复查

通过以下问题检查你是否掌握了本章的核心内容：

- [ ] 你能否使用 OpenCV 完成基本的图像读取、显示、保存操作，并理解 BGR 与 RGB 颜色空间的区别？

- [ ] 你能否实现基于 HSV 颜色空间的颜色检测，并解释为什么 HSV 比 RGB 更适合颜色识别任务？

- [ ] 你能否使用至少两种特征检测算法（如 SIFT、ORB 或角点检测）提取图像特征，并理解它们的应用场景差异？

- [ ] 你能否使用预训练模型（如 YOLO 或 Haar Cascade）实现目标检测，并在 ROS 2 中发布检测结果？

- [ ] 你能否实现至少一种目标跟踪算法（如 KCF、CSRT 或基于颜色的跟踪），并理解跟踪与检测的区别？

- [ ] 你能否创建一个完整的 ROS 2 视觉节点，订阅相机图像话题、处理图像并发布结果（如检测框或跟踪位置）？

- [ ] 你能否描述深度学习视觉模型（如 CNN）的基本原理，并使用 TensorFlow 或 PyTorch 加载预训练模型进行推理？

## 问答环节

### Q1: 在 ROS 2 机器人视觉系统中，为什么通常需要使用 cv_bridge，它解决了什么核心问题？在实际使用中有哪些注意事项？

**答**：cv_bridge 是 ROS 2 视觉系统中的关键桥梁组件，它解决了 ROS 消息格式与 OpenCV 图像格式之间的转换问题。ROS 2 使用 sensor_msgs/Image 消息类型在节点间传输图像数据，这种格式针对网络传输和序列化进行了优化；而 OpenCV 使用 cv::Mat 或 numpy 数组格式进行图像处理，这种格式针对计算效率进行了优化。cv_bridge 提供了高效的零拷贝或最小拷贝转换机制，避免了手动解析图像数据的复杂性和性能损失。

在实际使用中需要特别注意编码格式的匹配问题。常见的陷阱包括：RGB 与 BGR 通道顺序的混淆（ROS 标准是 RGB，OpenCV 默认是 BGR）、图像深度不匹配（8位、16位、浮点型）、以及压缩图像的处理。建议在转换时明确指定目标编码格式，例如使用 `cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')`。此外，在处理高分辨率或高帧率图像时，要注意内存管理和转换开销，必要时可以考虑使用图像传输插件（image_transport）来支持压缩传输，在带宽受限的场景下显著提升性能。

### Q2: 在移动机器人的颜色检测应用中，为什么 HSV 色彩空间比 RGB 更适合？如何处理不同光照条件下的颜色检测鲁棒性问题？

**答**：HSV（色调-饱和度-明度）色彩空间在机器人颜色检测中具有显著优势，主要原因是它将颜色信息（Hue）与亮度信息（Value）分离。在 RGB 空间中，同一物体在不同光照下的 RGB 值会整体变化，导致阈值范围难以设定；而在 HSV 空间中，色调（H）通道对光照变化相对不敏感，可以用较窄的 H 范围配合较宽的 S 和 V 范围来适应光照变化。例如，检测红色物体时，可以设置 H 在 0-10 和 170-180（红色在色环两端），S 在 100-255，V 在 50-255，这样即使光照变暗，只要物体保持红色特征就能被检测到。

然而，仅依赖 HSV 仍不足以应对复杂光照环境。实践中常用的鲁棒性增强方法包括：首先，使用自适应阈值或直方图均衡化预处理图像，补偿整体亮度变化；其次，实现动态阈值调整机制，通过在线学习或用户标定来适应当前环境；第三，结合形态学操作（腐蚀、膨胀）去除噪声和填补空洞，提高检测稳定性。对于室外机器人，还可以考虑使用多帧时间滤波、结合深度信息验证、或采用学习型方法（如训练轻量级分类器）来替代纯阈值方法。在工业应用中，主动光源（如环形 LED）也是提高颜色检测鲁棒性的有效硬件方案。

### Q3: 在实现机器人目标跟踪时，如何选择合适的跟踪算法？KCF、CSRT 和 DeepSORT 各适用于什么场景？

**答**：目标跟踪算法的选择需要在精度、速度和鲁棒性之间权衡，同时考虑机器人的计算资源和应用场景。KCF（Kernelized Correlation Filters）是一种经典的相关滤波跟踪器，速度极快（可达数百 FPS），适合资源受限的嵌入式平台和需要实时响应的场景，如无人机跟踪、快速移动物体。但 KCF 对遮挡和尺度变化敏感，容易跟丢。CSRT（Discriminative Correlation Filter with Channel and Spatial Reliability）是 KCF 的改进版本，引入了空间可靠性图和通道权重，精度显著提升，能更好地处理遮挡和形变，但速度降低到 20-30 FPS，适合精度要求较高且目标运动相对平稳的场景，如服务机器人跟踪人员、AGV 跟踪货物。

DeepSORT 则是基于深度学习的多目标跟踪算法，结合了 YOLO/SSD 等检测器和深度外观特征（Re-ID），能够处理目标的长时间遮挡、ID 切换和多目标关联问题。它特别适合复杂环境下的多目标跟踪场景，如自动驾驶中跟踪多个行人和车辆、仓储机器人跟踪多个货架。DeepSORT 的计算开销较大，通常需要 GPU 加速，但可以通过使用轻量级检测器（如 YOLOv8n）和降低输入分辨率来优化。在 ROS 2 实践中，建议先用 KCF 快速验证系统架构，再根据实际性能需求升级到 CSRT 或 DeepSORT。对于需要长期稳定跟踪的应用，还可以考虑混合策略：用快速检测器定期重新初始化跟踪器，避免误差累积。

### Q4: 在 ROS 2 中集成 YOLO 等深度学习视觉模型时，如何优化推理性能？从模型选择、部署方式到系统架构有哪些最佳实践？

**答**：深度学习视觉模型的性能优化是多层次的系统工程。首先在模型选择层面，应根据硬件平台选择合适的模型规模：在边缘设备（如 Jetson Nano）上优先选择 YOLOv8n、YOLOv8s 等轻量级模型，在高性能平台上可以使用 YOLOv8m/l。同时要关注模型的输入分辨率，640x640 是精度和速度的良好平衡点，对于远距离小目标检测可能需要更高分辨率，而近距离大目标可以降低到 416x416 甚至 320x320。模型量化是另一个关键优化手段，INT8 量化可以在精度损失小于 2% 的情况下将推理速度提升 2-4 倍，TensorRT 和 OpenVINO 都提供了成熟的量化工具链。

在部署架构层面，建议将视觉推理节点与控制节点解耦，使用独立的推理进程或容器，避免推理延迟阻塞控制回路。可以采用异步推理模式：主线程持续接收图像并将最新帧送入推理队列，推理线程处理完成后发布结果，这样即使单帧推理耗时 100ms，系统仍能保持 30fps 的图像接收。对于多摄像头系统，可以使用批处理推理（batch inference）来提高 GPU 利用率。此外，要合理设置 ROS 2 的 QoS 策略，对于视觉话题使用 BEST_EFFORT 可靠性和较小的队列深度（depth=1），避免处理过时的图像数据。在资源受限的场景下，还可以考虑降低推理频率（如每 3 帧推理一次）或使用 ROI（感兴趣区域）裁剪来减少计算量，结合目标跟踪算法在检测间隙维持目标位置。

### Q5: 在开发机器人视觉应用时遇到"图像接收正常但处理结果异常"的问题，应该如何系统性地排查？有哪些常见的隐蔽错误？

**答**：视觉处理结果异常的排查需要遵循"分层验证"的原则，从数据源到算法逐层检查。首先验证原始图像数据的完整性：使用 `rqt_image_view` 或 `ros2 run image_tools showimage` 直接可视化原始图像话题，确认图像内容、分辨率、帧率是否符合预期。然后检查图像编码格式，使用 `ros2 topic echo /camera/image_raw --once` 查看消息的 encoding 字段，确认是否与代码中的假设一致。一个常见的隐蔽错误是相机发布的是 `mono8` 或 `rgb8` 格式，但代码假设是 `bgr8`，导致通道错乱或转换失败。

第二层排查是算法参数和预处理流程。建议在关键处理步骤后插入可视化输出，例如在颜色阈值分割后发布 mask 图像、在特征检测后绘制关键点、在目标检测后标注边界框。这样可以快速定位问题出现在哪个环节。常见的隐蔽错误包括：坐标系混淆（图像坐标 vs 机器人坐标）、数据类型溢出（uint8 运算结果超出 0-255 范围）、归一化错误（深度学习模型输入需要归一化到 [0,1] 或 [-1,1]）、以及时间戳不同步（使用了错误的 TF 变换时间）。对于深度学习模型，还要检查预处理是否与训练时一致，包括均值减法、标准差归一化、通道顺序等。最后，使用 `ros2 topic hz` 和 `ros2 topic bw` 检查话题的发布频率和带宽，确认没有性能瓶颈导致的数据丢失或延迟。建立单元测试用例，使用固定的测试图像验证算法逻辑，可以有效隔离环境因素的干扰。
