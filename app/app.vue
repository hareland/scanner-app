<script setup lang="ts">
import { App } from 'konsta/vue'

const colorMode = useColorMode()
// On a device the native bars own the safe areas (layouts/default.vue pads by their CSS variables).
const nativeChrome = useState('native-chrome', () => false)

// Toasts drop in from the top, just below the native navbar, as iOS banners do; at the bottom the tab bar hides them.
// In a browser the variable is unset and they sit 1rem from the top.
const toaster = { position: 'top-center' as const, ui: { viewport: 'top-[calc(var(--cap-native-navigation-top,0px)+1rem)]' } }
</script>

<template>
  <App
    theme="ios"
    :safe-areas="!nativeChrome"
    :dark="colorMode.value === 'dark'"
  >
    <UApp :toaster="toaster">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ResultSheet />
    </UApp>
  </App>
</template>
