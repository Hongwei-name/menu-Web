/**
 * 搜索引擎模板表：{q} 会被替换为 URL 编码后的关键词
 * 新增引擎只需在这里加一行，零成本扩展
 */
export const SEARCH_ENGINES = [
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd={q}' },
  { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q={q}' },
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q={q}' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={q}' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/search?q={q}' },
  { id: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?type=content&q={q}' },
  { id: 'bilibili', name: 'B站', url: 'https://search.bilibili.com/all?keyword={q}' },
]

export function getEngine(id) {
  return SEARCH_ENGINES.find((e) => e.id === id) || SEARCH_ENGINES[0]
}

export function buildSearchUrl(engineId, query) {
  const engine = getEngine(engineId)
  return engine.url.replace('{q}', encodeURIComponent(String(query).trim()))
}
