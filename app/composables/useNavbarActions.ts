import type { MaybeRefOrGetter } from 'vue'

export type NavbarAction = {
  id: string
  label: string
  /** Iconify name for the Konsta navbar in a browser. */
  icon: string
  /** SF Symbol for the native navbar. */
  sfSymbol: string
  onSelect: () => void
}

/** The right-hand navbar buttons of the current page. Read by the native navbar plugin and the web navbar. */
export const useNavbarActionsState = () => useState<NavbarAction[]>('navbar-actions', () => [])

/** A page sets its navbar buttons; they clear when the page unmounts. */
export function useNavbarActions(actions: MaybeRefOrGetter<NavbarAction[]>) {
  const state = useNavbarActionsState()
  watch(() => toValue(actions), (value) => {
    state.value = value
  }, { immediate: true })
  onScopeDispose(() => {
    state.value = []
  })
}
