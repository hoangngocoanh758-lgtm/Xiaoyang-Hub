<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="mt-6">
      <div class="md:flex md:items-start md:gap-10 overflow-visible">
        <aside class="hidden md:block w-[260px] shrink-0 self-start h-fit relative">
          <div class="fixed top-24 bottom-6 left-[calc(50%-700px)] w-[260px] overflow-y-auto z-20">
            <div class="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
              <div class="text-xs font-semibold text-slate-400">分类导航</div>
              <div
                class="mt-3 grid grid-cols-2 gap-2.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1.5"
              >
                <button
                  v-for="group in groups"
                  :key="group.category"
                  type="button"
                  class="w-full px-2 py-2.5 text-[13px] rounded-lg transition-all text-center truncate"
                  :class="categoryClass(group.category)"
                  @click="scrollToCategory(group.category)"
                >
                  {{ group.category }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div class="space-y-6 flex-1 min-w-0">
          <div
            v-if="groups.length"
            class="md:hidden sticky top-16 z-10 -mx-4 px-4 py-2 bg-white/80 backdrop-blur border-b border-white/70"
          >
            <div class="flex items-center gap-2 overflow-x-auto">
              <button
                v-for="group in groups"
                :key="group.category"
                type="button"
                class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap"
                :class="mobileTabClass(group.category)"
                @click="scrollToCategory(group.category)"
              >
                {{ group.category }}
              </button>
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
              :ref="el => setGroupRef(el, group.category)"
              :data-category="group.category"
              class="bg-white/80 rounded-2xl shadow-sm border border-white/70 p-6 pt-10 backdrop-blur scroll-mt-24"
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
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
  import { useNavigationItems } from '@/composables/useNavigationItems'

  const { navItems, listLoading, listError, fetchNavItems } = useNavigationItems()
  const activeCategory = ref('')
  const scrollOffset = 88
  const groupRefs = new Map()
  let observer = null

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

  const categoryClass = category => {
    if (activeCategory.value === category) {
      return 'bg-slate-900 text-white font-semibold'
    }
    return 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
  }

  const mobileTabClass = category => {
    if (activeCategory.value === category) {
      return 'text-rose-600 border-rose-200 bg-rose-50/80'
    }
    return 'text-slate-500 border-transparent bg-white/70 hover:text-slate-900'
  }

  const setGroupRef = (el, category) => {
    if (el) {
      groupRefs.set(category, el)
    } else {
      groupRefs.delete(category)
    }
  }

  const setupObserver = () => {
    if (observer) {
      observer.disconnect()
    }
    if (!groupRefs.size) {
      return
    }
    observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          const category = visible[0].target.dataset.category
          if (category) {
            activeCategory.value = category
          }
        }
      },
      {
        root: null,
        rootMargin: `-${scrollOffset + 8}px 0px -60% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75]
      }
    )
    groupRefs.forEach(el => observer.observe(el))
  }

  const scrollToCategory = category => {
    const target = groupRefs.get(category)
    if (!target) {
      return
    }
    activeCategory.value = category
    const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  watch(
    groups,
    async value => {
      await nextTick()
      if (!value.length) {
        activeCategory.value = ''
        if (observer) {
          observer.disconnect()
        }
        return
      }
      if (!activeCategory.value) {
        activeCategory.value = value[0].category
      }
      setupObserver()
    },
    { immediate: true }
  )

  onMounted(fetchNavItems)

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })
</script>
