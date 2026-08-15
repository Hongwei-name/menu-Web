<template>
  <div class="root-layout" :style="{ background: bgGradient }">
    <!-- 背景层 -->
    <div v-if="bgImgSrc && bgImgOk" class="bg-layer" aria-hidden="true">
      <img :src="bgImgSrc" alt="" draggable="false" @error="bgImgOk = false" />
    </div>
    <div class="bg-overlay" aria-hidden="true"></div>

    <div class="content">
      <!-- 顶栏 -->
      <header class="topbar">
        <div class="brand">
          <img class="brand-logo" src="/logo.png" alt="zero_K" />
          <span class="brand-name">zero_K导航站</span>
        </div>
        <div class="clock" aria-hidden="true">
          <span class="clock-time">{{ time }}</span>
          <span class="clock-date">{{ date }}</span>
        </div>
        <div class="topbar-actions">
          <button class="icon-btn" type="button" :title="themeTitle" @click="toggleTheme">
            <svg v-if="isDark" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button class="icon-btn" type="button" title="设置" @click="openSettings = true">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Hero 搜索区 -->
      <section class="hero">
        <h1 class="hero-title">zero_K导航站</h1>
        <SearchBar @query="filterQuery = $event" />
      </section>

      <!-- 左侧悬浮分类导航 -->
      <CategorySidebar v-if="!filterQuery" :categories="categories" :count-of="countOf" />

      <!-- 加载中 -->
      <div v-if="nav.loading" class="loading">正在加载导航数据…</div>

      <!-- 分类分组 -->
      <main v-else class="main">
        <CategorySection
          v-for="c in visibleCategories"
          :key="c.id"
          :category="c"
          :sites="filteredSitesOf(c.id)"
          @add="openAdd"
          @edit="openEdit"
          @remove="removeWithUndo"
        />
        <div v-if="!visibleCategories.length" class="empty">
          <p>没有匹配「{{ filterQuery }}」的站点</p>
          <button class="empty-btn" type="button" @click="filterQuery = ''">清除筛选</button>
        </div>
      </main>

      <footer class="footer">
        <div class="footer-line">
          <span>作者：</span>
          <a class="author-link" href="https://chwmwh.cn/" target="_blank" rel="noopener">zero_K</a>
          <span class="footer-sep">·</span>
          <a class="beian" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" title="工信部备案查询">粤ICP备2026115501号</a>
        </div>
        <div class="footer-line footer-sub">
          <span>数据来源：{{ sourceLabel }}</span>
          <span class="footer-sep">·</span>
          <span>改 <code>public/data/nav.json</code> 即可整体换站</span>
        </div>
      </footer>
    </div>

    <!-- 弹窗与面板 -->
    <SiteModal
      v-model="modalOpen"
      :site="editingSite"
      :categories="categories"
      :default-category-id="defaultCategoryId"
      @submit="onModalSubmit"
    />
    <SettingsPanel v-model="openSettings" />

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast" role="status">
        <span>{{ toast.msg }}</span>
        <button v-if="toast.action" class="toast-action" type="button" @click="doToastAction">{{ toast.action }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import CategorySidebar from '@/components/CategorySidebar.vue'
import CategorySection from '@/components/CategorySection.vue'
import SiteModal from '@/components/SiteModal.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { useNavStore } from '@/stores/nav'
import { useSettingsStore, GRADIENTS } from '@/stores/settings'
import { prefetchIcons } from '@/utils/icon'

const nav = useNavStore()
const settings = useSettingsStore()

/* ---------- 初始化 ---------- */
onMounted(() => {
  nav.init().then(() => prefetchIcons(nav.sites))
  settings.applyTheme()
  startClock()
})

/* ---------- 顶栏时钟 ---------- */
const time = ref('')
const date = ref('')
let clockTimer = null
function startClock() {
  const WEEK = ['日', '一', '二', '三', '四', '五', '六']
  const tick = () => {
    const now = new Date()
    time.value = now.toTimeString().slice(0, 5)
    date.value = `${now.getMonth() + 1}月${now.getDate()}日 周${WEEK[now.getDay()]}`
  }
  tick()
  clockTimer = setInterval(tick, 1000)
}
onBeforeUnmount(() => clearInterval(clockTimer))

/* ---------- 主题切换 ---------- */
const systemDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  systemDark.value = e.matches
})
const isDark = computed(() => {
  const t = settings.settings.theme
  return t === 'dark' || (t === 'system' && systemDark.value)
})
const themeTitle = computed(() => (isDark.value ? '切换到浅色模式' : '切换到深色模式'))
function toggleTheme() {
  settings.setTheme(isDark.value ? 'light' : 'dark')
}

/* ---------- 背景 ---------- */
const bgGradient = computed(
  () => GRADIENTS.find((g) => g.id === settings.settings.bgValue)?.css || GRADIENTS[0].css,
)
const bgImgOk = ref(true)
const bingSrc = `https://api.dujin.org/bing/1920.php?t=${Date.now()}`
const bgImgSrc = computed(() => {
  if (settings.settings.bgMode === 'image') return settings.settings.bgValue || ''
  if (settings.settings.bgMode === 'bing') return bingSrc
  return ''
})

