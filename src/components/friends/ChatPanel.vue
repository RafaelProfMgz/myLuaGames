<!-- ChatPanel.vue -->
<template>
  <v-card class="chat-panel-container" elevation="12">
    <!-- CABEÇALHO DO CHAT -->
    <v-toolbar color="grey-darken-3" density="compact">
      <v-avatar size="32" class="ml-2" color="info">
        <span>{{ friend.username.charAt(0).toUpperCase() }}</span>
      </v-avatar>
      <v-toolbar-title class="mx-2 text-body-1 font-weight-bold">{{
        friend.username
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-close"
        size="small"
        @click="emit('close')"
        aria-label="Fechar chat"
      ></v-btn>
    </v-toolbar>

    <!-- ÁREA DE MENSAGENS -->
    <div class="messages-area" ref="messagesContainer">
      <div
        v-for="message in chatMessages"
        :key="message.id || message.timestamp + Math.random()"
        <!--
        Usar
        message.id
        se
        disponível
        --
      >
        class="message-wrapper" :class="{ 'my-message': message.senderId ===
        currentUserId }" >
        <v-sheet class="message pa-2 rounded-lg" :elevation="2">
          {{ message.content }}
          <!-- Use message.content conforme o backend -->
          <div
            class="message-timestamp text-caption text-right text-grey-lighten-2"
          >
            {{ formatMessageTime(message.timestamp) }}
          </div>
        </v-sheet>
      </div>
      <div v-if="chatMessages.length === 0" class="text-center text-grey pa-4">
        Comece uma conversa!
      </div>
    </div>

    <!-- ÁREA DE INPUT -->
    <v-card-actions class="pa-2">
      <v-text-field
        v-model="newMessage"
        label="Digite uma mensagem..."
        variant="solo-filled"
        density="compact"
        hide-details
        @keydown.enter="sendMessage"
        :disabled="!friendStore.getIsConnected"
        <!--
        Desabilita
        se
        não
        estiver
        conectado
        --
      >
        ></v-text-field
      >
      <v-btn
        icon="mdi-send"
        color="primary"
        class="ml-2"
        @click="sendMessage"
        :disabled="!newMessage.trim() || !friendStore.getIsConnected"
        <!--
        Desabilita
        se
        não
        estiver
        conectado
        ou
        mensagem
        vazia
        --
      >
        aria-label="Enviar mensagem" ></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";

import { useAppStore } from "@/stores/app"; // Para obter o ID do usuário logado
import useChatSocket from "@/plugins/socket"; // Ainda necessário para as funções de emit
import { useFriendStore } from "@/stores/friendStore";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const friendStore = useFriendStore();
const appStore = useAppStore();
const { sendPrivateMessage, requestChatHistory } = useChatSocket(); // Funções de emit do socket

const currentUserId = computed(() => appStore.user?.id); // Obtém o ID do usuário logado
const newMessage = ref("");
const messagesContainer = ref(null);

// Usa o getter da store Pinia para o histórico de chat do amigo atual
const chatMessages = computed(() => {
  return friendStore.getChatHistory(props.friend.id);
});

const sendMessage = () => {
  const text = newMessage.value.trim();
  // Garante que o socket esteja conectado e o usuário logado
  if (!text || !currentUserId.value || !friendStore.getIsConnected) return;

  sendPrivateMessage(props.friend.id, text);
  newMessage.value = "";
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatMessageTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

onMounted(() => {
  // Solicita o histórico de chat para o amigo atual ao montar
  if (currentUserId.value && friendStore.getIsConnected) {
    requestChatHistory(props.friend.id);
  }
  scrollToBottom();
});

// Observa mudanças no amigo selecionado para solicitar o novo histórico e rolar
watch(
  () => props.friend,
  (newFriend) => {
    if (newFriend && currentUserId.value && friendStore.getIsConnected) {
      requestChatHistory(newFriend.id);
      scrollToBottom();
    }
  },
  { immediate: true }
);

// Observa mudanças no chatMessages para rolar para baixo automaticamente
watch(
  chatMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// Opcional: watch para reconexão/login, caso o histórico não tenha sido carregado antes
watch(
  [currentUserId, () => friendStore.getIsConnected],
  ([newUserId, newIsConnected]) => {
    if (
      newUserId &&
      newIsConnected &&
      props.friend &&
      chatMessages.value.length === 0
    ) {
      requestChatHistory(props.friend.id);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.chat-panel-container {
  width: 350px;
  height: 500px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  background-color: var(--v-theme-surface);
}

.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-wrapper {
  display: flex;
}

.my-message {
  justify-content: flex-end;
}

.my-message .message {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.message {
  max-width: 80%;
  position: relative;
  padding-bottom: 20px; /* Espaço para o timestamp */
}

.message-timestamp {
  position: absolute;
  bottom: 2px;
  right: 8px;
  font-size: 0.7em;
  opacity: 0.8;
}
</style>
