import { extractDomain } from './url'

/**
 * favicon 获取策略（favicon.im 为首选方案，其余服务兜底）：
 * 1. 站点显式配置的 icon 字段
 * 2. favicon.im —— 输入域名即返回网站图标（用户指定方案）
 * 3. DuckDuckGo（Cloudflare CDN）
 * 4. icon.horse
 * 5. Google s2（部分网络不可达，放最后）
 * 全部失败 → 由组件渲染「域名/名称首字母」彩色占位
 */
export const FAVICON_SERVICES = [
  (domain) => `https://favicon.im/${domain}`,
  (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  (domain) => `https://icon.horse/icon/${domain}`,
  (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
]

const CACHE_KEY = 'nav-icon-cache-v2'
/** 内存缓存：domain -> 已解析服务下标（-1 表示无图标，用占位符） */
const sessionCache = new Map()
let persistentCache = null

function loadPersistent() {
  if (persistentCache) return persistentCache
  try {
    persistentCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    persistentCache = {}
  }
  return persistentCache
}

function savePersistent() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(loadPersistent()))
  } catch {
    /* 隐私模式/存储满时静默忽略 */
  }
}

export function getCachedIndex(domain) {
  if (sessionCache.has(domain)) return sessionCache.get(domain)
  const p = loadPersistent()
  return Object.prototype.hasOwnProperty.call(p, domain) ? p[domain] : null
}

export function cacheResolvedIndex(domain, index) {
  sessionCache.set(domain, index)
  loadPersistent()[domain] = index
  savePersistent()
}

/** 返回该站点待尝试的图标 URL 列表（显式 icon 优先） */
export function faviconCandidates(site) {
  const candidates = []
  if (site.icon) candidates.push(site.icon)
  const domain = extractDomain(site.url)
  if (domain) {
    FAVICON_SERVICES.forEach((fn) => candidates.push(fn(domain)))
  }
  return candidates
}

/** 名称首字母（占位图用） */
export function initialOf(name = '') {
  const trimmed = String(name).trim()
  return trimmed ? [...trimmed][0].toUpperCase() : '?'
}

const PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6']

/** 由名称生成稳定的占位背景色 */
export function colorFromString(str) {
  let hash = 0
  for (const ch of String(str)) hash = (hash * 31 + ch.codePointAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

/**
 * 解析单个站点的最终图标 URL（预热/缓存用），失败返回 null。
 * 命中缓存时直接返回，不重复联网。
 */
export function resolveFavicon(site) {
  return new Promise((resolve) => {
    const candidates = faviconCandidates(site)
    const domain = extractDomain(site.url)
    if (!candidates.length) return resolve(null)

    const cached = getCachedIndex(domain)
    if (cached !== null) {
      resolve(cached === -1 ? null : candidates[cached] ?? null)
      return
    }

    const tryNext = (i) => {
      if (i >= candidates.length) {
        cacheResolvedIndex(domain, -1)
        return resolve(null)
      }
      const img = new Image()
      img.onload = () => {
        cacheResolvedIndex(domain, i)
        resolve(candidates[i])
      }
      img.onerror = () => tryNext(i + 1)
      img.src = candidates[i]
    }
    tryNext(0)
  })
}

/**
 * 批量预热站点图标：按小批次解析并写入缓存，
 * 之后滚动到任意位置都能秒开（浏览器缓存 + 本地缓存双命中）。
 */
export function prefetchIcons(sites, batchSize = 8) {
  const unique = new Map()
  sites.forEach((s) => {
    const d = extractDomain(s.url)
    if (d && !unique.has(d)) unique.set(d, s)
  })
  const list = [...unique.values()]
  let cursor = 0
  const nextBatch = () => {
    const batch = list.slice(cursor, cursor + batchSize)
    cursor += batchSize
    batch.forEach((s) => {
      resolveFavicon(s).catch(() => {})
    })
    if (cursor < list.length) setTimeout(nextBatch, 120)
  }
  nextBatch()
}
