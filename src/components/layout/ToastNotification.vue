<template>
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
  >
    <div class="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
      <div class="bg-pink-400 rounded-full p-1">
        <Heart :size="14" class="fill-white" />
      </div>
      <span class="text-sm font-medium">
        {{ message }}
      </span>
      <button
        class="ml-2 text-xs text-slate-300 hover:text-white"
        type="button"
        @click="$emit('close')"
      >
        关闭
      </button>
    </div>
  </div>
</template>

<script setup>
  import { Heart } from 'lucide-vue-next'
  defineProps({
    message: {
      type: String,
      required: true
    }
  })
  defineEmits(['close'])
</script>
