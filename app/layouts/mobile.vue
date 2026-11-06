<script setup lang="ts">
/**
 * Replaces the `mobile` layout of @frigear-nu/mobile: the same header and tab bar, but no side padding, since Konsta's
 * inset lists and blocks bring their own. On iOS both bars are native and only the insets remain.
 */
const { state } = useMobileChrome()
const { scanAndPresent } = useScanFlow()

// Scan from any tab but Scan itself; it goes with the tab bar while a sheet or dialog is open.
const showFab = computed(() => state.value.tabBar.visible && state.value.activeTab?.id !== 'scan')
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <MobileHeader />
    <main
      class="flex flex-1 flex-col pb-[calc(var(--mobile-inset-bottom)+6rem)]"
      :class="{ 'pt-(--mobile-inset-top)': state.mode === 'native' || !state.header.visible }"
    >
      <slot />
    </main>
    <MobileFab
      v-if="showFab"
      label="Scan a code"
      icon="i-lucide-scan-barcode"
      @click="scanAndPresent"
    />
    <MobileTabBar />
  </div>
</template>
