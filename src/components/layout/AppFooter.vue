<template>
  <v-footer app height="56" class="px-4" border="t">
    <div>
      <v-btn
        v-for="item in items"
        :key="item.title"
        class="social-icon mx-1"
        :icon="item.icon"
        variant="text"
        size="small"
        :href="item.href"
        rel="noopener noreferrer"
        target="_blank"
        :aria-label="item.title"
      />
    </div>
    <v-spacer />
    <div class="text-caption text-disabled">
      &copy; 2025-{{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block font-weight-medium">
        MyLuaGames</span
      >
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  { title: "Minha Steam", icon: "mdi-steam", href: "#" },
  { title: "Meu GitHub", icon: "mdi-github", href: "#" },
  { title: "Meu Discord", icon: "mdi-discord", href: "#" },
  { title: "Meu Instagram", icon: "mdi-instagram", href: "#" },
];
</script>

<style scoped>
.social-icon {
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.social-icon:hover {
  color: rgba(var(--v-theme-primary), 1);
  transform: scale(1.1);
}
</style>
