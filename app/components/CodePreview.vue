<script setup lang="ts">
import type { BarcodeFormat } from '~/types/scanner'

/** Draws a code: QR via nuxt-qrcode, 1D formats via JsBarcode, nothing for formats neither can draw. */
const props = defineProps<{ value: string, format: BarcodeFormat }>()
defineEmits<{ invalid: [boolean] }>()

const kind = computed(() => props.format === 'QR_CODE' ? 'qr' : jsBarcodeFormat(props.format) ? 'barcode' : undefined)
</script>

<template>
  <div
    v-if="kind"
    class="flex justify-center rounded-xl bg-white p-4 text-black"
  >
    <Qrcode
      v-if="kind === 'qr'"
      :value="value"
      class="size-48"
    />
    <BarcodePreview
      v-else
      :value="value"
      :format="format"
      class="h-28"
      @invalid="$emit('invalid', $event)"
    />
  </div>
</template>
