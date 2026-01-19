<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div v-if="isTopLevel" class="flex items-center gap-3">
          <div class="bg-pink-400 text-white p-2 rounded-lg">
            <FileJson :size="24" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">小阳AI工具箱</h1>
          </div>
        </div>
        <router-link v-else to="/toolbox" class="flex items-center gap-2 text-sm text-slate-600">
          <ArrowLeft :size="16" class="text-slate-400" />
          <span class="font-medium">返回AI工具箱</span>
        </router-link>
        <nav class="flex items-center gap-4 text-sm">
          <router-link to="/" class="nav-item" :class="navClass('navigation')"
            >网址导航</router-link
          >
          <router-link to="/toolbox" class="nav-item" :class="navClass('toolbox')"
            >AI工具箱</router-link
          >
          <router-link to="/works" class="nav-item" :class="navClass('works')"
            >作品一览</router-link
          >
        </nav>
      </div>
      <nav class="flex items-center gap-4 text-xs text-slate-400">
        <router-link to="/about" class="hover:text-pink-400 transition-colors">关于</router-link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          class="hover:text-pink-400 transition-colors"
        >
          GitHub
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { ArrowLeft, FileJson } from 'lucide-vue-next'

  const route = useRoute()
  const isTopLevel = computed(
    () =>
      route.path === '/' ||
      route.path === '/navigation' ||
      route.path === '/toolbox' ||
      route.path === '/about' ||
      route.path === '/works'
  )
  const activeNav = computed(() => {
    if (route.path === '/' || route.path === '/navigation') {
      return 'navigation'
    }
    if (route.path === '/toolbox' || route.path.startsWith('/toolbox/')) {
      return 'toolbox'
    }
    if (route.path === '/works') {
      return 'works'
    }
    return ''
  })

  const navClass = key => {
    if (activeNav.value === key) {
      return 'text-pink-500 font-semibold border-b-2 border-pink-400 pb-1'
    }
    return 'text-slate-500 hover:text-pink-400 transition-colors'
  }
</script>
