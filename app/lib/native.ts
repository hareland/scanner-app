import type { ActionSheetButtonStyle } from '@capacitor/action-sheet'

/**
 * Small wrappers over Capacitor plugins. Each one is a no-op (or returns `null` / `false`) in a browser, so callers
 * fall back to their web behaviour without platform checks of their own. Plugins load lazily so the browser build
 * never touches them.
 */

export const isNative = async () => (await import('@capacitor/core')).Capacitor.isNativePlatform()

/** A light tap for a change that took effect, a buzz for a failure, a tick for a toggle, a double for a scan. */
export async function haptic(kind: 'impact' | 'success' | 'error' | 'selection' = 'impact') {
  if (!(await isNative())) return
  const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics')
  if (kind === 'error') await Haptics.notification({ type: NotificationType.Error })
  else if (kind === 'success') await Haptics.notification({ type: NotificationType.Success })
  else if (kind === 'selection') await Haptics.selectionChanged()
  else await Haptics.impact({ style: ImpactStyle.Light })
}

/**
 * An iOS action sheet. Returns the index of the chosen option, or `null` when cancelled or in a browser (callers
 * then fall back to their web menu). A Cancel button is added at the end.
 */
export async function actionSheet(options: { title?: string, message?: string, actions: { title: string, destructive?: boolean }[] }) {
  if (!(await isNative())) return null
  const { ActionSheet, ActionSheetButtonStyle: Style } = await import('@capacitor/action-sheet')
  const style = (destructive?: boolean): ActionSheetButtonStyle => destructive ? Style.Destructive : Style.Default
  const { index, canceled } = await ActionSheet.showActions({
    title: options.title,
    message: options.message,
    options: [
      ...options.actions.map(a => ({ title: a.title, style: style(a.destructive) })),
      { title: 'Cancel', style: Style.Cancel },
    ],
  })
  return canceled || index < 0 || index >= options.actions.length ? null : index
}

/** A native alert with Cancel / OK. `null` in a browser. */
export async function nativeConfirm(options: { title: string, message?: string, okLabel?: string, cancelLabel?: string }) {
  if (!(await isNative())) return null
  const { Dialog } = await import('@capacitor/dialog')
  const { value } = await Dialog.confirm({
    title: options.title,
    message: options.message ?? '',
    okButtonTitle: options.okLabel,
    cancelButtonTitle: options.cancelLabel,
  })
  return value
}

/** Writes to the system clipboard. `false` in a browser. */
export async function nativeCopy(text: string) {
  if (!(await isNative())) return false
  const { Clipboard } = await import('@capacitor/clipboard')
  await Clipboard.write({ string: text })
  return true
}

/** The system share sheet. `false` when sharing isn't available (a browser without `navigator.share`). */
export async function share(options: { title?: string, text?: string, url?: string }) {
  const { Share } = await import('@capacitor/share')
  if (!(await Share.canShare()).value) return false
  // Rejects when the user closes the sheet without sharing, which is not an error.
  await Share.share({ ...options, dialogTitle: options.title }).catch(() => {})
  return true
}

/** Opens a URL in the in-app browser (SFSafariViewController) on a device, a new tab in a browser. */
export async function openUrl(url: string) {
  const { Browser } = await import('@capacitor/browser')
  await Browser.open({ url })
}
