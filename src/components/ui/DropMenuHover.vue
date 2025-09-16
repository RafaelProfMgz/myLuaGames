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
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script setup>
const items = [
  { title: "Perfil" },
  { title: "Notificações" },
  { title: "Configurações" },
  { title: "Logout" },
];
</script>
