<template>
  <v-card class="friends-list-container" elevation="12">
    <v-toolbar color="grey-darken-3">
      <v-toolbar-title>Usuários</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="emit('close')" aria-label="Fechar lista de amigos">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <div class="pa-4">
      <v-text-field
        v-model="searchQuery"
        label="Procurar usuários"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        hide-details
        clearable
      ></v-text-field>
    </div>

    <v-divider></v-divider>

    <div class="friends-list-scroll">
      <v-expansion-panels
        v-if="
          friendRequestsReceived.length > 0 ||
          filteredOnlineFriends.length > 0 ||
          filteredOfflineFriends.length > 0 ||
          filteredPotentialFriends.length > 0
        "
        variant="accordion"
        v-model="panel"
      >
        <!-- Pedidos de Amizade Recebidos -->
        <v-expansion-panel
          v-if="friendRequestsReceived.length > 0"
          value="requests-received"
        >
          <v-expansion-panel-title>
            Pedidos Recebidos ({{ friendRequestsReceived.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="request in friendRequestsReceived"
                :key="request.id"
              >
                <template v-slot:prepend>
                  <v-avatar size="40" color="orange">
                    <span>{{
                      request.senderName.charAt(0).toUpperCase()
                    }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  request.senderName
                }}</v-list-item-title>
                <v-list-item-subtitle> Enviou um pedido </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    icon="mdi-check"
                    size="small"
                    color="success"
                    variant="tonal"
                    class="mr-2"
                    @click="acceptFriend(request.senderId)"
                    aria-label="Aceitar pedido"
                  ></v-btn>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    color="error"
                    variant="tonal"
                    @click="rejectFriend(request.senderId)"
                    aria-label="Rejeitar pedido"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Amigos Online -->
        <v-expansion-panel
          v-if="filteredOnlineFriends.length > 0"
          value="online"
        >
          <v-expansion-panel-title>
            Online ({{ filteredOnlineFriends.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="friend in filteredOnlineFriends"
                :key="friend.id"
                :value="friend.id"
                color="primary"
                @click="openChat(friend)"
              >
                <template v-slot:prepend>
                  <v-badge
                    dot
                    color="success"
                    location="bottom end"
                    offset-x="3"
                    offset-y="3"
                  >
                    <v-avatar size="40" color="info">
                      <span>{{ friend.username.charAt(0).toUpperCase() }}</span>
                    </v-avatar>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  friend.username
                }}</v-list-item-title>
                <v-list-item-subtitle> Online </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    icon="mdi-chat"
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="mr-2"
                    @click.stop="openChat(friend)"
                    aria-label="Abrir chat"
                  ></v-btn>
                  <v-btn
                    icon="mdi-close-circle"
                    size="small"
                    variant="tonal"
                    color="error"
                    @click.stop="removeFriend(friend.id)"
                    aria-label="Remover amigo"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Amigos Offline -->
        <v-expansion-panel
          v-if="filteredOfflineFriends.length > 0"
          value="offline"
        >
          <v-expansion-panel-title>
            Offline ({{ filteredOfflineFriends.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="friend in filteredOfflineFriends"
                :key="friend.id"
                :value="friend.id"
                class="friend-offline"
                @click="openChat(friend)"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <span>{{ friend.username.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ friend.username }}</v-list-item-title>
                <v-list-item-subtitle>Offline</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    icon="mdi-chat"
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="mr-2"
                    @click.stop="openChat(friend)"
                    aria-label="Abrir chat"
                  ></v-btn>
                  <v-btn
                    icon="mdi-close-circle"
                    size="small"
                    variant="tonal"
                    color="error"
                    @click.stop="removeFriend(friend.id)"
                    aria-label="Remover amigo"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Adicionar Amigos (Potenciais) -->
        <v-expansion-panel
          v-if="filteredPotentialFriends.length > 0"
          value="add-friends"
        >
          <v-expansion-panel-title>
            Adicionar Amigos ({{ filteredPotentialFriends.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="user in filteredPotentialFriends"
                :key="user.id"
                :value="user.id"
              >
                <template v-slot:prepend>
                  <v-avatar size="40" color="indigo">
                    <span>{{ user.name.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  user.name
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ user.isOnline ? "Online" : "Offline" }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    icon="mdi-account-plus"
                    size="small"
                    color="success"
                    variant="tonal"
                    @click="sendFriendRequest(user.id)"
                    aria-label="Enviar pedido de amizade"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div
        v-else
        class="text-center pa-8 text-grey d-flex flex-column align-center"
      >
        <v-icon size="48" class="mb-4">mdi-account-multiple-outline</v-icon>
        <span v-if="searchQuery"
          >Nenhum usuário encontrado para "{{ searchQuery }}".</span
        >
        <span v-else>Nenhum usuário disponível.</span>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { useFriendStore } from "@/stores/friendStore";
import { ref, computed, watch } from "vue";
import { createPrivateChat } from "@/plugins/socket";

const friendStore = useFriendStore();
const emit = defineEmits(["close", "open-chat"]);

const searchQuery = ref("");
const panel = ref(["online", "requests-received"]); // Painéis expandidos por padrão

// Computed properties do FriendStore
const allFriendsWithStatus = computed(() => friendStore.getFriendsWithStatus);
const friendRequestsReceived = computed(
  () => friendStore.friendRequestsReceived
);
const potentialFriends = computed(() => friendStore.getPotentialFriends);

// Filtra amigos online/offline
const filteredOnlineFriends = computed(() => {
  return allFriendsWithStatus.value.filter(
    (friend) =>
      friend.isOnline &&
      friend.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredOfflineFriends = computed(() => {
  return allFriendsWithStatus.value.filter(
    (friend) =>
      !friend.isOnline &&
      friend.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Filtra potenciais amigos
const filteredPotentialFriends = computed(() => {
  return potentialFriends.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const openChat = (friend) => {
  createPrivateChat(friend.id); // Avisa o socket para iniciar/obter o chat privado

  emit("open-chat", friend);
};

// Funções para interação com amigos via friendStore actions
const sendFriendRequest = (receiverId) => {
  friendStore.sendFriendRequest(receiverId);
};

const acceptFriend = (senderId) => {
  friendStore.acceptFriendRequest(senderId);
};

const rejectFriend = (senderId) => {
  friendStore.rejectFriendRequest(senderId);
};

const removeFriend = (friendId) => {
  friendStore.removeFriend(friendId);
};

// Se você quiser que o painel de "Pedidos Recebidos" esteja sempre aberto se houver pedidos
watch(
  friendRequestsReceived,
  (newVal) => {
    if (newVal.length > 0 && !panel.value.includes("requests-received")) {
      panel.value.push("requests-received");
    } else if (
      newVal.length === 0 &&
      panel.value.includes("requests-received")
    ) {
      panel.value = panel.value.filter((p) => p !== "requests-received");
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.friends-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.friends-list-scroll {
  flex-grow: 1;
  overflow-y: auto;
}

.friend-offline .v-list-item-title,
.friend-offline .v-list-item-subtitle {
  color: grey;
}
</style>
