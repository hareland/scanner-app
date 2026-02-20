import { defineNuxtModule, createResolver, extendPages, addImports } from '@nuxt/kit'
import defu from 'defu'

type ModuleOptions = {
  enabled?: boolean
}
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'developer',
  },
  defaults: {},
  async setup(_, nuxt) {
    // @ts-expect-error idk not typed
    nuxt.options.runtimeConfig.public.developer = nuxt.options.developer = defu(_, nuxt.options.developer, {
      enabled: nuxt.options.dev,
    })

    const resolver = createResolver(import.meta.url)

    // We include the developer composable no matter what:
    addImports([
      {
        name: 'useDeveloper',
        from: resolver.resolve('./runtime/composables/useDeveloper.ts'),
      },
    ])

    if (!nuxt.options.developer.enabled) return

    console.log(`developer module in ${resolver.resolve('./')}`)

    const routePath = '/settings/developer'
    const filePath = resolver.resolve('./runtime/pages/developer.vue')

    extendPages((pages) => {
      if (!pages.some(page => page.path === routePath)) {
        pages.push({
          path: routePath,
          file: filePath,
        })
      }
    })
  },
})
