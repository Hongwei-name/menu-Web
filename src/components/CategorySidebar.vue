<template>
  <div class="cat-sidebar" :class="{ expanded }">
    <!-- 折叠态：贴边细签 -->
    <div
      class="rail"
      role="button"
      :aria-expanded="expanded"
      aria-label="展开分类导航"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <svg
        class="rail-arrow"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span class="rail-text">分类</span>
    </div>

    <!-- 展开态：纵向分类列表 -->
    <nav
      class="cat-list"
      aria-label="分类导航"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <a
        v-for="c in categories"
        :key="c.id"
        class="cat-item"
        :class="{ active: activeId === c.id }"
        :href="`#cat-${c.id}`"
        :title="`${c.name}（${countOf(c.id)} 个站点）`"
        @click="activeId = c.id"
      >
        <span class="cat-name">{{ c.name }}</span>
        <span class="cat-count">{{ countOf(c.id) }}</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  countOf: { type: Function, default: () => 0 },
})

const expanded = ref(false)
const activeId = ref('')

/**
 * 滚动时高亮当前所在分类。
 * offset 必须 > 区块的 scroll-margin-top(140px)：
 * 锚点跳转后目标区块会停在 140px 处，若阈值小于它则永远无法命中刚点击的分类。
 */
function updateActive() {
  const sections = document.querySelectorAll('.category-section')
  if (!sections.length) return
  const offset = 150
  let current = ''
  sections.forEach((el) => {
    if (el.getBoundingClientRect().top <= offset) current = el.id.replace(/^cat-/, '')
  })
  if (activeId.value !== current) activeId.value = current
}

// 分类渲染/增删后重新计算（区块可能晚于组件挂载出现）
watch(
  () => props.categories.length,
  async () => {
    await nextTick()
    updateActive()
  },
)

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  // 数据异步加载时区块可能尚未渲染，兜底重算
  setTimeout(updateActive, 300)
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateActive))
</script>

<style scoped>
.cat-sidebar {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 55;
  pointer-events: none; /* 未覆盖区域不拦截内容点击 */
}

/* 折叠态细签 */
.rail {
  pointer-events: auto;
  position: relative;
  width: 34px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 0 14px 14px 0;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-left: none;
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: var(--card-shadow);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}
.rail:hover {
  background: var(--card-bg-hover);
  color: var(--text-primary);
}
.cat-sidebar.expanded .rail {
  opacity: 0;
  pointer-events: none;
}
.rail-text {
  writing-mode: vertical-rl;
  font-size: 11px;
  letter-spacing: 4px;
}
.rail-arrow {
  transition: transform 0.3s ease;
}

/* 展开态列表 */
.cat-list {
  pointer-events: auto;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 158px;
  max-height: 72vh;
  padding: 10px 8px;
  overflow-y: auto;
  border-radius: 0 16px 16px 0;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-left: none;
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  box-shadow: var(--card-shadow);
  opacity: 0;
  transform: translateY(-50%) translateX(-8px);
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.cat-sidebar.expanded .cat-list {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
  pointer-events: auto;
}

.cat-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}
.cat-item:hover {
  background: var(--menu-item-hover);
  color: var(--text-primary);
}
.cat-item.active {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
  font-weight: 600;
}
.cat-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 22%;
  bottom: 22%;
  width: 3px;
  border-radius: 2px;
  background: var(--accent);
}
.cat-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.cat-count {
  flex-shrink: 0;
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 9px;
  background: var(--engine-bg);
  color: var(--text-secondary);
}
.cat-item.active .cat-count {
  color: var(--accent);
}

@media (max-width: 640px) {
  .rail {
    width: 28px;
    padding: 12px 0;
  }
  .cat-list {
    width: 150px;
  }
}
</style>
