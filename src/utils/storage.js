import defaultNav from '@/data/defaultNav.json'

export const STORAGE_KEYS = {
  overlay: 'nav-overlay-v1',
  settings: 'nav-settings-v2',
}

/** 校验并规范化外部导入的导航数据 */
export function validateNavData(data) {
  if (!data || typeof data !== 'object') throw new Error('数据格式错误：应为 JSON 对象')
  const categories = Array.isArray(data.categories) ? data.categories : []
  const sites = Array.isArray(data.sites) ? data.sites : []
  if (!categories.length && !sites.length) {
    throw new Error('数据格式错误：缺少 categories / sites 数组')
  }
  const catIds = new Set()
  const normCategories = categories.map((c, i) => {
    if (!c || typeof c.id !== 'string' || !c.id) throw new Error('分类缺少 id')
    if (catIds.has(c.id)) throw new Error(`分类 id 重复：${c.id}`)
    catIds.add(c.id)
    return {
      id: c.id,
      name: String(c.name ?? c.id),
      order: typeof c.order === 'number' ? c.order : i,
    }
  })
  const siteIds = new Set()
  const normSites = sites.map((s, i) => {
    if (!s || typeof s.id !== 'string' || !s.id) throw new Error('站点缺少 id')
    if (siteIds.has(s.id)) throw new Error(`站点 id 重复：${s.id}`)
    siteIds.add(s.id)
    return {
      id: s.id,
      name: String(s.name ?? s.id),
      url: String(s.url ?? ''),
      icon: s.icon ? String(s.icon) : '',
      desc: s.desc ? String(s.desc) : '',
      categoryId: s.categoryId ?? normCategories[0]?.id ?? '',
      order: typeof s.order === 'number' ? s.order : i,
    }
  })
  return { version: data.version ?? 1, categories: normCategories, sites: normSites }
}

/** 从 public/data/nav.json 拉取数据（带缓存戳），失败回退内置默认 */
export async function loadNavData() {
  try {
    const url = `${import.meta.env.BASE_URL}data/nav.json?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { source: 'file', ...validateNavData(data) }
  } catch {
    return { source: 'default', ...validateNavData(defaultNav) }
  }
}

/** 读取本地覆盖层 */
export function readOverlay() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.overlay)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** 写入本地覆盖层 */
export function writeOverlay(overlay) {
  localStorage.setItem(STORAGE_KEYS.overlay, JSON.stringify(overlay))
}

export function clearOverlay() {
  localStorage.removeItem(STORAGE_KEYS.overlay)
}

/** 下载 JSON 文件 */
export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 复制文本到剪贴板 */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}
