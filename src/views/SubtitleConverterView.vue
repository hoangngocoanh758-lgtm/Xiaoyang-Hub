<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div class="lg:col-span-4 space-y-6">
        <SubtitleGuide />
      </div>
      <div class="lg:col-span-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
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
