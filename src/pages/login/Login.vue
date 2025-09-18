<!-- eslint-disable vue/script-indent -->
<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="signIn">Login</v-tab>
      <v-tab value="signUp">Cadastrar</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one"> <AppSignIn /> </v-tabs-window-item>

        <v-tabs-window-item value="two"> <AppSignUp /> </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
<script>
import AppSignIn from "@/components/sign-in/AppSignIn.vue";
import AppSignUp from "@/components/sign-up/AppSignUp.vue";

export default {
  data: () => ({
    tab: null,
  }),
};
</script>
