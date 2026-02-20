<script setup lang="ts">
import type { ScanResult } from '~/types/scanner'

defineProps<{
  result: ScanResult
}>()

defineEmits<{
  (e: 'delete'): void
}>()
</script>

<template>
  <UCard class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h2>{{ result.format }}</h2>
      <div
        class="ext-right text-xs"
      >
        <div>
          <UButton
            icon="i-lucide-trash"
            variant="subtle"
            color="error"
            @click="$emit('delete')"
          />
        </div>
      </div>
    </div>
    <pre>{{ result.text }}</pre>
  </UCard>
</template>
