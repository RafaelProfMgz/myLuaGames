<template>
  <!-- BOTÃO FLUTUANTE (FAB) -->
  <v-btn
    v-if="!isFriendsListVisible"
    class="friends-fab"
    icon="mdi-account-group"
    color="primary"
    size="large"
    elevation="8"
    @click="isFriendsListVisible = true"
    aria-label="Abrir lista de amigos"
  ></v-btn>

  <!-- PAINEL DE CHAT -->
  <ChatPanel
    v-if="selectedFriendForChat && myUserId"
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

  <!-- Modal para definir o ID do usuário se ainda não estiver definido -->
  <v-dialog v-model="showUserIdPrompt" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">Seu ID de Usuário</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tempUserId"
          label="Digite seu ID de usuário"
          required
          :rules="[(v) => !!v || 'ID de usuário é obrigatório']"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="setUserIdAndConnect"
          :disabled="!tempUserId"
          >Entrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import FriendsList from "./FriendsList.vue";
import ChatPanel from "./ChatPanel.vue";
import useChatSocket from "@/plugins/socket";

const { userId: myUserId, setMyUserId, connectSocket } = useChatSocket();

const isFriendsListVisible = ref(false);
const selectedFriendForChat = ref(null);

const showUserIdPrompt = ref(false);
const tempUserId = ref("");

const handleOpenChat = (friend) => {
  selectedFriendForChat.value = friend;
};

const closeAllPanels = () => {
  isFriendsListVisible.value = false;
  selectedFriendForChat.value = null;
};

const handleKeyDown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "p") {
    event.preventDefault();
    isFriendsListVisible.value = true;
  }
};

const setUserIdAndConnect = () => {
  if (tempUserId.value) {
    setMyUserId(tempUserId.value); // Define o userId no composable
    connectSocket(); // Conecta o socket
    showUserIdPrompt.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  // Se o ID do usuário não estiver definido (no localStorage), exibe o prompt
  if (!myUserId.value) {
    showUserIdPrompt.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// Watcher para reabrir o prompt se o userId for limpo por algum motivo
watch(myUserId, (newVal) => {
  if (!newVal) {
    showUserIdPrompt.value = true;
  }
});
</script>

<style>
.friends-fab {
  position: fixed !important;
  bottom: 20px;
  right: 34px;
  z-index: 1001;
}

.friends-list-fixed {
  position: fixed !important;
  bottom: 20px;
  right: 34px;
  z-index: 1000;
}

.chat-panel-fixed {
  position: fixed !important;
  bottom: 24px;
  right: calc(24px + 380px + 16px);
  z-index: 1000;
}
</style>
