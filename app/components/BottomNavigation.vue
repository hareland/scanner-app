<script setup lang="ts">
import { kTabbar, kTabbarLink, kToolbarPane, kIcon } from 'konsta/vue'
import { mergeClasses } from '#ui/utils'

type NavItem = {
  id: string
  label: string
  icon: string
  to?: string
  onClick?: () => void
  active?: () => boolean
}

const $emits = defineEmits<{
  (e: 'click', item: NavItem): void
}>()

const currentId = defineModel<string>({ default: undefined })
defineProps<{ items: NavItem[] }>()

const clickItem = (item: NavItem) => {
  // currentId.value = item.id
  $emits('click', item)
  if (item?.onClick) item.onClick?.()
  if (item?.to) return navigateTo(item.to)
}

// TODO: MAKE THE TOOLBAR INSTEAD?
//      See ->  https://konstaui.com/vue/toolbar
</script>

<template>
  <k-tabbar
    :labels="true"
    :icons="true"
    :class="mergeClasses('fixed bottom-0 ios:-mb-8 electron:mb-2 web:mb-2', $attrs?.class || '')"
  >
    <k-toolbar-pane>
      <k-tabbar-link
        v-for="(item, index) in items"
        :key="index"
        :active="item.active && typeof item.active === 'function' ? item.active() : currentId === item.id"
        @click="clickItem(item)"
      >
        <template
          #label
        >
          {{ item.label }}
        </template>
        <template
          #icon
        >
          <k-icon>
            <template #ios>
              <UIcon
                :name="item.icon"
                class="size-7"
              />
            </template>
            <template #material>
              <UIcon
                :name="item.icon"
                class="size-7"
              />
            </template>
          </k-icon>
        </template>
      </k-tabbar-link>
    </k-toolbar-pane>
  </k-tabbar>
</template>
