import type { NativeNavigationNavbarOptions } from '@capgo/capacitor-native-navigation'
import { plugins } from '#mobile/native'

/**
 * Temporary shim until @frigear-nu/mobile supports navbar actions: the module builds every `setNavbar` call itself and
 * iOS drops `rightItems` that a call leaves out. So the native-navigation plugin the module loads is wrapped: each of
 * its `setNavbar` calls gets the page's actions (`useNavbarActions`) as `rightItems`, and they are sent again with the
 * module's last options when the page's actions change. Taps come back through `navbarItemTap`.
 */
export default defineNuxtPlugin({
  name: 'scanner:navbar-actions',
  enforce: 'pre',
  setup() {
    const load = plugins.nativeNavigation
    if (!load) return
    const actions = useNavbarActionsState()

    const rightItems = () => actions.value.map(a => ({
      id: a.id,
      accessibilityLabel: a.label,
      icon: { ios: { sfSymbol: a.sfSymbol } },
    }))

    let wrapped: ReturnType<typeof load> | undefined
    plugins.nativeNavigation = () => wrapped ??= load().then((real) => {
      let last: NativeNavigationNavbarOptions | undefined
      const withActions = (options: NativeNavigationNavbarOptions) =>
        options.hidden ? options : { ...options, rightItems: rightItems() }

      void real.addListener('navbarItemTap', ({ id }: { id: string }) => {
        actions.value.find(a => a.id === id)?.onSelect()
      })
      watch(actions, () => {
        if (last && !last.hidden) void real.setNavbar(withActions(last))
      }, { deep: true })

      return new Proxy(real, {
        get(target, key, receiver) {
          if (key === 'setNavbar') {
            return (options: NativeNavigationNavbarOptions) => {
              last = options
              return target.setNavbar(withActions(options))
            }
          }
          return Reflect.get(target, key, receiver)
        },
      })
    })
  },
})
