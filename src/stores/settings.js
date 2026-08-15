import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/utils/storage'
import { SEARCH_ENGINES } from '@/utils/search'

/** 背景预设：渐变背景（参考「极净导航」的蓝白干净风，默认取极净浅色） */
export const GRADIENTS = [
  { id: 'clean', name: '极净', css: 'linear-gradient(160deg, #f8fafc 0%, #e8edf3 100%)' },
  { id: 'aurora', name: '极光', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
  { id: 'ocean', name: '深海', css: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { id: 'sunset', name: '落日', css: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #ffd1ff 100%)' },
  { id: 'forest', name: '森林', css: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { id: 'peach', name: '蜜桃', css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
]

export const ACCENTS = ['#1e87f0', '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

export const DEFAULT_SETTINGS = {
  theme: 'system', // light | dark | system
  accent: ACCENTS[0],
  bgMode: 'gradient', // gradient | image | bing
  bgValue: 'clean', // 渐变 id 或图片 URL
  searchEngine: SEARCH_ENGINES[0].id,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(loadSettings())

  watch(
    settings,
    (val) => localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(val)),
    { deep: true },
  )

  /** 将主题与强调色应用到 <html> */
  function applyTheme() {
    const root = document.documentElement
    const mode = settings.value.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : settings.value.theme
    root.dataset.theme = mode
    root.style.setProperty('--accent', settings.value.accent)
  }

  function setTheme(theme) {
    settings.value.theme = theme
    applyTheme()
  }

  function setAccent(color) {
    settings.value.accent = color
    applyTheme()
  }

  return { settings, applyTheme, setTheme, setAccent }
})
