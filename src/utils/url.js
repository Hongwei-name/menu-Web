/** 从任意 URL/输入中提取可用的主域名 */
export function extractDomain(input = '') {
  const raw = String(input).trim()
  if (!raw) return ''
  try {
    return new URL(raw).hostname
  } catch {
    // 不是合法 URL，尝试手动切分（可能没有协议）
    const cleaned = raw.replace(/^[a-z]+:\/\//i, '').split('/')[0].split('?')[0]
    return cleaned
  }
}

/** 补全协议，返回可访问的完整 URL */
export function normalizeUrl(input = '') {
  const raw = String(input).trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}

/** 是否为 http/https 链接 */
export function isHttpUrl(input = '') {
  return /^https?:\/\//i.test(String(input).trim())
}

/** 由 URL 生成站点标识（用于图标、去重） */
export function siteKey(site) {
  return extractDomain(site.url) || site.id
}
