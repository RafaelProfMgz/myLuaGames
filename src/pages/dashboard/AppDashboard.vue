<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>

<template>
  <v-container fluid class="pa-0">
    <HerosAnimation />
  </v-container>
</template>

<script setup>
import HerosAnimation from "@/components/generic/heros/HerosAnimation.vue";
</script>

<style scoped>
.v-container.fluid {
  height: 100vh;
  width: 100vw;
}
</style>
