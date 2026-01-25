<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl px-6 py-10 sm:px-10"
    >
      <div class="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-rose-200/60 blur-3xl"></div>
      <div class="absolute -bottom-20 left-6 h-40 w-40 rounded-full bg-amber-200/50 blur-3xl"></div>
      <div class="relative">
        <div
          class="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-100/80 px-3 py-1 rounded-full"
        >
          🧰 创作加速器
        </div>
        <h2 class="mt-5 text-3xl sm:text-5xl font-display text-slate-900">
          小阳AI工具箱，让创作更简单
        </h2>
        <p class="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl">
          AI 赋能创作流程，把繁琐操作变成一键式体验。用更少的时间，完成更清晰的表达。
        </p>
        <div class="mt-6 flex flex-wrap gap-3 text-xs">
          <span class="px-3 py-1 rounded-full bg-white/80 border border-white/70 text-slate-600"
            >字幕解析</span
          >
          <span class="px-3 py-1 rounded-full bg-white/80 border border-white/70 text-slate-600"
            >数据整理</span
          >
          <span class="px-3 py-1 rounded-full bg-white/80 border border-white/70 text-slate-600"
            >创作灵感</span
          >
          <span class="px-3 py-1 rounded-full bg-white/80 border border-white/70 text-slate-600"
            >高效交付</span
          >
        </div>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">每日工具</div>
            <div class="text-lg font-semibold text-slate-900">4+</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">可用功能</div>
            <div class="text-lg font-semibold text-slate-900">字幕 / 导出</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">即将上线</div>
            <div class="text-lg font-semibold text-slate-900">封面 / 词云</div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <component
          :is="card.to ? 'router-link' : 'div'"
          v-for="card in cards"
          :key="card.id"
          :to="card.to"
          class="relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl"
          :class="cardClass(card)"
        >
          <div class="text-3xl">{{ card.icon }}</div>
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-slate-900 font-display">{{ card.title }}</h3>
            <p class="text-sm text-slate-600">{{ card.description }}</p>
          </div>
          <div class="mt-auto">
            <span
              v-if="card.to"
              class="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-100 px-3 py-1 rounded-full"
            >
              立即使用 >
            </span>
            <span
              v-else
              class="inline-flex items-center text-xs font-semibold text-slate-500 bg-white/80 border border-white/70 px-3 py-1 rounded-full"
            >
              {{ card.status }}
            </span>
          </div>
        </component>
      </div>
    </section>
  </main>
</template>

<script setup>
  const cards = [
    {
      id: 'subtitle',
      title: 'B站字幕提取助手',
      description: '提取 CC 字幕转 SRT/TXT',
      icon: '📝',
      to: '/toolbox/subtitle',
      status: ''
    },
    {
      id: 'cover',
      title: '视频封面提取',
      description: '下载高清封面原图',
      icon: '🖼️',
      to: '',
      status: '🚧 开发中...'
    },
    {
      id: 'comment',
      title: '评论区数据分析',
      description: '导出评论 / 词云生成',
      icon: '📊',
      to: '',
      status: '⏳ 敬请期待'
    },
    {
      id: 'more',
      title: '更多工具位',
      description: '持续更新中',
      icon: '✨',
      to: '',
      status: '⏳ 敬请期待'
    }
  ]

  const cardClass = card => {
    if (card.to) {
      return 'cursor-pointer hover:border-rose-200/70 hover:shadow-rose-100/70'
    }
    return 'opacity-60 cursor-not-allowed'
  }
</script>
