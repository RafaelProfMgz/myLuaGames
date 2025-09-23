<template>
  <v-app>
    <router-view v-if="isRouterReady" />
    <div class="loading" v-else>Carregando...</div>
    <AlertCoockie />
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import AlertCoockie from "./utils/AlertCoockie.vue";

const isRouterReady = ref(false);

router.isReady().then(() => {
  isRouterReady.value = true;
});
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
}
</style>
