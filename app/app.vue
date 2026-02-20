<script setup lang="ts">
import { StatusBar, Style } from '@capacitor/status-bar'

import { App, useTheme } from 'konsta/vue'
import { Capacitor } from '@capacitor/core'

const theme = useTheme()
const colorMode = useColorMode()

const inIFrame = computed(() => {
  if (import.meta.env.SSR) return false
  return window.parent !== window
})

const enableSafeArea = computed(() => {
  if (inIFrame.value) {
    return false
  }

  switch (Capacitor.getPlatform()) {
    case 'electron':
      return false

    default:
      return true
  }
})

const toasterPosition = computed(() => {
  if (Capacitor.getPlatform() === 'electron') return 'bottom-right'

  return 'top-right'
})

watch(colorMode, async (cm) => {
  try {
    await StatusBar.setStyle({ style: cm.value === 'dark' ? Style.Dark : Style.Light })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) { /* Empty... */ }
})

onMounted(() => {
  document.documentElement.dataset.platform = Capacitor.getPlatform()
})
</script>

<template>
  <App
    :theme="theme"
    :safe-areas="enableSafeArea"
    :dark="colorMode.value === 'dark'"
  >
    <UApp :toaster="{ position: toasterPosition }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </App>
</template>
