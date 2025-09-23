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
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="handleAction(item.title)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const items = [
  { title: "Perfil", action: "profile" },
  { title: "Notificações", action: "notifications" },
  { title: "Configurações", action: "settings" },
  { title: "Logout", action: "logout" },
];

const handleAction = (actionTitle) => {
  if (actionTitle === "Logout") {
    logout();
  } else {
    // Lógica para outras ações, como navegar para a página de perfil
    console.log(`Clicou em ${actionTitle}`);
    // Exemplo de navegação: router.push('/profile');
  }
};

const logout = () => {
  // 1. Remove o token do localStorage
  localStorage.removeItem("auth_token");

  // 2. Redireciona o usuário para a página de login
  router.push("/login/Login");

  console.log("Usuário deslogado com sucesso!");
};
</script>
