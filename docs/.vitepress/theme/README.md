# Claude风格主题实现文档

## 概述

这是一个为《机器人学电子书》项目定制的VitePress主题，灵感来自Claude AI的设计语言。主题强调温暖、专业和易读性，提供亮色和暗色两种模式。

## 设计理念

### 核心价值
- **温暖而专业**：橙铜色主色调营造温暖感，同时保持专业性
- **清晰易读**：优化的对比度和字体大小确保长时间阅读舒适
- **流畅交互**：精心设计的过渡动画和交互反馈
- **响应式设计**：适配桌面、平板和移动设备

### 配色系统

#### 亮色主题
```css
--color-primary: #CC6633;        /* 橙铜色 - 主色调 */
--color-primary-light: #E8956F;  /* 浅橙铜 - 悬停态 */
--color-primary-dark: #A85229;   /* 深橙铜 - 激活态 */
--color-bg-primary: #FAF9F6;     /* 温暖米白 - 主背景 */
--color-bg-secondary: #FFFFFF;   /* 纯白 - 容器背景 */
--color-text-primary: #1A1A1A;   /* 深灰 - 主文字 */
--color-text-secondary: #666666; /* 中灰 - 次要文字 */
```

#### 暗色主题
```css
--color-primary: #E8956F;        /* 柔和橙铜 */
--color-primary-light: #F5B89A;  /* 更浅橙铜 */
--color-primary-dark: #CC6633;   /* 标准橙铜 */
--color-bg-primary: #1A1A1A;     /* 深色背景 */
--color-bg-secondary: #242424;   /* 容器背景 */
--color-text-primary: #E5E5E5;   /* 浅灰文字 */
--color-text-secondary: #A0A0A0; /* 次要文字 */
```

## 文件结构

```
.vitepress/theme/
├── index.ts                 # 主题入口
├── Layout.vue              # 布局组件
├── ThemeToggle.vue         # 主题切换按钮
├── theme-toggle.ts         # 主题切换逻辑
├── styles/
│   ├── vars.css           # CSS变量定义
│   ├── base.css           # 基础样式
│   ├── components.css     # 组件样式
│   └── responsive.css     # 响应式样式
├── README.md              # 本文档
└── TESTING.md             # 测试清单
```

## 核心功能

### 1. 主题切换

#### 实现方式
- 使用localStorage持久化用户偏好
- 支持自动跟随系统主题
- 通过CSS类名切换主题
- 避免页面闪烁

#### 使用方法
```typescript
import { setTheme, getTheme, toggleTheme } from './theme-toggle'

// 设置主题
setTheme('dark')  // 'light' | 'dark' | 'auto'

// 获取当前主题
const theme = getTheme()

// 切换主题
toggleTheme()
```

### 2. 响应式布局

#### 断点设置
```css
/* 移动端 */
@media (max-width: 767px) { }

/* 平板端 */
@media (min-width: 768px) and (max-width: 1279px) { }

/* 桌面端 */
@media (min-width: 1280px) { }
```

#### 适配策略
- **移动端**：汉堡菜单、全宽内容、移除圆角
- **平板端**：可折叠侧边栏、自适应宽度
- **桌面端**：固定侧边栏、居中内容、右侧目录

### 3. 组件样式

#### 导航栏
- 固定顶部，带阴影
- 包含标题、菜单和主题切换按钮
- 响应式汉堡菜单

#### 侧边栏
- 章节导航
- 活动项橙铜色高亮
- 悬停效果和过渡动画

#### 内容容器
- 白色/深色背景
- 圆角和阴影
- 最大宽度限制

#### 代码块
- 语法高亮
- 圆角和阴影
- 横向滚动支持

#### 引用块
- 橙铜色左边框
- 半透明背景
- 斜体文字

#### 表格
- 边框和间距
- 表头背景色
- 行悬停效果

#### 提示框
- 四种类型：tip, warning, danger, info
- 彩色左边框
- 对应的背景色

### 4. 交互状态

#### 悬停效果
```css
transition: all 0.2s ease;
```
- 颜色变化
- 背景高亮
- 轻微缩放

#### 焦点状态
```css
outline: 2px solid var(--color-focus-ring);
outline-offset: 2px;
```
- 橙铜色焦点环
- 适当的偏移量
- 键盘导航友好

#### 激活状态
- 按钮按下效果
- 缩小动画
- 即时反馈

## 性能优化

### CSS变量
- 使用CSS自定义属性实现主题
- 避免重复定义
- 运行时动态切换

### 过渡动画
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```
- 统一的过渡时长
- 合理的缓动函数
- 避免过度动画

### 字体加载
- 系统字体栈优先
- 优雅降级
- 避免字体闪烁

## 可访问性

### 键盘导航
- Tab键顺序合理
- 焦点可见性好
- Enter/Space激活

### 屏幕阅读器
- 语义化HTML
- aria-label属性
- 标题层级正确

### 颜色对比度
- 文字对比度 ≥ 4.5:1
- 大文字对比度 ≥ 3:1
- WCAG AA级别

## 浏览器兼容性

### 支持的浏览器
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+

### 使用的现代特性
- CSS自定义属性
- CSS Grid和Flexbox
- matchMedia API
- localStorage API

## 开发指南

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产版本
npm run docs:preview
```

### 修改主题

#### 修改配色
编辑 `styles/vars.css`，修改CSS变量值。

#### 添加组件样式
在 `styles/components.css` 中添加新的组件样式。

#### 调整响应式
在 `styles/responsive.css` 中修改断点和布局。

### 测试主题
1. 访问 http://localhost:5173/theme-test.html
2. 按照 `TESTING.md` 中的清单逐项测试
3. 在不同浏览器和设备上验证

## 最佳实践

### 颜色使用
- 使用CSS变量而非硬编码颜色
- 确保亮色和暗色主题都可读
- 保持足够的对比度

### 动画使用
- 使用统一的过渡时长
- 避免过度动画
- 尊重用户的动画偏好设置

### 响应式设计
- 移动优先的设计思路
- 使用相对单位（rem, em, %）
- 测试各种屏幕尺寸

## 常见问题

### Q: 主题切换后有闪烁？
A: 确保在HTML加载时立即应用主题，使用内联脚本或SSR。

### Q: 暗色主题对比度不够？
A: 调整 `--color-text-primary` 和 `--color-bg-primary` 的值。

### Q: 移动端布局错乱？
A: 检查 `responsive.css` 中的媒体查询和断点设置。

### Q: 代码高亮颜色不对？
A: 检查 `components.css` 中的代码块样式和语法高亮配置。

## 更新日志

### v1.0.0 (2026-05-31)
- ✅ 实现Claude风格配色系统
- ✅ 实现主题切换功能
- ✅ 应用主题到所有VitePress组件
- ✅ 优化响应式布局
- ✅ 完成测试和验证

## 贡献指南

欢迎提交问题和改进建议！

### 报告问题
请在GitHub Issues中描述：
- 问题现象
- 复现步骤
- 浏览器和设备信息
- 截图（如适用）

### 提交改进
1. Fork项目
2. 创建特性分支
3. 提交更改
4. 发起Pull Request

## 许可证

本主题遵循项目的整体许可证。

---

**维护者：** 机器人学电子书项目团队  
**最后更新：** 2026-05-31
