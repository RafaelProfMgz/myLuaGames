// stores/friendStore.js
import { defineStore } from "pinia";
import { initializeSocket, socket } from "@/plugins/socket"; // Importa o socket e onlineUsers
import { useAppStore } from "./app";

export const useFriendStore = defineStore("friendStore", {
  state: () => ({
    friends: [], // Lista de amigos do usu rio logado
    friendRequestsSent: [], // Pedidos de amizade que voc  enviou
    friendRequestsReceived: [], // Pedidos de amizade que voc  recebeu
  }),

  getters: {
    getFriendsWithStatus: (state) =>
      state.friends.map((friend) => ({
        ...friend,
        isOnline: onlineUsers.value.some((user) => user.id === friend.id),
      })),
    getPotentialFriends: (state) =>
      onlineUsers.value.filter(
        (user) =>
          !state.friends.some((friend) => friend.id === user.id) &&
          !state.friendRequestsSent.some((req) => req.receiverId === user.id) &&
          !state.friendRequestsReceived.some((req) => req.senderId === user.id)
      ),
  },

  actions: {
    initializeFriendSocketListeners() {
      if (!socket.value) return;

      socket.value.on(
        "initial_friends_data",
        ({ friends, requestsSent, requestsReceived }) => {
          this.friends = friends;
          this.friendRequestsSent = requestsSent;
          this.friendRequestsReceived = requestsReceived;
        }
      );

      socket.value.on("friend_request_received", (request) =>
        this.friendRequestsReceived.push(request)
      );
      socket.value.on("friend_request_sent_success", (request) =>
        this.friendRequestsSent.push(request)
      );
      socket.value.on("friend_request_accepted", (friend) => {
        this.friends.push(friend);
        this.friendRequestsReceived = this.friendRequestsReceived.filter(
          (req) => req.senderId !== friend.id
        );
        this.friendRequestsSent = this.friendRequestsSent.filter(
          (req) => req.receiverId !== friend.id
        );
      });

      socket.value.on("friend_request_rejected", (rejectedUserId) => {
        this.friendRequestsSent = this.friendRequestsSent.filter(
          (req) => req.receiverId !== rejectedUserId
        );
        this.friendRequestsReceived = this.friendRequestsReceived.filter(
          (req) => req.senderId !== rejectedUserId
        );
      });

      socket.value.on(
        "friend_removed",
        (removedUserId) =>
          (this.friends = this.friends.filter(
            (friend) => friend.id !== removedUserId
          ))
      );
      socket.value.on("friend_error", (message) =>
        console.error("Erro de amizade:", message)
      );
    },

    sendFriendRequest(receiverId) {
      if (socket.value && socket.value.connected)
        socket.value.emit("send_friend_request", receiverId);
    },

    acceptFriendRequest(senderId) {
      if (socket.value && socket.value.connected)
        socket.value.emit("accept_friend_request", senderId);
    },

    rejectFriendRequest(senderId) {
      if (socket.value && socket.value.connected)
        socket.value.emit("reject_friend_request", senderId);
    },

    removeFriend(friendId) {
      if (socket.value && socket.value.connected)
        socket.value.emit("remove_friend", friendId);
    },

    resetFriendStore() {
      this.friends = [];
      this.friendRequestsSent = [];
      this.friendRequestsReceived = [];
    },
  },
});
