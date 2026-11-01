import type { MaybeRefOrGetter } from 'vue'

/**
 * Counts the overlays (sheets, dialogs, drawers, modals) that are open. While any is open the tab bar hides — the
 * native one floats over the WebView and would cover the overlay's actions — and the native navbar hides too, since a
 * web overlay renders inside the WebView, under it.
 *
 * Template-bound overlays register with `useOverlayVisibility(isOpen)`; programmatic Nuxt UI overlays (`useOverlay`,
 * e.g. the confirm dialog of `@frigear-nu/ui`) are counted from Nuxt UI's own stack.
 */
export function useOverlayStack() {
  const open = useState<string[]>('overlay-stack', () => [])
  const { overlays } = useOverlay()

  const count = computed(() => open.value.length + overlays.filter(o => o.isOpen).length)

  return {
    count,
    hasOpen: computed(() => count.value > 0),
    push: (id: string) => {
      if (!open.value.includes(id)) open.value = [...open.value, id]
    },
    pop: (id: string) => {
      open.value = open.value.filter(o => o !== id)
    },
  }
}

/** Registers a template-bound overlay's open state with the overlay stack, and releases it when the component goes. */
export function useOverlayVisibility(isOpen: MaybeRefOrGetter<boolean>) {
  const id = useId()
  const { push, pop } = useOverlayStack()

  watch(() => toValue(isOpen), value => value ? push(id) : pop(id), { immediate: true })
  onScopeDispose(() => pop(id))
}
