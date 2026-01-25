<template>
  <div class="min-h-screen font-body text-slate-800 relative overflow-visible">
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute -top-40 -left-28 h-96 w-96 rounded-full bg-rose-200/60 blur-3xl"></div>
      <div
        class="absolute top-16 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-amber-200/50 blur-3xl"
      ></div>
      <div
        class="absolute bottom-[-8rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-indigo-200/40 blur-3xl"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:18px_18px] opacity-35"
      ></div>
    </div>
    <AppHeader />
    <router-view />
    <footer class="border-t border-white/60 bg-white/70 backdrop-blur-xl">
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
