<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página home"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="dashboard-container pa-6">
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
      rounded="xl"
    >
      {{ gamesStore.error }}
    </v-alert>

    <div v-else>
      <h1
        class="text-h4 font-weight-bold mb-8 text-primary d-flex align-center"
      >
        <v-icon size="36" class="mr-3">mdi-view-dashboard</v-icon>
        Dashboard da Biblioteca
      </h1>

      <v-row class="mb-8">
        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Total de Jogos
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.totalGames }}
                </div>
              </div>
              <v-icon color="primary" size="48">
                mdi-controller-classic-outline
              </v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Horas Registradas
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.totalHours }}h
                </div>
              </div>
              <v-icon color="primary" size="48" class="opacity-75">
                mdi-timer-outline
              </v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Jogando Agora
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ gamesStore.playingGames.length }}
                </div>
              </div>
              <v-icon color="primary" size="48"> mdi-play-outline </v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="dashboard-card" rounded="xl">
            <v-card-text class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline text-medium-emphasis">
                  Gênero Favorito
                </div>
                <div class="text-h5 font-weight-bold">RPG</div>
              </div>
              <v-icon color="primary" size="48" class="opacity-75">
                mdi-sword
              </v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-8">
        <v-col cols="12" md="6">
          <v-card class="section-card" flat rounded="xl">
            <v-card-title
              class="text-h6 font-weight-bold mb-3 d-flex align-center"
            >
              <v-icon start>mdi-play-circle-outline</v-icon>
              Jogando Atualmente
            </v-card-title>
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="game in gamesStore.playingGames"
                :key="game.id"
              >
                <v-card
                  class="slide-item-card ma-3"
                  width="180"
                  flat
                  color="transparent"
                >
                  <v-img
                    :src="game.cover"
                    height="100px"
                    cover
                    class="rounded-lg"
                  ></v-img>
                  <v-card-title class="text-subtitle-2 font-weight-bold pb-1">
                    {{ game.name }}
                  </v-card-title>
                  <v-card-text class="text-caption text-medium-emphasis pt-0">
                    {{ game.hours }}h jogadas
                  </v-card-text>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="section-card" flat rounded="xl">
            <v-card-title
              class="text-h6 font-weight-bold mb-3 d-flex align-center"
            >
              <v-icon start>mdi-chevron-right-circle-outline</v-icon>
              Próximos na Fila
            </v-card-title>
            <v-slide-group show-arrows>
              <v-slide-group-item
                v-for="game in gamesStore.backlogGames"
                :key="game.id"
              >
                <v-card
                  class="slide-item-card ma-3"
                  width="180"
                  flat
                  color="transparent"
                >
                  <v-img
                    :src="game.cover"
                    height="100px"
                    cover
                    class="rounded-lg"
                  ></v-img>
                  <v-card-text
                    class="pt-2 text-caption text-medium-emphasis font-weight-medium"
                  >
                    Prioridade: {{ game.priority }}
                  </v-card-text>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="section-card" flat rounded="xl">
            <v-card-title
              class="text-h6 font-weight-bold mb-3 d-flex align-center"
            >
              <v-icon start>mdi-new-box</v-icon>
              Recém Adicionados
            </v-card-title>
            <v-row>
              <v-col
                v-for="game in gamesStore.games"
                :key="game.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card class="game-card" flat color="transparent">
                  <v-img :src="game.cover" height="160px" cover></v-img>
                  <v-card-title class="text-subtitle-1 pb-1">
                    {{ game.name }}
                  </v-card-title>
                  <v-card-subtitle class="text-caption">
                    {{ game.genre }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn size="small" variant="text" color="primary">
                      Detalhes
                    </v-btn>
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
    </div>
  </v-container>
</template>

<script setup>
import { useGamesStore } from "@/stores/games.js/games";
import { onMounted } from "vue";

const gamesStore = useGamesStore();

onMounted(() => {
  if (gamesStore.games.length === 0) {
    gamesStore.fetchGames();
  }
});
</script>

<style scoped>
.dashboard-container {
  background-color: rgb(var(--v-theme-background));
}

.dashboard-card {
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid transparent;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--v-theme-primary-rgb), 0.2);
  box-shadow: 0 8px 20px rgba(var(--v-theme-primary-rgb), 0.1) !important;
}

.section-card {
  background-color: rgb(var(--v-theme-surface));
  padding: 16px;
}

.slide-item-card {
  transition: transform 0.2s ease-out;
}

.slide-item-card:hover {
  transform: scale(1.05);
}

.game-card .v-img {
  border-radius: 12px;
  background-color: rgb(var(--v-theme-surface));
}

.opacity-75 {
  opacity: 0.75;
}
</style>
