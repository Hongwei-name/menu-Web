<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="modelValue" class="panel-mask" @click.self="close">
        <aside class="settings-panel" role="dialog" aria-modal="true" aria-label="设置">
          <header class="panel-header">
            <h3>设置</h3>
            <button class="close-btn" type="button" aria-label="关闭" @click="close">✕</button>
          </header>

          <div class="panel-body">
            <!-- 外观 -->
            <section class="set-group">
              <h4>外观</h4>

              <div class="set-row">
                <span class="set-label">主题</span>
                <div class="seg">
                  <button
                    v-for="t in themeOptions"
                    :key="t.id"
                    type="button"
                    :class="{ active: settings.settings.theme === t.id }"
                    @click="settings.setTheme(t.id)"
                  >
                    {{ t.name }}
                  </button>
                </div>
              </div>

              <div class="set-row">
                <span class="set-label">强调色</span>
                <div class="swatches">
                  <button
                    v-for="c in ACCENTS"
                    :key="c"
                    type="button"
                    class="swatch"
                    :style="{ background: c }"
                    :class="{ active: settings.settings.accent === c }"
                    :aria-label="`强调色 ${c}`"
                    @click="settings.setAccent(c)"
                  ></button>
                </div>
              </div>

              <div class="set-row">
                <span class="set-label">背景</span>
                <div class="seg">
                  <button
                    v-for="m in bgModes"
                    :key="m.id"
                    type="button"
                    :class="{ active: settings.settings.bgMode === m.id }"
                    @click="settings.settings.bgMode = m.id"
                  >
                    {{ m.name }}
                  </button>
                </div>
              </div>

              <div v-if="settings.settings.bgMode === 'gradient'" class="set-row">
                <span class="set-label">渐变</span>
                <div class="grads">
                  <button
                    v-for="g in GRADIENTS"
                    :key="g.id"
                    type="button"
                    class="grad-swatch"
                    :style="{ background: g.css }"
                    :class="{ active: settings.settings.bgValue === g.id }"
                    :title="g.name"
                    @click="settings.settings.bgValue = g.id"
                  ></button>
                </div>
              </div>

              <div v-if="settings.settings.bgMode === 'image'" class="set-row">
                <span class="set-label">图片</span>
                <div class="image-controls">
                  <input v-model="imgUrl" type="text" placeholder="粘贴图片 URL" @change="applyImgUrl" />
                  <div class="image-actions">
                    <label class="upload-btn">
                      上传本地图片
                      <input type="file" accept="image/*" hidden @change="onUpload" />
                    </label>
                    <button class="upload-btn" type="button" @click="useBuiltinWallpaper">使用内置壁纸</button>
                  </div>
                  <p class="hint">上传的图片会存进浏览器本地存储，建议小于 1MB</p>
                </div>
              </div>

              <div v-if="settings.settings.bgMode === 'bing'" class="set-row">
                <span class="set-label">必应每日一图</span>
                <p class="hint">自动使用必应每日壁纸，加载失败时回退为渐变背景</p>
              </div>
            </section>

            <!-- 搜索 -->
            <section class="set-group">
              <h4>搜索</h4>
              <div class="set-row">
                <span class="set-label">默认引擎</span>
                <div class="engine-grid">
                  <button
                    v-for="e in SEARCH_ENGINES"
                    :key="e.id"
                    type="button"
                    :class="{ active: settings.settings.searchEngine === e.id }"
                    @click="settings.settings.searchEngine = e.id"
                  >
                    {{ e.name }}
                  </button>
                </div>
              </div>
            </section>

            <!-- 分类管理 -->
            <section class="set-group">
              <h4>分类管理</h4>
              <div class="cat-manage">
                <div v-for="c in nav.categories" :key="c.id" class="cat-row">
                  <input
                    v-model="catNames[c.id]"
                    class="cat-input"
                    type="text"
                    :placeholder="c.name"
                    @change="onRename(c)"
                  />
                  <span class="cat-count" :title="`${countOf(c.id)} 个站点`">{{ countOf(c.id) }}</span>
                  <button
                    class="cat-del"
                    type="button"
                    title="删除分类（同时删除其下站点）"
                    @click="onRemoveCategory(c)"
                  >
                    ✕
                  </button>
                </div>
                <div class="cat-row">
                  <input
                    v-model="newCatName"
                    class="cat-input"
                    type="text"
                    placeholder="新分类名称"
                    @keyup.enter="onAddCategory"
                  />
                  <button class="mini-btn primary" type="button" @click="onAddCategory">添加</button>
                </div>
              </div>
              <p class="hint">分类显示在左侧悬浮导航中，删除分类会一并删除其下站点</p>
            </section>

            <!-- 数据 -->
            <section class="set-group">
              <h4>数据</h4>

              <div class="set-row">
                <span class="set-label">配置文件路径</span>
                <div class="path-box">
                  <code>public/data/nav.json</code>
                  <p class="hint">部署后为 <code>/data/nav.json</code> —— 改文件刷新即整体换站，无需重新构建</p>
                </div>
              </div>

              <div class="set-row">
                <span class="set-label">当前数据来源</span>
                <span class="source-badge">{{ sourceLabel }}</span>
              </div>

              <div class="set-row">
                <span class="set-label">操作</span>
                <div class="btn-grid">
                  <button class="mini-btn" type="button" @click="onDownload">导出 JSON</button>
                  <button class="mini-btn" type="button" @click="onCopy">复制 JSON</button>
                  <button class="mini-btn" type="button" @click="onReload">重新加载文件</button>
                  <button class="mini-btn danger" type="button" @click="onClearOverlay">清除本地修改</button>
                </div>
              </div>

              <div class="set-row">
                <span class="set-label">导入 JSON（粘贴或上传文件）</span>
                <div class="import-area">
                  <textarea
                    v-model="importText"
                    rows="3"
                    placeholder='粘贴 JSON：{"categories":[...],"sites":[...]}'
                    spellcheck="false"
                  ></textarea>
                  <div class="import-actions">
                    <label class="mini-btn">
                      上传 .json 文件
                      <input type="file" accept=".json,application/json" hidden @change="onFileImport" />
                    </label>
                    <button class="mini-btn primary" type="button" @click="onParseImport">解析预览</button>
                  </div>
                </div>
              </div>

              <!-- 可视化导入预览 -->
              <div v-if="pendingImport" class="import-preview">
                <div class="preview-head">
                  <p class="preview-title">导入预览（{{ pendingImport.categories.length }} 个分类 · {{ pendingImport.sites.length }} 个站点）</p>
                  <button class="preview-close" type="button" title="关闭预览" @click="pendingImport = null">✕</button>
                </div>

                <div v-for="cat in pendingImport.categories" :key="cat.id" class="preview-group">
                  <div class="preview-group-head">
                    <span class="preview-group-name">{{ cat.name }}</span>
                    <span class="preview-group-count">{{ sitesIn(cat.id).length }}</span>
                  </div>
                  <div v-if="sitesIn(cat.id).length" class="preview-grid">
                    <div v-for="s in sitesIn(cat.id)" :key="s.id" class="preview-chip">
                      <span class="pc-icon">
                        <img
                          v-if="!failedImgs.has(s.id) && pcIcon(s)"
                          :src="pcIcon(s)"
                          alt=""
                          loading="lazy"
                          draggable="false"
                          @error="failedImgs.add(s.id)"
                        />
                        <span v-else class="pc-letter" :style="{ background: pcColor(s) }">
                          {{ pcInitial(s) }}
                        </span>
                      </span>
                      <span class="pc-name">{{ s.name }}</span>
                    </div>
                  </div>
                  <p v-else class="preview-empty">该分类暂无站点</p>
                </div>

                <div class="import-actions preview-actions">
                  <button class="mini-btn" type="button" @click="pendingImport = null">取消</button>
                  <button class="mini-btn primary" type="button" @click="onApplyImport">确认应用（覆盖当前数据）</button>
                </div>
              </div>

              <div class="set-row">
                <span class="set-label">JSON 格式示例</span>
                <pre class="format-example"><code>{
  "categories": [
    { "id": "common", "name": "常用", "order": 0 }
  ],
  "sites": [
    {
      "id": "weibo",
      "name": "微博",
      "url": "https://weibo.com",
      "icon": "",
      "desc": "随时随地发现新鲜事",
      "categoryId": "common",
      "order": 3
    }
  ]
}</code></pre>
                <p class="hint">
                  <code>id</code> / <code>name</code> / <code>url</code> / <code>categoryId</code> 必填；
                  <code>icon</code>、<code>desc</code> 选填；<code>order</code> 控制组内排序；
                  <code>categoryId</code> 必须对应 categories 里的 id。
                </p>
              </div>

              <p v-if="feedback" class="feedback" :class="{ error: feedbackError }">{{ feedback }}</p>
            </section>

            <!-- 关于 -->
            <section class="set-group">
              <h4>关于</h4>
              <p class="about-text">
                站点主数据由 <code>public/data/nav.json</code> 驱动，改文件即可整体换站；
                界面上的增删改保存在浏览器本地，可随时「导出 JSON」固化到文件。
              </p>
            </section>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useSettingsStore, GRADIENTS, ACCENTS } from '@/stores/settings'
