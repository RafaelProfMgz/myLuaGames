<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página Completados"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="pa-4">
    <h1 class="text-h4 font-weight-bold mb-4">
      Jogos Concluídos ({{ completedGames.length }})
    </h1>

    <!-- Indicador de Carregamento -->
    <div v-if="gamesStore.loading" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Carregando sua coleção...</p>
    </div>

    <!-- Mensagem se não houver jogos concluídos -->
    <v-card
      v-else-if="!gamesStore.loading && completedGames.length === 0"
      class="text-center pa-16"
      flat
      color="transparent"
    >
      <v-icon size="80" color="grey-lighten-1"
        >mdi-gamepad-variant-outline</v-icon
      >
      <p class="text-h6 mt-4">Nenhum jogo concluído ainda.</p>
      <p class="text-medium-emphasis">
        Quando você terminar um jogo, ele aparecerá aqui!
      </p>
    </v-card>

    <!-- Grid de Cards com os jogos concluídos -->
    <v-row v-else>
      <v-col
        v-for="game in completedGames"
        :key="game.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card class="game-card" elevation="2">
          <v-img
            :src="game.cover || 'https://via.placeholder.com/400x300'"
            height="180px"
            cover
          ></v-img>

          <v-card-title class="text-subtitle-1 pb-1">
            {{ game.name }}
          </v-card-title>

          <v-card-subtitle class="pb-2">
            {{ game.platform }}
          </v-card-subtitle>

          <v-card-text class="py-1">
            <v-rating
              :model-value="game.rating"
              readonly
              half-increments
              color="amber"
              size="x-small"
              density="compact"
            ></v-rating>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useGamesStore } from "@/stores/games.js/games"; // Verifique se o caminho está correto

// Inicializa a store
const gamesStore = useGamesStore();

// Cria uma referência computada para o getter.
// Isso garante que a lista será reativa a qualquer mudança no estado.
const completedGames = computed(() => gamesStore.completedGames);

// Busca os jogos quando o componente é montado (se a lista estiver vazia)
onMounted(() => {
  if (gamesStore.games.length === 0) {
    gamesStore.fetchGames();
  }
});
</script>

<style scoped>
.game-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
