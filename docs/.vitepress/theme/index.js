import DefaultTheme from 'vitepress/theme'
import ResourceCard from '../components/ResourceCard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ResourceCard', ResourceCard)
  }
}