// 切换背景模式/图片时重置加载状态
watch(
  () => [settings.settings.bgMode, settings.settings.bgValue],
  () => {
    bgImgOk.value = true
  },
)

/* ---------- 分类与筛选 ---------- */
const categories = computed(() => nav.categories)
const filterQuery = ref('')

const countOf = (catId) => nav.sitesByCategory(catId).length

function matchQuery(site) {
  const q = filterQuery.value.trim().toLowerCase()
  if (!q) return true
  return [site.name, site.desc, site.url].some((f) => String(f ?? '').toLowerCase().includes(q))
}
const filteredSitesOf = (catId) => nav.sitesByCategory(catId).filter(matchQuery)
const visibleCategories = computed(() =>
  categories.value.filter((c) => filteredSitesOf(c.id).length > 0),
)

/* ---------- 站点增删改 ---------- */
const modalOpen = ref(false)
const editingSite = ref(null)
const defaultCategoryId = ref('')

function openAdd(categoryId) {
  editingSite.value = null
  defaultCategoryId.value = categoryId
  modalOpen.value = true
}
function openEdit(site) {
  editingSite.value = site
  defaultCategoryId.value = site.categoryId
  modalOpen.value = true
}
function onModalSubmit(payload) {
  if (editingSite.value) {
    nav.updateSite(editingSite.value.id, payload)
    showToast(`已更新「${payload.name}」`)
  } else {
    nav.addSite(payload)
    showToast(`已添加「${payload.name}」`)
  }
  modalOpen.value = false
}

/* ---------- 删除 + 撤销 Toast ---------- */
const toast = ref(null)
const lastRemoved = ref(null)
let toastTimer = null

function removeWithUndo(site) {
  lastRemoved.value = site
  nav.removeSite(site.id)
  showToast(`已删除「${site.name}」`, '撤销')
}
function doToastAction() {
  if (toast.value?.action === '撤销') {
    nav.undoRemove(lastRemoved.value)
    lastRemoved.value = null
  }
  hideToast()
}
function showToast(msg, action) {
  toast.value = { msg, action: action ?? null }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(hideToast, 5000)
}
function hideToast() {
  toast.value = null
  clearTimeout(toastTimer)
}

/* ---------- 设置面板 ---------- */
const openSettings = ref(false)
const sourceLabel = computed(() =>
  nav.fileData.source === 'file' ? 'public/data/nav.json' : '内置默认数据',
)
</script>

<style scoped>
.root-layout {
  position: relative;
  min-height: 100vh;
  background: var(--bg-base);
  transition: background 0.3s;
}
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
}
.bg-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--bg-overlay);
  backdrop-filter: blur(0px);
  pointer-events: none;
}
.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶栏 */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 40px);
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--card-border);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}
.brand {
  display: flex;
  align-items: center;
  gap: 9px;
}
.brand-logo {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--topbar-text);
  letter-spacing: 1px;
}
.clock {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.clock-time {
  font-size: 17px;
  font-weight: 700;
  color: var(--topbar-text);
  font-variant-numeric: tabular-nums;
}
.clock-date {
  font-size: 12px;
  color: color-mix(in srgb, var(--topbar-text) 70%, transparent);
}
.topbar-actions {
  display: flex;
  gap: 8px;
}
.icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: color-mix(in srgb, var(--topbar-text) 88%, transparent);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: var(--topbar-text);
}

/* Hero */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: clamp(16px, 4vh, 40px) 16px 14px;
}
.hero-title {
  margin: 0;
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 2px;
}

/* 主体 */
.main {
  flex: 1;
  width: min(1180px, 94vw);
  margin: 0 auto;
  padding-bottom: 24px;
}

.loading {
  text-align: center;
  padding: 80px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-secondary);
}
.empty-btn {
  margin-top: 14px;
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

/* Footer */
.footer {
  padding: 12px clamp(16px, 4vw, 40px) 18px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}
.footer-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
}
.footer-sub {
  margin-top: 3px;
  opacity: 0.8;
}
.beian,
.author-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}
.beian:hover,
.author-link:hover {
  color: var(--accent);
  text-decoration: underline;
}
.footer code {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--engine-bg);
  font-family: ui-monospace, monospace;
}
.footer-sep {
  margin: 0 8px;
}

/* Toast */
.toast {
  position: fixed;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 18px;
  border-radius: 14px;
  background: var(--toast-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  font-size: 13px;
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(14px);
}
.toast-action {
  border: none;
  background: none;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 8px;
}
.toast-action:hover {
  background: var(--menu-item-hover);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* 响应式 */
@media (max-width: 640px) {
  .clock {
    display: none;
  }
  .hero {
    padding-top: 28px;
  }
}
</style>
