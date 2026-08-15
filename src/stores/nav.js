import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loadNavData, validateNavData, readOverlay, writeOverlay, clearOverlay } from '@/utils/storage'

/**
 * 导航数据架构（外部 JSON 驱动 + 本地覆盖层）：
 * - fileData：public/data/nav.json（部署后可编辑），fetch 失败回退内置默认
 * - overlay（localStorage）：用户在界面上做的增删改，按 id 与文件数据合并
 *   覆盖层 = { categories: Category[] | null, added: Site[], updated: [{id, patch}], removed: string[] }
 * - 改文件即整体换站；界面小改走覆盖层；「导入 JSON」整体替换
 */
const emptyOverlay = () => ({ categories: null, added: [], updated: [], removed: [] })

export const useNavStore = defineStore('nav', () => {
  const fileData = ref({ source: 'default', categories: [], sites: [] })
  const overlay = ref(emptyOverlay())
  const loading = ref(true)

  watch(overlay, (val) => writeOverlay(val), { deep: true })

  /** 合并后的分类列表 */
  const categories = computed(() => overlay.value.categories ?? fileData.value.categories)

  /** 合并后的站点列表 */
  const sites = computed(() => {
    const base = fileData.value.sites
      .filter((s) => !overlay.value.removed.includes(s.id))
      .map((s) => {
        const u = overlay.value.updated.find((x) => x.id === s.id)
        return u ? { ...s, ...u.patch } : s
      })
    return [...base, ...overlay.value.added]
  })

  const sitesByCategory = (categoryId) => sites.value.filter((s) => s.categoryId === categoryId)

  async function init() {
    loading.value = true
    fileData.value = await loadNavData()
    overlay.value = readOverlay() ?? emptyOverlay()
    loading.value = false
  }

  function persist() {
    writeOverlay(overlay.value)
  }

  const isLocalId = (id) => String(id).startsWith('local-')

  function addSite(payload) {
    const site = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: payload.name,
      url: payload.url,
      icon: payload.icon ?? '',
      desc: payload.desc ?? '',
      categoryId: payload.categoryId,
      order: sites.value.filter((s) => s.categoryId === payload.categoryId).length,
    }
    overlay.value.added.push(site)
    persist()
    return site
  }

  function updateSite(id, patch) {
    if (isLocalId(id)) {
      const target = overlay.value.added.find((s) => s.id === id)
      if (target) Object.assign(target, patch)
    } else {
      const entry = overlay.value.updated.find((x) => x.id === id)
      if (entry) Object.assign(entry.patch, patch)
      else overlay.value.updated.push({ id, patch: { ...patch } })
    }
    persist()
  }

  function removeSite(id) {
    if (isLocalId(id)) {
      overlay.value.added = overlay.value.added.filter((s) => s.id !== id)
    } else if (!overlay.value.removed.includes(id)) {
      overlay.value.removed.push(id)
    }
    persist()
  }

  /** 撤销删除（配合 Toast 的「撤销」按钮） */
  function undoRemove(site) {
    if (!site) return
    if (isLocalId(site.id)) {
      if (!overlay.value.added.some((s) => s.id === site.id)) overlay.value.added.push(site)
    } else {
      overlay.value.removed = overlay.value.removed.filter((id) => id !== site.id)
    }
    persist()
  }

  /** 分类相关操作：一旦修改分类，就把完整分类列表写入覆盖层 */
  function commitCategories(list) {
    overlay.value.categories = list
    persist()
  }

  function addCategory(name) {
    const list = categories.value.map((c) => ({ ...c }))
    list.push({
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name,
      order: list.length,
    })
    commitCategories(list)
    return list[list.length - 1]
  }

  function renameCategory(id, name) {
    commitCategories(
      categories.value.map((c) => (c.id === id ? { ...c, name } : { ...c })),
    )
  }

  function removeCategory(id) {
    // 同时移除该分类下的站点，避免出现孤儿站点
    const catSites = sites.value.filter((s) => s.categoryId === id)
    catSites.forEach((s) => removeSite(s.id))
    commitCategories(categories.value.filter((c) => c.id !== id).map((c) => ({ ...c })))
  }

  /** 导入 JSON：整体替换当前数据（写入覆盖层） */
  function importData(data) {
    const norm = validateNavData(data)
    overlay.value = {
      categories: norm.categories,
      added: norm.sites,
      updated: [],
      removed: [],
    }
    persist()
  }

  /** 丢弃所有本地修改，回到纯文件数据 */
  function resetToFile() {
    clearOverlay()
    overlay.value = emptyOverlay()
  }

  /** 导出当前合并后的完整数据 */
  function exportData() {
    return {
      version: 1,
      categories: categories.value,
      sites: sites.value,
    }
  }

  return {
    fileData,
    overlay,
    loading,
    categories,
    sites,
    sitesByCategory,
    init,
    addSite,
    updateSite,
    removeSite,
    undoRemove,
    addCategory,
    renameCategory,
    removeCategory,
    importData,
    resetToFile,
    exportData,
  }
})
