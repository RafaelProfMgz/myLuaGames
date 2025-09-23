<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página games"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="pa-4">
    <!-- Seção: Jogos com Mais Horas de Jogo -->
    <v-card class="mb-6" flat>
      <v-card-title class="text-h5 font-weight-bold mb-3">
        <v-icon left>mdi-trophy</v-icon> Meus Jogos com Mais Horas
      </v-card-title>

      <v-slide-group show-arrows>
        <v-slide-group-item v-for="game in topGames" :key="game.id">
          <v-card class="ma-3" width="200" flat>
            <v-img :src="game.image" height="120px" cover></v-img>
            <v-card-title class="text-subtitle-1 pb-1">{{
              game.name
            }}</v-card-title>
            <v-card-text class="text-caption text-medium-emphasis pt-0">
              {{ game.hours }} horas
            </v-card-text>
            <v-card-actions>
              <v-btn size="small" variant="text" color="primary"
                >Ver Detalhes</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-card>

    <!-- Seção: Todos os Jogos (Tabela Infinita) -->
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold mb-3">
        <v-icon left>mdi-gamepad-variant</v-icon> Todos os Meus Jogos
      </v-card-title>

      <v-data-table-virtual
        :headers="headers"
        :items="allGames"
        height="600"
        item-value="id"
        class="elevation-1"
      >
        <template v-slot:item.cover="{ item }">
          <v-avatar rounded="0" size="48">
            <v-img :src="item.raw.cover"></v-img>
          </v-avatar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn size="small" variant="text" color="primary">Ver Jogo</v-btn>
        </template>
        <template v-slot:bottom>
          <div v-intersect="onIntersect" class="text-center pa-4">
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <span v-else-if="!hasMore" class="text-caption text-medium-emphasis"
              >Todos os jogos carregados!</span
            >
          </div>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

// --- Dados para a Grid de Jogos com Mais Horas ---
const topGames = ref([
  {
    id: 1,
    name: "Cyberpunk 2077",
    image: "https://cdn.vuetifyjs.com/images/cards/docks.jpg",
    hours: 500,
  },
  {
    id: 2,
    name: "The Witcher 3",
    image: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
    hours: 450,
  },
  {
    id: 3,
    name: "Elden Ring",
    image: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
    hours: 380,
  },
  {
    id: 4,
    name: "Red Dead Redemption 2",
    image: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
    hours: 320,
  },
  {
    id: 5,
    name: "Stardew Valley",
    image: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
    hours: 280,
  },
]);

// --- Dados e Lógica para a Tabela Infinita de Todos os Jogos ---
const headers = ref([
  { title: "Capa", key: "cover", sortable: false },
  { title: "Título", key: "name" },
  { title: "Gênero", key: "genre" },
  { title: "Horas", key: "hours" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
]);

const allGames = ref([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const ITEMS_PER_PAGE = 10; // Quantos itens carregar por vez

// Função para simular o carregamento de jogos
const fetchGames = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  // Simula uma chamada API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newGames = [];
  const startIndex = (page.value - 1) * ITEMS_PER_PAGE;
  for (let i = 0; i < ITEMS_PER_PAGE; i++) {
    const gameId = startIndex + i + 1;
    if (gameId > 50) {
      // Simula que há apenas 50 jogos no total
      hasMore.value = false;
      break;
    }
    newGames.push({
      id: gameId,
      name: `Jogo ${gameId} do Acervo`,
      cover: `https://picsum.photos/id/${10 + gameId}/60/60`, // Imagens de exemplo
      genre: `Ação/Aventura`,
      hours: Math.floor(Math.random() * 200) + 10, // Horas aleatórias
    });
  }

  allGames.value.push(...newGames);
  page.value++;
  loading.value = false;
};

// Callback para o v-intersect (carregamento infinito)
const onIntersect = (entries) => {
  const [entry] = entries;
  if (entry.isIntersecting && !loading.value && hasMore.value) {
    fetchGames();
  }
};

// Carrega os primeiros jogos quando o componente é montado
onMounted(() => {
  fetchGames();
});
</script>

<style>
.v-slide-group__content {
  flex-wrap: nowrap;
}
</style>
