export default defineNuxtConfig({
  modules: [
    'nuxt-qrcode',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    'nuxt-capacitor',
    '@nuxt/eslint',
    ...import.meta.dev ? ['./modules/developer'] : [],
  ],
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    classPrefix: '',
    preference: 'system',
    fallback: 'light',
    storage: 'localStorage',
  },
  spaLoadingTemplate: false,
  build: {
    transpile: ['konsta'],
  },
  compatibilityDate: '2025-07-15',
  capacitor: {
    config: {
      appId: process.env.CAPACITOR_APP_ID || 'eu.hareland.app.scanner',
      appName: process.env.CAPACITOR_APP_NAME || 'Scanner',
      plugins: {
        StatusBar: {
          style: 'DARK',
        },
        CapacitorHttp: {
          enabled: true,
        },
      },
      ios: {
        contentInset: 'never',
      },
      electron: {
        safeDomains: ['fonts.googleapis.com', 'api.iconify.design'],
      },
    },
  },
  developer: {
    enabled: true,
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
      // OR
      // variant: {
      //   inner: 'circle',
      //   marker: 'rounded',
      //   pixel: 'rounded',
      // },
      radius: 1,
      blackColor: 'currentColor', // 'var(--ui-text-highlighted)' if you are using `@nuxt/ui` v3
      whiteColor: 'transparent', // 'var(--ui-bg)'
    },
  },
})
