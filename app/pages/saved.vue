<script setup lang="ts">
import { kBlock, kSheet, kNavbar, kDialog, kDialogButton, kLink, kButton } from 'konsta/vue'
import type { ScanResult } from '~/types/scanner'

definePageMeta({
  layout: 'home',
})

const { scanBarcode } = useBarcodeScanner()
const { results, remove, clear } = useSavedScanResults()
const { rightActions } = useMainNavbar()

onMounted(() => {
  rightActions.value = [{ icon: 'i-lucide-trash', onClick: clear }]
})

const savedScans = computed(() =>
  Array.from(results.value.entries())
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => b.scannedAt - a.scannedAt),
)

const previewItem = ref<ScanResult | undefined>()
const showPreview = ref(false)
const showDeleteDialog = ref(false)
const deleteFromSheet = ref(false)

const openPreview = (item: ScanResult) => {
  if (showDeleteDialog.value) return
  previewItem.value = item
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  previewItem.value = undefined
}

const promptDelete = (id: string, fromSheet = false) => {
  const item = savedScans.value.find(s => s.id === id)
  if (!item) return
  previewItem.value = item
  deleteFromSheet.value = fromSheet
  showPreview.value = false
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  showDeleteDialog.value = false
  deleteFromSheet.value = false
  if (!previewItem.value?.id) return
  await remove(previewItem.value.id)
  previewItem.value = undefined
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  if (deleteFromSheet.value) {
    showPreview.value = true
  } else {
    previewItem.value = undefined
  }
  deleteFromSheet.value = false
}

const previewHeaderActions = computed(() => {
  const item = previewItem.value
  if (!item) return []
  return [
    ...(item.id ? [{ icon: 'i-lucide-trash', onClick: () => promptDelete(item.id, true) }] : []),
    { icon: 'i-carbon-close', onClick: closePreview },
  ]
})

const previewBottomActions = computed(() => {
  const item = previewItem.value
  if (!item) return []
  const isOpenableUrl = item.format === 'QR_CODE' && item.text.startsWith('http')
  return [
    ...(isOpenableUrl ? [{ label: 'Open in browser', onClick: () => window.open(item.text) }] : []),
    { label: 'Close', onClick: closePreview },
  ]
})
</script>

<template>
  <div>
    <k-block v-if="savedScans.length">
      <UPageGrid class="gap-4 ios:pb-14 pb-12">
        <ScanSavedResultCard
          v-for="result in savedScans"
          :key="result.scannedAt"
          :result="result"
          @click="openPreview(result)"
          @delete="promptDelete(result.id)"
        />
      </UPageGrid>
    </k-block>

    <k-block v-else>
      <UEmpty
        title="Nothing to see here :/"
        icon="tdesign:no-result"
        variant="naked"
        :actions="[{ label: 'Scan & Save to start', variant: 'soft', icon: 'material-symbols:barcode-scanner-rounded', onClick: scanBarcode }]"
      />
    </k-block>

    <k-sheet
      class="pb-safe"
      :opened="showPreview"
      @backdropclick="closePreview"
    >
      <k-navbar title="Preview">
        <template #right>
          <k-link
            v-for="(action, i) in previewHeaderActions"
            :key="i"
            icon-only
            @click="action.onClick"
          >
            <UIcon
              :name="action.icon"
              class="size-8"
            />
          </k-link>
        </template>
      </k-navbar>

      <k-block>
        <div class="max-w-dvw">
          <template v-if="previewItem?.format === 'QR_CODE'">
            <Qrcode :value="previewItem.text" />
            <div class="mt-4 text-center">
              {{ previewItem.text }}
            </div>
          </template>
          <pre
            v-else
            class="break-all line-clamp-6"
          >{{ previewItem }}</pre>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <k-button
            v-for="(action, i) in previewBottomActions"
            :key="i"
            large
            rounded
            @click="action.onClick"
          >
            {{ action.label }}
          </k-button>
        </div>
      </k-block>
    </k-sheet>

    <k-dialog
      :opened="showDeleteDialog"
      @backdropclick="cancelDelete"
    >
      <template #title>
        Delete
      </template>
      <pre>{{ previewItem }}</pre>
      <template #buttons>
        <k-dialog-button @click="cancelDelete">
          Cancel
        </k-dialog-button>
        <k-dialog-button
          strong
          class="k-color-brand-red"
          @click="confirmDelete"
        >
          Confirm
        </k-dialog-button>
      </template>
    </k-dialog>
  </div>
</template>
