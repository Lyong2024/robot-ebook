# Robotics Development: From Zero to Building Your Own Robot

Interactive Chinese ebook. [VitePress](https://vitepress.dev/) renders the Markdown chapters into a searchable site with a sidebar and local full-text search.

Repository: <https://github.com/Lyong2024/robot-ebook>

The book text is Simplified Chinese. This file is the English guide to the project and how to start it.

## What this project is

The book title is 《机器人开发：从零基础到动手创造》. Site title, description, and language live in `docs/.vitepress/config.mts`: `lang` is `zh-CN`, local search is on, code blocks show line numbers, and math uses VitePress built-in math support.

Content lives under `docs/`, which VitePress uses as the site root. The root `package.json` script `docs:dev` runs `vitepress dev docs`. `docs/package.json` has a second script set meant to be run from inside `docs/`, pinned to VitePress `^1.6.4`. The installed stack is **VitePress 1.6.4** and **Vue 3**.

| Path | Role |
| --- | --- |
| `docs/index.md` | Home page (`layout: home`) |
| `docs/intro.md` | Preface and how to study |
| `docs/about.md` | About the book |
| `docs/chapters/` | 18 chapters. Chapter 9 lives in `chapter_09/` |
| `docs/appendix/` | Glossary, FAQ, debugging, open-source index, contributors |
| `docs/.vitepress/config.mts` | Nav, sidebar, search, footer |
| `docs/.vitepress/theme/` | Custom theme (copper accent, light/dark toggle) |
| `docs/resources/` | Extended resource index |
| `robot_ebook_complete.md` | Single-file source manuscript |
| `split_chapters.py` | Splits `### 第N章` headings into `docs/chapters/` |
| `VERSION.md` | Content history (v1.0.0-alpha, v2.0.0) |
| `LICENSE.md` | Book license notes |

The book is licensed [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (see `LICENSE.md`). `package.json` uses the SPDX id `CC-BY-NC-SA-4.0`.

The site renders `docs/`. A parallel `appendix/` copy sits at the repo root and is not served. Edit `docs/appendix/` when changing what readers see.

## Content map

Sidebar labels match the chapter H1s.

| Group | Chapter | File |
| --- | --- | --- |
| Preface | How to start | [`docs/intro.md`](docs/intro.md) |
| Foundations | 1 Definition, types, history | [`chapter_01.md`](docs/chapters/chapter_01.md) |
| Foundations | 2 Kinematics and dynamics | [`chapter_02.md`](docs/chapters/chapter_02.md) |
| Hardware | 3 Choosing hardware from scratch | [`chapter_03.md`](docs/chapters/chapter_03.md) |
| Hardware | 4 Arduino and ESP32 | [`chapter_04.md`](docs/chapters/chapter_04.md) |
| Hardware | 5 Motors and drives | [`chapter_05.md`](docs/chapters/chapter_05.md) |
| Hardware | 6 Power and electrical safety | [`chapter_06.md`](docs/chapters/chapter_06.md) |
| Software | 7 Linux command line | [`chapter_07.md`](docs/chapters/chapter_07.md) |
| Software | 8 Python | [`chapter_08.md`](docs/chapters/chapter_08.md) |
| Software | 9 ROS 2, sections 9.0–9.8 | [`chapter_09/`](docs/chapters/chapter_09/index.md) |
| Sensing and navigation | 10 Sensor integration | [`chapter_10.md`](docs/chapters/chapter_10.md) |
| Sensing and navigation | 11 Navigation and planning | [`chapter_11.md`](docs/chapters/chapter_11.md) |
| Sensing and navigation | 12 Computer vision | [`chapter_12.md`](docs/chapters/chapter_12.md) |
| Applications | 13 Manipulators | [`chapter_13.md`](docs/chapters/chapter_13.md) |
| Applications | 14 HRI and voice | [`chapter_14.md`](docs/chapters/chapter_14.md) |
| Applications | 15 Service-robot project | [`chapter_15.md`](docs/chapters/chapter_15.md) |
| Frontier | 16–17 Embodied AI; humanoids | [`chapter_16.md`](docs/chapters/chapter_16.md) |
| Capstone | 18 Desktop robot | [`chapter_18.md`](docs/chapters/chapter_18.md) |

Reading order: foundations (1–2) → hardware (3–6) → software (7–9) → sensors, navigation, and vision (10–12) → manipulation, HRI, and the service-robot project (13–15) → frontier (16–17) → capstone (18). Budget 150–300 hours. Gazebo and CoppeliaSim are mentioned inside chapters; they are not standalone chapter titles.

Sidebar appendix links:

- [Contributors / hall of achievement](docs/appendix/contributors.md)
- [Open-source project index](docs/appendix/projects.md)
- [Glossary](docs/appendix/glossary.md)

The same folder also has `faq.md`, `debugging_guide.md`, `hall_of_fame.md`, `open_source_projects.md`, and `resource_updates.md`. Those pages exist but are not all in the sidebar.

The theme extends the VitePress default theme with a nav-bar theme toggle. Styles are in `docs/.vitepress/theme/` (`color-palette.css`, `custom-theme.css`, `theme-enhancements.css`). The accent is copper `#CC6633` on a warm off-white background.

## Requirements

To read the site:

- Node.js 18+ (verified here with Node.js v24.22.3 and npm 11.21.1)
- Installed dependencies (this checkout already has root `node_modules` and `pnpm-lock.yaml`)

Arduino, ROS 2, Gazebo, and OpenCV examples are exercises inside chapters. Starting this site does not require them. ROS 2 samples target Humble; see the disclaimer in `LICENSE.md`.

## Start

From the repo root `C:\dev\robot_ebook`:

```bash
npm install
npm run docs:dev
```

The default URL is `http://localhost:5173/`.

To set host and port, pass the flags to VitePress so npm does not treat `--host` as its own config:

```bash
npx vitepress dev docs --host 127.0.0.1 --port 5175
```

On Windows, if port `5173` answers only on IPv6 (`[::1]`) and IPv4 returns an empty reply, pick another free port. See who is listening:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen
```

Build and preview the static site:

```bash
npm run docs:build
npm run docs:preview
```

Output goes to `docs/.vitepress/dist`.

## Release HTML, EPUB, and PDF

Pushing a tag that starts with `v` runs [`.github/workflows/release-ebook.yml`](.github/workflows/release-ebook.yml). The workflow attaches three files to the GitHub Release:

- `robot-ebook-html.zip`, an offline VitePress site
- `robot-ebook.epub`
- `robot-ebook.pdf`

```bash
git tag v1.0.0
git push origin v1.0.0
```

The same workflow can be started by hand from the Actions tab. A manual run publishes the tag `build-<run number>`.

To work only inside `docs/`:

```bash
cd docs
npm install
npm run dev
```

## 中文说明

项目分析与相同的启动步骤见 [README.md](README.md)。
