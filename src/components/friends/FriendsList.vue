<!-- FriendsList.vue -->
<template>
  <v-card class="friends-list-container" elevation="12">
    <!-- CABEÇALHO -->
    <v-toolbar color="grey-darken-3">
      <v-toolbar-title>Amigos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="addFriendDialog = true">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn icon @click="emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- CAMPO DE PESQUISA -->
    <div class="pa-4">
      <v-text-field
        v-model="searchQuery"
        label="Procurar amigos"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        hide-details
        clearable
      ></v-text-field>
    </div>
    <v-divider></v-divider>

    <!-- ÁREA DA LISTA DE AMIGOS -->
    <div class="friends-list-scroll">
      <v-expansion-panels
        v-if="filteredFriends.length > 0"
        variant="accordion"
        v-model="panel"
      >
        <!-- Categoria Online -->
        <v-expansion-panel v-if="onlineFriends.length > 0" value="online">
          <v-expansion-panel-title>
            Online ({{ onlineFriends.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="friend in onlineFriends"
                :key="friend.id"
                :value="friend"
                color="primary"
                @click="openChat(friend)"
              >
                <template v-slot:prepend>
                  <v-badge
                    :color="getOnlineStatusColor(friend.id)"
                    dot
                    location="bottom end"
                    offset-x="3"
                    offset-y="3"
                  >
                    <v-avatar size="40">
                      <v-img :src="friend.avatar" :alt="friend.name"></v-img>
                    </v-avatar>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  friend.name
                }}</v-list-item-title>
                <v-list-item-subtitle
                  :style="{ color: friend.game ? '#86bde8' : '' }"
                >
                  {{ getStatusText(friend) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Categoria Offline -->
        <v-expansion-panel v-if="offlineFriends.length > 0" value="offline">
          <v-expansion-panel-title>
            Offline ({{ offlineFriends.length }})
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="friend in offlineFriends"
                :key="friend.id"
                :value="friend"
                class="friend-offline"
                @click="openChat(friend)"
              >
                <template v-slot:prepend>
                  <v-avatar size="40">
                    <v-img :src="friend.avatar" :alt="friend.name"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ friend.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  getStatusText(friend)
                }}</v-list-item-subtitle>
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
          >Nenhum amigo encontrado para "{{ searchQuery }}".</span
        >
        <span v-else
          >Sua lista de amigos está vazia.<br />Clique em
          <v-icon size="small">mdi-account-plus</v-icon> para adicionar.</span
        >
      </div>
    </div>

    <!-- MODAL PARA ADICIONAR NOVO AMIGO -->
    <v-dialog v-model="addFriendDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Adicionar Novo Amigo</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              v-model="newFriend.name"
              label="ID ou Nome do Amigo"
              :rules="[rules.required]"
              variant="outlined"
            ></v-text-field>
            <!-- O status não será mais definido pelo cliente, mas pelo servidor -->
            <!-- <v-select
              v-model="newFriend.status"
              :items="['online', 'offline']"
              label="Status"
              variant="outlined"
            ></v-select> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cancelAddFriend"
            >Cancelar</v-btn
          >
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="saveFriend"
            :disabled="!isFormValid"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import useChatSocket from "@/plugins/socket";

const emit = defineEmits(["close", "open-chat"]);
const panel = ref(["online"]); // Expande a categoria online por padrão
const searchQuery = ref("");
const friends = ref([]);
const addFriendDialog = ref(false);
const isFormValid = ref(false);
const form = ref(null);

const { onlineUsers } = useChatSocket(); // Obtém o estado onlineUsers do socket

const newFriend = ref({
  name: "",
  // status: "online", // Não será mais definido manualmente, mas pelo servidor
});

const openChat = (friend) => {
  emit("open-chat", friend);
};

const rules = {
  required: (value) => !!value || "Campo obrigatório.",
};

onMounted(() => {
  const storedFriends = localStorage.getItem("friendsList");
  if (storedFriends) {
    friends.value = JSON.parse(storedFriends);
  }
});

watch(
  friends,
  (newFriendsList) => {
    localStorage.setItem("friendsList", JSON.stringify(newFriendsList));
  },
  { deep: true }
);

const saveFriend = () => {
  if (!isFormValid.value) return;

  // Em um sistema real, você faria uma requisição para adicionar um amigo no backend
  // Por enquanto, simulamos aqui
  friends.value.push({
    id: newFriend.value.name.toLowerCase().replace(/\s/g, ""), // Usar o nome como ID simples para simulação
    name: newFriend.value.name,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    game: null, // O status será determinado pelo servidor
  });

  form.value.reset();
  newFriend.value.name = ""; // Limpa o nome para o próximo
  addFriendDialog.value = false;
};

const cancelAddFriend = () => {
  form.value.reset();
  newFriend.value.name = "";
  addFriendDialog.value = false;
};

// Funções para filtrar e ordenar a lista de amigos, agora com base no `onlineUsers` do socket
const filteredFriends = computed(() => {
  if (!searchQuery.value) return friends.value;
  return friends.value.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const onlineFriends = computed(() => {
  return filteredFriends.value
    .filter((f) => onlineUsers.value[f.id] === "online") // Verifica o status do socket
    .sort((a, b) => a.name.localeCompare(b.name));
});

const offlineFriends = computed(() => {
  return filteredFriends.value
    .filter((f) => onlineUsers.value[f.id] !== "online") // Considera offline se não estiver explicitamente 'online'
    .sort((a, b) => a.name.localeCompare(b.name));
});

const getStatusText = (friend) => {
  // Se o amigo tem um jogo, exibe isso. Caso contrário, exibe o status de online/offline.
  if (friend.game) return `Jogando ${friend.game}`;
  return onlineUsers.value[friend.id] === "online" ? "Online" : "Offline";
};

const getOnlineStatusColor = (friendId) => {
  return onlineUsers.value[friendId] === "online" ? "success" : "grey";
};
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
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}
.friend-offline {
  opacity: 0.6;
}
</style>
