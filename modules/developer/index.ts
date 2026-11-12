import { defineNuxtModule, createResolver, extendPages, addImports } from '@nuxt/kit'
import defu from 'defu'

type ModuleOptions = {
  /** Developer mode on from the start, without the unlock. Default: on in `nuxt dev`. */
  enabled?: boolean
}

/**
 * Developer tools at /settings/developer. On in dev builds; in any other build a user turns it on by tapping the
 * version in Settings seven times (`useDeveloper().unlock()`), as on Android.
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'developer',
  },
  defaults: {},
  setup(options, nuxt) {
    // @ts-expect-error `developer` is not a typed Nuxt option
    nuxt.options.runtimeConfig.public.developer = nuxt.options.developer = defu(options, nuxt.options.developer, {
      enabled: nuxt.options.dev,
    })

    const resolver = createResolver(import.meta.url)

    addImports([
      {
        name: 'useDeveloper',
        from: resolver.resolve('./runtime/composables/useDeveloper.ts'),
      },
    ])

    // Always there: the page guards itself, since developer mode can be unlocked at runtime.
    const routePath = '/settings/developer'
    extendPages((pages) => {
      if (!pages.some(page => page.path === routePath)) {
        pages.push({
          path: routePath,
          file: resolver.resolve('./runtime/pages/developer.vue'),
        })
      }
    })
  },
})
