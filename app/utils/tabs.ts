/** The main screens, as tabs. The same list feeds the native tab bar and the Konsta one in a browser. */
export const tabs = [
  { id: 'home', path: '/', title: 'Home', icon: 'i-lucide-house', sfSymbol: 'house' },
  { id: 'scan', path: '/scan', title: 'Scan', icon: 'i-lucide-scan-barcode', sfSymbol: 'barcode.viewfinder' },
  { id: 'saved', path: '/saved', title: 'Saved', icon: 'i-lucide-bookmark', sfSymbol: 'bookmark' },
  { id: 'create', path: '/create', title: 'Create', icon: 'i-lucide-qr-code', sfSymbol: 'qrcode' },
] as const

export type Tab = typeof tabs[number]

export const tabForPath = (path: string) => tabs.find(t => t.path === path)
