<template>
  <v-card>
    <v-card-title class="text-h5">{{ formTitle }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isValid">
        <!-- Campos existentes -->
        <v-text-field
          v-model="gameData.name"
          label="Nome do Jogo"
          :rules="[rules.required]"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-text-field
          v-model="gameData.platform"
          label="Plataforma (ex: PC, PS5)"
          :rules="[rules.required]"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-text-field
          v-model="gameData.genre"
          label="Gênero (ex: RPG, Ação)"
          :rules="[rules.required]"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-text-field
          v-model="gameData.cover"
          label="URL da Imagem de Capa"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <v-select
          v-model="gameData.status"
          :items="statusOptions"
          label="Status"
          :rules="[rules.required]"
          variant="outlined"
          density="compact"
        ></v-select>

        <v-text-field
          v-model.number="gameData.hours"
          label="Horas Jogadas"
          type="number"
          min="0"
          variant="outlined"
          density="compact"
        ></v-text-field>

        <div class="text-center mt-2">
          <label class="d-block mb-2 text-medium-emphasis">Sua Avaliação</label>
          <v-rating
            v-model="gameData.rating"
            hover
            half-increments
            color="amber"
            density="comfortable"
            size="large"
          ></v-rating>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancel">Cancelar</v-btn>
      <v-btn color="primary" variant="flat" @click="save" :disabled="!isValid">
        Salvar Jogo
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const emit = defineEmits(["close", "save"]);

const props = defineProps({
  gameToEdit: {
    type: Object,
    default: null,
  },
});

const form = ref(null);
const isValid = ref(false);

const gameData = ref({
  name: "",
  platform: "",
  genre: "",
  cover: "",
  status: "backlog",
  hours: 0,
  rating: 0,
});

const formTitle = computed(() =>
  props.gameToEdit ? "Editar Jogo" : "Adicionar Novo Jogo"
);

watch(
  () => props.gameToEdit,
  (newGame) => {
    if (newGame) {
      gameData.value = { ...newGame };
    } else {
      gameData.value = {
        name: "",
        platform: "",
        genre: "",
        cover: "",
        status: "backlog",
        hours: 0,
        rating: 0,
      };
    }
  },
  { immediate: true }
);

const statusOptions = ref([
  { title: "Próximo na Fila (Backlog)", value: "backlog" },
  { title: "Jogando Atualmente", value: "playing" },
  { title: "Concluído", value: "completed" },
  { title: "Em Andamento", value: "inProgressGames" },
]);

const rules = {
  required: (value) => !!value || "Este campo é obrigatório.",
};

function cancel() {
  emit("close");
}

async function save() {
  const { valid } = await form.value.validate();
  if (valid) {
    emit("save", { ...gameData.value });
  }
}
</script>