import { useNavStore } from '@/stores/nav'
import { SEARCH_ENGINES } from '@/utils/search'
import { downloadJson, copyText, validateNavData } from '@/utils/storage'
import { faviconCandidates, initialOf, colorFromString } from '@/utils/icon'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const settings = useSettingsStore()
const nav = useNavStore()

const themeOptions = [
  { id: 'system', name: '跟随系统' },
  { id: 'light', name: '浅色' },
  { id: 'dark', name: '深色' },
]
const bgModes = [
  { id: 'gradient', name: '渐变' },
  { id: 'image', name: '图片' },
  { id: 'bing', name: '必应每日' },
]

const sourceLabel = computed(() =>
  nav.fileData.source === 'file' ? 'public/data/nav.json' : '内置默认数据',
)

/* 背景图片 */
const imgUrl = ref(
  settings.settings.bgMode === 'image' && !String(settings.settings.bgValue).startsWith('data:')
    ? settings.settings.bgValue
    : '',
)
function applyImgUrl() {
  const v = imgUrl.value.trim()
  if (v) settings.settings.bgValue = v
}
function useBuiltinWallpaper() {
  const url = `${import.meta.env.BASE_URL}wallpapers/Image.png`
  settings.settings.bgValue = url
  imgUrl.value = url
  flash('已应用内置壁纸')
}
function onUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 1024 * 1024) {
    flash('图片超过 1MB，请压缩后再上传', true)
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    settings.settings.bgValue = reader.result
    flash('背景已更新')
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

/* 分类管理 */
const catNames = reactive({})
const newCatName = ref('')
const countOf = (id) => nav.sitesByCategory(id).length

function syncCatNames() {
  nav.categories.forEach((c) => {
    if (!(c.id in catNames)) catNames[c.id] = c.name
  })
}
watch(
  () => nav.categories,
  () => syncCatNames(),
  { deep: true },
)
watch(
  () => props.modelValue,
  (open) => {
    if (open) syncCatNames()
  },
)

function onRename(c) {
  const v = String(catNames[c.id] ?? '').trim()
  if (v && v !== c.name) nav.renameCategory(c.id, v)
  else catNames[c.id] = c.name
}
function onAddCategory() {
  const name = newCatName.value.trim()
  if (!name) return
  nav.addCategory(name)
  newCatName.value = ''
}
function onRemoveCategory(c) {
  const n = countOf(c.id)
  const msg = n
    ? `删除分类「${c.name}」会同时删除其下 ${n} 个站点，确定删除吗？`
    : `确定删除分类「${c.name}」吗？`
  if (window.confirm(msg)) {
    nav.removeCategory(c.id)
    delete catNames[c.id]
  }
}

/* 数据操作 */
const importText = ref('')
const pendingImport = ref(null)
const failedImgs = reactive(new Set())
const feedback = ref('')
const feedbackError = ref(false)
let feedbackTimer = null
function flash(msg, isError = false) {
  feedback.value = msg
  feedbackError.value = isError
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => (feedback.value = ''), 3500)
}

