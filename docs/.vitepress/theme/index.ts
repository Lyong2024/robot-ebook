import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemeToggle from './ThemeToggle.vue'
import './color-palette.css'
import './custom-theme.css'
import './theme-enhancements.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeToggle)
    })
  }
} satisfies Theme
