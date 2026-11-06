import { createSharedComposable } from '@vueuse/core'
import type { ScanResult } from '~/types/scanner'

/**
 * Scanning from anywhere (the tab, the floating button) and the one result sheet that shows a scan or a saved code
 * (`ResultSheet`, mounted once in app.vue).
 */
const _useScanFlow = () => {
  const { scanBarcode } = useBarcodeScanner()
  const { save } = useSavedScanResults()
  const { settings } = useScannerSettings()
  const toast = useToast()
  const { haptic } = useNative()

  const sheet = reactive<{ open: boolean, result?: ScanResult, savedId?: string }>({ open: false })

  const present = (result: ScanResult, savedId?: string) => {
    sheet.result = result
    sheet.savedId = savedId
    sheet.open = true
  }

  const close = () => {
    sheet.open = false
  }

  const scan = async () => {
    try {
      return await scanBarcode()
    } catch (e) {
      // Closing the scanner rejects too; only report real failures.
      const message = e instanceof Error ? e.message : String(e)
      if (!/cancel/i.test(message)) {
        void haptic('error')
        toast.add({ title: 'Could not scan', description: message, color: 'error', icon: 'i-lucide-circle-alert' })
      }
      return undefined
    }
  }

  const scanAndPresent = async () => {
    close()
    const result = await scan()
    if (!result) return
    if (settings.autoSave) {
      const id = await save(result)
      toast.add({ title: 'Saved', description: result.text, color: 'success', icon: 'i-lucide-bookmark-check' })
      present(result, id)
      return
    }
    present(result)
  }

  return { sheet, present, close, scan, scanAndPresent }
}

export const useScanFlow = createSharedComposable(_useScanFlow)
