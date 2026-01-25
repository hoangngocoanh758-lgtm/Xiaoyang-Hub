<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl px-6 py-8 sm:px-10"
    >
      <div class="absolute -right-14 -top-16 h-32 w-32 rounded-full bg-rose-200/60 blur-3xl"></div>
      <div class="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl"></div>
      <div class="relative">
        <div
          class="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-100/80 px-3 py-1 rounded-full"
        >
          🔗 创作导航
        </div>
        <h2 class="mt-4 text-3xl sm:text-4xl font-display text-slate-900">网址导航</h2>
        <p class="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
          精选优质站点，快速进入创作流程
        </p>
      </div>
    </section>

    <section class="mt-6 space-y-6">
      <div
        v-if="isAdmin"
        class="bg-white/80 rounded-2xl shadow-lg shadow-rose-100/40 border border-white/70 p-4 backdrop-blur"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-slate-600 font-medium">管理模式已开启</div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors shadow-sm shadow-rose-200"
              @click="openCreate"
            >
              新增链接
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-white/70 bg-white/60 text-slate-600 text-sm font-semibold hover:bg-white transition-colors"
              @click="fetchNavItems"
            >
              刷新
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="listLoading"
        class="bg-white/80 rounded-2xl shadow-sm border border-white/70 p-6 backdrop-blur"
      >
        <div class="text-sm text-slate-500">正在加载导航数据...</div>
      </div>

      <div
        v-else-if="listError"
        class="bg-white/80 rounded-2xl shadow-sm border border-rose-100 p-6 backdrop-blur"
      >
        <div class="text-sm text-rose-600">{{ listError }}</div>
      </div>

      <template v-else>
        <div
          v-for="group in groups"
          :key="group.category"
          class="bg-white/80 rounded-2xl shadow-sm border border-white/70 p-6 backdrop-blur"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900 font-display">{{ group.category }}</h3>
            <span class="text-xs text-slate-400">{{ group.links.length }} 个链接</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              v-for="item in group.links"
              :key="item.id || item.name"
              :href="item.url"
              target="_blank"
              rel="noreferrer"
              class="border border-white/70 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all bg-white/70 backdrop-blur cursor-pointer relative"
            >
              <div class="flex items-start gap-3">
                <img
                  :src="item.icon"
                  :alt="item.name"
                  class="w-9 h-9 rounded-full bg-white border border-white/70 shrink-0 shadow-sm"
                />
                <div>
                  <div class="text-sm font-semibold text-slate-900">{{ item.name }}</div>
                  <div class="text-xs text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
              </div>
              <div v-if="isAdmin" class="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  class="text-xs text-slate-500 hover:text-rose-600"
                  @click.prevent.stop="openEdit(item)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="text-xs text-rose-400 hover:text-rose-600"
                  @click.prevent.stop="handleDelete(item)"
                >
                  删除
                </button>
              </div>
            </a>
          </div>
        </div>

        <div
          v-if="groups.length === 0"
          class="bg-white/80 rounded-2xl shadow-sm border border-white/70 p-6 backdrop-blur"
        >
          <div class="text-sm text-slate-500">暂无导航数据</div>
        </div>
      </template>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white/90 rounded-2xl shadow-2xl w-full max-w-lg p-6 backdrop-blur">
        <div class="text-lg font-semibold text-slate-900 mb-4 font-display">
          {{ form.id ? '编辑链接' : '新增链接' }}
        </div>
        <div class="space-y-3">
          <input
            v-model="form.name"
            type="text"
            placeholder="标题"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
          <input
            v-model="form.url"
            type="text"
            placeholder="链接"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
          <input
            v-model="form.category"
            type="text"
            placeholder="分类"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
          <input
            v-model="form.icon"
            type="text"
            placeholder="图标地址"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
          <input
            v-model="form.desc"
            type="text"
            placeholder="描述"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
          <input
            v-model="form.sort_order"
            type="number"
            placeholder="排序权重"
            class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
          />
        </div>
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-white/70 bg-white/70 text-slate-600 text-sm font-semibold hover:bg-white transition-colors"
            @click="closeModal"
          >
            取消
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
            :disabled="saving"
            @click="saveItem"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { supabase, supabaseConfig } from '@/supabase'

  const route = useRoute()
  const isAdmin = computed(() => route.path === '/admin/nav')
  const navItems = ref([])
  const listLoading = ref(true)
  const listError = ref('')
  const modalOpen = ref(false)
  const saving = ref(false)
  const form = ref({
    id: null,
    name: '',
    url: '',
    category: '',
    icon: '',
    desc: '',
    sort_order: 0
  })

  const columnMap = computed(() => {
    const sample = navItems.value[0] || {}
    return {
      name: sample.name !== undefined ? 'name' : sample.title !== undefined ? 'title' : 'name',
      desc:
        sample.desc !== undefined
          ? 'desc'
          : sample.description !== undefined
            ? 'description'
            : 'desc',
      icon: sample.icon !== undefined ? 'icon' : sample.icon_url !== undefined ? 'icon_url' : 'icon'
    }
  })

  const groups = computed(() => {
    const map = new Map()
    navItems.value.forEach(item => {
      const category = item.category || '未分类'
      if (!map.has(category)) {
        map.set(category, [])
      }
      map.get(category).push({
        id: item.id,
        name: item.name || item.title || '',
        url: item.url || '',
        desc: item.desc || item.description || '',
        icon: item.icon || item.icon_url || '',
        category,
        sort_order: item.sort_order ?? 0
      })
    })
    return Array.from(map.entries()).map(([category, links]) => ({ category, links }))
  })

  const fetchNavItems = async () => {
    listLoading.value = true
    listError.value = ''
    if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
      listError.value = '缺少 Supabase 环境变量配置，请检查 .env.local'
      listLoading.value = false
      return
    }
    const { data, error } = await supabase
      .from('xy_navigation_items')
      .select('*')
      .order('sort_order', { ascending: false })
    if (error) {
      listError.value = error.message || '加载失败'
    } else {
      navItems.value = Array.isArray(data) ? data : []
    }
    listLoading.value = false
  }

  const openCreate = () => {
    form.value = {
      id: null,
      name: '',
      url: '',
      category: '',
      icon: '',
      desc: '',
      sort_order: 0
    }
    modalOpen.value = true
  }

  const openEdit = item => {
    form.value = {
      id: item.id,
      name: item.name || '',
      url: item.url || '',
      category: item.category || '',
      icon: item.icon || '',
      desc: item.desc || '',
      sort_order: item.sort_order ?? 0
    }
    modalOpen.value = true
  }

  const closeModal = () => {
    modalOpen.value = false
  }

  const saveItem = async () => {
    if (!form.value.name || !form.value.url) {
      return
    }
    saving.value = true
    const { name, desc, icon } = columnMap.value
    const payload = {
      [name]: form.value.name,
      url: form.value.url,
      category: form.value.category,
      [desc]: form.value.desc,
      [icon]: form.value.icon,
      sort_order: Number(form.value.sort_order) || 0
    }
    let result
    if (form.value.id) {
      result = await supabase.from('xy_navigation_items').update(payload).eq('id', form.value.id)
    } else {
      result = await supabase.from('xy_navigation_items').insert(payload)
    }
    saving.value = false
    if (result.error) {
      listError.value = result.error.message || '保存失败'
      return
    }
    modalOpen.value = false
    fetchNavItems()
  }

  const handleDelete = async item => {
    if (!item.id) {
      return
    }
    const confirmed = window.confirm('确定要删除这条记录吗？')
    if (!confirmed) {
      return
    }
    const { error } = await supabase.from('xy_navigation_items').delete().eq('id', item.id)
    if (error) {
      listError.value = error.message || '删除失败'
      return
    }
    fetchNavItems()
  }

  onMounted(fetchNavItems)
</script>
