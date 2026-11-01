import { createSharedComposable } from '@vueuse/core'

export type ScannerSettings = {
  /** Buzz when a code is read. */
  hapticFeedback: boolean
  cameraFacing: 'back' | 'front'
  /** Save every scan without asking. */
  autoSave: boolean
  /** Show the scanner's camera picker in a browser. */
  webCameraSelection: boolean
}

const defaults = (): ScannerSettings => ({
  hapticFeedback: true,
  cameraFacing: 'back',
  autoSave: false,
  webCameraSelection: true,
})

const _useScannerSettings = () => {
  const storage = usePreferencesStore('scanner-settings')
  const settings = reactive(defaults())
  const loaded = ref(false)

  storage.get<Partial<ScannerSettings>>('settings').then((stored) => {
    if (stored) Object.assign(settings, stored)
    loaded.value = true
    // Persist only after the stored values are in, so the defaults never overwrite them.
    watch(settings, value => storage.set('settings', toRaw(value)), { deep: true })
  })

  const reset = () => Object.assign(settings, defaults())

  return { settings, loaded, reset }
}

export const useScannerSettings = createSharedComposable(_useScannerSettings)
