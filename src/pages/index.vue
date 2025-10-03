<route lang="yaml">
meta:
  requiresAuth: true
  searchable: true
  title: "Página inicial"
  icon: "mdi-check-circle-outline"
</route>

<template>
  <v-container fluid class="dashboard-container pa-0">
    <AppBackground />

    <v-row no-gutters class="fill-height align-center justify-center">
      <v-col cols="12" md="8" lg="6">
        <v-card
          class="welcome-card pa-6 text-center"
          elevation="8"
          rounded="xl"
        >
          <v-card-title class="justify-center text-h4 font-weight-bold mb-4">
            <v-icon large color="deep-purple-darken-2" class="mr-3"
              >mdi-rocket-launch-outline</v-icon
            >
            Bem-vindo ao Lua Games!
          </v-card-title>

          <v-card-text class="text-h6 grey--text text--darken-2 mb-6">
            Sua central de organização para seus jogos favoritos. Prepare-se
            para elevar sua experiência de jogo!
          </v-card-text>

          <v-divider class="my-6"></v-divider>

          <v-row justify="center" class="mb-6">
            <v-col cols="12" sm="6" md="4">
              <v-card flat class="pa-4 feature-card" rounded="xl">
                <v-icon x-large color="deep-purple" class="mb-3"
                  >mdi-play-outline</v-icon
                >
                <div class="text-subtitle-1 font-weight-medium">
                  Gerencie sua Biblioteca
                </div>
                <div class="text-caption grey--text text--darken-1">
                  Organize todos os seus jogos em um só lugar.
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card flat class="pa-4 feature-card" rounded="xl">
                <v-icon x-large color="deep-purple" class="mb-3"
                  >mdi-chart-bar</v-icon
                >
                <div class="text-subtitle-1 font-weight-medium">
                  Acompanhe seu Progresso
                </div>
                <div class="text-caption grey--text text--darken-1">
                  Veja suas conquistas e horas jogadas.
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card flat class="pa-4 feature-card" rounded="xl">
                <v-icon x-large color="deep-purple" class="mb-3"
                  >mdi-plus</v-icon
                >
                <div class="text-subtitle-1 font-weight-medium">
                  Encontre pessoas novas
                </div>
                <div class="text-caption grey--text text--darken-1">
                  Converse com seus amigos e compartilhe conquistas.
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card flat class="pa-4 feature-card" rounded="xl">
                <v-icon x-large color="deep-purple" class="mb-3"
                  >mdi-share-variant-outline</v-icon
                >
                <div class="text-subtitle-1 font-weight-medium">
                  Descubra Novidades
                </div>
                <div class="text-caption grey--text text--darken-1">
                  Fique por dentro dos lançamentos e tendências.
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import AppBackground from "@/components/animation/AppBackground.vue";

// Adicione qualquer lógica de script necessária aqui
</script>

<style scoped>
.dashboard-container {
  /* Gradiente de fundo alterado para tons de roxo */
  background: linear-gradient(
    45deg,
    #311b92,
    /* Roxo bem escuro */ #673ab7,
    /* Roxo principal */ #9575cd /* Roxo mais claro */
  );
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.welcome-card {
  backdrop-filter: blur(5px); /* Efeito de desfoque para o fundo */
  background-color: rgba(255, 255, 255, 0.05); /* Fundo um pouco mais visível */
  border: 1px solid rgba(225, 200, 255, 0.4); /* Borda com tom roxo */
  z-index: 10;
}

.feature-card {
  /* Arredondamento aumentado */
  border-radius: 24px;
  transition: transform 0.3s ease-in-out;
  background-color: rgba(255, 255, 255, 0.08); /* Fundo sutil */
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(49, 27, 146, 0.2); /* Sombra com tom roxo */
}
</style>
