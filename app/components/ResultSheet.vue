<script setup lang="ts">
import { kSheet, kNavbar, kLink, kBlock } from 'konsta/vue'

/** The one sheet that shows a scanned or saved code, with its actions. Opened through `useScanFlow().present`. */
const { sheet, close, scanAndPresent } = useScanFlow()
const { save, describe, remove, isSaved } = useSavedScanResults()
const actions = useNativeActions()
const format = useFormat()
const toast = useToast()

useSuppressTabBar(() => sheet.open)

const result = computed(() => sheet.result)

// What the code is. A saved code stores it as soon as the field loses focus; an unsaved one keeps it for Save.
const description = ref('')
watch(() => [sheet.open, sheet.result], () => {
  description.value = sheet.result?.description ?? ''
}, { immediate: true })

async function onDescribe() {
  if (!sheet.savedId || !sheet.result) return
  if ((sheet.result.description ?? '') === description.value.trim()) return
  await describe(sheet.savedId, description.value)
  sheet.result = { ...sheet.result, description: description.value.trim() || undefined }
}
const saved = computed(() => !!sheet.savedId || (result.value ? isSaved(result.value) : false))
const setup = computed(() => result.value ? parseSetupCode(result.value.text) : null)

const details = computed(() => result.value
  ? [
      { key: 'format', label: 'Type', value: formatLabel(result.value.format) },
      { key: 'text', label: 'Value', value: result.value.text },
      { key: 'scannedAt', label: 'Scanned', value: format.dateTime(result.value.scannedAt) },
    ]
  : [])

/** Closing keeps a description that was typed but never left the field. */
async function closeSheet() {
  await onDescribe()
  close()
}

async function onSave() {
  if (!result.value) return
  sheet.result = { ...result.value, description: description.value.trim() || undefined }
  sheet.savedId = await save(sheet.result)
  toast.add({ title: 'Saved', color: 'success', icon: 'i-lucide-bookmark-check' })
}

async function onDelete() {
  const id = sheet.savedId
  if (!id) return
  const ok = await actions.confirm({ title: 'Delete this code?', description: result.value?.text, confirmText: 'Delete', destructive: true })
  if (!ok) return
  await remove(id)
  close()
}
</script>

<template>
  <k-sheet
    class="w-full pb-safe"
    :opened="sheet.open"
    @backdropclick="closeSheet"
  >
    <k-navbar :title="result ? (result.description || formatLabel(result.format)) : 'Result'">
      <template #right>
        <k-link
          icon-only
          aria-label="Close"
          @click="closeSheet"
        >
          <UIcon
            name="i-lucide-x"
            class="size-7"
          />
        </k-link>
      </template>
    </k-navbar>

    <k-block
      v-if="result"
      class="flex max-h-[70dvh] flex-col gap-4 overflow-y-auto"
    >
      <CodePreview
        :value="result.text"
        :format="result.format"
      />

      <UFormField
        label="Description"
        :hint="sheet.savedId ? undefined : 'Kept when you save'"
      >
        <UInput
          v-model="description"
          placeholder="What is this code? e.g. Gym locker"
          icon="i-lucide-tag"
          size="lg"
          class="w-full"
          enterkeyhint="done"
          @change="onDescribe"
          @keydown.enter="($event.target as HTMLInputElement).blur()"
        />
      </UFormField>

      <DescriptionList :items="details">
        <template #text="{ item }">
          <span class="font-mono break-all">{{ item.value }}</span>
        </template>
      </DescriptionList>

      <UAlert
        v-if="setup"
        :color="setup.ok ? 'info' : 'error'"
        variant="subtle"
        icon="i-lucide-settings-2"
        :title="setup.ok ? 'Setup code' : 'Invalid setup code'"
      >
        <template #description>
          <pre class="overflow-x-auto text-xs">{{ setup.ok ? setup.value : setup.error }}</pre>
        </template>
      </UAlert>

      <div class="grid grid-cols-2 gap-3">
        <UButton
          v-if="isUrl(result.text)"
          label="Open link"
          icon="i-lucide-external-link"
          size="xl"
          block
          class="col-span-2"
          @click="actions.openUrl(result.text)"
        />
        <UButton
          label="Copy"
          icon="i-lucide-copy"
          size="xl"
          color="neutral"
          variant="soft"
          block
          @click="actions.copy(result.text)"
        />
        <UButton
          label="Share"
          icon="i-lucide-share"
          size="xl"
          color="neutral"
          variant="soft"
          block
          @click="actions.share(result.text)"
        />
        <UButton
          v-if="!saved"
          label="Save"
          icon="i-lucide-bookmark"
          size="xl"
          color="neutral"
          variant="soft"
          block
          @click="onSave"
        />
        <UButton
          v-else-if="sheet.savedId"
          label="Delete"
          icon="i-lucide-trash-2"
          size="xl"
          color="error"
          variant="soft"
          block
          @click="onDelete"
        />
        <UButton
          label="Scan again"
          icon="i-lucide-scan-barcode"
          size="xl"
          color="neutral"
          variant="soft"
          block
          :class="saved && !sheet.savedId ? 'col-span-2' : ''"
          @click="scanAndPresent"
        />
      </div>
    </k-block>
  </k-sheet>
</template>
