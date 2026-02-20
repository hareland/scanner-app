<script setup lang="ts">
import { kBlock, kBlockTitle } from 'konsta/vue'

definePageMeta({
  layout: 'home',
})

const { results } = useBarcodeScanner()

const { rightActions } = useMainNavbar()

onMounted(() => {
  rightActions.value = [
    { icon: 'i-lucide-cog', onClick() { navigateTo('/settings') } },
  ]
})
</script>

<template>
  <div>
    <k-block
      strong
      inset-ios
    >
      <p>Start scanning, this app should work on iOS, Android and Electron (Mac, Windows, Linux).</p>
      <p class="underline text-error">
        Results will appear below as you scan.
      </p>
    </k-block>
    <k-block-title v-if="results.length">
      Scan results
    </k-block-title>
    <k-block v-if="results.length">
      <UPageGrid>
        <ScanResultCard
          v-for="result in results"
          :key="result.scannedAt"
          :result="result"
        />
      </UPageGrid>
    </k-block>
  </div>
</template>
