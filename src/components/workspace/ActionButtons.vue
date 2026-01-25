<template>
  <div
    class="p-6 border-t border-white/70 bg-white/70 rounded-b-2xl flex flex-col sm:flex-row gap-4 items-center justify-end"
  >
    <p class="text-xs text-slate-500 mr-auto">
      {{ statusText }}
    </p>
    <button
      type="button"
      class="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/70 bg-white/80 text-slate-700 font-semibold hover:bg-white hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      :disabled="parsedCount === 0"
      @click="handleCopy"
    >
      <Copy :size="18" /> 复制到剪贴板
    </button>
    <button
      type="button"
      class="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2"
      :disabled="parsedCount === 0"
      @click="handleDownload"
    >
      <Download :size="18" /> 立即下载文件
    </button>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { Copy, Download } from 'lucide-vue-next'
  import { buildFullText } from '@/services/subtitleService'

  const props = defineProps({
    parsedCount: {
      type: Number,
      required: true
    },
    outputFormat: {
      type: String,
      required: true
    },
    subs: {
      type: Array,
      required: true
    },
    timeOffset: {
      type: [Number, String],
      required: true
    },
    previewText: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['toast'])

  const statusText = computed(() => {
    if (props.parsedCount > 0) {
      return `准备就绪: ${props.parsedCount} 行字幕将导出为 .${props.outputFormat} 格式`
    }
    return '等待输入...'
  })

  const handleDownload = () => {
    if (!props.parsedCount) {
      return
    }
    const content = buildFullText(props.subs, props.outputFormat, props.timeOffset)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bilibili_subtitle.${props.outputFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    emit('toast', '提取成功！如果有帮到你，记得去 B 站点个赞。')
  }

  const handleCopy = () => {
    if (!props.parsedCount) {
      return
    }
    const content = buildFullText(props.subs, props.outputFormat, props.timeOffset)
    navigator.clipboard.writeText(content)
    emit('toast', '已复制完整字幕内容到剪贴板。')
  }
</script>
