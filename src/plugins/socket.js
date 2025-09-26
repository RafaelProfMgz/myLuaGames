import { ref, watch, computed, onMounted } from "vue"; // onMounted foi importado
import io from "socket.io-client";
import { useAppStore } from "@/stores/app";

// --- Constantes de configuração ---
const SOCKET_SERVER_URL = "https://chatmessage-de0t.onrender.com";
// A URL base para as chamadas de API (rotas GET/POST)
const API_BASE_URL = "https://chatmessage-de0t.onrender.com";

// --- Instância única do Socket ---
// Definido fora da função para que haja apenas uma conexão,
// mesmo que o composable seja usado em vários componentes.
const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // Conectaremos manualmente
});

// --- O Composable ---
export default function useChatSocket() {
  // --- Estado Reativo ---
  const appStore = useAppStore();
  const user = computed(() => appStore.user);
  const userId = computed(() => user.value?.id);

  const isConnected = ref(false);
  const allUsersList = ref([]); // NOVA: Armazena a lista de todos os usuários
  const currentChatHistory = ref({});

  // --- Funções ---

  // Busca a lista completa de usuários da nossa API
  const fetchAllUsers = async () => {
    if (!userId.value) return; // Garante que só busca se houver um usuário logado
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) throw new Error("Falha ao buscar a lista de usuários.");

      const users = await response.json();
      // Filtra o próprio usuário para não aparecer na lista de contatos
      allUsersList.value = users.filter((u) => u.id !== userId.value);
    } catch (error) {
      console.error("Erro ao carregar lista de usuários:", error);
      allUsersList.value = []; // Limpa a lista em caso de erro
    }
  };

  const connectSocket = () => {
    // Conecta apenas se houver um ID de usuário e não estiver conectado
    if (userId.value && !socket.connected) {
      console.log("Tentando conectar ao socket...");
      socket.connect();
    }
  };

  const sendPrivateMessage = (targetUserId, message) => {
    if (isConnected.value && userId.value) {
      socket.emit("privateMessage", { targetUserId, message });
    }
  };

  const requestChatHistory = (friendId) => {
    if (isConnected.value && userId.value) {
      socket.emit("requestChatHistory", { targetUserId: friendId });
    }
  };

  // --- Gerenciamento de Eventos do Socket ---

  socket.on("connect", () => {
    isConnected.value = true;
    console.log(`Socket conectado com ID: ${socket.id}`);
    // Informa ao servidor que este usuário está online
    if (userId.value) {
      socket.emit("userGoesOnline", userId.value);
    }
  });

  socket.on("disconnect", () => {
    isConnected.value = false;
    console.log("Socket desconectado.");
  });

  socket.on("connect_error", (err) => {
    console.error("Erro de conexão Socket.IO:", err.message);
  });

  socket.on("userStatusUpdate", ({ userId: updatedUserId, status }) => {
    // Encontra o usuário na nossa lista principal e atualiza seu status
    const userToUpdate = allUsersList.value.find((u) => u.id === updatedUserId);
    if (userToUpdate) {
      userToUpdate.status = status;
    }
  });

  socket.on("chatHistory", ({ friendId, history }) => {
    currentChatHistory.value[friendId] = history;
  });

  socket.on("privateMessageReceived", ({ friendId, message }) => {
    if (!currentChatHistory.value[friendId]) {
      currentChatHistory.value[friendId] = [];
    }
    currentChatHistory.value[friendId].push(message);
  });

  socket.on("chatError", (errorMessage) => {
    console.error("[Chat Error]:", errorMessage);
  });

  // --- Ciclo de Vida e Watchers ---

  // Observa mudanças no estado de login do usuário
  watch(
    user,
    (currentUser, previousUser) => {
      // Se o usuário logou (de null para um objeto com id)
      if (currentUser?.id && !previousUser) {
        fetchAllUsers(); // Busca a lista de contatos
        connectSocket(); // Conecta ao socket
      }
      // Se o usuário deslogou
      else if (!currentUser && previousUser) {
        socket.disconnect();
        allUsersList.value = []; // Limpa a lista de usuários
      }
    },
    { immediate: true } // 'immediate' executa o watch assim que o composable é usado
  );

  // --- Retorno do Composable ---
  // Expondo as variáveis e funções para serem usadas nos componentes
  return {
    socket,
    isConnected,
    userId,
    allUsersList, // Exportando a nova lista de usuários
    currentChatHistory,
    connectSocket,
    sendPrivateMessage,
    requestChatHistory,
    fetchAllUsers, // Exportando a função para poder recarregar manualmente se necessário
  };
}
