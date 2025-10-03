<template>
  <!-- O card principal já usa a cor 'surface' por padrão, o que está correto. -->
  <v-card class="pa-0" rounded="xl" elevation="4">
    <!-- O cabeçalho agora usa a cor 'primary' para um destaque maior e mais "brandeado".
         O Vuetify aplicará automaticamente a cor 'on-primary' (branco) ao texto do título. -->
    <v-toolbar color="primary" density="compact">
      <v-toolbar-title class="text-h6 font-weight-bold d-flex align-center">
        <v-icon
          start
          :icon="props.gameToEdit ? 'mdi-pencil' : 'mdi-plus-box'"
        ></v-icon>
        {{ formTitle }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text class="pa-4">
      <v-form ref="form" v-model="isValid">
        <v-row>
          <!-- Campos principais -->
          <v-col cols="12">
            <v-text-field
              v-model="gameData.name"
              label="Nome do Jogo"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-text-short"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="gameData.platform"
              label="Plataforma"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-gamepad-variant-outline"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="gameData.genre"
              label="Gênero"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-tag-outline"
            />
          </v-col>

          <!-- Seção de Imagem com Pré-visualização -->
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="gameData.cover"
              label="URL da Imagem de Capa"
              variant="outlined"
              prepend-inner-icon="mdi-image-outline"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" class="d-flex align-center justify-center">
            <v-img
              v-if="gameData.cover"
              :src="gameData.cover"
              aspect-ratio="16/9"
              cover
              class="rounded-lg border"
              height="60"
            >
              <template #error>
                <div
                  class="d-flex fill-height align-center justify-center text-caption text-medium-emphasis"
                >
                  URL inválida
                </div>
              </template>
            </v-img>
            <div
              v-else
              class="d-flex fill-height align-center justify-center text-caption text-medium-emphasis border rounded-lg w-100"
            >
              Preview
            </div>
          </v-col>

          <!-- Campos de Status e Progresso -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="gameData.status"
              :items="statusOptions"
              label="Status"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-list-status"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="gameData.hours"
              label="Horas Jogadas"
              type="number"
              min="0"
              variant="outlined"
              prepend-inner-icon="mdi-clock-outline"
            />
          </v-col>

          <!-- A seção de avaliação usa um fundo sutil com a cor secundária do tema -->
          <v-col cols="12">
            <v-sheet
              variant="tonal"
              color="secondary"
              rounded="lg"
              class="pa-4 text-center"
            >
              <div
                class="text-subtitle-2 font-weight-medium mb-2 text-on-surface"
              >
                Sua Avaliação
              </div>
              <!-- A cor 'amber' foi substituída pela cor 'accent' da sua paleta de tema. -->
              <v-rating
                v-model="gameData.rating"
                hover
                half-increments
                color="7C4DFF"
                active-color="warning"
                density="comfortable"
                size="large"
              />
            </v-sheet>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <!-- Ações do Card com borda superior para separação clara -->
    <v-card-actions class="pa-4 border-t">
      <v-spacer />
      <v-btn variant="text" @click="cancel">Cancelar</v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        @click="save"
        :disabled="!isValid"
        prepend-icon="mdi-content-save"
      >
        Salvar Jogo
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// Nenhuma alteração foi necessária no script. A lógica permanece a mesma.
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
