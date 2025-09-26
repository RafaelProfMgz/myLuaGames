import { ref, watch, computed } from "vue";
import io from "socket.io-client";
import { useAppStore } from "@/stores/app";

const SOCKET_SERVER_URL = "https://chatmessage-de0t.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});
const appStore = useAppStore();

const user = computed(() => appStore.user);
const userIdCoocki = computed(() => user.value?.id);

const isConnected = ref(false);
const userId = userIdCoocki;
const onlineUsers = ref({});
const currentChatHistory = ref({});

socket.on("connect", () => {
  isConnected.value = true;
  if (userId.value) {
    socket.emit("registerUser", userId.value);
  }
});

socket.on("disconnect", () => {
  isConnected.value = false;
});

socket.on("connect_error", (err) => {
  console.error("Erro de conexão Socket.IO:", err.message);
});

socket.on("userStatusUpdate", ({ userId: updatedUserId, status }) => {
  onlineUsers.value[updatedUserId] = status;
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

const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

const setMyUserId = (id) => {
  userId.value = id;
};

const sendPrivateMessage = (targetUserId, message) => {
  if (isConnected.value && userId.value) {
    socket.emit("privateMessage", { targetUserId, message });
  }
};

const requestChatHistory = (friendId) => {
  if (isConnected.value && userId.value) {
    socket.emit("requestChatHistory", {
      userId1: userId.value,
      userId2: friendId,
    });
  }
};

export default function useChatSocket() {
  return {
    socket,
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

if (userId.value) {
  connectSocket();
}
