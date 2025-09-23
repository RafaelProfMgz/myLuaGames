<template>
  <v-container class="pa-0">
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-model="form.username"
        label="Nome de Usuário"
        variant="solo-filled"
        density="compact"
        clearable
        placeholder="Escolha um nome de usuário"
        prepend-inner-icon="mdi-account"
        class="mb-3"
      ></v-text-field>

      <v-text-field
        v-model="form.email"
        label="E-mail"
        variant="solo-filled"
        density="compact"
        clearable
        placeholder="Digite seu e-mail"
        prepend-inner-icon="mdi-email"
        class="mb-3"
      ></v-text-field>

      <v-text-field
        v-model="form.password"
        label="Senha"
        variant="solo-filled"
        density="compact"
        clearable
        type="password"
        placeholder="Crie uma senha forte"
        prepend-inner-icon="mdi-lock"
        class="mb-3"
      ></v-text-field>

      <v-btn block color="primary" type="submit" size="large">Cadastrar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive, defineEmits } from "vue";

const emit = defineEmits(["submit"]);

const form = reactive({
  username: "",
  email: "",
  password: "",
});

const onSubmit = () => {
  emit("submit", form);
};
</script>
