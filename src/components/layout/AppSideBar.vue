<template>
  <v-card class="mx-auto" width="256">
    <v-layout>
      <v-navigation-drawer absolute permanent>
        <v-list>
          <v-list-item
            v-if="user"
            :prepend-icon="'mdi-account-circle'"
            :subtitle="user.email"
            :title="user.username"
          >
            <template v-slot:append>
              <DropMenuHover />
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

      <v-main style="height: 100vh"></v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";
import DropMenuHover from "../ui/DropMenuHover.vue";

const appStore = useAppStore();

const user = computed(() => appStore.user);

const items = [
  { text: "Home", icon: "mdi-home", value: "/home" },
  { text: "Meus jogos", icon: "mdi-folder", value: "/games" },
  {
    text: "Concluídos",
    icon: "mdi-check-circle",
    value: "/completed",
  },
];
</script>
