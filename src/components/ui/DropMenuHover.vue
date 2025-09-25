<!-- Seu componente de menu -->
<template>
  <div class="text-center">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-menu-down"
          size="small"
          variant="text"
        ></v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.action"
          :value="item.action"
          @click="handleAction(item.action)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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

const items = [
  { title: "Perfil", action: "profile", icon: "mdi-account-circle" },
  { title: "Logout", action: "logout", icon: "mdi-logout" },
];

const handleAction = (action) => {
  if (action === "profile") {
    isProfileModalOpen.value = true;
  } else if (action === "logout") {
    logout();
  }
};

// Função de logout que usa a store
const logout = () => {
  appStore.logout();

  router.push("/login");
};
</script>
