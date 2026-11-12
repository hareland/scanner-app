/**
 * Confirm, copy, share and open on top of `useNative()` (@frigear-nu/mobile): native on a device, the
 * `@frigear-nu/ui` / browser equivalents otherwise. Call it in setup.
 */
export function useNativeActions() {
  const native = useNative()
  const { copy: webCopy } = useCopyToClipboard()
  const toast = useToast()

  /** Destructive confirms are an action sheet with a red button on iOS, the rest an alert or the web dialog. */
  const confirm = (options: { title: string, description?: string, confirmText?: string, destructive?: boolean }) =>
    native.confirm({ title: options.title, description: options.description, confirmLabel: options.confirmText, destructive: options.destructive })

  async function copy(text: string, message = 'Copied to clipboard') {
    if (!native.isNative) return await webCopy(text, message)
    const { Clipboard } = await import('@capacitor/clipboard')
    await Clipboard.write({ string: text })
    void native.haptic('success')
    toast.add({ title: message, color: 'success', icon: 'i-lucide-clipboard-check' })
    return true
  }

  /** The share sheet; in a browser without one the text is copied. */
  async function share(text: string, title?: string) {
    const isUrl = /^https?:\/\//i.test(text)
    await native.share(isUrl ? { title, url: text } : { title, text })
  }

  /** The in-app browser (SFSafariViewController) on a device, a new tab in a browser. */
  async function openUrl(url: string) {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url })
  }

  return { confirm, copy, share, openUrl, haptic: native.haptic, actionSheet: native.actionSheet, isNative: native.isNative }
}
