import { actionSheet, haptic, nativeConfirm, nativeCopy, openUrl, share } from '~/lib/native'

/**
 * Confirm, copy, share and open — native on a device (Capacitor plugins), the `@frigear-nu/ui` / browser equivalents
 * otherwise. Call it in setup: the web confirm dialog needs Nuxt UI's overlay context.
 */
export function useNativeActions() {
  const confirmDialog = useConfirmDialog()
  const { copy: webCopy } = useCopyToClipboard()
  const toast = useToast()

  /** Destructive confirms are an action sheet with a red button, as in iOS; the rest an alert. */
  async function confirm(options: { title: string, description?: string, confirmText?: string, destructive?: boolean }) {
    if (options.destructive) {
      const choice = await actionSheet({
        title: options.title,
        message: options.description,
        actions: [{ title: options.confirmText ?? 'Confirm', destructive: true }],
      })
      if (choice !== null) return choice === 0
    }
    const native = await nativeConfirm({ title: options.title, message: options.description, okLabel: options.confirmText })
    if (native !== null) return native
    return await confirmDialog(options)
  }

  async function copy(text: string, message = 'Copied to clipboard') {
    if (await nativeCopy(text)) {
      await haptic('success')
      toast.add({ title: message, color: 'success', icon: 'i-lucide-clipboard-check' })
      return true
    }
    return await webCopy(text, message)
  }

  async function shareText(text: string, title?: string) {
    const isUrl = /^https?:\/\//i.test(text)
    if (await share(isUrl ? { title, url: text } : { title, text })) return
    // Nothing to share with (desktop browser): copying is the closest thing.
    await copy(text)
  }

  return { confirm, copy, share: shareText, openUrl }
}
