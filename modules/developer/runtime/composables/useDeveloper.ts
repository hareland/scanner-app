import { createSharedComposable } from '@vueuse/core'

const _useDeveloper = () => {
  const { public: { developer } } = useRuntimeConfig()
  const isEnabled = computed(() => developer?.enabled ?? import.meta.dev ?? false)
  return { isEnabled }
}

export const useDeveloper = createSharedComposable(_useDeveloper)

export default useDeveloper
