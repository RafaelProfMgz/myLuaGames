<!-- FriendsList.vue -->
<template>
  <v-card class="friends-list-container" elevation="12">
    <!-- CABEÇALHO -->
    <v-toolbar color="grey-darken-3">
      <v-toolbar-title>Usuários</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- O botão de adicionar amigos foi desabilitado pois agora a lista vem do servidor.
           Para adicionar um amigo, seria necessário um evento de socket ou uma chamada de API. -->
      <!-- <v-btn icon @click="addFriendDialog = true">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn> -->
      <v-btn icon @click="emit('close')">
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
        v-if="filteredUsers.length > 0"
        variant="accordion"
        v-model="panel"
      >
        <!-- Categoria Online -->
        <v-expansion-panel v-if="onlineUsers.length > 0" value="online">
          <v-expansion-panel-title>
            Online ({{ onlineUsers.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="user in onlineUsers"
                :key="user.id"
                :value="user"
                color="primary"
                @click="openChat(user)"
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
                      <!-- O objeto de usuário do servidor não tem 'avatar', então usamos a inicial do nome -->
                      <span>{{ user.username.charAt(0).toUpperCase() }}</span>
                    </v-avatar>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  user.username
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ user.status }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Categoria Offline -->
        <v-expansion-panel v-if="offlineUsers.length > 0" value="offline">
          <v-expansion-panel-title>
            Offline ({{ offlineUsers.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="user in offlineUsers"
                :key="user.id"
                :value="user"
                class="friend-offline"
                @click="openChat(user)"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <span>{{ user.username.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.status }}</v-list-item-subtitle>
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
import { ref, computed } from "vue";
import useChatSocket from "@/plugins/socket"; // Verifique se o caminho está correto

const emit = defineEmits(["close", "open-chat"]);

// Obtém a lista de usuários em tempo real do nosso composable
const { allUsersList } = useChatSocket();

const panel = ref(["online"]); // Expande a categoria online por padrão
const searchQuery = ref("");

const openChat = (user) => {
  emit("open-chat", user);
};

// --- Computeds para filtrar e organizar a lista de usuários ---

// 1. Filtra a lista completa de usuários com base na busca
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return allUsersList.value;
  }
  return allUsersList.value.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 2. Pega os usuários filtrados e separa os que estão online
const onlineUsers = computed(() => {
  return filteredUsers.value
    .filter((user) => user.status === "online")
    .sort((a, b) => a.username.localeCompare(b.username));
});

// 3. Pega os usuários filtrados e separa os que estão offline
const offlineUsers = computed(() => {
  return filteredUsers.value
    .filter((user) => user.status !== "online")
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
}
.friends-list-scroll {
  flex-grow: 1;
  overflow-y: auto;
}
/* Garante que o conteúdo dentro do painel não tenha padding extra */
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
.friend-offline {
  opacity: 0.6;
}
</style>
