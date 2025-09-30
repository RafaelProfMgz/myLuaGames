<template>
  <v-card class="chat-panel-container" elevation="12">
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

    <div class="messages-area" ref="messagesContainer">
      <div
        v-for="message in chatMessages"
        :key="message.id || message.timestamp + Math.random()"
        class="message-wrapper"
        :class="{ 'my-message': message.senderId === currentUserId }"
      >
        <v-sheet class="message pa-2 rounded-lg" :elevation="2">
          {{ message.content }}
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

    <v-card-actions class="pa-2">
      <v-text-field
        v-model="newMessage"
        label="Digite uma mensagem..."
        variant="solo-filled"
        density="compact"
        hide-details
        @keydown.enter="handleSendMessage"
        :disabled="!isConnected"
      >
      </v-text-field>
      <v-btn
        icon="mdi-send"
        color="primary"
        class="ml-2"
        @click="handleSendMessage"
        :disabled="!newMessage.trim() || !isConnected"
      >
        aria-label="Enviar mensagem" ></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useAppStore } from "@/stores/app";

import {
  socket,
  privateChats,
  sendMessage as sendSocketMessage,
} from "@/plugins/socket";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const appStore = useAppStore();
const currentUserId = computed(() => appStore.user?.id);

const newMessage = ref("");
const messagesContainer = ref(null);

// Computa se o socket está conectado
const isConnected = computed(() => socket.value?.connected || false);

const privateChatId = computed(() => {
  const chatIds = Object.keys(privateChats.value);
  for (const chatId of chatIds) {
    const chat = privateChats.value[chatId];
    if (
      chat.users.some((user) => user.id === props.friend.id) &&
      chat.users.some((user) => user.id === currentUserId.value)
    ) {
      return chatId;
    }
  }

  return `private-${[props.friend.id, currentUserId.value].sort().join("-")}`; // Placeholder
});

// As mensagens para este chat privado
const chatMessages = computed(() => {
  return privateChats.value[privateChatId.value]?.messages || [];
});

const handleSendMessage = () => {
  if (newMessage.value.trim() && isConnected.value) {
    sendSocketMessage(privateChatId.value, newMessage.value);
    newMessage.value = "";
  }
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Observa as mensagens para rolar para baixo
watch(chatMessages, scrollToBottom, { deep: true });

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ajuste conforme a necessidade do seu layout */
  max-height: 500px; /* Exemplo */
}

.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #2e2e2e; /* Cor de fundo do chat */
}

.message-wrapper {
  display: flex;
  margin-bottom: 8px;
}

.message {
  max-width: 70%;
  background-color: #424242; /* Cor da bolha de mensagem do outro */
  color: #fff;
}

.my-message {
  justify-content: flex-end;
}

.my-message .message {
  background-color: #1976d2; /* Cor da bolha de mensagem do meu usuário (primary) */
  color: #fff;
}

.message-timestamp {
  font-size: 0.75em;
  margin-top: 4px;
}
</style>
