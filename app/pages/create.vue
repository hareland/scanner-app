<script setup lang="ts">
import { kBlock } from 'konsta/vue'

definePageMeta({
  layout: 'home',
})

const { rightActions } = useMainNavbar()

onMounted(() => {
  rightActions.value = []
})
</script>

<template>
  <k-block
    strong
    inset-ios
  >
    <p>TBA: Will be for creating QR Codes / Barcodes...</p>
    <p class="underline text-error">
      TODO Man... Get to it!
    </p>
  </k-block>
</template>
