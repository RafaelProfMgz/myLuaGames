<template>
  <v-container class="pa-0">
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.username"
        label="Usuário"
        variant="solo-filled"
        density="compact"
        clearable
        placeholder="Digite seu usuário"
        prepend-inner-icon="mdi-account"
        class="mb-3"
      ></v-text-field>

      <v-text-field
        v-model="form.password"
        label="Senha"
        variant="solo-filled"
        density="compact"
        clearable
        type="password"
        placeholder="Digite sua senha"
        prepend-inner-icon="mdi-lock"
        class="mb-3"
      ></v-text-field>

      <v-btn block color="primary" type="submit" size="large">Entrar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive, defineEmits } from "vue";

const emit = defineEmits(["submit"]);

const form = reactive({
  username: "",
  password: "",
});

const onSubmit = () => {
  emit("submit", form);
};
</script>
