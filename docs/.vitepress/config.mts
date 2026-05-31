import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "机器人开发：从零基础到动手创造",
  description: "软件、硬件与前沿趋势的完整实践指南",
  lang: 'zh-CN',

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
          { text: '第3章：传感器：机器人的感知系统', link: '/chapters/chapter_03' }
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
          { text: '第8章：Python 与 C++ 基础', link: '/chapters/chapter_08' },
          { text: '第9章：ROS 2 核心概念', link: '/chapters/chapter_09' }
        ]
      },
      {
        text: '仿真与视觉篇',
        collapsed: false,
        items: [
          { text: '第10章：Gazebo 仿真', link: '/chapters/chapter_10' },
          { text: '第11章：CoppeliaSim', link: '/chapters/chapter_11' },
          { text: '第12章：计算机视觉基础', link: '/chapters/chapter_12' }
        ]
      },
      {
        text: '高级主题篇',
        collapsed: false,
        items: [
          { text: '第13章：SLAM', link: '/chapters/chapter_13' },
          { text: '第14章：Nav2 自主导航', link: '/chapters/chapter_14' },
          { text: '第15章：MoveIt 2 机械臂规划', link: '/chapters/chapter_15' }
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
      { icon: 'github', link: 'https://github.com/yourusername/robot-ebook' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-present'
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
  }
})
