<!-- ChatPanel.vue -->
<template>
  <v-card class="chat-panel-container" elevation="12">
    <!-- CABEÇALHO DO CHAT -->
    <v-toolbar color="grey-darken-3" density="compact">
      <v-avatar size="32" class="ml-2">
        <v-img :src="friend.avatar" :alt="friend.name"></v-img>
      </v-avatar>
      <v-toolbar-title class="mx-2 text-body-1 font-weight-bold">{{
        friend.name
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" size="small" @click="emit('close')"></v-btn>
    </v-toolbar>

    <!-- ÁREA DE MENSAGENS -->
    <div class="messages-area" ref="messagesContainer">
      <div
        v-for="message in chatMessages"
        :key="message.timestamp + Math.random()"
        class="message-wrapper"
        :class="{ 'my-message': message.senderId === myUserId }"
      >
        <v-sheet class="message pa-2 rounded-lg" :elevation="2">
          {{ message.text }}
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
      ></v-text-field>
      <v-btn
        icon="mdi-send"
        color="primary"
        class="ml-2"
        @click="sendMessage"
        :disabled="!newMessage.trim()"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import useChatSocket from "@/plugins/socket";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const {
  userId: myUserId,
  currentChatHistory,
  sendPrivateMessage,
  requestChatHistory,
} = useChatSocket();

const newMessage = ref("");
const messagesContainer = ref(null);

// Computa as mensagens para o amigo atual a partir do histórico do socket
const chatMessages = computed(() => {
  return currentChatHistory.value[props.friend.id] || [];
});

const sendMessage = () => {
  const text = newMessage.value.trim();
  if (!text || !myUserId.value) return;

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

onMounted(() => {
  // Solicita o histórico de chat para o amigo atual ao montar
  requestChatHistory(props.friend.id);
  scrollToBottom();
});

// Observa mudanças no amigo selecionado para solicitar o novo histórico e rolar
watch(
  () => props.friend,
  (newFriend) => {
    if (newFriend) {
      requestChatHistory(newFriend.id);
      scrollToBottom();
    }
  },
  { immediate: true } // Executa a função do watcher imediatamente na montagem
);

// Observa mudanças no chatMessages para rolar para baixo automaticamente
watch(
  chatMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style scoped>
.chat-panel-container {
  width: 350px;
  height: 500px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
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
}
</style>
