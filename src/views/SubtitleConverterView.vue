<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <section
      class="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl px-6 py-8 sm:px-10 mb-8"
    >
      <div class="absolute -right-12 -top-16 h-32 w-32 rounded-full bg-rose-200/60 blur-3xl"></div>
      <div class="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl"></div>
      <div class="relative">
        <div
          class="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-100/80 px-3 py-1 rounded-full"
        >
          🎬 字幕提取助手
        </div>
        <h2 class="mt-4 text-3xl sm:text-4xl font-display text-slate-900">B站字幕提取，一键导出</h2>
        <p class="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl">
          粘贴 ai_subtitle JSON，即刻生成 SRT / TXT / VTT。支持时间轴微调与在线预览。
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div class="lg:col-span-4 space-y-6">
        <SubtitleGuide />
      </div>
      <div class="lg:col-span-8">
        <div
          class="bg-white/80 rounded-2xl shadow-xl shadow-rose-100/40 border border-white/70 h-full flex flex-col backdrop-blur"
        >
          <JsonInputPanel
            :input-json="inputJson"
            :parsed-count="parsedSubs.length"
            :error="error"
            @update:inputJson="handleUpdateInputJson"
          />
          <FormatSettings
            :output-format="outputFormat"
            :time-offset="timeOffset"
            @changeFormat="handleChangeFormat"
            @changeOffset="handleChangeOffset"
          />
          <PreviewPanel :preview-text="previewText" />
          <ActionButtons
            :parsed-count="parsedSubs.length"
            :output-format="outputFormat"
            :subs="parsedSubs"
            :time-offset="timeOffset"
            :preview-text="previewText"
            @toast="handleToast"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import SubtitleGuide from '@/components/guide/SubtitleGuide.vue'
  import JsonInputPanel from '@/components/workspace/JsonInputPanel.vue'
  import FormatSettings from '@/components/workspace/FormatSettings.vue'
  import PreviewPanel from '@/components/workspace/PreviewPanel.vue'
  import ActionButtons from '@/components/workspace/ActionButtons.vue'

  const store = useStore()

  const inputJson = computed(() => store.state.subtitle.inputJson)
  const parsedSubs = computed(() => store.state.subtitle.parsedSubs)
  const error = computed(() => store.state.subtitle.error)
  const outputFormat = computed(() => store.state.subtitle.outputFormat)
  const timeOffset = computed(() => store.state.subtitle.timeOffset)
  const previewText = computed(() => store.state.subtitle.previewText)

  const handleUpdateInputJson = value => {
    store.dispatch('subtitle/updateInputJson', value)
  }

  const handleChangeFormat = format => {
    store.dispatch('subtitle/changeOutputFormat', format)
  }

  const handleChangeOffset = offset => {
    store.dispatch('subtitle/changeTimeOffset', offset)
  }

  const handleToast = message => {
    store.dispatch('subtitle/showToast', message)
  }
</script>