/* 预览辅助 */
const sitesIn = (catId) => pendingImport.value?.sites.filter((s) => s.categoryId === catId) ?? []
const pcIcon = (s) => faviconCandidates(s)[0] ?? ''
const pcInitial = (s) => initialOf(s.name)
const pcColor = (s) => colorFromString(s.name)

function resetPreview() {
  failedImgs.clear()
  pendingImport.value = null
}

function onDownload() {
  downloadJson('nav.json', nav.exportData())
  flash('已导出 nav.json')
}
async function onCopy() {
  const ok = await copyText(JSON.stringify(nav.exportData(), null, 2))
  flash(ok ? '已复制到剪贴板' : '复制失败，请手动选择文本', !ok)
}
async function onReload() {
  await nav.init()
  flash('已重新加载 nav.json（本地修改仍保留）')
}
function onClearOverlay() {
  if (window.confirm('确定清除全部本地修改，回到文件数据吗？')) {
    nav.resetToFile()
    flash('已清除本地修改')
  }
}
/** 解析 JSON，空内容/常见错误给出可操作的提示 */
function parseJsonSafe(text) {
  const raw = String(text ?? '').trim()
  if (!raw) {
    throw new Error('内容为空：请先粘贴 JSON，或点击「上传 .json 文件」选择文件')
  }
  try {
    return JSON.parse(raw)
  } catch (err) {
    const msg = err.message || 'JSON 格式错误'
    if (/Unexpected end of JSON input/i.test(msg)) {
      throw new Error('JSON 不完整：可能缺少结尾的 } 或 ]，或内容被截断，请检查后重试')
    }
    if (/Unexpected token/i.test(msg)) {
      throw new Error('JSON 格式错误：请检查是否有多余逗号、引号是否为半角 " 双引号、键名是否带引号')
    }
    throw new Error(`JSON 解析失败：${msg}`)
  }
}

