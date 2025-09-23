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
    v-if="selectedFriendForChat"
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
import { ref, onMounted, onUnmounted } from "vue";
import FriendsList from "./FriendsList.vue";
import ChatPanel from "./ChatPanel.vue";

const isFriendsListVisible = ref(false);
const selectedFriendForChat = ref(null);

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

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
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
