// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .override('nuxt/vue/setup', {
    rules: {
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  })
  .append([
    { ignores: ['./ios/**'] },
    // Module pages are routes, named by their file like app/pages.
    { files: ['modules/*/runtime/pages/**/*.vue'], rules: { 'vue/multi-word-component-names': 'off' } },
  ])
