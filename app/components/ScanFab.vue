<script setup lang="ts">
/** Scan from any tab. Sits above the native tab bar on a device, above the Konsta one in a browser. */
const nativeChrome = useState('native-chrome', () => false)
const { scanAndPresent } = useScanFlow()
</script>

<template>
  <UButton
    icon="i-lucide-scan-barcode"
    size="xl"
    class="fixed right-4 z-20 size-14 justify-center rounded-full shadow-lg"
    :class="nativeChrome
      ? 'bottom-[calc(var(--cap-native-system-tabbar-height,0px)+1rem)]'
      : 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'"
    :ui="{ leadingIcon: 'size-7' }"
    aria-label="Scan a code"
    @click="scanAndPresent"
  />
</template>
