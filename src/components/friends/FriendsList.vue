<!-- FriendsList.vue -->
<template>
  <v-card class="friends-list-container" elevation="12">
    <!-- CABEÇALHO -->
    <v-toolbar color="grey-darken-3">
      <v-toolbar-title>Usuários</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="emit('close')" aria-label="Fechar lista de amigos">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- CAMPO DE PESQUISA -->
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

    <!-- ÁREA DA LISTA DE USUÁRIOS -->
    <div class="friends-list-scroll">
      <v-expansion-panels
        v-if="
          filteredOnlineFriends.length > 0 || filteredOfflineFriends.length > 0
        "
        variant="accordion"
        v-model="panel"
      >
        <!-- Categoria Online -->
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
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Categoria Offline -->
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
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- MENSAGEM DE LISTA VAZIA -->
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
import { ref, computed } from "vue";

const emit = defineEmits(["close", "open-chat"]);

const friendStore = useFriendStore(); // Inicializa a store

const panel = ref(["online"]);
const searchQuery = ref("");

const openChat = (friend) => {
  emit("open-chat", friend);
};

// Usa os getters da store Pinia e aplica a filtragem e ordenação
const allFriendsFromStore = computed(() => friendStore.allFriends);

const filteredFriends = computed(() => {
  if (!searchQuery.value) {
    return allFriendsFromStore.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allFriendsFromStore.value.filter((friend) =>
    friend.username.toLowerCase().includes(query)
  );
});

const filteredOnlineFriends = computed(() => {
  return filteredFriends.value
    .filter((friend) => friend.status === "online")
    .sort((a, b) => a.username.localeCompare(b.username));
});

const filteredOfflineFriends = computed(() => {
  return filteredFriends.value
    .filter((friend) => friend.status !== "online")
    .sort((a, b) => a.username.localeCompare(b.username));
});
</script>

<style scoped>
.friends-list-container {
  height: 400px;
  width: 350px;
  max-height: 70vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(
    --v-theme-surface
  ); /* Garante que o fundo seja temático */
}
.friends-list-scroll {
  flex-grow: 1;
  overflow-y: auto;
}

/* Ajuste para remover padding extra do Vuetify expansion panel text */
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
.friend-offline {
  opacity: 0.7; /* Suavemente mais transparente */
}
</style>
