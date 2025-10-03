<!-- src/components/modals/UserProfileModal.vue -->
<template>
  <v-dialog
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    max-width="450px"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="user" rounded="xl" class="text-center">
      <!-- Banner Superior e Avatar -->
      <div>
        <!-- Banner colorido no fundo -->
        <v-card
          color="primary"
          height="100px"
          flat
          rounded="0"
          class="d-flex justify-end pa-2"
        >
          <!-- Botão de fechar posicionado no banner -->
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="$emit('close')"
            color="on-primary"
          />
        </v-card>

        <!-- Avatar do Usuário (sobrepondo o banner) -->
        <v-avatar size="100" class="mt-n16 border">
          <!-- Você pode substituir por uma imagem real do usuário se tiver -->
          <v-icon size="60" color="grey-darken-1">mdi-account-circle</v-icon>
        </v-avatar>
      </div>

      <!-- Conteúdo do Card: Nome e E-mail -->
      <v-card-text class="pt-4">
        <h5 class="text-h5 font-weight-bold">
          {{ user.username }}
        </h5>
        <p class="text-medium-emphasis text-body-1">
          {{ user.email || "E-mail não informado" }}
        </p>
      </v-card-text>

      <v-divider class="mx-4 mb-2"></v-divider>

      <!-- Ações do Card -->
      <v-card-actions class="justify-center pa-4">
        <v-btn
          color="primary"
          variant="tonal"
          size="large"
          @click="$emit('close')"
        >
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.border {
  border: 4px solid white;
}

/* Negativo margin-top para puxar o avatar para cima */
.mt-n16 {
  margin-top: -64px;
}
</style>
