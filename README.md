# 机器人开发：从零基础到动手创造

交互式中文电子书。用 [VitePress](https://vitepress.dev/) 把 Markdown 章节渲染成可搜索、带侧边栏和本地全文检索的站点。

仓库：<https://github.com/Lyong2024/robot-ebook>

## 项目是什么

书名是《机器人开发：从零基础到动手创造》。站点标题、描述和语言写在 `docs/.vitepress/config.mts`：`lang` 为 `zh-CN`，本地搜索已打开，代码块显示行号，公式由 VitePress 内置数学支持渲染。

正文在 `docs/`，由 VitePress 作为站点根目录。根目录 `package.json` 的 `docs:dev` 会执行 `vitepress dev docs`。`docs/package.json` 里还有一套只在 `docs/` 目录内使用的脚本，版本锁在 VitePress `^1.6.4`。实际安装版本是 **VitePress 1.6.4**、**Vue 3**。

| 路径 | 作用 |
| --- | --- |
| `docs/index.md` | 首页（`layout: home`） |
| `docs/intro.md` | 前言与学习方法 |
| `docs/about.md` | 关于本书 |
| `docs/chapters/chapter_01.md` … `chapter_18.md` | 正文。第 9 章在 `chapter_09/` 目录 |
| `docs/appendix/` | 术语表、FAQ、调试、开源项目、贡献者等 |
| `docs/.vitepress/config.mts` | 导航、侧边栏、搜索、页脚 |
| `docs/.vitepress/theme/` | 自定义主题（橙铜色、亮色/暗色切换） |
| `docs/resources/` | 拓展资源索引 |
| `robot_ebook_complete.md` | 合并稿 |
| `split_chapters.py` | 按 `### 第N章` 把合并稿拆进 `docs/chapters/` |
| `VERSION.md` | 内容版本记录（v1.0.0-alpha、v2.0.0） |
| `LICENSE.md` | 正文许可说明 |

正文许可是 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)，见 `LICENSE.md`。`package.json` 使用 SPDX 标识 `CC-BY-NC-SA-4.0`。

读者看到的正文在 `docs/`。仓库根的 `appendix/` 是一份平行副本，站点不渲染它。改给读者看的附录时，改 `docs/appendix/`。

## 内容结构

侧边栏标题与各章 Markdown 的一级标题一致。第 9 章在目录 `docs/chapters/chapter_09/`，从全景页链到 9.1–9.8。

| 分组 | 侧边栏 | 文件与一级标题 |
| --- | --- | --- |
| 前言 | 开启你的机器人开发之旅 | [`docs/intro.md`](docs/intro.md) |
| 基础 | 第1章 定义、分类与发展史 | [`chapter_01.md`](docs/chapters/chapter_01.md) |
| 基础 | 第2章 运动学与动力学 | [`chapter_02.md`](docs/chapters/chapter_02.md) |
| 硬件 | 第3章 机器人硬件基础 | [`chapter_03.md`](docs/chapters/chapter_03.md) 从零开始选择组件 |
| 硬件 | 第4章 Arduino 与 ESP32 | [`chapter_04.md`](docs/chapters/chapter_04.md) 你的第一块开发板 |
| 硬件 | 第5章 电机与驱动 | [`chapter_05.md`](docs/chapters/chapter_05.md) |
| 硬件 | 第6章 电源管理与电路安全 | [`chapter_06.md`](docs/chapters/chapter_06.md) |
| 软件栈 | 第7章 Linux 命令行 | [`chapter_07.md`](docs/chapters/chapter_07.md) Linux 命令行：机器人开发者的必备技能 |
| 软件栈 | 第8章 Python 编程 | [`chapter_08.md`](docs/chapters/chapter_08.md) Python 编程：机器人的通用语言 |
| 软件栈 | 第9章 ROS 2 核心概念 | [`chapter_09/`](docs/chapters/chapter_09/index.md) 9.0–9.8：工作空间、话题与 QoS、服务与动作、参数与 Launch、tf 与 rosbag、执行器、命令行、DDS 与真机话题 |
| 传感器与导航 | 第10章 传感器集成 | [`chapter_10.md`](docs/chapters/chapter_10.md) 传感器集成与数据处理 |
| 传感器与导航 | 第11章 导航与路径规划 | [`chapter_11.md`](docs/chapters/chapter_11.md) 导航与路径规划 |
| 传感器与导航 | 第12章 计算机视觉 | [`chapter_12.md`](docs/chapters/chapter_12.md) 计算机视觉基础 |
| 应用 | 第13章 机械臂与操作 | [`chapter_13.md`](docs/chapters/chapter_13.md) 机械臂与操作 |
| 应用 | 第14章 人机交互与语音 | [`chapter_14.md`](docs/chapters/chapter_14.md) 人机交互与语音控制 |
| 应用 | 第15章 智能服务机器人 | [`chapter_15.md`](docs/chapters/chapter_15.md) 项目实战：智能服务机器人 |
| 前沿趋势 | 第16–17章 | 具身智能与大模型；人形机器人技术路线 |
| 综合项目 | 第18章 | [`chapter_18.md`](docs/chapters/chapter_18.md) 制作你自己的桌面机器人（巡线、避障、抓取） |

