<script setup lang="ts">
import { kBlockTitle, kList, kListItem, kDialog, kDialogButton, kRadio } from 'konsta/vue'
import { upperFirst } from 'scule'

definePageMeta({ mobile: { title: 'Settings' } })

const colorMode = useColorMode()
const { actionSheet, isNative, haptic } = useNative()
const { isEnabled: developerMode, unlock } = useDeveloper()
const { list } = useSavedScanResults()

const themes = ['system', 'light', 'dark'] as const
const themeDialog = ref(false)
useSuppressTabBar(themeDialog)

// On a device the choice is a native action sheet; in a browser a Konsta dialog.
async function chooseTheme() {
  const choice = await actionSheet({ title: 'Theme', actions: themes.map(t => ({ title: upperFirst(t) })) })
  if (choice !== null) {
    colorMode.preference = themes[choice]!
    return
  }
  if (!isNative) themeDialog.value = true
}

const version = ref<string>()
onMounted(async () => {
  if (!isNative) return
  const { App } = await import('@capacitor/app')
  const info = await App.getInfo()
  version.value = `${info.version} (${info.build})`
})

// Seven taps on the version turn developer mode on, as on Android; a pause of over 1.5s starts the count again.
const UNLOCK_TAPS = 7
const toast = useToast()
let taps = 0
let lastTap = 0
async function onVersionTap() {
  const now = Date.now()
  taps = now - lastTap > 1500 ? 1 : taps + 1
  lastTap = now
  if (developerMode.value) {
    if (taps === 1) toast.add({ id: 'developer', title: 'Developer mode is already on', icon: 'i-lucide-wrench' })
    return
  }
  const left = UNLOCK_TAPS - taps
  if (left > 0) {
    void haptic('selection')
    if (left <= 4) toast.add({ id: 'developer', title: `${left} ${left === 1 ? 'tap' : 'taps'} from developer mode`, icon: 'i-lucide-wrench' })
    return
  }
  taps = 0
  await unlock()
  void haptic('success')
  toast.add({ id: 'developer', title: 'Developer mode is on', description: 'Find the tools under Developer in Settings.', icon: 'i-lucide-wrench', color: 'success' })
}
</script>

<template>
  <div>
    <k-block-title>Scanning</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item
        link
        title="Scanner"
        @click="navigateTo('/settings/scanner')"
      >
        <template #media>
          <UIcon
            name="i-lucide-scan-barcode"
            class="size-6 text-primary"
          />
        </template>
      </k-list-item>
      <k-list-item
        link
        title="Saved codes"
        :after="String(list.length)"
        @click="navigateTo('/saved')"
      >
        <template #media>
          <UIcon
            name="i-lucide-bookmark"
            class="size-6 text-primary"
          />
        </template>
      </k-list-item>
    </k-list>

    <k-block-title>Appearance</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item
        link
        title="Theme"
        :after="upperFirst(colorMode.preference)"
        @click="chooseTheme"
      >
        <template #media>
          <UIcon
            name="i-lucide-sun-moon"
            class="size-6 text-primary"
          />
        </template>
      </k-list-item>
    </k-list>

    <template v-if="developerMode">
      <k-block-title>Developer</k-block-title>
      <k-list
        strong-ios
        inset-ios
      >
        <k-list-item
          link
          title="Developer tools"
          @click="navigateTo('/settings/developer')"
        >
          <template #media>
            <UIcon
              name="i-lucide-wrench"
              class="size-6 text-primary"
            />
          </template>
        </k-list-item>
      </k-list>
    </template>

    <k-block-title>About</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item
        title="Version"
        :after="version ?? 'Web'"
        @click="onVersionTap"
      />
    </k-list>

    <k-dialog
      :opened="themeDialog"
      @backdropclick="themeDialog = false"
    >
      <template #title>
        Theme
      </template>
      <k-list
        nested
        class="-mx-4"
      >
        <k-list-item
          v-for="theme in themes"
          :key="theme"
          label
          :title="upperFirst(theme)"
        >
          <template #after>
            <k-radio
              component="div"
              :value="theme"
              :checked="colorMode.preference === theme"
              @change="colorMode.preference = theme"
            />
          </template>
        </k-list-item>
      </k-list>
      <template #buttons>
        <k-dialog-button
          strong
          @click="themeDialog = false"
        >
          Done
        </k-dialog-button>
      </template>
    </k-dialog>
  </div>
</template>
