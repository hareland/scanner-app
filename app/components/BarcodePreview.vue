<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import type { BarcodeFormat } from '~/types/scanner'

/** A 1D barcode as SVG (JsBarcode). Emits `invalid` when the value doesn't fit the format (e.g. letters in EAN-13). */
const props = defineProps<{ value: string, format: BarcodeFormat }>()
const emit = defineEmits<{ invalid: [boolean] }>()

const svg = useTemplateRef<SVGSVGElement>('svg')
const valid = ref(true)

function render() {
  const format = jsBarcodeFormat(props.format)
  if (!svg.value || !format || !props.value) return
  try {
    JsBarcode(svg.value, props.value, {
      format,
      background: 'transparent',
      lineColor: 'currentColor',
      displayValue: true,
      font: 'ui-monospace, monospace',
      margin: 0,
      valid: (ok: boolean) => {
        valid.value = ok
      },
    })
  } catch {
    valid.value = false
  }
  emit('invalid', !valid.value)
}

watch(() => [props.value, props.format], render, { flush: 'post' })
onMounted(render)
</script>

<template>
  <svg
    v-show="valid"
    ref="svg"
    class="max-w-full"
  />
</template>
