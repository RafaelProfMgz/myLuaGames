<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer"> <AppSideBar /> </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title><AppHeader /></v-app-bar-title>
    </v-app-bar>
    <v-main> <router-view /> </v-main>
    <AppFloatButton />
    <v-footer app> <AppFooter /> </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppFloatButton from "@/components/layout/AppFloatButton.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSideBar from "@/components/layout/AppSideBar.vue";
const drawer = ref(null);
</script>
