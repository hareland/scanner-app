<script setup lang="ts">
import { kBlock, kBlockTitle, kList, kListItem } from 'konsta/vue'
import { definePageMeta, useNativeActions, useSavedScanResults, useScannerSettings, useToast, ref } from '#imports'
import type { ScanResult } from '~/types/scanner'

definePageMeta({ mobile: { title: 'Developer' } })

const toast = useToast()
const actions = useNativeActions()
const { list, importItems } = useSavedScanResults()
const { settings, reset } = useScannerSettings()

const importInput = ref('')

const exportJson = () => JSON.stringify({ results: list.value.map(({ id: _id, ...result }) => result) }, null, 2)

async function onImport() {
  let parsed: { results?: ScanResult[] }
  try {
    parsed = JSON.parse(importInput.value || '{}')
  } catch {
    toast.add({ title: 'Invalid JSON', icon: 'i-lucide-circle-alert', color: 'error' })
    return
  }
  const results = Array.isArray(parsed.results) ? parsed.results.filter(r => r?.text && r?.format) : []
  await importItems(results.map(r => ({ text: r.text, format: r.format, scannedAt: r.scannedAt ?? Date.now(), description: r.description })))
  importInput.value = ''
  toast.add({ title: `Imported ${results.length} codes`, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div>
    <k-block-title>Saved codes</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item
        link
        title="Copy all as JSON"
        :after="String(list.length)"
        @click="actions.copy(exportJson())"
      />
      <k-list-item
        link
        title="Share as JSON"
        @click="actions.share(exportJson(), 'Saved codes')"
      />
    </k-list>

    <k-block-title>Import</k-block-title>
    <k-block class="flex flex-col gap-3">
      <UTextarea
        v-model="importInput"
        class="w-full font-mono"
        placeholder="{ &quot;results&quot;: [{ &quot;text&quot;: &quot;…&quot;, &quot;format&quot;: &quot;QR_CODE&quot; }] }"
        :rows="6"
        autoresize
      />
      <UButton
        label="Import"
        icon="i-lucide-import"
        size="lg"
        block
        :disabled="!importInput"
        @click="onImport"
      />
    </k-block>

    <k-block-title>Scanner settings</k-block-title>
    <k-block>
      <pre class="overflow-x-auto text-xs">{{ settings }}</pre>
      <UButton
        label="Reset scanner settings"
        color="error"
        variant="soft"
        class="mt-3"
        @click="reset"
      />
    </k-block>
  </div>
</template>
