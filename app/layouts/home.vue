<script setup lang="ts">
import { kPage, kNavbar, kLink, kNavbarBackLink } from 'konsta/vue'

const { title, currentViewId, leftActions, rightActions } = useMainNavbar()

type View = { id: string, icon: string, label: string, to: string }

const views: View[] = [
  { id: 'home', icon: 'i-carbon-home', label: 'Home', to: '/' },
  { id: 'scan', icon: 'material-symbols:barcode-scanner-rounded', label: 'Scan', to: '/scan' },
  { id: 'saved', icon: 'i-carbon-book', label: 'Saved', to: '/saved' },
  { id: 'create', icon: 'i-lucide-plus', label: 'Create', to: '/create' },
]

const currentView = computed(() => views.find(v => v.id === currentViewId.value))

watch(currentView, () => {
  title.value = currentView.value?.label ?? ''
}, { immediate: true })

const route = useRoute()

const matchRoute = () => {
  if (views && views.length) {
    const matchedItem = views.find((view) => {
      if (!view.to) return false

      return view.to === route.path
    })

    if (!matchedItem) return

    currentViewId.value = matchedItem.id
  }
}

watch(() => route.path, matchRoute, { immediate: true })
</script>

<template>
  <k-page>
    <BottomNavigation
      v-model="currentViewId"
      :items="views"
    />

    <k-navbar
      :title="title"
      :large="currentViewId === 'home'"
      class="sticky top-0"
    >
      <template #left>
        <template
          v-for="(action, i) in leftActions"
          :key="i"
        >
          <k-navbar-back-link
            v-if="action.isBack"
            @click="action.onClick"
          />
          <k-link
            v-else
            @click="action.onClick"
          >
            {{ action.label }}
            <UIcon
              v-if="action.icon"
              :name="action.icon"
              class="size-6"
            />
          </k-link>
        </template>
      </template>
      <template #right>
        <k-link
          v-for="(action, i) in rightActions"
          :key="i"
          @click="action.onClick"
        >
          {{ action.label }}
          <UIcon
            v-if="action.icon"
            :name="action.icon"
            class="size-6"
          />
        </k-link>
      </template>
    </k-navbar>
    <div>
      <NuxtPage />
    </div>
  </k-page>
</template>
