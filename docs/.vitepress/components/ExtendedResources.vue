<template>
  <div class="extended-resources">
    <div class="resource-header">
      <h3>📚 拓展资源</h3>
      <p class="subtitle">深入学习，拓展视野</p>
    </div>

    <div class="resource-categories">
      <!-- 经典文献 -->
      <div v-if="books && books.length" class="resource-category">
        <h4>📖 经典文献</h4>
        <div class="resource-list">
          <div v-for="(book, index) in books" :key="index" class="resource-item">
            <div class="resource-icon">📕</div>
            <div class="resource-content">
              <h5>{{ book.title }}</h5>
              <p class="author">{{ book.author }}</p>
              <p class="description">{{ book.description }}</p>
              <div class="tags">
                <span v-for="tag in book.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学术论文 -->
      <div v-if="papers && papers.length" class="resource-category">
        <h4>🔬 学术论文</h4>
        <div class="resource-list">
          <div v-for="(paper, index) in papers" :key="index" class="resource-item">
            <div class="resource-icon">📄</div>
            <div class="resource-content">
              <h5>{{ paper.title }}</h5>
              <p class="author">{{ paper.authors }} ({{ paper.year }})</p>
              <p class="description">{{ paper.description }}</p>
              <a v-if="paper.link" :href="paper.link" target="_blank" class="resource-link">查看论文 →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 博客文章 -->
      <div v-if="articles && articles.length" class="resource-category">
        <h4>✍️ 优质博客</h4>
        <div class="resource-list">
          <div v-for="(article, index) in articles" :key="index" class="resource-item">
            <div class="resource-icon">📝</div>
            <div class="resource-content">
              <h5>{{ article.title }}</h5>
              <p class="author">{{ article.author }} - {{ article.source }}</p>
              <p class="description">{{ article.description }}</p>
              <a v-if="article.link" :href="article.link" target="_blank" class="resource-link">阅读文章 →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 视频教程 -->
      <div v-if="videos && videos.length" class="resource-category">
        <h4>🎬 视频教程</h4>
        <div class="resource-list">
          <div v-for="(video, index) in videos" :key="index" class="resource-item">
            <div class="resource-icon">🎥</div>
            <div class="resource-content">
              <h5>{{ video.title }}</h5>
              <p class="author">{{ video.creator }} - {{ video.platform }}</p>
              <p class="description">{{ video.description }}</p>
              <div class="video-meta">
                <span class="duration">⏱️ {{ video.duration }}</span>
                <span class="level">📊 {{ video.level }}</span>
              </div>
              <a v-if="video.link" :href="video.link" target="_blank" class="resource-link">观看视频 →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 开源项目 -->
      <div v-if="projects && projects.length" class="resource-category">
        <h4>💻 开源项目</h4>
        <div class="resource-list">
          <div v-for="(project, index) in projects" :key="index" class="resource-item">
            <div class="resource-icon">⚙️</div>
            <div class="resource-content">
              <h5>{{ project.name }}</h5>
              <p class="author">{{ project.maintainer }}</p>
              <p class="description">{{ project.description }}</p>
              <div class="project-stats">
                <span v-if="project.stars">⭐ {{ project.stars }}</span>
                <span v-if="project.language">💬 {{ project.language }}</span>
              </div>
              <a v-if="project.link" :href="project.link" target="_blank" class="resource-link">访问仓库 →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 在线课程 -->
      <div v-if="courses && courses.length" class="resource-category">
        <h4>🎓 在线课程</h4>
        <div class="resource-list">
          <div v-for="(course, index) in courses" :key="index" class="resource-item">
            <div class="resource-icon">🏫</div>
            <div class="resource-content">
              <h5>{{ course.title }}</h5>
              <p class="author">{{ course.instructor }} - {{ course.platform }}</p>
              <p class="description">{{ course.description }}</p>
              <div class="course-meta">
                <span class="duration">⏱️ {{ course.duration }}</span>
                <span class="level">📊 {{ course.level }}</span>
                <span v-if="course.price" class="price">💰 {{ course.price }}</span>
              </div>
              <a v-if="course.link" :href="course.link" target="_blank" class="resource-link">查看课程 →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  books: Array,
  papers: Array,
  articles: Array,
  videos: Array,
  projects: Array,
  courses: Array
})
</script>

<style scoped>
.extended-resources {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resource-header {
  text-align: center;
  margin-bottom: 2rem;
}

.resource-header h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.resource-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.resource-category {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resource-category h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.resource-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.resource-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.resource-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.resource-content {
  flex: 1;
}

.resource-content h5 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.author {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.resource-link {
  display: inline-block;
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.resource-link:hover {
  color: #2980b9;
}

.video-meta, .course-meta, .project-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .extended-resources {
    padding: 1rem;
  }

  .resource-item {
    flex-direction: column;
  }

  .resource-icon {
    font-size: 1.5rem;
  }
}
</style>