/** 解析文本内容 → 校验 → 进入可视化预览（两段式：先预览后应用） */
function onParseImport() {
  try {
    const data = parseJsonSafe(importText.value)
    failedImgs.clear()
    pendingImport.value = validateNavData(data)
    importText.value = ''
    flash('解析成功，请确认预览后应用')
  } catch (err) {
    flash(err.message || 'JSON 解析失败，请检查格式', true)
  }
}

/** 读取用户上传的 .json 文件 */
function onFileImport(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = parseJsonSafe(reader.result)
      failedImgs.clear()
      pendingImport.value = validateNavData(data)
      flash(`已读取 ${file.name}，请确认预览后应用`)
    } catch (err) {
      flash(`${file.name}：${err.message}`, true)
    }
  }
  reader.onerror = () => flash('文件读取失败，请重试', true)
  reader.readAsText(file, 'utf-8')
  e.target.value = ''
}

/** 确认应用预览数据（整体覆盖） */
function onApplyImport() {
  if (!pendingImport.value) return
  nav.importData(pendingImport.value)
  resetPreview()
  flash(`导入成功，共 ${nav.sites.length} 个站点`)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.panel-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--mask-bg);
}
.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(430px, 92vw);
  display: flex;
  flex-direction: column;
  background: var(--panel-bg);
  border-left: 1px solid var(--card-border);
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(24px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--card-border);
}
.panel-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}
.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
}
.close-btn:hover {
  background: var(--menu-item-hover);
  color: var(--text-primary);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 22px 30px;
}

.set-group {
  padding: 16px 0;
  border-bottom: 1px solid var(--card-border);
}
.set-group:last-child {
  border-bottom: none;
}
.set-group h4 {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}
.set-row {
  margin-bottom: 14px;
}
.set-row:last-child {
  margin-bottom: 0;
}
.set-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

