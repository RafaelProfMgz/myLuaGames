<!-- Seu componente de menu aprimorado -->
<template>
  <div class="text-center">
    <v-menu open-on-hover location="bottom end" transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <!-- O ativador agora é um avatar, que é mais intuitivo para um menu de perfil -->
        <v-btn v-bind="props" icon variant="text">
          <v-avatar color="primary" size="20">
            <span v-if="user"></span>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <!-- O menu em si está dentro de um v-card para melhor estilo e elevação -->
      <v-card min-width="250" rounded="lg" class="mt-2">
        <v-list density="compact">
          <!-- Item de Cabeçalho: Exibe informações do usuário, não é clicável -->
          <v-list-item class="px-3">
            <template #prepend>
              <v-avatar color="primary" size="40">
                <span v-if="user" class="text-h6">{{
                  user.username.charAt(0).toUpperCase()
                }}</span>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{
              user?.username
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider class="my-1" />

        <!-- Ações do Usuário -->
        <v-list density="compact" nav>
          <v-list-item
            v-for="item in items"
            :key="item.action"
            :value="item.action"
            @click="handleAction(item.action)"
            color="primary"
            rounded="md"
            class="mx-2"
          >
            <template #prepend>
              <v-icon :icon="item.icon" size="20"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium text-body-2">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-1" />

        <!-- Ação de Logout, com estilo diferenciado para indicar uma ação final -->
        <v-list density="compact" nav>
          <v-list-item
            @click="handleAction('logout')"
            color="error"
            rounded="md"
            class="mx-2"
          >
            <template #prepend>
              <v-icon icon="mdi-logout" size="20" color="error"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium text-body-2 text-error"
              >Logout</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- O modal permanece o mesmo -->
    <UserProfileModal
      :is-open="isProfileModalOpen"
      :user="user"
      @close="isProfileModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import UserProfileModal from "../modals/UserProfileModal.vue";

const router = useRouter();
const appStore = useAppStore();

const isProfileModalOpen = ref(false);

const user = computed(() => appStore.user);

// A lista de itens agora contém apenas as ações "normais"
const items = [
  {
    title: "Ver Perfil",
    action: "profile",
    icon: "mdi-account-circle-outline",
  },
  // Adicione outras ações aqui, como "Configurações", "Ajuda", etc.
];

const handleAction = (action) => {
  if (action === "profile") {
    isProfileModalOpen.value = true;
  } else if (action === "logout") {
    logout();
  }
};

const logout = () => {
  appStore.logout();
  router.push("/login");
};
</script>
