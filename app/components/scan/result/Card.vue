<script setup lang="ts">
import type { ScanResult } from '~/types/scanner'

defineProps<{
  result: ScanResult
}>()
</script>

<template>
  <UCard class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h2>{{ result.format }}</h2>
      <div
        v-if="result.scannedAt"
        class="ext-right text-xs"
      >
        {{ new Date(result.scannedAt).toISOString() }}
      </div>
    </div>
    <pre>{{ result.text }}</pre>
  </UCard>
</template>
