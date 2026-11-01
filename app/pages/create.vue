<script setup lang="ts">
import { kBlock, kBlockTitle, kSegmented, kSegmentedButton } from 'konsta/vue'
import type { BarcodeFormat } from '~/types/scanner'

definePageMeta({ title: 'Create' })

const { save } = useSavedScanResults()
const native = useNativeActions()
const toast = useToast()

const kind = ref<'qr' | 'barcode'>('qr')
const text = ref('')
const barcodeFormat = ref<BarcodeFormat>('CODE_128')
const invalid = ref(false)
const description = ref('')

const barcodeFormats = ['CODE_128', 'CODE_39', 'CODE_93', 'EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'ITF', 'CODABAR']
  .map(value => ({ value, label: formatLabel(value) }))

const format = computed<BarcodeFormat>(() => kind.value === 'qr' ? 'QR_CODE' : barcodeFormat.value)
const code = computed(() => text.value.trim())
const hints: Record<string, string> = {
  EAN_13: '12 or 13 digits',
  EAN_8: '7 or 8 digits',
  UPC_A: '11 or 12 digits',
  UPC_E: '6 to 8 digits',
  ITF: 'An even number of digits',
  CODE_39: 'Upper-case letters, digits and - . $ / + %',
  CODABAR: 'Digits and - $ : / . +, optionally wrapped in A–D',
}

watch(format, () => {
  invalid.value = false
})

const onCopy = () => native.copy(code.value)
const onShare = () => native.share(code.value)

async function onSave() {
  await save({ text: code.value, format: format.value, scannedAt: Date.now(), description: description.value })
  toast.add({ title: 'Saved', description: description.value.trim() || code.value, color: 'success', icon: 'i-lucide-bookmark-check' })
}
</script>

<template>
  <div>
    <k-block>
      <k-segmented
        strong
        rounded
      >
        <k-segmented-button
          :active="kind === 'qr'"
          @click="kind = 'qr'"
        >
          QR code
        </k-segmented-button>
        <k-segmented-button
          :active="kind === 'barcode'"
          @click="kind = 'barcode'"
        >
          Barcode
        </k-segmented-button>
      </k-segmented>
    </k-block>

    <k-block class="flex flex-col gap-4">
      <UFormField
        v-if="kind === 'barcode'"
        label="Format"
        :hint="hints[barcodeFormat]"
      >
        <USelect
          v-model="barcodeFormat"
          :items="barcodeFormats"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Description">
        <UInput
          v-model="description"
          placeholder="What is this code? e.g. Guest Wi-Fi"
          icon="i-lucide-tag"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="kind === 'qr' ? 'Text or link' : 'Value'"
        :error="invalid && code ? `Not a valid ${formatLabel(format)} value` : undefined"
      >
        <UTextarea
          v-if="kind === 'qr'"
          v-model="text"
          placeholder="https://example.com"
          autoresize
          :rows="2"
          size="lg"
          class="w-full"
        />
        <UInput
          v-else
          v-model="text"
          placeholder="123456789012"
          size="lg"
          class="w-full"
          autocapitalize="characters"
        />
      </UFormField>
    </k-block>

    <template v-if="code">
      <k-block-title>Preview</k-block-title>
      <k-block>
        <CodePreview
          :value="code"
          :format="format"
          @invalid="invalid = $event"
        />
      </k-block>
      <k-block class="grid grid-cols-3 gap-3">
        <UButton
          label="Save"
          icon="i-lucide-bookmark"
          size="xl"
          block
          :disabled="invalid"
          @click="onSave"
        />
        <UButton
          label="Copy"
          icon="i-lucide-copy"
          size="xl"
          color="neutral"
          variant="soft"
          block
          @click="onCopy"
        />
        <UButton
          label="Share"
          icon="i-lucide-share"
          size="xl"
          color="neutral"
          variant="soft"
          block
          @click="onShare"
        />
      </k-block>
    </template>
    <UEmpty
      v-else
      icon="i-lucide-qr-code"
      title="Make a code"
      description="Type something to see it as a code. Save it to show it from the Saved tab."
      variant="naked"
      class="py-8"
    />
  </div>
</template>
