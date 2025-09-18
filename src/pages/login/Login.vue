<route lang="json">
{
  "meta": {
    "layout": "blank"
  }
}
</route>

<template>
  <div class="login-page">
    <AppBackground />

    <v-container class="login-wrapper fill-height justify-center align-center">
      <v-card class="pa-6" min-width="400" rounded="lg" elevation="10">
        <v-tabs
          v-model="tab"
          bg-color="transparent"
          class="mb-4"
          slider-color="primary"
        >
          <v-tab value="signIn" class="text-none">Login</v-tab>
          <v-tab value="signUp" class="text-none">Cadastrar</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="signIn">
              <AppSignIn @submit="onSignIn" />
            </v-tabs-window-item>

            <v-tabs-window-item value="signUp">
              <AppSignUp @submit="onSignUp" />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppSignIn from "@/components/sign-in/AppSignIn.vue";
import AppSignUp from "@/components/sign-up/AppSignUp.vue";
import router from "@/router";
import AppBackground from "@/components/animation/AppBackground.vue";

const tab = ref("signIn");
const onSignIn = (formData) => {
  const fakeToken = "abcde12345";

  localStorage.setItem("auth_token", fakeToken);

  router.push("/");
};

const onSignUp = (formData) => {
  console.log("Dados de Cadastro:", formData);
  // **AQUI você faria a chamada à sua API de cadastro de usuário**
  // Ex: axios.post('/api/register', formData);
};
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
}
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 10;
}
</style>
