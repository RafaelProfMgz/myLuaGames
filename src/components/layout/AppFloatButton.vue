<template>
  <!-- Botão FAB de Pesquisa -->
  <v-btn
    class="float-button"
    color="primary"
    icon="mdi-magnify"
    size="large"
    elevation="8"
    @click="dialog = true"
  ></v-btn>

  <!-- Diálogo de Pesquisa -->
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <v-card class="d-flex flex-column" style="height: 550px">
      <v-toolbar color="primary" flat>
        <v-toolbar-title class="text-h6">Navegar para...</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-text-field
          v-model="searchQuery"
          label="O que você está procurando?"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          autofocus
          hide-details
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Lista de Rotas -->
      <div class="flex-grow-1" style="overflow-y: auto">
        <v-list v-if="filteredRoutes.length > 0">
          <v-list-item
            v-for="route in filteredRoutes"
            :key="route.name"
            @click="navigateTo(route.name)"
          >
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-2">
                <v-icon>{{ route.icon || "mdi-file-document-outline" }}</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>{{ route.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ route.path }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <!-- Mensagem de "Nenhum resultado" -->
        <div v-else class="text-center text-grey pa-8">
          Nenhuma rota encontrada.
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const dialog = ref(false);
const searchQuery = ref("");
const router = useRouter();

const availableRoutes = computed(() => {
  return router
    .getRoutes()
    .filter((route) => route.meta && route.meta.searchable)
    .map((route) => ({
      name: route.name,
      path: route.path,
      title: route.meta.title || route.name,
      icon: route.meta.icon,
    }));
});

const filteredRoutes = computed(() => {
  if (!searchQuery.value) {
    return availableRoutes.value;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return availableRoutes.value.filter((route) =>
    route.title.toLowerCase().includes(lowerCaseQuery)
  );
});

const navigateTo = (routeName) => {
  router.push({ name: routeName });
  dialog.value = false;
  searchQuery.value = "";
};

const handleKeyDown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    dialog.value = !dialog.value;
  }
};

onMounted(() => {
  console.log("ROTAS DISPONÍVEIS:", router.getRoutes());
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.float-button {
  position: fixed;
  bottom: 80px;
  right: 34px;
  z-index: 50;
}
.float-button:hover {
  transform: scale(1.1);
  animation-duration: 300ms;
  transition: all 0.3s ease-in-out;
}
</style>
