/**
 * 主题切换逻辑
 * 支持localStorage持久化和系统主题偏好检测
 */

const STORAGE_KEY = 'vitepress-theme'
const THEME_CLASS = 'dark'

export type Theme = 'light' | 'dark' | 'auto'

/**
 * 获取系统主题偏好
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 获取当前主题设置
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'auto'
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'auto'
}

/**
 * 获取实际应用的主题（解析auto）
 */
export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getTheme()
  return theme === 'auto' ? getSystemTheme() : theme
}

/**
 * 设置主题
 */
export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEY, theme)
  applyTheme(theme)
}

/**
 * 应用主题到DOM
 */
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return

  const resolvedTheme = theme === 'auto' ? getSystemTheme() : theme
  const html = document.documentElement

  // 添加过渡类以防止闪烁
  html.classList.add('theme-transitioning')

  if (resolvedTheme === 'dark') {
    html.classList.add(THEME_CLASS)
  } else {
    html.classList.remove(THEME_CLASS)
  }

  // 移除过渡类
  setTimeout(() => {
    html.classList.remove('theme-transitioning')
  }, 0)
}

/**
 * 切换主题（在light和dark之间）
 */
export function toggleTheme() {
  const current = getResolvedTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
}

/**
 * 初始化主题
 */
export function initTheme() {
  if (typeof window === 'undefined') return

  // 立即应用主题，避免闪烁
  const theme = getTheme()
  applyTheme(theme)

  // 监听系统主题变化
  if (theme === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (getTheme() === 'auto') {
        applyTheme('auto')
      }
    })
  }
}

// 在脚本加载时立即初始化
if (typeof window !== 'undefined') {
  initTheme()
}
