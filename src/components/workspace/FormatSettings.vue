<template>
  <div class="flex-0 flex flex-col bg-slate-50/50">
    <div class="p-6 pb-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div class="flex items-center gap-2 bg-slate-200 p-1 rounded-lg self-start">
          <button
            v-for="fmt in formats"
            :key="fmt"
            type="button"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="buttonClass(fmt)"
            @click="changeFormat(fmt)"
          >
            {{ fmt.toUpperCase() }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <Settings :size="14" class="text-slate-400" />
          <span class="text-xs text-slate-500">时间轴修正(秒):</span>
          <input
            type="number"
            step="0.5"
            :value="timeOffset"
            class="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:border-pink-400"
            @input="changeOffset($event.target.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Settings } from 'lucide-vue-next'

  const props = defineProps({
    outputFormat: {
      type: String,
      required: true
    },
    timeOffset: {
      type: [Number, String],
      required: true
    }
  })

  const emit = defineEmits(['changeFormat', 'changeOffset'])

  const formats = ['srt', 'txt', 'vtt']

  const changeFormat = fmt => {
    emit('changeFormat', fmt)
  }

  const changeOffset = value => {
    emit('changeOffset', parseFloat(value || 0))
  }

  const buttonClass = fmt => {
    if (fmt === props.outputFormat) {
      return 'bg-white text-pink-500 shadow-sm'
    }
    return 'text-slate-500 hover:text-slate-700'
  }
</script>
