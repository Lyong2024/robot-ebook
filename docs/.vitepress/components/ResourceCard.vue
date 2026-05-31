<template>
  <div :class="['resource-card', `resource-${type}`]">
    <div class="resource-header">
      <span class="resource-icon">{{ getIcon(type) }}</span>
      <span class="resource-type">{{ getTypeName(type) }}</span>
    </div>
    <div class="resource-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => [
      'paper', 'book', 'video', 'blog', 'tool',
      'dataset', 'standard', 'course', 'project'
    ].includes(value)
  }
})

const getIcon = (type) => {
  const icons = {
    paper: '📚',
    book: '📖',
    video: '🎥',
    blog: '📝',
    tool: '🛠️',
    dataset: '📊',
    standard: '🏛️',
    course: '🎓',
    project: '🔬'
  }
  return icons[type] || '📄'
}

const getTypeName = (type) => {
  const names = {
    paper: '学术论文',
    book: '书籍',
    video: '视频教程',
    blog: '博客文章',
    tool: '工具/库',
    dataset: '数据集',
    standard: '标准/规范',
    course: '在线课程',
    project: '项目案例'
  }
  return names[type] || '资源'
}
</script>

<style scoped>
.resource-card {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.resource-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.resource-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.resource-type {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.resource-content {
  line-height: 1.7;
}

.resource-content :deep(strong) {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.resource-content :deep(p) {
  margin: 0.5rem 0;
}

.resource-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.resource-content :deep(a:hover) {
  border-bottom-color: var(--vp-c-brand-1);
}

/* 不同类型的资源卡片使用不同的强调色 */
.resource-paper {
  border-left: 4px solid #3b82f6;
}

.resource-book {
  border-left: 4px solid #8b5cf6;
}

.resource-video {
  border-left: 4px solid #ef4444;
}

.resource-blog {
  border-left: 4px solid #10b981;
}

.resource-tool {
  border-left: 4px solid #f59e0b;
}

.resource-dataset {
  border-left: 4px solid #06b6d4;
}

.resource-standard {
  border-left: 4px solid #6366f1;
}

.resource-course {
  border-left: 4px solid #ec4899;
}

.resource-project {
  border-left: 4px solid #14b8a6;
}

/* 暗色模式优化 */
.dark .resource-card {
  background: var(--vp-c-bg-alt);
}

.dark .resource-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