/* 分段选择 */
.seg {
  display: inline-flex;
  padding: 3px;
  border-radius: 11px;
  background: var(--engine-bg);
  gap: 2px;
}
.seg button {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.seg button.active {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

/* 色板 */
.swatches {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;
}
.swatch:hover {
  transform: scale(1.12);
}
.swatch.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
}

.grads {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.grad-swatch {
  width: 44px;
  height: 30px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
}
.grad-swatch.active {
  border-color: var(--text-primary);
}

/* 图片上传 */
.image-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.image-controls input[type='text'] {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
}
.image-controls input[type='text']:focus {
  border-color: var(--accent);
}
.image-actions {
  display: flex;
  gap: 8px;
}
.upload-btn {
  align-self: flex-start;
  padding: 8px 16px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}
.upload-btn:hover {
  color: var(--text-primary);
  border-color: var(--accent);
}
.hint {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 引擎选择 */
.engine-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.engine-grid button {
  padding: 6px 12px;
  border: 1px solid var(--card-border);
  border-radius: 9px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.engine-grid button.active {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 600;
}

/* 分类管理 */
.cat-manage {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.cat-input {
  flex: 1;
  min-width: 0;
  padding: 7px 11px;
  border: 1px solid var(--card-border);
  border-radius: 9px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.cat-input:focus {
  border-color: var(--accent);
}
.cat-count {
  flex-shrink: 0;
  min-width: 26px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 8px;
  background: var(--engine-bg);
  font-size: 11px;
  color: var(--text-secondary);
}
.cat-del {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.cat-del:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

/* 数据操作 */
.source-badge {
  padding: 4px 12px;
  border-radius: 9px;
  background: var(--engine-bg);
  font-size: 12px;
  color: var(--text-primary);
  font-family: ui-monospace, monospace;
}
.btn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mini-btn {
  padding: 9px 12px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.mini-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.mini-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}
.mini-btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.mini-btn.primary:hover {
  filter: brightness(1.08);
}

.import-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.import-area textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 12px;
  font-family: ui-monospace, monospace;
  resize: vertical;
  outline: none;
}
.import-area textarea:focus {
  border-color: var(--accent);
}

/* 配置路径 */
.path-box {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--engine-bg);
  border: 1px solid var(--card-border);
}
.path-box code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: var(--accent);
}

/* 导入操作行 */
.import-actions {
  display: flex;
  gap: 8px;
}
.import-actions .mini-btn {
  position: relative;
  overflow: hidden;
}
.import-actions input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* 导入预览 */
.import-preview {
  margin-top: 10px;
  padding: 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  max-height: 46vh;
  overflow-y: auto;
}
.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.preview-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}
.preview-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
}
.preview-close:hover {
  background: var(--menu-item-hover);
  color: var(--text-primary);
}

.preview-group {
  margin-bottom: 12px;
}
.preview-group:last-child {
  margin-bottom: 0;
}
.preview-group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}
.preview-group-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-primary);
}
.preview-group-count {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 8px;
  background: var(--engine-bg);
  color: var(--text-secondary);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 8px;
}
.preview-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 4px 6px;
  border-radius: 10px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  min-width: 0;
}
.pc-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-bg);
  overflow: hidden;
}
.pc-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.pc-letter {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.pc-name {
  width: 100%;
  font-size: 11px;
  color: var(--text-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview-empty {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.preview-actions {
  margin-top: 12px;
  justify-content: flex-end;
}

/* JSON 格式示例 */
.format-example {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--input-bg);
  border: 1px solid var(--card-border);
  overflow-x: auto;
  max-height: 160px;
  overflow-y: auto;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre;
}

.feedback {
  margin: 10px 0 0;
  font-size: 12px;
  color: #10b981;
}
.feedback.error {
  color: #ef4444;
}

.about-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--text-secondary);
}
.about-text code {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--engine-bg);
  font-family: ui-monospace, monospace;
}

/* 滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s;
}
.slide-enter-active .settings-panel,
.slide-leave-active .settings-panel {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
.slide-enter-from .settings-panel,
.slide-leave-to .settings-panel {
  transform: translateX(100%);
}
</style>
