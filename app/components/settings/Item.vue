<script setup lang="ts">
import { kListItem, kIcon } from 'konsta/vue'
import { kebabCase } from 'scule'
import type { SettingGroup, SettingItem } from '~/types/settings'

defineProps<{ item: SettingItem, group: SettingGroup }>()
</script>

<template>
  <k-list-item
    :title="item.label"
    label
    @click="item.onClick"
  >
    <template #after>
      <slot
        v-if="$slots?.[kebabCase(`${group.label.toLowerCase()}-${item.label.toLowerCase()}`)]"
        :name="kebabCase(`${group.label.toLowerCase()}-${item.label.toLowerCase()}`)"
        :item="item"
      />
      <k-icon
        v-else
      >
        <div class="flex items-center justify-center">
          <UIcon
            name="i-lucide-chevron-right"
            class="size-6 font-bold"
          />
        </div>
      </k-icon>
    </template>
  </k-list-item>
</template>
