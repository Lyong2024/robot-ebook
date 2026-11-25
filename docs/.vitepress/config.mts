import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "机器人开发：从零基础到动手创造",
  description: "软件、硬件与前沿趋势的完整实践指南",
  lang: 'zh-CN',
  // 发布压缩包时设 DOCS_BASE=./，解压后用浏览器直接打开。本地开发保持 /。
  base: process.env.DOCS_BASE || '/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '开始阅读', link: '/chapters/chapter_01' },
      { text: '关于', link: '/about' }
    ],

    sidebar: [
      {
        text: '前言',
        items: [
          { text: '开启你的机器人开发之旅', link: '/intro' }
        ]
      },
      {
        text: '基础理论篇',
        collapsed: false,
        items: [
          { text: '第1章：机器人的定义、分类与发展史', link: '/chapters/chapter_01' },
          { text: '第2章：机器人运动学与动力学基础', link: '/chapters/chapter_02' },
          { text: '第3章：机器人硬件基础', link: '/chapters/chapter_03' }
        ]
      },
      {
        text: '硬件入门篇',
        collapsed: false,
        items: [
          { text: '第4章：Arduino 与 ESP32', link: '/chapters/chapter_04' },
          { text: '第5章：电机与驱动', link: '/chapters/chapter_05' },
          { text: '第6章：电源管理与电路安全', link: '/chapters/chapter_06' }
        ]
      },
      {
        text: '软件栈篇',
        collapsed: false,
        items: [
          { text: '第7章：Linux 命令行基础', link: '/chapters/chapter_07' },
          { text: '第8章：Python 编程', link: '/chapters/chapter_08' },
          {
            text: '第9章：ROS 2 核心概念',
            collapsed: false,
            items: [
              { text: '9.0 全景与阅读路线', link: '/chapters/chapter_09/' },
              { text: '9.1 发行版、安装与工作空间', link: '/chapters/chapter_09/01-distro-workspace' },
              { text: '9.2 计算图、话题与 QoS', link: '/chapters/chapter_09/02-graph-topics-qos' },
              { text: '9.3 接口、服务与动作', link: '/chapters/chapter_09/03-interfaces-services-actions' },
              { text: '9.4 参数与 Launch', link: '/chapters/chapter_09/04-parameters-launch' },
              { text: '9.5 坐标、时间与 rosbag', link: '/chapters/chapter_09/05-tf-time-rosbag' },
              { text: '9.6 执行器、组件与 C++', link: '/chapters/chapter_09/06-executor-components' },
              { text: '9.7 命令行与排错', link: '/chapters/chapter_09/07-cli-debugging' },
              { text: '9.8 多机通信与真机话题', link: '/chapters/chapter_09/08-dds-robot-interface' },
              { text: '拓展阅读', link: '/chapters/chapter_09/further-reading' }
            ]
          }
        ]
      },
      {
        text: '仿真与视觉篇',
        collapsed: false,
        items: [
          { text: '第10章：传感器集成与数据处理', link: '/chapters/chapter_10' },
          { text: '第11章：导航与路径规划', link: '/chapters/chapter_11' },
          { text: '第12章：计算机视觉基础', link: '/chapters/chapter_12' }
        ]
      },
      {
        text: '高级主题篇',
        collapsed: false,
        items: [
          { text: '第13章：机械臂与操作', link: '/chapters/chapter_13' },
          { text: '第14章：人机交互与语音控制', link: '/chapters/chapter_14' },
          { text: '第15章：项目实战：智能服务机器人', link: '/chapters/chapter_15' }
        ]
      },
      {
        text: '前沿趋势篇',
        collapsed: false,
        items: [
          { text: '第16章：具身智能与大模型', link: '/chapters/chapter_16' },
          { text: '第17章：人形机器人技术路线', link: '/chapters/chapter_17' }
        ]
      },
      {
        text: '综合项目',
        items: [
          { text: '第18章：制作你自己的桌面机器人', link: '/chapters/chapter_18' }
        ]
      },
      {
        text: '附录',
        items: [
          { text: '高成就者名录', link: '/appendix/contributors' },
          { text: '开源项目索引', link: '/appendix/projects' },
          { text: '术语表', link: '/appendix/glossary' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lyong2024/robot-ebook' }
    ],

    footer: {
      message: '正文采用 CC BY-NC-SA 4.0',
      copyright: 'Copyright © 2024–2026'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: {
      prev: '上一章',
      next: '下一章'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  markdown: {
    lineNumbers: true,
    math: true
  },

  vite: {
    plugins: [
      {
        name: 'dark-gray-last',
        transform(code, id) {
          const normalized = id.replace(/\\/g, '/')
          if (!normalized.includes('/vitepress/dist/client/theme-default/styles/vars.css')) {
            return
          }
          return (
            code +
            '\n.dark{--vp-c-bg:#3a3a3a;--vp-c-bg-alt:#323232;--vp-c-bg-elv:#4a4a4a;--vp-c-bg-soft:#454545;--vp-c-border:#6a6a6a;--vp-c-divider:#555555;--vp-c-gutter:#2c2c2c;--vp-c-text-1:#f3f3f3;--vp-c-text-2:#c6c6c6;--vp-c-text-3:#9c9c9c;--vp-code-block-bg:#2f2f2f;--vp-code-block-divider-color:#555555;--vp-sidebar-bg-color:#323232;--vp-nav-bg-color:#454545;--vp-local-nav-bg-color:#3a3a3a;}\n'
          )
        }
      }
    ]
  }
})
