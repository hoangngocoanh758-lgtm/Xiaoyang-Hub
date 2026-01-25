<template>
  <div>
    <div
      class="bg-white/80 rounded-2xl shadow-lg shadow-rose-100/40 border border-white/70 p-6 backdrop-blur"
    >
      <div class="flex items-center gap-2 mb-4">
        <MonitorPlay class="text-rose-500" :size="20" />
        <h2 class="text-lg font-bold font-display">如何获取字幕数据？</h2>
      </div>

      <div class="space-y-0 relative">
        <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-rose-100 z-0"></div>

        <!-- Step 1 -->
        <div class="relative z-10 flex gap-4 mb-6 group">
          <div
            class="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors"
          >
            1
          </div>
          <div class="pt-1">
            <h3 class="font-semibold text-slate-900">准备工作</h3>
            <p class="text-sm text-slate-600 mt-1">
              打开B站视频，按
              <kbd
                class="bg-white/80 px-1.5 py-0.5 rounded border border-white/80 text-xs font-mono"
                >F12</kbd
              >
              打开开发者工具。
            </p>
            <p class="text-xs text-slate-400 mt-1 italic">Mac 用户按 Cmd+Opt+I</p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative z-10 flex gap-4 mb-6 group">
          <div
            class="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors"
          >
            2
          </div>
          <div class="pt-1">
            <h3 class="font-semibold text-slate-900">锁定目标</h3>
            <p class="text-sm text-slate-600 mt-1">
              点击 <span class="font-medium text-slate-700">网络(Network)</span>，在筛选框输入
              <span class="text-rose-600 font-mono bg-rose-50 px-1 rounded">ai_subtitle</span
              >，然后刷新页面。
            </p>
            <div class="mt-2 bg-slate-900 rounded p-2 text-xs font-mono text-slate-300">
              <div class="flex gap-2 border-b border-slate-800 pb-1 mb-1">
                <Network :size="12" /> Elements
                <span class="text-white font-bold">Network</span> Sources
              </div>
              <div class="flex gap-2 items-center">
                <Search :size="12" /> <span class="text-rose-400">ai_subtitle</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative z-10 flex gap-4 group">
          <div
            class="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors"
          >
            3
          </div>
          <div class="pt-1">
            <h3 class="font-semibold text-slate-900">复制数据</h3>
            <p class="text-sm text-slate-600 mt-1">
              找到红色的 <code class="text-xs bg-white/80 p-0.5 rounded">{}</code> 请求。点击右侧
              <span class="font-medium text-slate-700">响应(Response)</span>。
            </p>
            <p class="text-sm font-medium text-rose-600 mt-1">Ctrl+A 全选并复制所有内容。</p>
            <div
              class="mt-2 bg-amber-50 border border-amber-100 rounded p-2 text-xs text-amber-700 flex gap-2"
            >
              <AlertCircle :size="14" class="shrink-0 mt-0.5" />
              必须复制完整的 JSON 格式（包含大括号）。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pro Tip Card -->
    <div
      class="bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 rounded-2xl p-6 text-white shadow-xl shadow-rose-200/40 mt-6"
    >
      <h3 class="font-bold flex items-center gap-2 mb-2 font-display">
        <Heart class="fill-white" :size="18" /> 致敬开源
      </h3>
      <p class="text-sm opacity-90 leading-relaxed">
        本工具设计灵感来自 B 站评论区的热心大佬。如果你觉得好用，记得回 B 站给原 UP
        主和工具作者点个赞哦！
      </p>
    </div>
  </div>
</template>

<script setup>
  import { MonitorPlay, Network, Search, AlertCircle, Heart } from 'lucide-vue-next'
</script>
