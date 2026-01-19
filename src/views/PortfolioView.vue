<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="text-center py-6">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-800">作品一览</h2>
      <p class="text-sm sm:text-base text-slate-500 mt-3">精选独立作品，展示创意与美感</p>
    </section>

    <section class="mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="item in works"
          :key="item.title"
          :href="item.url"
          target="_blank"
          rel="noreferrer"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
        >
          <div class="aspect-video bg-slate-100">
            <img
              :src="item.cover"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="p-5">
            <div class="text-base font-bold text-slate-900">{{ item.title }}</div>
            <div class="text-sm text-slate-500 mt-2">{{ item.desc }}</div>
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
