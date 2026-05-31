<template>
  <button
    class="theme-toggle"
    :aria-label="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    @click="toggle"
  >
    <svg v-if="isDark" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toggleTheme, getResolvedTheme } from './theme-toggle'

const isDark = ref(false)

function toggle() {
  toggleTheme()
  isDark.value = getResolvedTheme() === 'dark'
}

onMounted(() => {
  isDark.value = getResolvedTheme() === 'dark'
})
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--color-hover-bg);
  color: var(--color-text-primary);
}

.theme-toggle:active {
  background: var(--color-active-bg);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.icon {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-fast);
}

.theme-toggle:hover .icon {
  transform: scale(1.1);
}

.theme-toggle:active .icon {
  transform: scale(0.95);
}
</style>
