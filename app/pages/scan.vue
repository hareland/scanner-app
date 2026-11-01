<script setup lang="ts">
import { kBlock, kBlockTitle, kList } from 'konsta/vue'

definePageMeta({ title: 'Scan' })

const { results, clear } = useBarcodeScanner()
const { present, scanAndPresent } = useScanFlow()

const sorted = computed(() => [...results.value].reverse())

useNavbarActions(() => results.value.length
  ? [{ id: 'clear-session', label: 'Clear session', icon: 'i-lucide-list-x', sfSymbol: 'xmark.circle', onSelect: clear }]
  : [])
</script>

<template>
  <div>
    <k-block>
      <button
        type="button"
        class="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-10 text-primary active:bg-primary/10"
        @click="scanAndPresent"
      >
        <UIcon
          name="i-lucide-scan-barcode"
          class="size-16"
        />
        <span class="text-lg font-semibold">Tap to scan</span>
        <span class="text-sm text-muted">QR codes, barcodes, Data Matrix, Aztec and PDF417</span>
      </button>
    </k-block>

    <template v-if="sorted.length">
      <k-block-title>This session</k-block-title>
      <k-list
        strong-ios
        inset-ios
      >
        <ScanListItem
          v-for="result in sorted"
          :key="result.scannedAt"
          :result="result"
          @select="present(result)"
        />
      </k-list>
    </template>
    <UEmpty
      v-else
      icon="i-lucide-history"
      title="No scans yet"
      description="Codes you scan show up here until you close the app."
      variant="naked"
      class="py-8"
    />
  </div>
</template>
