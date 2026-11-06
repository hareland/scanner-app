<script setup lang="ts">
import { kBlock, kList } from 'konsta/vue'

definePageMeta({ title: 'Saved' })

const { list, loaded, clear } = useSavedScanResults()
const { present, scanAndPresent } = useScanFlow()
const actions = useNativeActions()

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return list.value
  return list.value.filter(s => [s.text, s.description ?? '', formatLabel(normalizeFormat(s.format, s.text))].some(v => v.toLowerCase().includes(q)))
})

async function onClear() {
  const ok = await actions.confirm({
    title: 'Delete all saved codes?',
    description: `${list.value.length} saved ${list.value.length === 1 ? 'code' : 'codes'} will be removed from this device.`,
    confirmText: 'Delete all',
    destructive: true,
  })
  if (ok) await clear()
}

useNavbarActions(() => list.value.length
  ? [{ id: 'clear-saved', label: 'Delete all', icon: 'i-lucide-trash-2', sfSymbol: 'trash', onSelect: onClear }]
  : [])
</script>

<template>
  <div>
    <template v-if="list.length">
      <k-block class="my-4">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search saved codes"
          size="lg"
          class="w-full"
        />
      </k-block>
      <k-list
        v-if="filtered.length"
        strong-ios
        inset-ios
      >
        <ScanListItem
          v-for="item in filtered"
          :key="item.id"
          :result="item"
          @select="present(item, item.id)"
        />
      </k-list>
      <UEmpty
        v-else
        icon="i-lucide-search-x"
        :title="`Nothing matches “${query}”`"
        variant="naked"
        class="py-8"
      />
    </template>

    <UEmpty
      v-else-if="loaded"
      icon="i-lucide-bookmark"
      title="No saved codes"
      description="Save a scan to keep it here."
      variant="naked"
      class="py-12"
      :actions="[{ label: 'Scan a code', icon: 'i-lucide-scan-barcode', variant: 'soft', onClick: scanAndPresent }]"
    />
  </div>
</template>
