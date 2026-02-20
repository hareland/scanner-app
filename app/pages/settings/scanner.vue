<script setup lang="ts">
import { kPage, kNavbar, kNavbarBackLink } from 'konsta/vue'
</script>

<template>
  <k-navbar title="Scanner Settings">
    <template #left>
      <k-navbar-back-link
        icon-only
        @click="$router.back()"
      />
    </template>
  </k-navbar>
</template>
