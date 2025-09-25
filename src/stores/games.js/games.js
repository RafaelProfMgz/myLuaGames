// stores/games.js/games.js
import { defineStore } from "pinia";

const LOCAL_STORAGE_KEY = "my_games_library";

// Função auxiliar para carregar os jogos do localStorage
const loadFromLocalStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Função auxiliar para salvar os jogos no localStorage
const saveToLocalStorage = (games) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
};

export const useGamesStore = defineStore("games", {
  // O estado inicial agora tenta carregar os dados salvos
  state: () => ({
    games: loadFromLocalStorage(),
    loading: false,
    error: null,
  }),

  getters: {
    // Seus getters permanecem os mesmos
    totalGames: (state) => state.games.length,
    playingGames: (state) => state.games.filter((g) => g.status === "playing"),
    inProgressGames: (state) =>
      state.games.filter((g) => g.status === "inProgressGames"),
    backlogGames: (state) => state.games.filter((g) => g.status === "backlog"),
    completedGames: (state) =>
      state.games.filter((g) => g.status === "completed"),
    totalHours: (state) =>
      state.games.reduce((acc, game) => acc + (game.hours || 0), 0),
  },

  actions: {
    addGame(newGame) {
      const gameWithId = { ...newGame, id: Date.now() };
      this.games.unshift(gameWithId);
      saveToLocalStorage(this.games);
    },

    async fetchGames() {
      if (this.games.length > 0) {
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        console.log("LocalStorage vazio, buscando dados iniciais...");
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve([]);
          }, 500)
        );
        this.games = response;
        // Salva esses dados iniciais (vazios ou não) no localStorage
        saveToLocalStorage(this.games);
      } catch (e) {
        this.error = "Não foi possível carregar os jogos.";
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    updateGame(updatedGame) {
      // Encontra o índice do jogo a ser atualizado
      const index = this.games.findIndex((game) => game.id === updatedGame.id);
      if (index !== -1) {
        // Substitui o jogo antigo pelo novo no array
        this.games[index] = updatedGame;
        // Salva a lista atualizada
        saveToLocalStorage(this.games);
      }
    },

    deleteGame(gameId) {
      // Filtra o array, mantendo todos os jogos exceto o que tem o ID correspondente
      this.games = this.games.filter((game) => game.id !== gameId);
      // Salva a lista atualizada
      saveToLocalStorage(this.games);
    },
  },
});
