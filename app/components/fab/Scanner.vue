<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'click'): void
}>()

const props = defineProps<{
  onClick: () => void
}>()

const handleClick = () => {
  if (!props.onClick) {
    navigateTo({ path: '/scan', query: { action: 'quickscan' } })
    return
  }

  $emits('click')
}
</script>

<template>
  <UButton
    class="fixed right-safe-4 bottom-safe-4 z-20000 rounded-3xl p-2 size-12 flex align-center justify-center"
    @click="handleClick"
  >
    <UIcon
      name="material-symbols:barcode-scanner-rounded"
      class="size-16"
    />
  </UButton>
</template>
