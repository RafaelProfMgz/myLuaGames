<template>
  <v-container class="fill-height justify-center align-center" fluid>
    <v-card min-width="200">
      <v-row align="center" no-gutters>
        <v-col class="d-flex justify-center">
          <v-icon :color="isDark ? 'grey-darken-1' : 'yellow-darken-3'"
            >mdi-white-balance-sunny</v-icon
          >
        </v-col>
        <v-col class="d-flex justify-center">
          <v-switch v-model="isDark" hide-details inset></v-switch>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-icon :color="isDark ? 'white' : 'grey-darken-1'"
            >mdi-weather-night</v-icon
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
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
