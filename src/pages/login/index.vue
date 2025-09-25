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
import { useRouter } from "vue-router";
import AppSignIn from "@/components/sign-in/AppSignIn.vue";
import AppSignUp from "@/components/sign-up/AppSignUp.vue";
import { useAppStore } from "@/stores/app";
import AppBackground from "@/components/animation/AppBackground.vue";
import { registerUser, verifyCredentials } from "@/services/userService";

const tab = ref("signIn");
const router = useRouter();
const appStore = useAppStore();

const onSignIn = async (formData) => {
  try {
    const userData = await verifyCredentials(formData);

    appStore.login(userData);

    router.push("/");
  } catch (error) {
    alert(error.message);
  }
};

const onSignUp = async (formData) => {
  try {
    await registerUser(formData);

    alert("Cadastro realizado com sucesso! Agora você já pode fazer o login.");
    tab.value = "signIn";
  } catch (error) {
    alert(error.message);
  }
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
