import type { MaybeRefOrGetter } from 'vue'

/**
 * Hides the tab bar while a Konsta sheet or dialog is open, as @frigear-nu/mobile does on its own for Nuxt UI
 * overlays: on iOS the native tab bar floats over the WebView and would cover the overlay's actions.
 */
export function useSuppressTabBar(isOpen: MaybeRefOrGetter<boolean>) {
  const { suppress } = useMobileChrome()
  let release: (() => void) | undefined

  watch(() => toValue(isOpen), (open) => {
    if (open && !release) release = suppress()
    else if (!open && release) {
      release()
      release = undefined
    }
  }, { immediate: true })
  onScopeDispose(() => release?.())
}
