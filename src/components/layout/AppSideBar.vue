<template>
  <v-card class="mx-auto" width="256">
    <v-layout>
      <v-navigation-drawer absolute permanent>
        <v-list>
          <v-list-item
            prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
            subtitle="john@google.com"
            title="John Leider"
          >
            <template v-slot:append>
              <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list :lines="false" density="compact" nav>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item.value"
            color="primary"
            :to="`${item.value}`"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 354px"></v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
const items = reactive([
  { text: "Home", icon: "mdi-home", value: "/" },
  { text: "Meus jogos", icon: "mdi-folder", value: "/games/AppGames" },
  {
    text: "Amigos",
    icon: "mdi-account-multiple",
    value: "/friends/AppFriends",
  },
  { text: "Favoritos", icon: "mdi-star", value: "AppFavorites" },
  { text: "Histórico", icon: "mdi-history", value: "/hystory/AppHistory" },
  {
    text: "Concluídos",
    icon: "mdi-check-circle",
    value: "completed/AppCompleted",
  },
]);
</script>
