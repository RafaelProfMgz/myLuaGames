<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página games"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="pa-4">
    <h1 class="text-h4 font-weight-bold mb-4">Minha Biblioteca de Jogos</h1>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center flex-wrap">
        <span>Jogos Cadastrados ({{ gamesStore.totalGames }})</span>
        <v-btn
          color="primary"
          @click="isFormDialogOpen = true"
          prepend-icon="mdi-plus"
        >
          Adicionar Jogo
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text
        v-if="gamesStore.games.length === 0"
        class="text-center py-16"
      >
        <p class="text-h6">Nenhum jogo cadastrado ainda.</p>
        <p class="text-medium-emphasis">
          Clique em "Adicionar Jogo" para começar!
        </p>
      </v-card-text>

      <v-card-text v-else>
        <div class="games-grid-container">
          <v-card
            v-for="game in gamesStore.games"
            :key="game.id"
            class="game-card"
            elevation="2"
            @dblclick="openDetailsModal(game)"
          >
            <v-img
              :src="game.cover || 'https://via.placeholder.com/400x300'"
              height="150px"
              cover
            ></v-img>
            <v-card-title class="text-subtitle-1 pb-1">{{
              game.name
            }}</v-card-title>

            <v-card-subtitle class="pb-2">{{ game.platform }}</v-card-subtitle>
            <v-card-text class="py-0">
              <v-rating
                :model-value="game.rating"
                readonly
                half-increments
                color="amber"
                size="x-small"
                density="compact"
              ></v-rating>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="openEditModal(game)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="promptDelete(game)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isFormDialogOpen" max-width="600px" persistent>
      <FormGames
        :game-to-edit="selectedGame"
        @close="closeFormModal"
        @save="handleSaveGame"
      />
    </v-dialog>

    <v-dialog v-model="isDetailsDialogOpen" max-width="800px">
      <Details
        v-if="selectedGame"
        :game="selectedGame"
        @close="isDetailsDialogOpen = false"
      />
    </v-dialog>

    <v-dialog v-model="isConfirmDialogOpen" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Você tem certeza que deseja excluir o jogo
          <strong>{{ selectedGame?.name }}</strong
          >? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isConfirmDialogOpen = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="handleDeleteGame"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormGames from "@/components/form/FormGames.vue";
import { useGamesStore } from "@/stores/games.js/games";

const gamesStore = useGamesStore();

const isFormDialogOpen = ref(false);
const isDetailsDialogOpen = ref(false);
const selectedGame = ref(null);

onMounted(() => {
  if (gamesStore.games.length === 0) {
    gamesStore.fetchGames();
  }
});

function handleSaveGame(gameData) {
  if (gameData.id) {
    gamesStore.updateGame(gameData);
  } else {
    gamesStore.addGame(gameData);
  }
  closeFormModal();
}

function openDetailsModal(game) {
  selectedGame.value = game;
  isDetailsDialogOpen.value = true;
}

function openAddModal() {
  selectedGame.value = null;
  isFormDialogOpen.value = true;
}

function openEditModal(game) {
  selectedGame.value = { ...game };
  isFormDialogOpen.value = true;
}

function closeFormModal() {
  isFormDialogOpen.value = false;
  selectedGame.value = null;
}

function promptDelete(game) {
  selectedGame.value = game;
  isConfirmDialogOpen.value = true;
}

function handleDeleteGame() {
  if (selectedGame.value) {
    gamesStore.deleteGame(selectedGame.value.id);
  }
  isConfirmDialogOpen.value = false;
  selectedGame.value = null;
}
</script>

<style scoped>
.games-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.game-card {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.game-card:hover {
  cursor: pointer;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
