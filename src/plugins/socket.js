import { ref, watch, computed, onMounted } from "vue";
import io from "socket.io-client";
import { useAppStore } from "@/stores/app";

const SOCKET_SERVER_URL = "https://chatmessage-de0t.onrender.com";
const API_BASE_URL = "https://chatmessage-de0t.onrender.com";

const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function useChatSocket() {
  const appStore = useAppStore();
  const user = computed(() => appStore.user);
  const userId = computed(() => user.value?.id);

  const isConnected = ref(false);
  const allUsersList = ref([]);
  const currentChatHistory = ref({});

  const fetchAllUsers = async () => {
    if (!userId.value) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      if (!response.ok) throw new Error("Falha ao buscar a lista de usuários.");

      const users = await response.json();
      allUsersList.value = users.filter((u) => u.id !== userId.value);
    } catch (error) {
      console.error("Erro ao carregar lista de usuários:", error);
      allUsersList.value = [];
    }
  };

  const connectSocket = () => {
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

  socket.on("connect", () => {
    isConnected.value = true;
    console.log(`Socket conectado com ID: ${socket.id}`);
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

  watch(
    user,
    (currentUser, previousUser) => {
      if (currentUser?.id && !previousUser) {
        fetchAllUsers();
        connectSocket();
      } else if (!currentUser && previousUser) {
        socket.disconnect();
        allUsersList.value = [];
      }
    },
    { immediate: true }
  );

  return {
    socket,
    isConnected,
    userId,
    allUsersList,
    currentChatHistory,
    connectSocket,
    sendPrivateMessage,
    requestChatHistory,
    fetchAllUsers,
  };
}
