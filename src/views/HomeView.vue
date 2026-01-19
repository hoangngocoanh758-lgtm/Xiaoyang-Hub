<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="text-center py-10">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-800">🛠️ 小阳AI工具箱，让创作更简单</h2>
      <p class="text-sm sm:text-base text-slate-500 mt-3">AI 赋能创作，让数据处理更智慧</p>
    </section>

    <section class="mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <component
          :is="card.to ? 'router-link' : 'div'"
          v-for="card in cards"
          :key="card.id"
          :to="card.to"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
          :class="cardClass(card)"
        >
          <div class="text-3xl">{{ card.icon }}</div>
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-slate-900">{{ card.title }}</h3>
            <p class="text-sm text-slate-500">{{ card.description }}</p>
          </div>
          <div class="mt-auto">
            <span
              v-if="card.to"
              class="inline-flex items-center text-sm font-semibold text-pink-500"
            >
              立即使用 >
            </span>
            <span
              v-else
              class="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
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
      return ''
    }
    return 'opacity-70'
  }
</script>
