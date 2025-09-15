<template>
  <!-- Botão FAB de Pesquisa -->
  <v-btn
    class="float-button"
    color="primary"
    icon="mdi-magnify"
    size="large"
    elevation="8"
    @click="dialog = true"
  ></v-btn>

  <!-- Diálogo de Pesquisa -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-toolbar color="primary" flat>
        <v-toolbar-title class="text-h6">Pesquisar na Página</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-5">
        <v-text-field
          label="O que você está procurando?"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          autofocus
          @keyup.enter="performSearch"
        ></v-text-field>
        <!-- Conteúdo de pesquisa ou resultados podem ir aqui -->
        <p class="text-caption text-medium-emphasis mt-3">
          Comece a digitar para encontrar jogos, categorias ou outros conteúdos.
        </p>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="dialog = false">Fechar</v-btn>
        <v-btn color="primary" variant="flat" @click="performSearch"
          >Pesquisar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const dialog = ref(false);
const searchQuery = ref(""); // Para armazenar o termo de pesquisa

const performSearch = () => {
  // Aqui você implementaria a lógica de pesquisa real.
  // Por exemplo, você pode emitir um evento, navegar para uma página de resultados,
  // ou filtrar os itens na página atual.
  console.log("Realizando pesquisa por:", searchQuery.value);
  dialog.value = false; // Fecha o diálogo após a pesquisa
};
</script>
<style scoped>
.float-button {
  position: fixed;
  bottom: 80px; /* Aumentei um pouco a distância do fundo */
  right: 24px; /* Aumentei um pouco a distância da direita */
  z-index: 1000; /* Garante que o botão fique acima de outros elementos */
}
</style>
