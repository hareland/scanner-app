<script setup lang="ts">
import {
  kPage,
  kNavbar,
  kNavbarBackLink,
  kBlockTitle,
  kButton,
  kList,
  kListItem,
  kDialog,
  kDialogButton,
  kRadio,
} from 'konsta/vue'
import { upperFirst } from 'scule'
import type { SettingGroup } from '~/types/settings'

const colorMode = useColorMode()
const { isEnabled: developerMode } = useDeveloper()

const displayColorModeList = ref(false)

const groups = computed<SettingGroup[]>(() => {
  const defaults = [
    {
      label: 'General',
      children: [
        {
          label: 'Scan settings',
          onClick() { navigateTo('/settings/scanner') },
        },
      ],
    },
    {
      label: 'Appearance',
      children: [
        {
          label: 'Theme',
          onClick() { displayColorModeList.value = true },
        },
      ],
    },
  ]

  if (toValue(developerMode)) {
    defaults.push({
      label: 'Developer',
      children: [
        {
          label: 'Menu',
          onClick() {
            navigateTo('/settings/developer')
          },
        },
      ],
    })
  }

  return defaults
})
</script>

<template>
  <k-navbar title="Settings">
    <template #left>
      <k-navbar-back-link
        icon-only
        @click="$router.back()"
      />
    </template>
  </k-navbar>
  <SettingsList :groups="groups">
    <template #appearance-theme>
      <k-button
        rounded
        outline
        small
        @click="() => (displayColorModeList = true)"
      >
        {{ upperFirst(colorMode.preference) }}
      </k-button>
    </template>
  </SettingsList>

  <k-dialog
    :opened="displayColorModeList"
    @backdropclick="() => (displayColorModeList = false)"
  >
    <template #title>
      Color Mode
    </template>
    <k-list
      nested
      class="-mx-4"
    >
      <k-list-item
        label
        title="System"
      >
        <template #after>
          <k-radio
            component="div"
            value="system"
            :checked="colorMode.preference === 'system'"
            @change="() => (colorMode.preference = 'system')"
          />
        </template>
      </k-list-item>
      <k-list-item
        label
        title="Light"
      >
        <template #after>
          <k-radio
            component="div"
            value="light"
            :checked="colorMode.preference === 'light'"
            @change="() => (colorMode.preference = 'light')"
          />
        </template>
      </k-list-item>
      <k-list-item
        label
        title="Dark"
      >
        <template #after>
          <k-radio
            component="div"
            value="dark"
            :checked="colorMode.preference === 'dark'"
            @change="() => (colorMode.preference = 'dark')"
          />
        </template>
      </k-list-item>
    </k-list>
    <template #buttons>
      <k-dialog-button
        strong
        @click="() => (displayColorModeList = false)"
      >
        Save
      </k-dialog-button>
    </template>
  </k-dialog>
</template>
