<template>
  <!-- Arredondamento aumentado para "xl" -->
  <v-card class="chat-panel-container" elevation="12" rounded="xl">
    <!-- Cor da toolbar agora usa uma cor do tema que se adapta -->
    <v-toolbar color="surface-variant" density="compact">
      <v-avatar size="32" class="ml-2" color="primary">
        <!-- Avatar agora usa a cor primária para consistência -->
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
        <!--
          A cor da bolha agora é dinâmica usando o tema do Vuetify.
          As suas mensagens são 'primary' (roxo), as outras são 'surface-variant'.
          O arredondamento foi aumentado para "xl".
        -->
        <v-sheet
          class="message pa-2"
          rounded="xl"
          :elevation="2"
          :color="
            message.senderId === currentUserId ? 'primary' : 'surface-variant'
          "
        >
          {{ message.content }}
          <!-- A cor do timestamp foi ajustada para melhor contraste -->
          <div class="message-timestamp text-caption text-right">
            {{ formatMessageTime(message.timestamp) }}
          </div>
        </v-sheet>
      </div>
      <div
        v-if="chatMessages.length === 0"
        class="text-center text-medium-emphasis pa-4"
      >
        Comece uma conversa!
      </div>
    </div>

    <v-card-actions class="pa-2">
      <!-- Campo de texto também foi arredondado -->
      <v-text-field
        v-model="newMessage"
        label="Digite uma mensagem..."
        variant="solo-filled"
        density="compact"
        hide-details
        rounded="lg"
        @keydown.enter="handleSendMessage"
        :disabled="!isConnected"
      >
      </v-text-field>
      <!-- Botão já usava a cor 'primary', o que é perfeito -->
      <v-btn
        icon="mdi-send"
        color="primary"
        class="ml-2"
        @click="handleSendMessage"
        :disabled="!newMessage.trim() || !isConnected"
        aria-label="Enviar mensagem"
      ></v-btn>
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
  height: 100%;
  max-height: 500px; /* Exemplo */
  overflow: hidden; /* Previne que elementos internos vazem do arredondamento */
}

.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  /* Fundo agora usa a variável do tema, adaptando-se a light/dark mode */
  background-color: rgb(var(--v-theme-background));
}

.message-wrapper {
  display: flex;
  margin-bottom: 12px; /* Aumentado para mais respiro */
}

/* Esta classe ainda é necessária para alinhar suas mensagens à direita */
.my-message {
  justify-content: flex-end;
}

/*
  AS REGRAS DE COR PARA .message E .my-message .message FORAM REMOVIDAS
  porque a lógica agora está no :color da v-sheet no template.
  Isso é mais limpo e compatível com os temas.
*/
.message {
  max-width: 75%;
}

.message-timestamp {
  font-size: 0.75em;
  margin-top: 4px;
  /* Opacidade para o timestamp, funciona bem em ambos os temas */
  opacity: 0.7;
}
</style>
