import { defineStore } from "pinia";
import { useGamesStore } from "./games";

export const useGamesCompletedStore = defineStore("games-completed", {
  state: () => ({
    completedGameIds: [2],
  }),

  getters: {
    completedGames: (state) => {
      const gamesStore = useGamesStore();

      return gamesStore.games.filter((game) =>
        state.completedGameIds.includes(game.id)
      );
    },
    isCompleted: (state) => (gameId) => {
      return state.completedGameIds.includes(gameId);
    },
  },

  actions: {
    toggleCompleted(gameId) {
      const index = this.completedGameIds.indexOf(gameId);
      if (index === -1) {
        // Se não encontrou, adiciona
        this.completedGameIds.push(gameId);
      } else {
        // Se encontrou, remove
        this.completedGameIds.splice(index, 1);
      }
    },
  },
});
