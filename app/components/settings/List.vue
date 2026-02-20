<script lang="ts" setup>
import type { SettingGroup } from '~/types/settings'
import { kBlockTitle, kList, kListItem, kIcon } from 'konsta/vue'
import { kebabCase } from 'scule'

defineProps<{ groups: SettingGroup[] }>()
</script>

<template>
  <div
    v-for="(group, index) in groups"
    :key="index"
  >
    <k-block-title>{{ group.label }}</k-block-title>
    <k-list
      inset-ios
      strong-ios
    >
      <SettingsItem
        v-for="(item, itemIdx) in group.children"
        :key="itemIdx"
        :item="item"
        :group="group"
      >
        <template
          v-if="`${kebabCase(group.label)}-${kebabCase(item.label)}` in $slots"
          #[`${kebabCase(group.label)}-${kebabCase(item.label)}`]="slotProps"
        >
          <slot
            :name="`${kebabCase(group.label)}-${kebabCase(item.label)}`"
            v-bind="slotProps"
          />
        </template>
      </SettingsItem>
    </k-list>
  </div>
</template>
