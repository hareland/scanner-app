import { isNative } from '~/lib/native'

/**
 * On a device the native navbar and tab bar (`@capgo/capacitor-native-navigation`) replace the Konsta navbar and
 * tabbar (layouts/default.vue), and the plugin publishes their size as `--cap-native-navigation-*` CSS variables.
 * Routing stays in Nuxt: native taps only call `navigateTo`. In a browser this does nothing and the web chrome stays.
 */
export default defineNuxtPlugin(async () => {
  const nativeChrome = useState('native-chrome', () => false)
  if (!(await isNative())) return

  const { NativeNavigation } = await import('@capgo/capacitor-native-navigation')
  const route = useRoute()
  const router = useRouter()
  const actions = useNavbarActionsState()
  const { hasOpen: overlayOpen } = useOverlayStack()

  await NativeNavigation.configure({ contentInsetMode: 'css' })
  nativeChrome.value = true

  await NativeNavigation.addListener('tabSelect', ({ id }) => {
    const tab = tabs.find(t => t.id === id)
    if (tab && tab.path !== route.path) navigateTo(tab.path)
  })
  await NativeNavigation.addListener('navbarBack', () => router.back())
  await NativeNavigation.addListener('navbarItemTap', ({ id }) => {
    actions.value.find(a => a.id === id)?.onSelect()
  })

  // The native bars follow the iOS appearance, not the app's (Settings → Theme), so the navbar title and status bar
  // colors are set from the app's resolved mode; otherwise white text sits on a light page.
  const colorMode = useColorMode()
  const navbarColors = () => ({ foreground: colorMode.value === 'dark' ? '#FFFFFF' : '#0F172A' })

  const { StatusBar, Style } = await import('@capacitor/status-bar')
  // `Style.Dark` means light text, for a dark page.
  watch(() => colorMode.value, mode => StatusBar.setStyle({ style: mode === 'dark' ? Style.Dark : Style.Light }), { immediate: true })

  watch([() => route.path, () => route.meta.title, actions, overlayOpen, () => colorMode.value], async ([path, , items, hidden]) => {
    // A web sheet or dialog renders inside the WebView, under both bars: hide them while one is open.
    if (hidden) {
      await NativeNavigation.setTabbar({ hidden: true })
      await NativeNavigation.setNavbar({ hidden: true })
      return
    }

    const current = tabForPath(path)
    await NativeNavigation.setNavbar({
      hidden: false,
      title: route.meta.title ?? current?.title ?? 'Scanner',
      large: !!current,
      backButton: { visible: !current },
      rightItems: items.map(a => ({ id: a.id, accessibilityLabel: a.label, icon: { ios: { sfSymbol: a.sfSymbol } } })),
      colors: navbarColors(),
      resetScrollCollapsed: true,
    })

    if (!current) {
      await NativeNavigation.setTabbar({ hidden: true })
      return
    }
    await NativeNavigation.setTabbar({
      hidden: false,
      selectedId: current.id,
      tabs: tabs.map(t => ({ id: t.id, title: t.title, icon: { ios: { sfSymbol: t.sfSymbol } } })),
    })
  }, { immediate: true })
})
