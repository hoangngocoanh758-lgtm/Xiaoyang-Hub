<template>
  <div class="p-6 border-b border-white/70 bg-white/60">
    <div class="flex justify-between items-center mb-3">
      <label class="text-sm font-bold text-slate-700 flex items-center gap-2 font-display">
        <MousePointerClick :size="16" /> JSON 数据输入
      </label>
      <button
        v-if="inputJson"
        type="button"
        class="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
        @click="clear"
      >
        <Trash2 :size="12" /> 清空内容
      </button>
    </div>
    <div class="relative group">
      <textarea
        class="w-full h-44 p-4 rounded-2xl border-2 bg-white/70 font-mono text-xs resize-none focus:outline-none transition-all shadow-inner"
        :class="textareaClass"
        :value="inputJson"
        @input="onInput"
        placeholder='在此粘贴您复制的 JSON 代码（Ctrl+V）...&#10;例如：{"code":0,"message":"0","ttl":1,"data":{"body":[{"from":0.68,"to":2.24,"location":2,"content":"..."}]}}'
      />
      <div class="absolute right-4 bottom-4">
        <div
          v-if="parsedCount > 0 && !error"
          class="flex items-center gap-1.5 text-emerald-600 bg-white/90 px-3 py-1 rounded-full shadow-sm text-xs font-medium animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 :size="14" /> 已识别 {{ parsedCount }} 行字幕
        </div>
        <div
          v-if="error"
          class="flex items-center gap-1.5 text-rose-600 bg-white/90 px-3 py-1 rounded-full shadow-sm text-xs font-medium animate-in fade-in slide-in-from-bottom-2"
        >
          <AlertCircle :size="14" /> 格式错误
        </div>
      </div>
    </div>
    <p v-if="error" class="text-xs text-rose-500 mt-2 ml-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { MousePointerClick, Trash2, CheckCircle2, AlertCircle } from 'lucide-vue-next'

  const props = defineProps({
    inputJson: {
      type: String,
      required: true
    },
    parsedCount: {
      type: Number,
      required: true
    },
    error: {
      type: String,
      default: null
    }
  })

  const emit = defineEmits(['update:inputJson'])

  const textareaClass = computed(() => {
    if (props.error) {
      return 'border-rose-200 bg-rose-50/70 focus:border-rose-400'
    }
    if (props.parsedCount > 0) {
      return 'border-emerald-200 bg-emerald-50/60 focus:border-emerald-400'
    }
    return 'border-slate-200 focus:border-rose-300 focus:bg-white'
  })

  const onInput = event => {
    emit('update:inputJson', event.target.value)
  }

  const clear = () => {
    emit('update:inputJson', '')
  }
</script>
