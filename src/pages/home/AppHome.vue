<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página home"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="dashboard-container pa-4">
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
              <div class="text-h5 font-weight-bold">245</div>
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
              <div class="text-h5 font-weight-bold">1.876h</div>
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
              <div class="text-h5 font-weight-bold">3</div>
            </div>
            <v-icon color="deep-purple-darken-1" size="48"
              >mdi-play-outline</v-icon
            >
          </v-card-text>
        </v-card>
      </v-col>

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

    <!-- Seção 2: Jogando Atualmente & Próximos na Fila (Horizontal Scroll) -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card flat>
          <v-card-title class="text-h6 font-weight-bold mb-3">
            <v-icon left>mdi-play-circle-outline</v-icon> Jogando Atualmente
          </v-card-title>
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="game in playingGames" :key="game.id">
              <v-card class="ma-3" width="180" flat>
                <v-img :src="game.cover" height="100px" cover></v-img>
                <v-card-title class="text-subtitle-1 pb-1">{{
                  game.name
                }}</v-card-title>
                <v-card-text class="text-caption text-medium-emphasis pt-0">
                  {{ game.hours }}h jogadas
                </v-card-text>
                <v-card-actions>
                  <v-btn size="small" variant="text" color="primary"
                    >Continuar</v-btn
                  >
                </v-card-actions>
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
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="game in backlogGames" :key="game.id">
              <v-card class="ma-3" width="180" flat>
                <v-img :src="game.cover" height="100px" cover></v-img>
                <v-card-title class="text-subtitle-1 pb-1">{{
                  game.name
                }}</v-card-title>
                <v-card-text class="text-caption text-medium-emphasis pt-0">
                  Prioridade: {{ game.priority }}
                </v-card-text>
                <v-card-actions>
                  <v-btn size="small" variant="text" color="primary"
                    >Adicionar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-card>
      </v-col>
    </v-row>

    <!-- Seção 3: Jogos Recém Adicionados (Grid de Cards) -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card flat>
          <v-card-title class="text-h6 font-weight-bold mb-3">
            <v-icon left>mdi-new-box</v-icon> Recém Adicionados
          </v-card-title>
          <v-row>
            <v-col
              v-for="game in recentlyAddedGames"
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
                    size="small"
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

    <!-- Seção 4: Gráfico de Gêneros (Placeholder) -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat>
          <v-card-title class="text-h6 font-weight-bold mb-3">
            <v-icon left>mdi-chart-pie</v-icon> Horas por Gênero
          </v-card-title>
          <v-card-text>
            <!-- Aqui você integraria um componente de gráfico real (ex: Chart.js, ApexCharts) -->
            <v-sheet
              class="pa-4 rounded bg-grey-lighten-3 text-center text-medium-emphasis"
              height="250"
            >
              <p>Espaço para Gráfico de Pizza/Barras</p>
              <v-icon size="48" class="mt-2">mdi-chart-bar</v-icon>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card flat>
          <v-card-title class="text-h6 font-weight-bold mb-3">
            <v-icon left>mdi-fire</v-icon> Conquistas Recentes
          </v-card-title>
          <v-list density="compact">
            <v-list-item
              v-for="achievement in recentAchievements"
              :key="achievement.id"
              :title="achievement.name"
              :subtitle="achievement.game"
              class="border-b"
            >
              <template v-slot:prepend>
                <v-icon
                  :color="achievement.unlocked ? 'amber' : 'grey-lighten-1'"
                >
                  mdi-star
                </v-icon>
              </template>
              <template v-slot:append>
                <span class="text-caption text-medium-emphasis">{{
                  achievement.date
                }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Dados para a seção "Jogando Atualmente"
const playingGames = ref([
  {
    id: 101,
    name: "Hogwarts Legacy",
    cover: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
    hours: 85,
  },
  {
    id: 102,
    name: "Baldur's Gate 3",
    cover: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
    hours: 120,
  },
  {
    id: 103,
    name: "Starfield",
    cover: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
    hours: 40,
  },
  {
    id: 104,
    name: "Genshin Impact",
    cover: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
    hours: 300,
  },
  {
    id: 105,
    name: "Valorant",
    cover: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    hours: 150,
  },
]);

// Dados para a seção "Próximos na Fila" (Backlog)
const backlogGames = ref([
  {
    id: 201,
    name: "Zelda: Tears of the Kingdom",
    cover: "https://picsum.photos/id/237/200/300",
    priority: "Alta",
  },
  {
    id: 202,
    name: "Diablo IV",
    cover: "https://picsum.photos/id/238/200/300",
    priority: "Média",
  },
  {
    id: 203,
    name: "Spider-Man 2",
    cover: "https://picsum.photos/id/239/200/300",
    priority: "Alta",
  },
  {
    id: 204,
    name: "Alan Wake 2",
    cover: "https://picsum.photos/id/240/200/300",
    priority: "Média",
  },
]);

// Dados para a seção "Recém Adicionados"
const recentlyAddedGames = ref([
  {
    id: 301,
    name: "Armored Core VI",
    cover: "https://picsum.photos/id/241/200/300",
    genre: "Mecha",
    rating: 4.5,
  },
  {
    id: 302,
    name: "Sea of Stars",
    cover: "https://picsum.photos/id/242/200/300",
    genre: "RPG",
    rating: 4.8,
  },
  {
    id: 303,
    name: "Dave the Diver",
    cover: "https://picsum.photos/id/243/200/300",
    genre: "Aventura",
    rating: 4.7,
  },
  {
    id: 304,
    name: "Remnant II",
    cover: "https://picsum.photos/id/244/200/300",
    genre: "Ação",
    rating: 4.2,
  },
]);

// Dados para a seção "Conquistas Recentes"
const recentAchievements = ref([
  {
    id: 401,
    name: "Mestre da Lâmina",
    game: "Baldur's Gate 3",
    unlocked: true,
    date: "Ontem",
  },
  {
    id: 402,
    name: "Primeira Vitória",
    game: "Valorant",
    unlocked: true,
    date: "2 dias atrás",
  },
  {
    id: 403,
    name: "Colecionador de Ovos",
    game: "Stardew Valley",
    unlocked: false,
    date: "Em breve",
  },
  {
    id: 404,
    name: "Explorador Celeste",
    game: "Starfield",
    unlocked: true,
    date: "1 semana atrás",
  },
]);
</script>

<style scoped>
.dashboard-card {
  height: 100%; /* Garante que cards de estatísticas tenham altura igual */
}

.dashboard-card .v-card-text {
  align-items: center; /* Alinha o texto e o ícone */
}

.v-slide-group__content {
  flex-wrap: nowrap; /* Para evitar que os itens do slide group quebrem em múltiplas linhas */
}

.game-card .v-img {
  border-radius: 8px; /* Bordas arredondadas para as imagens dos jogos */
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08); /* Borda sutil para itens de lista */
}

.border-b:last-child {
  border-bottom: none; /* Remove a borda do último item */
}
</style>
