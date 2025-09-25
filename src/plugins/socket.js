// plugins/socket.js

import { ref, watch } from "vue"; // Importa ref e watch para reatividade no Vue 3
// REMOVA ESTA LINHA: import Vue from "vue"; // Não é necessário importar Vue diretamente no Vue 3 para este caso
// REMOVA ESTA LINHA: import VueSocketIOExtended from "vue-socket.io-extended"; // O plugin será usado no main.js
import io from "socket.io-client";

// REMOVA ESTA LINHA: Vue.use(VueSocketIOExtended, socket); // Isto é sintaxe Vue 2

// URL do seu backend Socket.IO (Glitch ou local)
const SOCKET_SERVER_URL = "https://chatmessage-de0t.onrender.com"; // Altere para a URL do seu Glitch quando hospedar

// A instância do socket
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // Desabilitar conexão automática
});

// Reativos para estado do socket
const isConnected = ref(false);
const userId = ref(localStorage.getItem("myUserId") || null); // Seu próprio ID de usuário
const onlineUsers = ref({}); // { userId: 'online' | 'offline' }
const currentChatHistory = ref({}); // { friendId: [{ senderId, text, timestamp }] }

// Eventos de Socket.IO
socket.on("connect", () => {
  isConnected.value = true;
  console.log("Conectado ao servidor Socket.IO");
  if (userId.value) {
    socket.emit("registerUser", userId.value);
  }
});

socket.on("disconnect", () => {
  isConnected.value = false;
  console.log("Desconectado do servidor Socket.IO");
});

socket.on("connect_error", (err) => {
  console.error("Erro de conexão Socket.IO:", err.message);
});

// Quando o servidor informa que um usuário mudou de status
socket.on("userStatusUpdate", ({ userId: updatedUserId, status }) => {
  onlineUsers.value[updatedUserId] = status;
  console.log(`Usuário ${updatedUserId} está ${status}`);
});

// Quando o servidor envia o histórico de chat para um amigo específico
socket.on("chatHistory", ({ friendId, history }) => {
  currentChatHistory.value[friendId] = history;
  console.log(`Histórico de chat recebido para ${friendId}`);
});

// Quando uma nova mensagem privada é recebida (para mim ou de mim)
socket.on("privateMessageReceived", ({ friendId, message }) => {
  if (!currentChatHistory.value[friendId]) {
    currentChatHistory.value[friendId] = [];
  }
  currentChatHistory.value[friendId].push(message);
  console.log(`Nova mensagem para ${friendId}:`, message);
});

socket.on("chatError", (errorMessage) => {
  console.error("[Chat Error]:", errorMessage);
  // Você pode exibir um v-snackbar aqui no frontend
});

// Observa o userId e tenta registrar novamente se mudar
watch(userId, (newId) => {
  if (newId) {
    localStorage.setItem("myUserId", newId);
    if (isConnected.value) {
      socket.emit("registerUser", newId);
    }
  } else {
    localStorage.removeItem("myUserId");
  }
});

// Função para conectar
const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Função para definir o ID do usuário (chamado do seu componente principal)
const setMyUserId = (id) => {
  userId.value = id;
};

// Função para enviar mensagem privada
const sendPrivateMessage = (targetUserId, message) => {
  if (isConnected.value && userId.value) {
    socket.emit("privateMessage", { targetUserId, message });
  } else {
    console.error("Não conectado ou userId não definido.");
  }
};

// Função para solicitar histórico de chat
const requestChatHistory = (friendId) => {
  if (isConnected.value && userId.value) {
    socket.emit("requestChatHistory", {
      userId1: userId.value,
      userId2: friendId,
    });
  } else {
    console.error(
      "Não conectado ou userId não definido para solicitar histórico."
    );
  }
};

// Exportar reativos e funções para uso nos componentes Vue (Composition API)
export default function useChatSocket() {
  return {
    socket, // A instância do socket também é retornada para fácil acesso
    isConnected,
    userId,
    onlineUsers,
    currentChatHistory,
    connectSocket,
    setMyUserId,
    sendPrivateMessage,
    requestChatHistory,
  };
}

// Conectar ao montar o aplicativo (se houver userId no localStorage)
// Isso só será executado se o arquivo for importado (e portanto avaliado)
// Pode ser melhor chamar connectSocket() explicitamente no seu componente de login
// ou no mounted do seu App.vue, após definir o userId.
if (userId.value) {
  connectSocket();
}
