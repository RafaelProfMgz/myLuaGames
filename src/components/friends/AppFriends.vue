<template>
  <!-- BOTÃO FLUTUANTE (FAB) -->
  <v-btn
    v-if="!isFriendsListVisible && currentUserId && isConnected"
    class="friends-fab"
    icon="mdi-account-group"
    color="primary"
    size="large"
    elevation="8"
    @click="isFriendsListVisible = true"
    aria-label="Abrir lista de amigos"
  ></v-btn>
  <v-btn
    v-else-if="!isFriendsListVisible && currentUserId && !isConnected"
    class="friends-fab"
    icon="mdi-close-network"
    color="error"
    size="large"
    elevation="8"
    aria-label="Socket desconectado"
    title="Socket desconectado, tentando reconectar..."
  ></v-btn>

  <!-- PAINEL DE CHAT -->
  <ChatPanel
    v-if="selectedFriendForChat && currentUserId"
    class="chat-panel-fixed"
    :friend="selectedFriendForChat"
    @close="selectedFriendForChat = null"
  />

  <!-- PAINEL DA LISTA DE AMIGOS -->
  <FriendsList
    v-if="isFriendsListVisible"
    class="friends-list-fixed"
    @close="closeAllPanels"
    @open-chat="handleOpenChat"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import FriendsList from "./FriendsList.vue";
import ChatPanel from "./ChatPanel.vue";
import { useAppStore } from "@/stores/app";
import { initializeSocket, socket } from "@/plugins/socket";

const appStore = useAppStore();

const currentUserId = computed(() => appStore.user?.id); // Obtém o userId reativamente da appStore
const isConnected = computed(() => socket.value?.connected || false); // Verifica o status do socket

const isFriendsListVisible = ref(false);
const selectedFriendForChat = ref(null);

const handleOpenChat = (friend) => {
  selectedFriendForChat.value = friend;
};

const closeAllPanels = () => {
  isFriendsListVisible.value = false;
  selectedFriendForChat.value = null;
};
</script>

<style scoped>
/* Estilos para posicionamento fixo, se necessário */
.friends-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
.friends-list-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px; /* Largura da lista de amigos */
  height: 600px; /* Altura da lista de amigos */
  z-index: 900;
}
.chat-panel-fixed {
  position: fixed;
  bottom: 20px;
  right: 400px; /* Posiciona o chat ao lado da lista de amigos */
  width: 350px; /* Largura do painel de chat */
  height: 600px; /* Altura do painel de chat */
  z-index: 900;
}

/* Para dispositivos menores, talvez sobrepor */
@media (max-width: 768px) {
  .friends-list-fixed,
  .chat-panel-fixed {
    width: 90%;
    left: 5%;
    right: 5%;
    height: 80%;
    bottom: 10%;
  }
  .chat-panel-fixed {
    right: 5%; /* Alinha o chat à direita em telas menores */
  }
}
</style>
