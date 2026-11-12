// A static SPA: `nuxt generate` writes `.output/public`, which Capacitor serves from the device.
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@frigear-nu/ui',
    // The Capacitor app shell: native iOS tab bar and navbar, web chrome elsewhere. Installs nuxt-capacitor.
    '@frigear-nu/mobile',
    'nuxt-qrcode',
    // Adds useDeveloper() always, and the /settings/developer page in dev builds.
    './modules/developer',
  ],
  devtools: { enabled: false },
  app: {
    head: {
      // maximum-scale=1 stops iOS zooming the page when a field with text under 16px gets focus.
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#18181b' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  spaLoadingTemplate: false,
  build: {
    transpile: ['konsta'],
  },
  compatibilityDate: '2026-06-30',
  // nuxt-capacitor writes capacitor.config.json from this; @frigear-nu/mobile fills in appId, appName and autoSync: false.
  capacitor: {
    config: {
      plugins: {
        CapacitorHttp: {
          enabled: true,
        },
      },
      ios: {
        contentInset: 'never',
      },
    },
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        blockSpacing: true,
      },
    },
  },
  icon: {
    // A Capacitor app has no server to fetch icons from, and may be offline: every icon ships in the bundle.
    clientBundle: {
      // The default scan skips .ts files (utils/scan.ts picks icons by content type).
      scan: { globInclude: ['app/**/*.{vue,ts}', 'modules/**/*.{vue,ts}'] },
      // Icons named outside the app: the tabs below, and @frigear-nu/mobile and @frigear-nu/ui components.
      icons: [
        'lucide:house', 'lucide:scan-barcode', 'lucide:bookmark', 'lucide:qr-code', 'lucide:settings',
        'lucide:plus', 'lucide:chevron-left', 'lucide:chevron-right', 'lucide:x', 'lucide:check', 'lucide:ellipsis',
        'lucide:circle-alert', 'lucide:clipboard-check', 'lucide:loader-2', 'lucide:search', 'lucide:eye',
      ],
    },
  },
  mobile: {
    appId: process.env.CAPACITOR_APP_ID || 'eu.hareland.app.scanner',
    appName: process.env.CAPACITOR_APP_NAME || 'Scanner',
    // One list for the native iOS tab bar, the web tab bar and the navbar titles.
    tabs: [
      { id: 'home', to: '/', label: 'Home', title: 'Scanner', icon: 'i-lucide-house', sfSymbol: 'house', sfSymbolActive: 'house.fill' },
      { id: 'scan', to: '/scan', label: 'Scan', icon: 'i-lucide-scan-barcode', sfSymbol: 'barcode.viewfinder' },
      { id: 'saved', to: '/saved', label: 'Saved', icon: 'i-lucide-bookmark', sfSymbol: 'bookmark', sfSymbolActive: 'bookmark.fill' },
      { id: 'create', to: '/create', label: 'Create', icon: 'i-lucide-qr-code', sfSymbol: 'qrcode' },
    ],
    // From the native launch screen (ios/App/App/Base.lproj/LaunchScreen.storyboard, same logo and colors) to the
    // first page, without a flash of an empty WebView.
    splashScreen: {
      logo: '/logo.svg',
      background: { light: '#ffffff', dark: '#18181b' },
    },
    // The app opens no links of its own.
    deepLinks: { schemes: false },
  },
  qrcode: {
    options: {
      variant: 'pixelated',
      radius: 1,
      blackColor: 'currentColor',
      whiteColor: 'transparent',
    },
  },
})
