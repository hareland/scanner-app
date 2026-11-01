const appId = process.env.CAPACITOR_APP_ID || 'eu.hareland.app.scanner'

// A static SPA: `nuxt generate` writes `.output/public`, which Capacitor serves from the device.
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@frigear-nu/ui',
    'nuxt-capacitor',
    'nuxt-qrcode',
    // Adds useDeveloper() always, and the /settings/developer page in dev builds.
    './modules/developer',
  ],
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      // maximum-scale=1 stops iOS zooming the page when a field with text under 16px gets focus.
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
    },
  },
  css: ['~/assets/css/main.css'],
  spaLoadingTemplate: false,
  build: {
    transpile: ['konsta'],
  },
  compatibilityDate: '2026-06-30',
  // nuxt-capacitor writes capacitor.config.json from this (and points `webDir` at the generated output).
  capacitor: {
    // Off: on dev start it would run `nuxt generate` and `cap sync`. Sync explicitly with `ios:sync`.
    autoSync: false,
    config: {
      appId,
      appName: process.env.CAPACITOR_APP_NAME || 'Scanner',
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
  qrcode: {
    options: {
      variant: 'pixelated',
      radius: 1,
      blackColor: 'currentColor',
      whiteColor: 'transparent',
    },
  },
})