学习顺序：基础（1–2）→ 硬件（3–6）→ 软件栈（7–9）→ 传感器、导航与视觉（10–12）→ 机械臂、交互与项目（13–15）→ 前沿（16–17）→ 综合项目（18）。预计 150–300 小时。

附录在侧边栏中挂了三项：

- [高成就者名录](docs/appendix/contributors.md)
- [开源项目索引](docs/appendix/projects.md)
- [术语表](docs/appendix/glossary.md)

同目录还有 `faq.md`、`debugging_guide.md`、`hall_of_fame.md`、`open_source_projects.md`、`resource_updates.md`，没有全部放进侧边栏。

主题在默认 VitePress 主题上加了导航栏主题切换，样式在 `docs/.vitepress/theme/`（`color-palette.css`、`custom-theme.css`、`theme-enhancements.css`）。主色是橙铜 `#CC6633`，背景偏暖米白。

## 环境要求

阅读站点只需要：

- Node.js 18+
- pnpm 12（本次用 pnpm 12.23.0 完成安装并启动站点。可用 Corepack：`corepack enable`，再 `corepack prepare pnpm@12.23.0 --activate`）

书中的 Arduino、ROS 2、Gazebo、OpenCV 示例是章节里的练习，启动本站点不需要安装它们。ROS 2 章节以 Humble 为参照，见 `LICENSE.md` 的免责声明。

## 启动

在仓库根目录：

```bash
pnpm install
pnpm run docs:dev
```

不要用 `npm install`。根目录的 `package-lock.json` 里依赖被解析成 `registry.npmmirror.com` 的压缩包地址，当前 npm 会以 `EALLOWREMOTE` 拒绝这些 remote 包，`vitepress` 也就不会装上。

默认地址是 `http://localhost:5173/`。

指定地址和端口时，把参数交给 VitePress：

```bash
pnpm exec vitepress dev docs --host 127.0.0.1 --port 5175
```

Windows 上如果 `5173` 只在 IPv6（`[::1]`）能打开、IPv4 返回空响应，先换一个空闲端口。可用下面的命令看谁占用了端口：

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen
```

构建静态站点并预览：

```bash
pnpm run docs:build
pnpm run docs:preview
```

产物在 `docs/.vitepress/dist`。

## 发布 HTML、EPUB 和 PDF

推送 `v` 开头的标签后，[`.github/workflows/release-ebook.yml`](.github/workflows/release-ebook.yml) 会构建并上传到 GitHub Release：

- `robot-ebook-html.zip`：可离线打开的 VitePress 站点
- `robot-ebook.epub`
- `robot-ebook.pdf`

```bash
git tag v1.0.0
git push origin v1.0.0
```

也可以在 GitHub 的 Actions 页手动运行 “Release ebook”。手动运行会生成标签 `build-<运行号>`。

依赖只在仓库根目录安装。`pnpm run docs:dev` 会在 `docs/` 里启动 VitePress。

## 英文说明

English project overview and the same start commands: [README.en.md](README.en.md).
