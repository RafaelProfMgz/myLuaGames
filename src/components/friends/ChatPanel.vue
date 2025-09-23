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
        v-for="message in messages"
        :key="message.timestamp"
        class="message-wrapper"
        :class="{ 'my-message': message.sender === 'me' }"
      >
        <v-sheet class="message pa-2 rounded-lg" :elevation="2">
          {{ message.text }}
        </v-sheet>
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
import { ref, onMounted, watch, nextTick } from "vue";

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);

// --- Lógica do Chat e localStorage ---

// Carrega o histórico de chat do localStorage
const loadMessages = () => {
  const allChats = JSON.parse(localStorage.getItem("chatHistory") || "{}");
  // Carrega as mensagens para o amigo específico, ou um array vazio se não houver
  messages.value = allChats[props.friend.id] || [];
  scrollToBottom();
};

// Salva o histórico de chat no localStorage
const saveMessages = () => {
  const allChats = JSON.parse(localStorage.getItem("chatHistory") || "{}");
  allChats[props.friend.id] = messages.value;
  localStorage.setItem("chatHistory", JSON.stringify(allChats));
};

const sendMessage = () => {
  const text = newMessage.value.trim();
  if (!text) return;

  messages.value.push({
    text: text,
    sender: "me", // Assumimos que a mensagem enviada é 'nossa'
    timestamp: Date.now(),
  });

  newMessage.value = "";
  saveMessages();
  scrollToBottom();
};

// Rola a área de mensagens para o final
const scrollToBottom = async () => {
  await nextTick(); // Espera o DOM ser atualizado
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Carrega as mensagens quando o componente é montado
onMounted(loadMessages);

// Observa mudanças no amigo selecionado para carregar o novo histórico de chat
watch(
  () => props.friend,
  () => {
    loadMessages();
  }
);
</script>

<style scoped>
.chat-panel-container {
  width: 350px; /* Largura do painel de chat */
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
  justify-content: flex-end; /* Alinha nossas mensagens à direita */
}

.my-message .message {
  background-color: rgb(var(--v-theme-primary)); /* Cor primária do tema */
  color: rgb(var(--v-theme-on-primary));
}

.message {
  max-width: 80%;
}
</style>
