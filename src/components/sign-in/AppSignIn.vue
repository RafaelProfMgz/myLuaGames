<template>
  <v-container fluid>
    <v-title>Login</v-title>
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.username"
            label="Email ou Usuário"
            variant="outlined"
            density="comfortable"
            clearable
            placeholder="Digite seu email ou usuário"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.password"
            label="Senha"
            variant="outlined"
            density="comfortable"
            clearable
            type="password"
            placeholder="Digite sua senha"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block color="primary" type="submit">Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
const form = reactive({
  username: "",
  password: "",
});

const onSubmit = () => {
  console.log(form);
};
</script>

<style scoped></style>
