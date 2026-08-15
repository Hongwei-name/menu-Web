<template>
  <div class="search-wrap">
    <div class="engine-select" ref="engineWrap">
      <button ref="engineBtn" class="engine-btn" type="button" @click="engineOpen = !engineOpen">
        <span class="engine-current">{{ currentEngine.name }}</span>
        <svg class="engine-arrow" :class="{ open: engineOpen }" viewBox="0 0 12 12" width="12" height="12">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <input
      ref="inputRef"
      class="search-input"
      type="text"
      :placeholder="`在 ${currentEngine.name} 中搜索…`"
      v-model="keyword"
      @keyup.enter="doSearch"
      @input="emit('query', keyword)"
    />
    <button v-if="keyword" class="search-clear" type="button" @click="clear" aria-label="清空">
      ✕
    </button>
    <button class="search-btn" type="button" @click="doSearch" aria-label="搜索">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </button>
  </div>

  <!-- 下拉菜单：Teleport 到 body，脱离搜索框的 backdrop-filter 层叠上下文，保证不被吸顶导航/顶栏遮挡 -->
  <Teleport to="body">
    <Transition name="drop">
      <ul v-if="engineOpen" class="engine-list" :style="dropStyle">
        <li
          v-for="engine in engines"
          :key="engine.id"
          :class="{ active: engine.id === currentEngine.id }"
          @click="selectEngine(engine)"
        >
          {{ engine.name }}
        </li>
      </ul>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { SEARCH_ENGINES, buildSearchUrl } from '@/utils/search'
import { useSettingsStore } from '@/stores/settings'

const emit = defineEmits(['query'])

const settings = useSettingsStore()
const engines = SEARCH_ENGINES

const keyword = ref('')
const engineOpen = ref(false)
const inputRef = ref(null)
const engineWrap = ref(null)
const engineBtn = ref(null)
const dropStyle = ref({})

const currentEngine = computed(() => engines.find((e) => e.id === settings.settings.searchEngine) || engines[0])

function selectEngine(engine) {
  settings.settings.searchEngine = engine.id
  engineOpen.value = false
  inputRef.value?.focus()
}

/* 菜单打开时按按钮位置计算浮层坐标（viewport 定位） */
watch(engineOpen, (open) => {
  if (open && engineBtn.value) {
    const rect = engineBtn.value.getBoundingClientRect()
    dropStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
    }
  }
})

/* 滚动/缩放时自动关闭，避免浮层位置错位 */
function onViewportChange() {
  engineOpen.value = false
}

function doSearch() {
  const q = keyword.value.trim()
  if (!q) return
  window.open(buildSearchUrl(currentEngine.value.id, q), '_blank', 'noopener')
  keyword.value = ''
  emit('query', '')
}

function clear() {
  keyword.value = ''
  emit('query', '')
  inputRef.value?.focus()
}

/** 全局快捷键：/ 聚焦搜索（输入框内时除外） */
function onKeydown(e) {
  const tag = document.activeElement?.tagName
  const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
  if (e.key === '/' && !typing) {
    e.preventDefault()
    inputRef.value?.focus()
  }
  if (e.key === 'Escape') {
    engineOpen.value = false
    inputRef.value?.blur()
  }
}

function onClickOutside(e) {
  if (engineOpen.value && engineWrap.value && !engineWrap.value.contains(e.target)) {
    engineOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<style scoped>
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: min(620px, 92vw);
  height: 54px;
  border-radius: 27px;
  background: var(--search-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: var(--search-shadow);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-wrap:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent), var(--search-shadow);
}

.engine-select {
  position: relative;
  flex-shrink: 0;
  margin-left: 8px;
}
.engine-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 38px;
  padding: 0 12px;
  border: none;
  border-radius: 19px;
  background: var(--engine-bg);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.engine-btn:hover {
  background: var(--engine-bg-hover);
}
.engine-current {
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.engine-arrow {
  transition: transform 0.2s;
}
.engine-arrow.open {
  transform: rotate(180deg);
}

.engine-list {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  min-width: 132px;
  padding: 6px;
  margin: 0;
  list-style: none;
  border-radius: 12px;
  background: var(--menu-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--card-shadow);
}
.engine-list li {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.engine-list li:hover {
  background: var(--menu-item-hover);
}
.engine-list li.active {
  color: var(--accent);
  font-weight: 600;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 40px 0 14px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
}
.search-input::placeholder {
  color: var(--text-secondary);
}

.search-clear {
  position: absolute;
  right: 52px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--engine-bg);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-clear:hover {
  background: var(--engine-bg-hover);
  color: var(--text-primary);
}

.search-btn {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  margin-right: 6px;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.2s, transform 0.2s;
}
.search-btn:hover {
  filter: brightness(1.1);
  transform: scale(1.04);
}
</style>
