import { defineStore } from "pinia";

export const useFriendStore = defineStore("friends", {
  state: () => ({
    // A lista de todos os usuários/amigos, incluindo o status
    allFriends: [],
    // Histórico de chat para cada amigo, key: friendId, value: array de mensagens
    chatHistories: {},
    // Para armazenar o estado de conexão do socket
    isConnected: false,
  }),
  getters: {
    // Retorna apenas os amigos que estão online
    onlineFriends: (state) =>
      state.allFriends.filter((friend) => friend.status === "online"),
    // Retorna apenas os amigos que estão offline
    offlineFriends: (state) =>
      state.allFriends.filter((friend) => friend.status === "offline"),
    // Getter para o histórico de chat de um amigo específico
    getChatHistory: (state) => (friendId) =>
      state.chatHistories[friendId] || [],
    // Getter para o status de conexão
    getIsConnected: (state) => state.isConnected,
  },
  actions: {
    // Define a lista completa de amigos
    setAllFriends(friends) {
      this.allFriends = friends;
    },
    // Atualiza o status de um amigo específico
    updateFriendStatus({ userId, status }) {
      const friend = this.allFriends.find((f) => f.id === userId);
      if (friend) {
        friend.status = status;
      }
    },
    // Define o histórico de chat para um amigo
    setChatHistory({ friendId, history }) {
      this.chatHistories[friendId] = history;
    },
    // Adiciona uma nova mensagem ao histórico de chat de um amigo
    addMessageToChatHistory({ friendId, message }) {
      if (!this.chatHistories[friendId]) {
        this.chatHistories[friendId] = [];
      }
      this.chatHistories[friendId].push(message);
    },
    // Define o estado de conexão do socket
    setIsConnected(status) {
      this.isConnected = status;
    },
    // Limpa o estado quando o usuário faz logout
    clearFriendsState() {
      this.allFriends = [];
      this.chatHistories = {};
      this.isConnected = false;
    },
  },
});
