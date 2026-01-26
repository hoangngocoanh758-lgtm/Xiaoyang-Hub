import { ref } from 'vue'
import { supabase, supabaseConfig } from '@/supabase'

const tableName = 'xy_navigation_items'
const aiParserPath = '/functions/v1/ai-parser'

export function useNavigationItems() {
  const navItems = ref([])
  const listLoading = ref(true)
  const listError = ref('')
  const columnMap = ref({ name: 'name', desc: 'desc', icon: 'icon' })

  const ensureConfig = () => {
    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
      listError.value = '缺少 Supabase 环境变量配置，请检查 .env.local'
      return false
    }
    return true
  }

  const resolveColumnMap = sample => {
    const result = {
      name: sample.name !== undefined ? 'name' : sample.title !== undefined ? 'title' : 'name',
      desc:
        sample.desc !== undefined
          ? 'desc'
          : sample.description !== undefined
            ? 'description'
            : 'desc',
      icon: sample.icon !== undefined ? 'icon' : sample.icon_url !== undefined ? 'icon_url' : 'icon'
    }
    columnMap.value = result
  }

  const normalizeItem = item => ({
    id: item.id,
    name: item.name ?? item.title ?? '',
    url: item.url ?? '',
    category: item.category ?? '',
    desc: item.desc ?? item.description ?? '',
    icon: item.icon ?? item.icon_url ?? '',
    sort_order: item.sort_order ?? 0
  })

  const fetchNavItems = async () => {
    listLoading.value = true
    listError.value = ''
    if (!ensureConfig()) {
      listLoading.value = false
      navItems.value = []
      return
    }
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('sort_order', { ascending: false })
    if (error) {
      listError.value = error.message || '加载失败'
      navItems.value = []
    } else {
      if (data && data.length) {
        resolveColumnMap(data[0])
      }
      navItems.value = Array.isArray(data) ? data.map(normalizeItem) : []
    }
    listLoading.value = false
  }

  const buildPayload = item => {
    const { name, desc, icon } = columnMap.value
    return {
      [name]: item.name,
      url: item.url,
      category: item.category,
      [desc]: item.desc,
      [icon]: item.icon,
      sort_order: Number(item.sort_order) || 0
    }
  }

  const createItem = async item => {
    listError.value = ''
    if (!ensureConfig()) {
      return { error: { message: listError.value } }
    }
    const payload = buildPayload(item)
    return supabase.from(tableName).insert(payload)
  }

  const updateItem = async item => {
    listError.value = ''
    if (!ensureConfig()) {
      return { error: { message: listError.value } }
    }
    if (!item.id) {
      listError.value = '缺少记录 ID'
      return { error: { message: listError.value } }
    }
    const payload = buildPayload(item)
    return supabase.from(tableName).update(payload).eq('id', item.id)
  }

  const deleteItem = async id => {
    listError.value = ''
    if (!ensureConfig()) {
      return { error: { message: listError.value } }
    }
    if (!id) {
      listError.value = '缺少记录 ID'
      return { error: { message: listError.value } }
    }
    return supabase.from(tableName).delete().eq('id', id)
  }

  const buildAiParserUrl = () => {
    const base = (supabaseConfig.supabaseUrl || '').trim().replace(/\/$/, '')
    return base ? `${base}${aiParserPath}` : aiParserPath
  }

  const parseUrlByAi = async url => {
    listError.value = ''
    if (!ensureConfig()) {
      return { error: { message: listError.value } }
    }
    try {
      const endpoint = buildAiParserUrl()
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseConfig.supabaseAnonKey}`
        },
        body: JSON.stringify({ url })
      })
      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        return { error: { message: payload?.error || 'AI 识别失败' } }
      }
      const data = payload.data || {}
      return {
        data: {
          name: data.title ?? '',
          url: data.url ?? url ?? '',
          desc: data.description ?? '',
          category: data.category ?? '',
          icon: data.icon_url ?? ''
        }
      }
    } catch (error) {
      return { error: { message: error?.message || 'AI 识别失败' } }
    }
  }

  return {
    navItems,
    listLoading,
    listError,
    fetchNavItems,
    createItem,
    updateItem,
    deleteItem,
    parseUrlByAi
  }
}
