import { haptic, isNative } from '~/lib/native'

/** On a device: a selection tick on every switch or toggle. In a browser it does nothing. */
export default defineNuxtPlugin(async () => {
  if (!(await isNative())) return

  document.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest('[role="switch"], .k-toggle, input[type="checkbox"]')) {
      haptic('selection').catch(() => {})
    }
  })
})
