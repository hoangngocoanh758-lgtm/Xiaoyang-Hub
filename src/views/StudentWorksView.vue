<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <section class="text-center py-4">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-800">学员作品</h2>
      <p class="text-sm sm:text-base text-slate-500 mt-3">实时更新学员作品，无需重新部署</p>
    </section>

    <section class="mt-6 flex flex-col lg:flex-row gap-6 min-h-[70vh]">
      <div
        class="lg:w-80 xl:w-96 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col"
      >
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <span class="text-sm font-semibold text-slate-900">作品列表</span>
          <span class="text-xs text-slate-400">{{ works.length }} 个作品</span>
        </div>
        <div class="flex-1 overflow-auto">
          <div v-if="listLoading" class="p-6 text-sm text-slate-400">正在加载作品...</div>
          <div v-else-if="listError" class="p-6 text-sm text-red-500">{{ listError }}</div>
          <button
            v-else
            v-for="item in works"
            :key="item.id"
            type="button"
            class="w-full text-left px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
            :class="item.id === activeId ? 'bg-pink-50' : ''"
            @click="selectWork(item)"
          >
            <div class="text-sm font-semibold text-slate-900">{{ item.title }}</div>
            <div class="text-xs text-slate-500 mt-1">{{ item.author }} · {{ item.date }}</div>
            <div class="text-xs text-slate-400 mt-2">{{ item.description }}</div>
          </button>
        </div>
      </div>

      <div
        class="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[70vh]"
      >
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-slate-900">
              {{ activeWork ? activeWork.title : '请选择作品进行预览' }}
            </div>
            <div v-if="activeWork" class="text-xs text-slate-500 mt-1">
              {{ activeWork.author }} · {{ activeWork.date }}
            </div>
          </div>
          <a
            v-if="activeWork"
            :href="activeWork.path"
            target="_blank"
            rel="noreferrer"
            class="text-slate-400 hover:text-pink-500 transition-colors"
            title="新窗口打开"
          >
            <ExternalLink :size="18" />
          </a>
        </div>
        <div class="relative flex-1 bg-slate-100/70">
          <div
            v-if="!activeWork && !listLoading"
            class="absolute inset-0 flex items-center justify-center text-sm text-slate-400"
          >
            请选择左侧作品以加载预览
          </div>
          <iframe
            v-if="activeWork"
            class="w-full h-full border border-slate-200 bg-white"
            :src="activeWork.path"
            sandbox="allow-scripts allow-forms allow-same-origin"
            @load="handleFrameLoad"
          />
          <div
            v-if="previewLoading"
            class="absolute inset-0 flex items-center justify-center bg-white/70"
          >
            <div class="flex items-center gap-3 text-sm text-slate-500">
              <span
                class="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"
              ></span>
              作品加载中...
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { ExternalLink } from 'lucide-vue-next'

  const works = ref([])
  const listLoading = ref(true)
  const listError = ref('')
  const activeId = ref('')
  const previewLoading = ref(false)

  const activeWork = computed(() => works.value.find(item => item.id === activeId.value))

  const selectWork = item => {
    if (activeId.value === item.id) {
      return
    }
    activeId.value = item.id
    previewLoading.value = true
  }

  const handleFrameLoad = () => {
    previewLoading.value = false
  }

  const fetchWorks = async () => {
    try {
      listLoading.value = true
      listError.value = ''
      const response = await fetch('/student-projects/list.json', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('作品列表加载失败')
      }
      const data = await response.json()
      works.value = Array.isArray(data) ? data : []
      if (works.value.length > 0) {
        activeId.value = works.value[0].id
        previewLoading.value = true
      }
    } catch (error) {
      listError.value = '无法获取作品列表，请稍后再试'
    } finally {
      listLoading.value = false
    }
  }

  onMounted(fetchWorks)
</script>
