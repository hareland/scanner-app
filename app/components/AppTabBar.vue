<script setup lang="ts">
import { kTabbar, kTabbarLink, kToolbarPane } from 'konsta/vue'

/** The browser tab bar. On a device the native one (plugins/native-navigation.client.ts) is shown instead. */
const route = useRoute()
</script>

<template>
  <k-tabbar
    labels
    icons
    class="fixed bottom-0 left-0"
  >
    <k-toolbar-pane>
      <k-tabbar-link
        v-for="tab in tabs"
        :key="tab.id"
        :active="route.path === tab.path"
        :label="tab.title"
        @click="navigateTo(tab.path)"
      >
        <template #icon>
          <UIcon
            :name="tab.icon"
            class="size-7"
          />
        </template>
      </k-tabbar-link>
    </k-toolbar-pane>
  </k-tabbar>
</template>
