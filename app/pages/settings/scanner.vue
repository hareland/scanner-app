<script setup lang="ts">
import { kBlockTitle, kBlockFooter, kList, kListItem, kToggle, kSegmented, kSegmentedButton } from 'konsta/vue'

definePageMeta({ mobile: { title: 'Scanner' } })

const { settings } = useScannerSettings()
</script>

<template>
  <div>
    <k-block-title>Camera</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item title="Camera">
        <template #after>
          <k-segmented
            strong
            rounded
            class="w-40"
          >
            <k-segmented-button
              :active="settings.cameraFacing === 'back'"
              @click="settings.cameraFacing = 'back'"
            >
              Back
            </k-segmented-button>
            <k-segmented-button
              :active="settings.cameraFacing === 'front'"
              @click="settings.cameraFacing = 'front'"
            >
              Front
            </k-segmented-button>
          </k-segmented>
        </template>
      </k-list-item>
      <k-list-item
        label
        title="Camera picker in browser"
      >
        <template #after>
          <k-toggle
            component="div"
            :checked="settings.webCameraSelection"
            @change="settings.webCameraSelection = !settings.webCameraSelection"
          />
        </template>
      </k-list-item>
    </k-list>

    <k-block-title>After a scan</k-block-title>
    <k-list
      strong-ios
      inset-ios
    >
      <k-list-item
        label
        title="Vibrate"
      >
        <template #after>
          <k-toggle
            component="div"
            :checked="settings.hapticFeedback"
            @change="settings.hapticFeedback = !settings.hapticFeedback"
          />
        </template>
      </k-list-item>
      <k-list-item
        label
        title="Save automatically"
      >
        <template #after>
          <k-toggle
            component="div"
            :checked="settings.autoSave"
            @change="settings.autoSave = !settings.autoSave"
          />
        </template>
      </k-list-item>
    </k-list>
    <k-block-footer>
      With “Save automatically” on, every code you scan goes straight to Saved.
    </k-block-footer>
  </div>
</template>
