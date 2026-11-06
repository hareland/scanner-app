import type { MaybeRefOrGetter } from 'vue'

export type NavbarAction = {
  id: string
  label: string
  /** Nuxt UI icon for the web header. */
  icon: string
  /** SF Symbol for the native iOS navbar. */
  sfSymbol: string
  onSelect: () => void
}

/** The current page's buttons on the right of the navbar. Read by `plugins/navbar-actions.client.ts` and `layouts/mobile.vue`. */
export const useNavbarActionsState = () => useState<NavbarAction[]>('navbar-actions', () => [])

/**
 * Puts buttons on the right of the navbar while the page is mounted.
 *
 * Temporary: @frigear-nu/mobile 0.4 has no navbar actions yet. Replace with its API once that lands upstream.
 */
export function useNavbarActions(actions: MaybeRefOrGetter<NavbarAction[]>) {
  const state = useNavbarActionsState()
  let active = true
  const show = () => {
    active = true
    state.value = toValue(actions)
  }
  const hide = () => {
    active = false
    state.value = []
  }
  watch(() => toValue(actions), (value) => {
    if (active) state.value = value
  }, { immediate: true })
  // Tab pages stay alive (@frigear-nu/mobile keepTabsAlive), so leaving one deactivates it instead of unmounting it.
  onActivated(show)
  onDeactivated(hide)
  onScopeDispose(hide)
}
