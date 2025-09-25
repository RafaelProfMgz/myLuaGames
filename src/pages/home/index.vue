<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página home"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="dashboard-container pa-4">
    <!-- Indicador de Carregamento e Erro -->
    <div v-if="gamesStore.loading" class="text-center pa-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Carregando seus jogos...</p>
    </div>
    <v-alert
      v-else-if="gamesStore.error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ gamesStore.error }}
    </v-alert>

    <!-- Conteúdo principal do Dashboard (mostrado após o carregamento) -->
    <div v-else>
      <h1 class="text-h4 font-weight-bold mb-6 text-primary">
        <v-icon size="36" class="mr-3">mdi-view-dashboard</v-icon>Dashboard da
        Biblioteca
      </h1>

      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" elevation="2">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Total de Jogos
                </div>
                <!-- DADO DA STORE -->
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.totalGames }}
                </div>
              </div>
              <v-icon color="indigo-darken-1" size="48"
                >mdi-controller-classic-outline</v-icon
              >
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" elevation="2">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Horas Registradas
                </div>
                <!-- DADO DA STORE -->
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.totalHours }}h
                </div>
              </div>
              <v-icon color="teal-darken-1" size="48">mdi-timer-outline</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" elevation="2">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Jogando Agora
                </div>
                <!-- DADO DA STORE -->
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.playingGames.length }}
                </div>
              </div>
              <v-icon color="deep-purple-darken-1" size="48"
                >mdi-play-outline</v-icon
              >
            </v-card-text>
          </v-card>
        </v-col>

        <!-- (Este card continua como estático, pois a lógica para 'Gênero Favorito' é mais complexa) -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" elevation="2">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Gênero Favorito
                </div>
                <div class="text-h5 font-weight-bold">RPG</div>
              </div>
              <v-icon color="orange-darken-1" size="48">mdi-sword</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-card flat>
            <v-card-title class="text-h6 font-weight-bold mb-3">
              <v-icon left>mdi-play-circle-outline</v-icon> Jogando Atualmente
            </v-card-title>
            <!-- DADOS DA STORE -->
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="game in gamesStore.playingGames"
                :key="game.id"
              >
                <v-card class="ma-3" width="180" flat>
                  <v-img :src="game.cover" height="100px" cover></v-img>
                  <v-card-title class="text-subtitle-1 pb-1">{{
                    game.name
                  }}</v-card-title>
                  <v-card-text class="text-caption text-medium-emphasis pt-0">
                    {{ game.hours }}h jogadas
                  </v-card-text>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card flat>
            <v-card-title class="text-h6 font-weight-bold mb-3">
              <v-icon left>mdi-chevron-right-circle-outline</v-icon> Próximos na
              Fila
            </v-card-title>
            <!-- DADOS DA STORE -->
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="game in gamesStore.backlogGames"
                :key="game.id"
              >
                <v-card class="ma-3" width="180" flat>
                  <v-img :src="game.cover" height="100px" cover></v-img>

                  <v-card-text class="text-caption text-medium-emphasis pt-0">
                    Prioridade: {{ game.priority }}
                  </v-card-text>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12">
          <v-card flat>
            <v-card-title class="text-h6 font-weight-bold mb-3">
              <v-icon left>mdi-new-box</v-icon> Recém Adicionados
            </v-card-title>
            <v-row>
              <!-- DADOS DA STORE (mostrando todos os jogos como exemplo) -->
              <v-col
                v-for="game in gamesStore.games"
                :key="game.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card class="game-card" flat>
                  <v-img :src="game.cover" height="160px" cover></v-img>
                  <v-card-title class="text-subtitle-1 pb-1">{{
                    game.name
                  }}</v-card-title>
                  <v-card-subtitle class="text-caption">{{
                    game.genre
                  }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn size="small" variant="text" color="primary"
                      >Detalhes</v-btn
                    >
                    <v-spacer></v-spacer>
                    <v-rating
                      :model-value="game.rating"
                      size="x-small"
                      half-increments
                      readonly
                      color="amber"
                      density="compact"
                    ></v-rating>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Seção de Conquistas (continua com dados estáticos por enquanto) -->
      <!-- ... seu código para conquistas e gráficos ... -->
    </div>
  </v-container>
</template>

<script setup>
import { useGamesStore } from "@/stores/games.js/games";
import { onMounted } from "vue";

// 1. Inicializa a store
const gamesStore = useGamesStore();

// 2. Busca os dados quando o componente é montado
//    O 'if' previne que os dados sejam buscados novamente se você navegar para outra página e voltar
onMounted(() => {
  if (gamesStore.games.length === 0) {
    gamesStore.fetchGames();
  }
});

// Os dados de 'playingGames', 'backlogGames', etc. foram removidos daqui
// porque agora eles vêm diretamente dos getters da store, simplificando o componente.
</script>

<style scoped>
/* Seu CSS continua o mesmo */
.dashboard-card {
  height: 100%;
}
.dashboard-card .v-card-text {
  align-items: center;
}
.v-slide-group__content {
  flex-wrap: nowrap;
}
.game-card .v-img {
  border-radius: 8px;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
.border-b:last-child {
  border-bottom: none;
}
</style>
