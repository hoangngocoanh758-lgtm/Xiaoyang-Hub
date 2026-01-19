<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section class="text-center py-6">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-800">网址导航</h2>
      <p class="text-sm sm:text-base text-slate-500 mt-3">精选优质站点，快速进入创作流程</p>
    </section>

    <section class="mt-6 space-y-6">
      <div
        v-for="group in groups"
        :key="group.category"
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900">{{ group.category }}</h3>
          <span class="text-xs text-slate-400">{{ group.links.length }} 个链接</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="item in group.links"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
            class="border border-slate-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition-all bg-slate-50 cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <img
                :src="faviconUrl(item.url)"
                :alt="item.name"
                class="w-8 h-8 rounded-full bg-white border border-slate-100 shrink-0"
              />
              <div>
                <div class="text-sm font-semibold text-slate-900">{{ item.name }}</div>
                <div class="text-xs text-slate-500 mt-1">{{ item.desc }}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  const faviconUrl = url => {
    try {
      const host = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${host}&sz=64`
    } catch (e) {
      return `https://www.google.com/s2/favicons?domain=${url}&sz=64`
    }
  }

  const groups = [
    {
      category: '常用AI',
      links: [
        { name: 'ChatGPT', url: 'https://chatgpt.com', desc: '最强 AI 对话' },
        { name: 'Midjourney', url: 'https://midjourney.com', desc: 'AI 绘画神器' },
        { name: 'Hugging Face', url: 'https://huggingface.co', desc: '模型与数据集社区' }
      ]
    },
    {
      category: 'B站运营',
      links: [
        { name: 'Bilibili 创作中心', url: 'https://member.bilibili.com', desc: '后台管理' },
        { name: 'Bilibili 官网', url: 'https://www.bilibili.com', desc: '内容发布入口' }
      ]
    },
    {
      category: '设计与效率',
      links: [
        { name: 'Figma', url: 'https://www.figma.com', desc: '在线协作设计' },
        { name: 'Canva', url: 'https://www.canva.com', desc: '快速出图排版' }
      ]
    }
  ]
</script>
