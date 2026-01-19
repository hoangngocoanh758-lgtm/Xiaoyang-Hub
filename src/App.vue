<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <AppHeader />
    <router-view />
    <footer class="border-t border-slate-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500">
        Made with ❤️ by 你的名字 | 灵感来源 B站评论区大佬
      </div>
    </footer>
    <ToastNotification v-if="showToast" :message="toastMessage" @close="hideToast" />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import ToastNotification from '@/components/layout/ToastNotification.vue'

  const store = useStore()

  const showToast = computed(() => store.state.subtitle.showToast)
  const toastMessage = computed(() => store.state.subtitle.toastMessage)

  const hideToast = () => {
    store.commit('subtitle/setShowToast', false)
  }
</script>
