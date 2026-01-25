<template>
  <div class="flex-1 px-6 pb-6 overflow-hidden flex flex-col min-h-[220px] bg-white/60">
    <label class="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
      效果预览 (前10行)
    </label>
    <div
      class="flex-1 bg-white/90 border border-white/70 rounded-2xl p-4 overflow-auto shadow-inner"
    >
      <pre v-if="previewText" class="text-sm font-mono text-slate-700 whitespace-pre-wrap">{{
        previewText
      }}</pre>
      <div v-else class="h-full flex flex-col items-center justify-center text-slate-300">
        <FileJson :size="48" class="mb-2 opacity-50" />
        <p class="text-sm">请先在上方粘贴字幕数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { FileJson } from 'lucide-vue-next'

  defineProps({
    previewText: {
      type: String,
      required: true
    }
  })
</script>
