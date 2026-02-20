import { createSharedComposable } from '@vueuse/core'

type Action = {
  label?: string
  icon?: string
  isBack?: boolean
  onClick: () => void
}
const _useMainNavbar = () => {
  const title = ref<string | undefined>()
  const leftActions = ref<Action[]>([])
  const rightActions = ref<Action[]>([])

  const currentViewId = ref<'home' | 'scan' | 'saved' | string>('home')

  return {
    title,
    currentViewId,
    leftActions,
    rightActions,
  }
}

export const useMainNavbar = createSharedComposable(_useMainNavbar)
