// stores/friendStore.js
import { defineStore } from "pinia";
import { initializeSocket, socket } from "@/plugins/socket"; // Importe o socket e onlineUsers
import { useAppStore } from "./app";

export const useFriendStore = defineStore("friendStore", {
  state: () => ({
    friends: [], // Lista de amigos do usuário logado
    friendRequestsSent: [], // Pedidos de amizade que você enviou
    friendRequestsReceived: [], // Pedidos de amizade que você recebeu
    // Podemos ter um estado para "sugestões" de amigos se o backend fornecer
  }),

  getters: {
    // Retorna a lista de amigos, marcando se estão online
    getFriendsWithStatus: (state) => {
      return state.friends.map((friend) => {
        const isOnline = onlineUsers.value.some(
          (user) => user.id === friend.id
        );
        return { ...friend, isOnline };
      });
    },
    // Retorna a lista de usuários online que NÃO são amigos e NÃO receberam/enviaram pedido
    getPotentialFriends: (state) => {
      const appStore = useAppStore();
      const currentUser = appStore.user;
      if (!currentUser) return [];

      return onlineUsers.value.filter((user) => {
        // Não é o usuário logado
        if (user.id === currentUser.id) return false;
        // Não é um amigo
        if (state.friends.some((f) => f.id === user.id)) return false;
        // Não enviou um pedido de amizade para ele
        if (state.friendRequestsSent.some((req) => req.receiverId === user.id))
          return false;
        // Não recebeu um pedido de amizade dele
        if (
          state.friendRequestsReceived.some((req) => req.senderId === user.id)
        )
          return false;

        return true;
      });
    },
  },

  actions: {
    // Inicializa o listener de socket para amigos
    initializeFriendSocketListeners() {
      if (!socket.value) return;

      // O backend enviaria a lista inicial de amigos e pedidos
      socket.value.on(
        "initial_friends_data",
        ({ friends, requestsSent, requestsReceived }) => {
          this.friends = friends;
          this.friendRequestsSent = requestsSent;
          this.friendRequestsReceived = requestsReceived;
        }
      );

      socket.value.on("friend_request_received", (request) => {
        this.friendRequestsReceived.push(request);
      });

      socket.value.on("friend_request_sent_success", (request) => {
        this.friendRequestsSent.push(request);
      });

      socket.value.on("friend_request_accepted", (friend) => {
        // Adiciona o novo amigo
        this.friends.push(friend);
        // Remove o pedido de amizade recebido (se existir)
        this.friendRequestsReceived = this.friendRequestsReceived.filter(
          (req) => req.senderId !== friend.id
        );
        // Remove o pedido de amizade enviado (se existir)
        this.friendRequestsSent = this.friendRequestsSent.filter(
          (req) => req.receiverId !== friend.id
        );
      });

      socket.value.on("friend_request_rejected", (rejectedUserId) => {
        // Remove o pedido de amizade que você enviou
        this.friendRequestsSent = this.friendRequestsSent.filter(
          (req) => req.receiverId !== rejectedUserId
        );
        // Ou remove o pedido de amizade que você recebeu (se o outro usuário rejeitou)
        this.friendRequestsReceived = this.friendRequestsReceived.filter(
          (req) => req.senderId !== rejectedUserId
        );
      });

      socket.value.on("friend_removed", (removedUserId) => {
        this.friends = this.friends.filter(
          (friend) => friend.id !== removedUserId
        );
      });

      socket.value.on("friend_error", (message) => {
        console.error("Erro de amizade:", message);
        // Você pode adicionar uma notificação para o usuário aqui
      });
    },

    // Ações para enviar eventos ao socket
    sendFriendRequest(receiverId) {
      if (socket.value && socket.value.connected) {
        socket.value.emit("send_friend_request", receiverId);
      }
    },

    acceptFriendRequest(senderId) {
      if (socket.value && socket.value.connected) {
        socket.value.emit("accept_friend_request", senderId);
      }
    },

    rejectFriendRequest(senderId) {
      if (socket.value && socket.value.connected) {
        socket.value.emit("reject_friend_request", senderId);
      }
    },

    removeFriend(friendId) {
      if (socket.value && socket.value.connected) {
        socket.value.emit("remove_friend", friendId);
      }
    },

    // Ação para resetar o estado quando o usuário faz logout
    resetFriendStore() {
      this.friends = [];
      this.friendRequestsSent = [];
      this.friendRequestsReceived = [];
    },
  },
});
