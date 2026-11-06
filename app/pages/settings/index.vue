<script setup lang="ts">
import { kBlockTitle, kList, kListItem, kDialog, kDialogButton, kRadio } from 'konsta/vue'
import { upperFirst } from 'scule'

const colorMode = useColorMode()
const { actionSheet, isNative } = useNative()
const { isEnabled: developerMode } = useDeveloper()
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
