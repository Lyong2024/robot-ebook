# 拓展资源模板规范

> 本文档定义了电子书拓展资源的标准格式和展示规范

---

## 📋 资源类型分类

### 1. 权威文献（📖）
- **国际标准**：ISO、IEEE等标准文档
- **行业报告**：IFR、Gartner等权威机构报告
- **白皮书**：公司技术白皮书

### 2. 学术论文（📄）
- **原始论文**：算法/技术的首次发表论文
- **综述论文**：Survey/Review类型
- **会议论文**：ICRA、IROS、RSS等顶会

### 3. 经典书籍（📕）
- **教材**：大学课程教材
- **专著**：技术专业书籍
- **手册**：技术参考手册

### 4. 视频教程（🎥）
- **在线课程**：Coursera、Udemy、edX
- **技术讲座**：会议演讲、技术分享
- **实验演示**：实际操作视频

### 5. 历史文献（📜）
- **专利文档**：原始专利
- **历史回顾**：技术发展历史
- **人物传记**：重要人物介绍

### 6. 实用工具（🛠️）
- **开源库**：GitHub项目
- **在线工具**：Web工具
- **仿真平台**：仿真软件

### 7. 数据集（📊）
- **公开数据集**：KITTI、TUM等
- **基准测试**：Benchmark
- **模型库**：预训练模型

### 8. 社区资源（🔗）
- **论坛**：ROS Discourse、Reddit
- **博客**：技术博客
- **开源项目**：GitHub项目

---

## 📝 资源条目格式

### 标准格式

```markdown
#### 资源标题
**类型：** [论文/书籍/视频/工具等]  
**作者/来源：** 作者名或机构名  
**发布年份：** YYYY年  
**简介：** 一句话概括资源内容和价值

**核心内容：**
- 要点1
- 要点2
- 要点3

**访问链接：** [链接文本](URL)  
**中文资源：** [可选] 中文版本或中文解读链接

---
```

### 示例

```markdown
#### "A Flexible New Technique for Camera Calibration" - Zhang (2000)
**类型：** 学术论文  
**作者：** Zhengyou Zhang (Microsoft Research)  
**发布年份：** 2000年  
**引用次数：** 20,000+  
**简介：** 张正友标定法，计算机视觉领域最常用的相机标定方法。

**核心贡献：**
- 使用平面棋盘格标定
- 无需精密标定设备
- 成为OpenCV标定函数的基础

**论文链接：** https://www.microsoft.com/en-us/research/publication/...  
**中文解读：** [张正友标定法详解 - 知乎](https://zhuanlan.zhihu.com/p/xxxxx)

---
```

---

## 🎨 资源卡片组件（VitePress）

### 组件设计

创建自定义VitePress组件用于展示资源：

```vue
<!-- .vitepress/theme/components/ResourceCard.vue -->
<template>
  <div class="resource-card" :class="`type-${type}`">
    <div class="card-header">
      <span class="card-icon">{{ getIcon(type) }}</span>
      <h4 class="card-title">{{ title }}</h4>
    </div>
    
    <div class="card-meta">
      <span v-if="author" class="meta-item">
        <strong>作者：</strong>{{ author }}
      </span>
      <span v-if="year" class="meta-item">
        <strong>年份：</strong>{{ year }}
      </span>
      <span v-if="citations" class="meta-item">
        <strong>引用：</strong>{{ citations }}+
      </span>
    </div>
    
    <p class="card-description">{{ description }}</p>
    
    <div v-if="highlights" class="card-highlights">
      <strong>核心内容：</strong>
      <ul>
        <li v-for="(item, index) in highlights" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
    
    <div class="card-links">
      <a v-if="link" :href="link" target="_blank" class="primary-link">
        访问资源 →
      </a>
      <a v-if="cnLink" :href="cnLink" target="_blank" class="secondary-link">
        中文资源 →
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: String,      // paper, book, video, tool, dataset
  title: String,
  author: String,
  year: String,
  citations: String,
  description: String,
  highlights: Array,
  link: String,
  cnLink: String
})

const getIcon = (type) => {
  const icons = {
    paper: '📄',
    book: '📕',
    video: '🎥',
    tool: '🛠️',
    dataset: '📊',
    standard: '📖',
    blog: '🔗'
  }
  return icons[type] || '📌'
}
</script>

<style scoped>
.resource-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.resource-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-icon {
  font-size: 24px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  color: var(--vp-c-brand);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.card-description {
  margin: 12px 0;
  line-height: 1.6;
}

.card-highlights {
  margin: 12px 0;
  padding: 12px;
  background: var(--vp-c-bg);
  border-radius: 4px;
}

.card-highlights ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.card-links {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.primary-link,
.secondary-link {
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.primary-link {
  background: var(--vp-c-brand);
  color: white;
}

.primary-link:hover {
  background: var(--vp-c-brand-dark);
}

.secondary-link {
  border: 1px solid var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.secondary-link:hover {
  background: var(--vp-c-brand-light);
}
</style>
```

### 使用示例

```markdown
# 第1章拓展资源

<ResourceCard
  type="paper"
  title="Intelligence Without Representation"
  author="Rodney Brooks"
  year="1991"
  citations="3500"
  description="Brooks在这篇开创性论文中提出了行为主义机器人学，挑战了传统的感知-建模-规划-执行范式。"
  :highlights="[
    '传统AI的世界模型方法过于复杂且脆弱',
    '真正的智能来自于与环境的实时交互',
    '简单行为的涌现可以产生复杂智能'
  ]"
  link="https://people.csail.mit.edu/brooks/papers/AIM-1293.pdf"
  cnLink="https://zhuanlan.zhihu.com/p/xxxxx"
/>
```

---

## 📂 文件组织结构

```
chapters/docs/resources/
├── README.md                    # 资源索引
├── template.md                  # 本模板文档
├── chapter_01_resources.md      # 第1章资源
├── chapter_02_resources.md      # 第2章资源
├── ...
└── chapter_17_resources.md      # 第17章资源

.vitepress/theme/
├── components/
│   ├── ResourceCard.vue         # 资源卡片组件
│   ├── ResourceList.vue         # 资源列表组件
│   └── ResourceFilter.vue       # 资源筛选组件
└── index.js                     # 主题配置
```

---

## 🎯 质量标准

### 必须满足
- ✅ 所有资源必须包含标题、类型、简介
- ✅ 外部链接必须有效可访问
- ✅ 优先选择权威来源（学术论文、官方文档）
- ✅ 资源时效性（优先2020年后内容）

### 推荐做法
- 📌 为英文资源提供中文解读链接
- 📌 添加资源的核心内容摘要
- 📌 注明引用次数（学术论文）
- 📌 提供多种访问方式（官网、GitHub、镜像）

### 避免事项
- ❌ 避免失效链接
- ❌ 避免低质量资源
- ❌ 避免重复资源
- ❌ 避免过时内容（除非是历史文献）

---

## 🔄 维护流程

### 定期检查（每月）
1. 验证外部链接有效性
2. 更新资源时效性
3. 补充新发布的重要资源
4. 移除失效或过时资源

### 版本更新
- 每次重大更新创建git tag
- 在VERSION.md中记录变更
- 更新资源索引README.md

---

**最后更新：** 2024年6月  
**维护者：** 机器人电子书项目组
