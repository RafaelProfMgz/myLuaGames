import { ref, watch, computed, onMounted } from "vue";
import io from "socket.io-client";
import { useAppStore } from "@/stores/app";
import { useFriendStore } from "@/stores/friendStore";

const SOCKET_SERVER_URL = "http://localhost:3001";

export const socket = ref(null);

export const onlineUsers = ref([]);
export const generalChatMessages = ref([]);
export const privateChats = ref({});
export const activeChatId = ref("general");

export function initializeSocket() {
  const appStore = useAppStore();
  const friendStore = useFriendStore();

  if (socket.value && socket.value.connected) {
    return;
  }

  watch(
    () => appStore.user,
    (newUser) => {
      if (newUser && !socket.value) {
        socket.value = io(SOCKET_SERVER_URL);
        setupSocketListeners();
        friendStore.initializeFriendSocketListeners();
        socket.value.emit("user_connect", {
          id: newUser.id,
          name: newUser.name,
        });
      } else if (!newUser && socket.value) {
        socket.value.disconnect();
        socket.value = null;
        onlineUsers.value = [];
        generalChatMessages.value = [];
        privateChats.value = {};
        activeChatId.value = "general";
        friendStore.resetFriendStore();
      }
    },
    { immediate: true }
  );
}

function setupSocketListeners() {
  const appStore = useAppStore();

  if (!socket.value) return;

  socket.value.on("connect", () => {
    console.log("Conectado ao Socket.io!", socket.value.id);
  });

  socket.value.on("disconnect", () => {
    console.log("Desconectado do Socket.io.");
  });

  socket.value.on("connect_error", (error) => {
    console.error("Erro de conex o Socket.io:", error.message);
  });

  socket.value.on("chat_error", (message) => {
    console.error("Erro no chat:", message);
  });

  socket.value.on("online_users", (users) => {
    onlineUsers.value = users;
  });

  socket.value.on("chat_history", ({ chatId, messages }) => {
    if (chatId === "general") {
      generalChatMessages.value = messages;
    } else {
      if (!privateChats.value[chatId]) {
        privateChats.value[chatId] = { users: [], messages: [] };
      }
      privateChats.value[chatId].messages = messages;
    }
  });

  socket.value.on("new_message", ({ chatId, message }) => {
    if (chatId === "general") {
      generalChatMessages.value.push(message);
    } else if (privateChats.value[chatId]) {
      privateChats.value[chatId].messages.push(message);
    }
  });

  socket.value.on("private_chat_created", ({ chatId, users, messages }) => {
    privateChats.value[chatId] = { users, messages };
  });
}

export function sendMessage(chatId, messageContent) {
  const appStore = useAppStore();
  if (socket.value && socket.value.connected && appStore.user) {
    socket.value.emit("send_message", {
      chatId: chatId,
      userId: appStore.user.id,
      message: messageContent,
    });
  }
}

export function createPrivateChat(targetUserId) {
  if (socket.value && socket.value.connected) {
    socket.value.emit("create_private_chat", targetUserId);
  }
}
