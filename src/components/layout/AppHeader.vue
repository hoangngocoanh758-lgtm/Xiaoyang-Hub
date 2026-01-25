<template>
  <header class="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div v-if="isTopLevel" class="flex items-center gap-3">
          <div
            class="bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 text-white p-2.5 rounded-xl shadow-lg shadow-rose-200/60"
          >
            <FileJson :size="24" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight font-display">
              小阳AI工具箱
            </h1>
          </div>
        </div>
        <router-link
          v-else
          to="/toolbox"
          class="flex items-center gap-2 text-sm text-slate-600 bg-white/80 border border-white/70 px-3 py-1.5 rounded-full shadow-sm hover:text-slate-900 hover:shadow transition-all"
        >
          <ArrowLeft :size="16" class="text-slate-400" />
          <span class="font-medium">返回AI工具箱</span>
        </router-link>
        <nav class="flex items-center gap-3 text-sm">
          <router-link
            to="/"
            class="nav-item px-3 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all"
            :class="navClass('navigation')"
            >网址导航</router-link
          >
          <router-link
            to="/toolbox"
            class="nav-item px-3 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all"
            :class="navClass('toolbox')"
            >AI工具箱</router-link
          >
          <router-link
            to="/works"
            class="nav-item px-3 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all"
            :class="navClass('works')"
            >作品一览</router-link
          >
          <router-link
            to="/student-works"
            class="nav-item px-3 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all"
            :class="navClass('studentWorks')"
            >学员作品</router-link
          >
        </nav>
      </div>
      <nav class="flex items-center gap-4 text-xs text-slate-500">
        <router-link to="/about" class="hover:text-slate-900 transition-colors font-semibold"
          >关于</router-link
        >
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          class="hover:text-slate-900 transition-colors font-semibold"
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
      route.path === '/works' ||
      route.path === '/student-works'
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
    if (route.path === '/student-works') {
      return 'studentWorks'
    }
    return ''
  })

  const navClass = key => {
    if (activeNav.value === key) {
      return 'text-slate-900 bg-rose-100/70 border-rose-200/80 shadow-sm'
    }
    return 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:border-white/70'
  }
</script>
