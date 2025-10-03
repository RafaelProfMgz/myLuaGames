<template>
  <!-- O v-layout já atua como um bom container. Removemos o v-card externo
       para usar a cor de fundo ('background') da tela principal de forma mais eficaz. -->
  <v-layout>
    <!-- Aplicamos a cor 'surface' ao drawer para que ele se destaque do fundo.
         A propriedade 'elevation' adiciona uma sombra sutil, criando profundidade. -->
    <v-navigation-drawer permanent absolute color="surface" elevation="2">
      <!-- Título da Aplicação com a cor primária para destaque -->
      <v-list-item class="pa-4">
        <v-list-item-title class="text-h6 font-weight-bold text-primary">
          MyLuaGames
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <!-- Informações do Usuário -->
      <v-list v-if="user">
        <!-- Adicionamos mais espaçamento vertical (py-3) para um visual menos apertado -->
        <v-list-item
          class="px-4 py-3"
          prepend-icon="mdi-account-circle"
          :subtitle="user.email"
          lines="two"
        >
          <v-list-item-title class="font-weight-bold text-on-surface">
            {{ user.username }}
          </v-list-item-title>

          <template #append>
            <DropMenuHover />
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <!-- Itens de Navegação -->
      <!-- 'nav' já aplica estilos apropriados, mas podemos refinar o espaçamento -->
      <v-list density="compact" nav class="pa-2">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item.value"
          :to="item.value"
          color="primary"
          rounded="lg"
        >
          <template #prepend>
            <!-- A cor do ícone será herdada da cor do texto, garantindo consistência -->
            <v-icon :icon="item.icon" />
          </template>
          <!-- A classe 'font-weight-medium' dá um pouco mais de peso aos itens de menu -->
          <v-list-item-title v-text="item.text" class="font-weight-medium" />
        </v-list-item>
      </v-list>

      <!-- Posicionamos o seletor de tema na parte inferior do drawer
           usando um template #append para um alinhamento limpo. -->
      <template #append>
        <div class="pa-4 d-flex justify-center">
          <SelectTheme />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Aplicamos a cor 'background' ao v-main para que a área de conteúdo
         tenha a cor de fundo correta do tema. -->
    <v-main style="height: 90vh" class="bg-background" />
  </v-layout>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";
import DropMenuHover from "../ui/DropMenuHover.vue";
import SelectTheme from "../ui/SelectTheme.vue";

const appStore = useAppStore();
const user = computed(() => appStore.user);

const items = [
  { text: "Home", icon: "mdi-view-dashboard-outline", value: "/home" },
  {
    text: "Meus jogos",
    icon: "mdi-gamepad-variant-outline",
    value: "/games",
  },
  { text: "Concluídos", icon: "mdi-trophy-outline", value: "/completed" },
];
</script>
