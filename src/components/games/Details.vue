<!-- components/games/Details.vue -->
<template>
  <v-card v-if="game">
    <v-img
      :src="game.cover || 'https://via.placeholder.com/800x400'"
      height="300px"
      cover
      class="text-white"
    >
      <v-toolbar color="rgba(0, 0, 0, 0.5)" theme="dark">
        <v-toolbar-title class="text-h5 font-weight-bold">
          {{ game.name }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="close"></v-btn>
      </v-toolbar>
    </v-img>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="8">
          <div class="mb-4">
            <p class="text-overline">Plataforma</p>
            <p class="text-h6">{{ game.platform }}</p>
          </div>
          <div class="mb-4">
            <p class="text-overline">Gênero</p>
            <p class="text-h6">{{ game.genre }}</p>
          </div>
          <div v-if="game.startDate">
            <p class="text-overline">Período Jogado</p>
            <p class="text-subtitle-1">
              Iniciado em {{ game.startDate }}
              <span v-if="game.finishedDate">
                e finalizado em {{ game.finishedDate }}</span
              >.
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-md-center">
          <p class="text-overline">Avaliação</p>
          <v-rating
            :model-value="game.rating"
            color="amber"
            density="default"
            half-increments
            readonly
            class="mb-4"
          ></v-rating>

          <p class="text-overline">Status</p>
          <v-chip
            :color="statusColor(game.status)"
            class="font-weight-bold mb-4"
          >
            {{ game.status }}
          </v-chip>

          <p class="text-overline">Horas Jogadas</p>
          <p class="text-h5 font-weight-bold">{{ game.hoursPlayed || 0 }}h</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" variant="text" @click="close"> Fechar </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
function statusColor(status) {
  switch (status) {
    case "completed":
      return "success";
    case "playing":
      return "info";
    case "backlog":
      return "grey";
    default:
      return "default";
  }
}
</script>
