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
          🎨 灵感作品
        </div>
        <h2 class="mt-4 text-3xl sm:text-4xl font-display text-slate-900">作品一览</h2>
        <p class="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
          精选独立作品，展示创意与美感
        </p>
      </div>
    </section>

    <section class="mt-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="item in works"
          :key="item.title"
          :href="item.url"
          target="_blank"
          rel="noreferrer"
          class="bg-white/80 rounded-2xl shadow-sm border border-white/70 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer group backdrop-blur"
        >
          <div class="aspect-video bg-slate-100">
            <img
              :src="item.cover"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="p-5">
            <div class="text-base font-bold text-slate-900 font-display">{{ item.title }}</div>
            <div class="text-sm text-slate-600 mt-2">{{ item.desc }}</div>
          </div>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup>
  const works = [
    {
      title: '在线烟花模拟',
      desc: 'HTML5 Canvas 实现的逼真烟花特效，支持触控交互。',
      cover: 'https://placehold.co/1280x720/png?text=Fireworks',
      url: 'https://html.wynlx.cn/'
    },
    {
      title: '豆瓣电影日历',
      desc: '复刻经典日历 UI，每天推荐一部好电影。',
      cover: 'https://placehold.co/1280x720/png?text=Calendar',
      url: 'https://douban.wynlx.cn/'
    }
  ]
</script>
