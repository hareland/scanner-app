<script setup lang="ts">
import { kListItem } from 'konsta/vue'
import type { ScanResult } from '~/types/scanner'

/** One code in a Konsta list: content icon, its description (else its value), type and when it was scanned. */
defineProps<{ result: ScanResult }>()
defineEmits<{ select: [] }>()

const format = useFormat()
// Today's scans show the time, older ones the date.
const when = (at: number) => new Date(at).toDateString() === new Date().toDateString() ? format.time(at) : format.date(at)
</script>

<template>
  <k-list-item
    link
    :title="result.description || result.text"
    :subtitle="result.description ? `${formatLabel(result.format)} · ${result.text}` : formatLabel(result.format)"
    :after="when(result.scannedAt)"
    title-wrap-class="min-w-0"
    @click="$emit('select')"
  >
    <template #media>
      <span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <UIcon
          :name="contentIcon(result.text, result.format)"
          class="size-5"
        />
      </span>
    </template>
  </k-list-item>
</template>
