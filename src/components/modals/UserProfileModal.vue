<!-- src/components/modals/UserProfileModal.vue -->
<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    max-width="500px"
  >
    <v-card v-if="user" rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Perfil do Usuário</span>
        <v-btn icon="mdi-close" variant="text" @click="$emit('close')"></v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-list lines="two">
          <v-list-item
            prepend-icon="mdi-account"
            title="Nome de Usuário"
            :subtitle="user.username"
          ></v-list-item>
          <v-divider inset></v-divider>
          <v-list-item
            prepend-icon="mdi-email"
            title="E-mail"
            :subtitle="user.email || 'Não informado'"
          ></v-list-item>
        </v-list>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="$emit('close')">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  // Controla a visibilidade do modal
  isOpen: {
    type: Boolean,
    default: false,
  },
  // O objeto com os dados do usuário a serem exibidos
  user: {
    type: Object,
    default: null,
  },
});

defineEmits(["close"]);
</script>
