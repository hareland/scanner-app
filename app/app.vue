<script setup lang="ts">
import { App } from 'konsta/vue'

const colorMode = useColorMode()
</script>

<template>
  <!-- Konsta draws lists, sheets and dialogs; @frigear-nu/mobile owns the chrome and the safe areas. -->
  <App
    theme="ios"
    :safe-areas="false"
    :dark="colorMode.value === 'dark'"
  >
    <UApp :toaster="useMobileToaster()">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ResultSheet />
    </UApp>
  </App>
</template>
