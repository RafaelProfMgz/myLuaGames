<!-- AppFriends.vue -->
<template>
  <!-- BOTÃO FLUTUANTE (FAB) -->
  <v-btn
    v-if="!isFriendsListVisible && currentUserId && friendStore.getIsConnected"
    class="friends-fab"
    icon="mdi-account-group"
    color="primary"
    size="large"
    elevation="8"
    @click="isFriendsListVisible = true"
    aria-label="Abrir lista de amigos"
  ></v-btn>
  <v-btn
    v-else-if="
      !isFriendsListVisible && currentUserId && !friendStore.getIsConnected
    "
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

  <!-- Diálogo para pedir o UserId (se ainda for usado) -->
  <v-dialog v-model="showUserIdPrompt" persistent max-width="300">
    <v-card>
      <v-card-title class="headline">Seu ID de Usuário</v-card-title>
      <v-card-text>
        Por favor, digite seu ID de usuário para entrar no chat. (Ex: user1,
        user2, Alice, Bob)
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="tempUserId"
          label="ID de Usuário"
          required
          hide-details
          @keydown.enter="setUserIdAndConnect"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="setUserIdAndConnect"
          :disabled="!tempUserId.trim()"
        >
          Entrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import FriendsList from "./FriendsList.vue";
import ChatPanel from "./ChatPanel.vue";
import { useAppStore } from "@/stores/app"; // Para obter o usuário logado
import { useFriendStore } from "@/stores/friendStore";

const appStore = useAppStore();
const friendStore = useFriendStore();

const currentUserId = computed(() => appStore.user?.id); // Obtém o userId reativamente da appStore

const isFriendsListVisible = ref(false);
const selectedFriendForChat = ref(null);

const showUserIdPrompt = ref(false); // Mantido por compatibilidade, mas o ideal é que a appStore gerencie o login
const tempUserId = ref("");

const handleOpenChat = (friend) => {
  selectedFriendForChat.value = friend;
};

const closeAllPanels = () => {
  isFriendsListVisible.value = false;
  selectedFriendForChat.value = null;
};

// Listener global para atalhos de teclado (Ctrl+P)
const handleKeyDown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "p") {
    event.preventDefault();
    isFriendsListVisible.value = !isFriendsListVisible.value; // Alterna visibilidade
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  // Se não houver um usuário logado na appStore, você pode ativar o prompt de ID.
  // A lógica de conexão já é tratada no watch do useChatSocket, então não precisamos chamar connectSocket aqui.
  // if (!currentUserId.value) {
  //   showUserIdPrompt.value = true;
  // }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

const setUserIdAndConnect = () => {
  console.warn(
    "setUserIdAndConnect foi chamado, mas o userId deve ser gerenciado pela appStore."
  );
  if (tempUserId.value) {
    showUserIdPrompt.value = false;
  }
};

// Opcional: Watch para o userId da appStore para abrir o prompt se necessário
watch(
  currentUserId,
  (newUserId) => {
    if (!newUserId) {
      // Se o usuário não estiver logado, você pode mostrar o prompt para simular um login.
      // Isso é mais para um cenário de demonstração/teste.
      // Em uma aplicação real, o `appStore.user` viria de um processo de login real.
      // showUserIdPrompt.value = true;
    } else {
      showUserIdPrompt.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Os estilos `fixed` são importantes para o posicionamento */
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
  right: calc(
    24px + 380px + 16px
  ); /* Ajustado para deixar espaço para a lista de amigos */
  z-index: 1000;
}
</style>
