<script setup lang="ts">
import { kNavbar, kNavbarBackLink, kBlockTitle, kBlock, kButton } from 'konsta/vue'
import { useSavedScanResults, useDeveloper } from '#imports'
import { useClipboard } from '@vueuse/core'

const toast = useToast()
const { copy, copied } = useClipboard()
const { results, importItems } = useSavedScanResults()

watch(copied, (b) => {
  if (!b) return
  toast.add({
    title: 'Copied to clipboard',
    icon: 'i-lucide-check',
    color: 'success',
  })
})

const copyAllAsJson = async () => {
  const jsonString = JSON.stringify({
    results: toRaw(Array.from(results.value.values())),
  }, null, 2)
  await copy(jsonString)
}

const importInput = ref<string | undefined>()

const parseImportInput = () => {
  try {
    return JSON.parse(importInput.value ?? '{}')
  } catch (_) {
    return null
  }
}

const onImportJson = async () => {
  const parsedJson = parseImportInput()

  if (!parsedJson) return toast.add({
    title: 'Invalid JSON',
    icon: 'i-lucide-alert-circle',
    color: 'error',
  })

  const { results } = parsedJson

  const importedKeys = []
  if (results && Array.isArray(results)) {
    // idk, maybe append?
    await importItems(results)
    importedKeys.push('results')
  }

  toast.add({
    title: `Imported ${importedKeys.join(', ')}`,
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <div>
    <k-navbar title="Developer">
      <template #left>
        <k-navbar-back-link
          icon-only
          @click="$router.back()"
        />
      </template>
    </k-navbar>
    <k-block-title>
      Export Saved Results
    </k-block-title>
    <k-block>
      <k-button @click="copyAllAsJson">
        Copy all as JSON
      </k-button>
    </k-block>
    <k-block-title>Import</k-block-title>
    <k-block class="flex flex-col gap-4">
      <UTextarea
        v-model="importInput"
        class="w-full"
        placeholder="Paste JSON"
        :rows="10"
        autoresize
      />
      <k-button @click="onImportJson">
        Import
      </k-button>
    </k-block>
  </div>
</template>
