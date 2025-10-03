<template>
  <v-container class="pa-0">
    <!-- Título do Formulário -->
    <div class="text-center mb-6">
      <h4 class="text-h4 font-weight-bold">Bem-vindo!</h4>
      <p class="text-medium-emphasis">Faça login para continuar</p>
    </div>

    <v-form @submit.prevent="onSubmit">
      <!-- Campo de Usuário com Validação -->
      <v-text-field
        v-model="form.username"
        :rules="[rules.required]"
        label="Usuário"
        variant="solo-filled"
        flat
        placeholder="Digite seu usuário"
        prepend-inner-icon="mdi-account-outline"
        class="mb-4"
        validate-on="input"
      ></v-text-field>

      <!-- Campo de Senha com Validação e Visibilidade -->
      <v-text-field
        v-model="form.password"
        :rules="[rules.required]"
        :append-inner-icon="
          showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
        "
        :type="showPassword ? 'text' : 'password'"
        @click:append-inner="showPassword = !showPassword"
        label="Senha"
        variant="solo-filled"
        flat
        placeholder="Digite sua senha"
        prepend-inner-icon="mdi-lock-outline"
        class="mb-4"
        validate-on="input"
      ></v-text-field>

      <!-- Ações do Formulário: Link e Botão -->
      <div class="d-flex justify-end mb-6">
        <a
          href="#"
          class="text-primary font-weight-medium text-caption"
          @click.prevent
          >Esqueceu a senha?</a
        >
      </div>

      <!-- Botão de Submissão com Estado de Carregamento -->
      <v-btn
        :loading="loading"
        :disabled="!isFormValid"
        block
        color="primary"
        type="submit"
        size="large"
        flat
        >Entrar</v-btn
      >
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const emit = defineEmits(["submit"]);

// Estado para o controle de visibilidade da senha
const showPassword = ref(false);
// Estado para o feedback de carregamento no botão
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

// Regras de validação simples
const rules = {
  required: (value) => !!value || "Este campo é obrigatório.",
};

// Computada para verificar se o formulário é válido
const isFormValid = computed(() => {
  return form.username && form.password;
});

const onSubmit = () => {
  if (!isFormValid.value) return;

  loading.value = true;
  // Simula uma chamada de API
  setTimeout(() => {
    emit("submit", form);
    loading.value = false;
  }, 1500);
};
</script>

<style scoped>
a {
  text-decoration: none;
  transition: opacity 0.2s ease-in-out;
}
a:hover {
  opacity: 0.8;
}
</style>
