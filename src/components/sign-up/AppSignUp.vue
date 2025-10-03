<template>
  <v-container class="pa-0">
    <!-- Título do Formulário -->
    <div class="text-center mb-6">
      <h4 class="text-h4 font-weight-bold">Crie sua Conta</h4>
      <p class="text-medium-emphasis">É rápido e fácil!</p>
    </div>

    <v-form @submit.prevent="onSubmit" v-model="isFormValid">
      <!-- Campo de Nome de Usuário -->
      <v-text-field
        v-model="form.username"
        :rules="[rules.required]"
        label="Nome de Usuário"
        variant="solo-filled"
        flat
        placeholder="Escolha um nome de usuário"
        prepend-inner-icon="mdi-account-outline"
        class="mb-4"
        validate-on="input"
      ></v-text-field>

      <!-- Campo de E-mail -->
      <v-text-field
        v-model="form.email"
        :rules="[rules.required, rules.email]"
        label="E-mail"
        variant="solo-filled"
        flat
        placeholder="Digite seu e-mail"
        prepend-inner-icon="mdi-email-outline"
        class="mb-4"
        validate-on="input"
      ></v-text-field>

      <!-- Campo de Senha -->
      <v-text-field
        v-model="form.password"
        :rules="[rules.required, rules.minLength(8)]"
        :append-inner-icon="
          showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
        "
        :type="showPassword ? 'text' : 'password'"
        @click:append-inner="showPassword = !showPassword"
        label="Senha"
        variant="solo-filled"
        flat
        placeholder="Crie uma senha forte"
        prepend-inner-icon="mdi-lock-outline"
        class="mb-4"
        counter
        validate-on="input"
      ></v-text-field>

      <!-- Campo de Confirmação de Senha -->
      <v-text-field
        v-model="form.confirmPassword"
        :rules="[rules.required, rules.passwordMatch]"
        :type="showPassword ? 'text' : 'password'"
        label="Confirmar Senha"
        variant="solo-filled"
        flat
        placeholder="Repita sua senha"
        prepend-inner-icon="mdi-lock-check-outline"
        class="mb-4"
        validate-on="input"
      ></v-text-field>

      <!-- Checkbox de Termos de Serviço -->
      <v-checkbox
        v-model="form.terms"
        :rules="[rules.required]"
        class="mb-4"
        validate-on="input"
      >
        <template #label>
          <div>
            Eu concordo com os
            <a href="#" @click.prevent>Termos de Serviço</a>
          </div>
        </template>
      </v-checkbox>

      <!-- Botão de Cadastro -->
      <v-btn
        :loading="loading"
        :disabled="!isFormValid"
        block
        color="primary"
        type="submit"
        size="large"
        flat
        >Cadastrar</v-btn
      >
    </v-form>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";

const emit = defineEmits(["submit"]);

// Estado para controle do formulário
const isFormValid = ref(false);
const showPassword = ref(false);
const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

// Regras de validação
const rules = {
  required: (v) => !!v || "Este campo é obrigatório.",
  minLength: (length) => (v) =>
    (v && v.length >= length) ||
    `A senha deve ter no mínimo ${length} caracteres.`,
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido.",
  passwordMatch: (v) => v === form.password || "As senhas não coincidem.",
};

const onSubmit = () => {
  if (!isFormValid.value) return;

  loading.value = true;
  // Simula uma chamada de API
  setTimeout(() => {
    // Remove a confirmação de senha antes de emitir os dados
    const { confirmPassword, ...userData } = form;
    emit("submit", userData);
    loading.value = false;
  }, 1500);
};
</script>

<style scoped>
a {
  color: hsl(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
}
a:hover {
  text-decoration: underline;
}
</style>
