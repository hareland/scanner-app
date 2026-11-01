<script setup lang="ts">
import { kPage, kNavbar, kNavbarBackLink, kLink } from 'konsta/vue'

/**
 * On a device the native navbar and tab bar (plugins/native-navigation.client.ts) replace the Konsta ones, and the
 * page pads by their size. In a browser Konsta draws both; the tabbar hides while a sheet or dialog is open, like
 * the native one.
 */
const nativeChrome = useState('native-chrome', () => false)
const route = useRoute()
const router = useRouter()
const actions = useNavbarActionsState()
const { hasOpen: overlayOpen } = useOverlayStack()

const currentTab = computed(() => tabForPath(route.path))
const title = computed(() => route.meta.title ?? currentTab.value?.title ?? 'Scanner')
</script>

<template>
  <div
    v-if="nativeChrome"
    class="min-h-dvh pt-(--cap-native-navigation-top)"
    :class="currentTab ? 'pb-[calc(var(--cap-native-system-tabbar-height,0px)+6rem)]' : 'pb-[calc(env(safe-area-inset-bottom)+2rem)]'"
  >
    <slot />
    <ScanFab v-if="currentTab && currentTab.id !== 'scan' && !overlayOpen" />
  </div>

  <k-page v-else>
    <k-navbar
      :title="title"
      :large="!!currentTab"
      class="sticky top-0"
    >
      <template
        v-if="!currentTab"
        #left
      >
        <k-navbar-back-link @click="router.back()" />
      </template>
      <template #right>
        <k-link
          v-for="action in actions"
          :key="action.id"
          icon-only
          :aria-label="action.label"
          @click="action.onSelect"
        >
          <UIcon
            :name="action.icon"
            class="size-6"
          />
        </k-link>
      </template>
    </k-navbar>

    <div :class="currentTab ? 'pb-36' : 'pb-8'">
      <slot />
    </div>

    <ScanFab v-if="currentTab && currentTab.id !== 'scan' && !overlayOpen" />
    <AppTabBar v-if="currentTab && !overlayOpen" />
  </k-page>
</template>
