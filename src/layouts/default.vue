<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <AppSideBar />
    </v-navigation-drawer>

    <v-app-bar flat border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <AppHeader />
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>

    <AppFloatButton />
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import AppFloatButton from "@/components/layout/AppFloatButton.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSideBar from "@/components/layout/AppSideBar.vue";

const drawer = ref(null);
</script>
