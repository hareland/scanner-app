import { Preferences } from '@capacitor/preferences'
import { createSharedComposable } from '@vueuse/core'
import { computed, ref, useRuntimeConfig } from '#imports'

const KEY = 'developer:unlocked'

const _useDeveloper = () => {
  const { public: { developer } } = useRuntimeConfig()
  /** On for the whole build (dev), so it cannot be turned off in the app. */
  const builtIn = computed(() => !!(developer as { enabled?: boolean } | undefined)?.enabled)
  const unlocked = ref(false)

  // Remembered on the device (UserDefaults on iOS, localStorage in a browser).
  const ready = Preferences.get({ key: KEY }).then(({ value }) => {
    unlocked.value = value === 'true'
  }).catch(() => {})

  const isEnabled = computed(() => builtIn.value || unlocked.value)

  async function unlock() {
    unlocked.value = true
    await Preferences.set({ key: KEY, value: 'true' })
  }

  async function lock() {
    unlocked.value = false
    await Preferences.remove({ key: KEY })
  }

  return { isEnabled, builtIn, unlock, lock, ready }
}

export const useDeveloper = createSharedComposable(_useDeveloper)

export default useDeveloper
