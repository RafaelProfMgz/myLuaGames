<template>
  <div class="d-flex align-center">
    <v-icon :color="!isDark ? 'yellow-darken-3' : 'grey-darken-1'" class="mr-2"
      >mdi-white-balance-sunny</v-icon
    >

    <v-switch v-model="isDark" hide-details inset color="primary"></v-switch>

    <v-icon :color="isDark ? 'primary' : 'grey-darken-1'" class="ml-2"
      >mdi-weather-night</v-icon
    >
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

const isDark = computed({
  get() {
    return theme.global.name.value === "dark";
  },
  set(value) {
    theme.global.name.value = value ? "dark" : "light";
  },
});
</script>
