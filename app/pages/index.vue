<script setup lang="ts">
import { kBlock, kBlockTitle, kList } from 'konsta/vue'

definePageMeta({ title: 'Scanner' })

const { results } = useBarcodeScanner()
const { list: saved } = useSavedScanResults()
const { present, scanAndPresent } = useScanFlow()

const recent = computed(() => [...results.value].reverse().slice(0, 5))

useNavbarActions([
  { id: 'settings', label: 'Settings', icon: 'i-lucide-settings', sfSymbol: 'gearshape', onSelect: () => navigateTo('/settings') },
])
</script>

<template>
  <div>
    <k-block class="grid grid-cols-2 gap-3">
      <StatCard
        label="This session"
        :value="results.length"
        icon="i-lucide-scan-barcode"
        to="/scan"
      />
      <StatCard
        label="Saved"
        :value="saved.length"
        icon="i-lucide-bookmark"
        to="/saved"
      />
    </k-block>

    <k-block>
      <UButton
        label="Scan a code"
        icon="i-lucide-scan-barcode"
        size="xl"
        block
        @click="scanAndPresent"
      />
    </k-block>

    <template v-if="recent.length">
      <k-block-title>Recent scans</k-block-title>
      <k-list
        strong-ios
        inset-ios
      >
        <ScanListItem
          v-for="result in recent"
          :key="result.scannedAt"
          :result="result"
          @select="present(result)"
        />
      </k-list>
    </template>

    <template v-if="saved.length">
      <k-block-title>Recently saved</k-block-title>
      <k-list
        strong-ios
        inset-ios
      >
        <ScanListItem
          v-for="item in saved.slice(0, 3)"
          :key="item.id"
          :result="item"
          @select="present(item, item.id)"
        />
      </k-list>
    </template>

    <k-block
      v-if="!recent.length && !saved.length"
      strong
      inset
    >
      <p>Scan QR codes and barcodes, keep the ones you need, and make your own on the Create tab.</p>
    </k-block>
  </div>
</template>
