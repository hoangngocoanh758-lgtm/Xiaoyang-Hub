<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="mt-6 space-y-6">
      <div
        class="bg-white/80 rounded-2xl shadow-lg shadow-rose-100/40 border border-white/70 p-4 backdrop-blur"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="text-sm text-slate-500">网址导航管理</div>
            <div class="text-base font-semibold text-slate-900 mt-1">管理模式已开启</div>
          </div>
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
          class="bg-white/80 rounded-2xl shadow-sm border border-white/70 p-6 pt-10 backdrop-blur"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900 font-display">{{ group.category }}</h2>
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
              <div class="absolute top-3 right-3 flex items-center gap-2">
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
        <div class="space-y-4">
          <div class="rounded-xl border border-white/70 bg-white/70 p-3">
            <div class="text-xs font-semibold text-slate-500 mb-2">AI 极速填充</div>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input
                v-model="aiUrl"
                type="text"
                placeholder="在此粘贴网址，一键自动填写..."
                class="w-full border border-white/70 bg-white/80 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
              />
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
                :disabled="aiLoading || !aiUrl"
                @click="handleAiParse"
              >
                <span
                  v-if="aiLoading"
                  class="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"
                ></span>
                <span>{{ aiLoading ? '识别中...' : '✨ 智能识别' }}</span>
              </button>
            </div>
          </div>
          <div class="space-y-3">
            <input
              ref="nameInputRef"
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
            :disabled="saving || aiLoading"
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
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useStore } from 'vuex'
  import { useNavigationItems } from '@/composables/useNavigationItems'

  const store = useStore()
  const {
    navItems,
    listLoading,
    listError,
    fetchNavItems,
    createItem,
    updateItem,
    deleteItem,
    parseUrlByAi
  } = useNavigationItems()
  const modalOpen = ref(false)
  const saving = ref(false)
  const aiLoading = ref(false)
  const aiUrl = ref('')
  const nameInputRef = ref(null)
  const form = ref({
    id: null,
    name: '',
    url: '',
    category: '',
    icon: '',
    desc: '',
    sort_order: 0
  })

  const groups = computed(() => {
    const map = new Map()
    navItems.value.forEach(item => {
      const category = item.category || '未分类'
      if (!map.has(category)) {
        map.set(category, [])
      }
      map.get(category).push(item)
    })
    return Array.from(map.entries()).map(([category, links]) => ({ category, links }))
  })

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
    aiUrl.value = ''
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
    aiUrl.value = item.url || ''
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
    let result
    if (form.value.id) {
      result = await updateItem({ ...form.value })
    } else {
      result = await createItem({ ...form.value })
    }
    saving.value = false
    if (result?.error) {
      return
    }
    modalOpen.value = false
    fetchNavItems()
  }

  const handleAiParse = async () => {
    if (!aiUrl.value) {
      return
    }
    aiLoading.value = true
    const result = await parseUrlByAi(aiUrl.value)
    aiLoading.value = false
    if (result?.error) {
      store.dispatch('subtitle/showToast', 'AI 识别失败，请手动填写')
      return
    }
    const data = result?.data || {}
    form.value = {
      ...form.value,
      name: data.name || form.value.name,
      url: data.url || form.value.url,
      category: data.category || form.value.category,
      icon: data.icon || form.value.icon,
      desc: data.desc || form.value.desc
    }
    await nextTick()
    if (nameInputRef.value) {
      nameInputRef.value.focus()
    }
    store.dispatch('subtitle/showToast', '识别成功，请确认信息')
  }

  const handleDelete = async item => {
    if (!item.id) {
      return
    }
    const confirmed = window.confirm('确定要删除这条记录吗？')
    if (!confirmed) {
      return
    }
    const result = await deleteItem(item.id)
    if (result?.error) {
      return
    }
    fetchNavItems()
  }

  onMounted(fetchNavItems)
</script>
