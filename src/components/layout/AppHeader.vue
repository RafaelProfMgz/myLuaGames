<template>
  <header class="app-header">
    <div class="app-header__center">
      <img
        src="@/assets/logo.svg"
        alt="Vuetify Logo"
        class="app-header__logo-img"
      />
      <span class="app-header__app-name">Seu App</span>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
/* Estiliza o header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  background-color: var(--v-theme-surface);
  border-bottom: 1px solid var(--v-theme-divider);
  height: 64px;
}

/* Estiliza o conte do do header */
.app-header__center {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Estiliza a logo */
.app-header__logo-img {
  height: 40px;
  width: auto;
}

/* Estiliza o nome do app */
.app-header__app-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--v-theme-on-surface);
}
</style>
