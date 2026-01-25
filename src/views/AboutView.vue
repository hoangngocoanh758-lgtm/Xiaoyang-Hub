<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl px-6 py-10 sm:px-12"
    >
      <div class="absolute -right-14 -top-16 h-32 w-32 rounded-full bg-rose-200/60 blur-3xl"></div>
      <div class="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl"></div>
      <div class="relative">
        <div
          class="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-100/80 px-3 py-1 rounded-full"
        >
          👋 关于我们
        </div>
        <h1 class="mt-4 text-3xl sm:text-4xl font-display text-slate-900">B站字幕提取助手</h1>
        <p class="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
          基于 Vue 3 + Tailwind CSS 构建，专注于提取 Bilibili 视频 AI 字幕，让内容整理更轻松。
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">当前版本</div>
            <div class="text-lg font-semibold text-slate-900">v2.0</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">核心能力</div>
            <div class="text-lg font-semibold text-slate-900">字幕解析</div>
          </div>
          <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
            <div class="text-xs text-slate-400">体验方式</div>
            <div class="text-lg font-semibold text-slate-900">一键导出</div>
          </div>
        </div>
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 bg-rose-50/90 border border-rose-100 px-4 py-2 rounded-full mt-6 hover:text-rose-700 hover:bg-rose-50 transition-colors"
        >
          返回首页
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup></script>
