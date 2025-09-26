import { ref, watch, computed, onMounted } from "vue";
import io from "socket.io-client";
import { useAppStore } from "@/stores/app";
import { useFriendStore } from "@/stores/friendStore";

const SOCKET_SERVER_URL = "https://chatmessage-de0t.onrender.com";
const API_BASE_URL = "https://chatmessage-de0t.onrender.com";

const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function useChatSocket() {
  const appStore = useAppStore();
  const friendStore = useFriendStore();

  const user = computed(() => appStore.user);
  const userId = computed(() => user.value?.id);

  const allSockets = ref({}); // Pode ser mantido local ou movido para Pinia se necessário globalmente
  const allUsersInSocket = ref([]); // Pode ser mantido local ou movido para Pinia se necessário globalmente

  const fetchAllUsers = async () => {
    if (!userId.value) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) throw new Error("Falha ao buscar a lista de usuários.");

      const users = await response.json();
      // Filtra o próprio usuário e salva na store Pinia
      friendStore.setAllFriends(users.filter((u) => u.id !== userId.value));
    } catch (error) {
      console.error("Erro ao carregar lista de usuários:", error);
      friendStore.setAllFriends([]); // Limpa a lista em caso de erro
    }
  };

  const connectSocket = () => {
    // Usa o estado de conexão da store Pinia
    if (userId.value && !friendStore.getIsConnected) {
      console.log("Tentando conectar ao socket...");
      socket.connect();
    }
  };

  const sendPrivateMessage = (targetUserId, message) => {
    // Usa o estado de conexão da store Pinia
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("privateMessage", { targetUserId, message });
    }
  };

  const sendPublicMessage = (message) => {
    // Usa o estado de conexão da store Pinia
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("publicMessage", { message });
    }
  };

  const joinRoom = (roomId) => {
    // Usa o estado de conexão da store Pinia
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("joinRoom", { roomId });
    }
  };

  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  const userGoesOnline = () => {
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("userGoesOnline", userId.value);
    }
  };

  const userGoesOffline = () => {
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("userGoesOffline", userId.value);
    }
  };

  const requestChatHistory = (friendId) => {
    if (friendStore.getIsConnected && userId.value) {
      socket.emit("requestChatHistory", { targetUserId: friendId });
    }
  };

  // --- Socket Event Handlers ---
  socket.on("connect", () => {
    friendStore.setIsConnected(true); // Atualiza o estado na store
    console.log(`Socket conectado com ID: ${socket.id}`);
    if (userId.value) {
      socket.emit("userGoesOnline", userId.value);
    }
  });

  socket.on("disconnect", () => {
    friendStore.setIsConnected(false); // Atualiza o estado na store
    console.log("Socket desconectado.");
  });

  socket.on("connect_error", (err) => {
    console.error("Erro de conexão Socket.IO:", err.message);
  });

  socket.on("userStatusUpdate", ({ userId: updatedUserId, status }) => {
    friendStore.updateFriendStatus({ userId: updatedUserId, status }); // Usa a action da store
  });

  socket.on("chatHistory", ({ friendId, history }) => {
    friendStore.setChatHistory({ friendId, history }); // Usa a action da store
  });

  socket.on("privateMessageReceived", ({ friendId, message }) => {
    friendStore.addMessageToChatHistory({ friendId, message }); // Usa a action da store
  });

  socket.on("chatError", (errorMessage) => {
    console.error("[Chat Error]:", errorMessage);
  });

  socket.on("allUsersInSocket", (users) => {
    allUsersInSocket.value = users;
  });

  socket.on("allSockets", (sockets) => {
    allSockets.value = sockets;
  });

  // --- Watcher para o usuário autenticado ---
  watch(
    user,
    (currentUser, previousUser) => {
      if (currentUser?.id && !previousUser) {
        // Usuário logou
        fetchAllUsers();
        connectSocket();
      } else if (!currentUser && previousUser) {
        // Usuário fez logout
        socket.disconnect();
        friendStore.clearFriendsState(); // Limpa a store Pinia ao fazer logout
      }
    },
    { immediate: true }
  );

  return {
    socket,
    userId,
    allSockets, // Mantido aqui se for usado apenas localmente
    allUsersInSocket, // Mantido aqui se for usado apenas localmente
    connectSocket,
    sendPrivateMessage,
    requestChatHistory,
    fetchAllUsers,
    disconnectSocket, // Adicionei este retorno para controle explícito
    userGoesOnline,
    userGoesOffline,
    sendPublicMessage,
    joinRoom,
  };
}
