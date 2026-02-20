<script setup lang="ts">
import {
  kNavbar,
  kBlockTitle,
  kBlock,
  kSheet,
  kLink,
} from 'konsta/vue'
import { useBarcodeScanner } from '~/composables/useBarcodeScanner'
import { useClipboard } from '@vueuse/core'

definePageMeta({
  layout: 'home',
})

const toast = useToast()
const { results, scanBarcode } = useBarcodeScanner()
const { save: saveScan } = useSavedScanResults()
const { rightActions } = useMainNavbar()
const { copy, copied } = useClipboard()

const handleScan = async () => {
  await scanBarcode()
}

const displayLatestResult = ref(false)
const latestResult = computed(() => results.value.at(-1))
const setupJson = ref<unknown | undefined>()

const sortedResults = computed(() => [...results.value].sort((a, b) => b.scannedAt - a.scannedAt))

const onCopyResult = () => {
  if (!latestResult.value) return
  copy(latestResult.value.text)
}
const onSaveResult = async () => {
  if (!latestResult.value) return

  displayLatestResult.value = false
  await saveScan(latestResult.value)
}

const onSaveAndScanAgain = async () => {
  if (!latestResult.value) return
  displayLatestResult.value = false
  await saveScan(latestResult.value)
  await scanBarcode()
}

const onScanAgain = () => {
  displayLatestResult.value = false
  scanBarcode()
}

watch(latestResult, () => {
  displayLatestResult.value = true
})

watch(copied, (b) => {
  if (!b) return
  toast.add({
    title: 'Copied to clipboard',
    icon: 'i-lucide-check',
    color: 'success',
  })
})

watch(latestResult, (result) => {
  if (!result) return

  if (!result.format || !result.text) return

  if (result.text.startsWith('stp:')) {
    // This is a setup code, we want to load it into the scan engine:
    const jsonString = result.text.slice(4)
    try {
      setupJson.value = JSON.parse(jsonString)
    } catch (err) {
      setupJson.value = err
    }
  }
})

onMounted(() => rightActions.value = [])
</script>

<template>
  <div>
    <k-block-title v-if="setupJson">
      Found Setup:
    </k-block-title>
    <k-block v-if="setupJson">
      <pre>{{ setupJson }}</pre>
    </k-block>
    <div v-if="sortedResults && sortedResults.length">
      <k-block-title>Recent scans</k-block-title>
      <k-block>
        <UPageGrid class="gap-4">
          <ScanResultCard
            v-for="result in sortedResults"
            :key="result.scannedAt"
            :result="result"
          />
        </UPageGrid>
      </k-block>
    </div>
    <k-block v-else>
      <UEmpty
        title="No recent scans."
        icon="tdesign:no-result"
        variant="naked"
        :actions="[{ label: 'Scan to get started', size: 'xl', variant: 'soft', onClick: handleScan, icon: 'material-symbols:barcode-scanner-rounded' }]"
      />
    </k-block>

    <k-block class="fixed bottom-26  ios:mb-4 electron:mb-4 w-full flex justify-center">
      <UButton
        class="ml-safe text-lg p-4 rounded-4xl"
        size="xl"
        variant="subtle"
        @click="handleScan"
      >
        Scan a code
      </UButton>
    </k-block>

    <k-sheet
      class="pb-safe"
      :opened="displayLatestResult"
      @backdropclick="() => (displayLatestResult = false)"
    >
      <k-navbar title="Result">
        <template #right>
          <k-link
            icon-only
            @click="() => (displayLatestResult = false)"
          >
            <UIcon
              name="i-carbon-close"
              class="size-8"
            />
          </k-link>
        </template>
      </k-navbar>
      <k-block
        v-if="latestResult"
        class="flex gap-4 flex-col"
      >
        <UBadge
          color="neutral"
          size="lg"
          class="rounded-xl"
          @click="copy(latestResult.format)"
        >
          <b>Type:</b> {{ latestResult.format }}
        </UBadge>
        <UBadge
          color="neutral"
          size="lg"
          class="rounded-xl"
          @click="copy(latestResult.text)"
        >
          <b>Value:</b> {{ latestResult.text }}
        </UBadge>
      </k-block>
      <k-block
        v-if="latestResult"
        class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <UButton
          label="Copy"
          size="xl"
          icon="i-lucide-copy"
          @click="onCopyResult"
        />
        <UButton
          label="Save"
          size="xl"
          icon="i-carbon-save"
          @click="onSaveResult"
        /><UButton
          label="Save & Scan"
          size="xl"
          icon="i-carbon-save"
          @click="onSaveAndScanAgain"
        />
        <UButton
          label="Again"
          size="xl"
          icon="material-symbols:barcode-scanner-rounded"
          @click="onScanAgain"
        />
      </k-block>
    </k-sheet>
  </div>
</template>
