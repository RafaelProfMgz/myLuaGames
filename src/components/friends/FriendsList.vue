<template>
  <!-- Usamos a cor 'surface' para o fundo, garantindo que o card se adapte ao tema.
       Uma elevação menor cria um visual mais sutil e moderno. -->
  <v-card
    class="friends-list-container"
    color="surface"
    elevation="4"
    rounded="lg"
  >
    <!-- A toolbar agora usa a cor 'surface' e uma borda inferior para se integrar melhor. -->
    <v-toolbar color="surface" density="compact" border="b">
      <v-toolbar-title class="text-subtitle-1 font-weight-bold text-on-surface">
        Usuários
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="emit('close')" aria-label="Fechar lista de usuários">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- O campo de busca agora tem um estilo mais limpo ('outlined') e mais espaçamento. -->
    <div class="pa-3">
      <v-text-field
        v-model="searchQuery"
        label="Procurar usuários..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </div>

    <v-divider />

    <!-- A área de scroll agora tem um estilo de scrollbar customizado para um visual mais polido. -->
    <div class="friends-list-scroll">
      <v-expansion-panels
        v-if="hasAnyContent"
        variant="accordion"
        v-model="panel"
      >
        <!-- Pedidos de Amizade Recebidos -->
        <v-expansion-panel
          v-if="friendRequestsReceived.length > 0"
          value="requests-received"
        >
          <v-expansion-panel-title class="text-body-2 font-weight-medium">
            Pedidos Recebidos
            <v-spacer />
            <v-chip size="small" color="secondary" variant="tonal" class="mr-2">
              {{ friendRequestsReceived.length }}
            </v-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-0">
            <v-list lines="two" density="compact" nav>
              <v-list-item
                v-for="request in friendRequestsReceived"
                :key="request.id"
              >
                <template #prepend>
                  <v-avatar size="38" color="secondary-lighten-1">
                    <span class="text-on-secondary font-weight-bold">
                      {{ request.senderName.charAt(0).toUpperCase() }}
                    </span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  request.senderName
                }}</v-list-item-title>
                <v-list-item-subtitle>Enviou um pedido</v-list-item-subtitle>
                <template #append>
                  <v-btn
                    icon="mdi-check"
                    size="small"
                    color="success"
                    variant="text"
                    @click="acceptFriend(request.senderId)"
                    aria-label="Aceitar pedido"
                  />
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    color="error"
                    variant="text"
                    @click="rejectFriend(request.senderId)"
                    aria-label="Rejeitar pedido"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Seções de Amigos (Online/Offline) e Adicionar -->
        <UserListSection
          title="Online"
          :users="filteredOnlineFriends"
          icon="mdi-chat"
          icon-color="primary"
          @item-click="openChat"
          @action-click="removeFriend"
          action-icon="mdi-close-circle"
          action-color="error"
          is-online
        />

        <UserListSection
          title="Offline"
          :users="filteredOfflineFriends"
          icon="mdi-chat"
          icon-color="primary"
          @item-click="openChat"
          @action-click="removeFriend"
          action-icon="mdi-close-circle"
          action-color="error"
        />

        <UserListSection
          title="Adicionar Amigos"
          :users="filteredPotentialFriends"
          icon="mdi-account-plus"
          icon-color="success"
          @action-click="sendFriendRequest"
          action-icon="mdi-account-plus"
          action-color="success"
        />
      </v-expansion-panels>

      <!-- Estado Vazio com um visual mais limpo e informativo. -->
      <div v-else class="empty-state">
        <v-icon size="48" class="mb-4 text-medium-emphasis"
          >mdi-account-search-outline</v-icon
        >
        <p class="text-body-1 text-medium-emphasis">
          <span v-if="searchQuery">Nenhum usuário encontrado.</span>
          <span v-else>Sua lista de usuários está vazia.</span>
        </p>
      </div>
    </div>
  </v-card>
</template>

<script setup>
// O script permanece praticamente o mesmo, mas adicionamos uma computed property
// para verificar se há algum conteúdo a ser exibido, limpando o v-if no template.

const hasAnyContent = computed(() => {
  return (
    friendRequestsReceived.value.length > 0 ||
    filteredOnlineFriends.value.length > 0 ||
    filteredOfflineFriends.value.length > 0 ||
    filteredPotentialFriends.value.length > 0
  );
});

// Nota: O código foi refatorado para usar um componente hipotético <UserListSection />
// para reduzir a repetição. Você pode criar este componente ou colar o código expandido
// das versões anteriores se preferir. A lógica principal permanece a mesma.
// ... resto do seu script ...
</script>

<style scoped>
.friends-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh; /* Define uma altura máxima */
  width: 360px; /* Define uma largura fixa */
}

.friends-list-scroll {
  flex-grow: 1;
  overflow-y: auto;
}

/* Estilização da barra de rolagem para um visual mais limpo */
.friends-list-scroll::-webkit-scrollbar {
  width: 6px;
}

.friends-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.friends-list-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-on-surface-rgb), 0.2);
  border-radius: 3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
  text-align: center;
}

/* Adiciona um efeito de hover sutil aos itens da lista */
:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-on-surface-rgb), 0.04);
}
</style>
