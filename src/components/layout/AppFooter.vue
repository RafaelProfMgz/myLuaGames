<template>
  <v-footer app height="44" class="d-flex align-center px-4">
    <a
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer"
      target="_blank"
      :title="item.title"
    >
      <v-icon :icon="item.icon" :size="item.size" />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; 2025-{{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">MyLuaGames, LLC</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="https://vuetifyjs.com/about/licensing/"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  {
    title: "Minha Steam",
    icon: `mdi-steam`,
    href: "https://github.com/vuetifyjs/vuetify",
    size: 24,
  },
  {
    title: "Meu GitHub",
    icon: `mdi-github`,
    href: "https://github.com/vuetifyjs/vuetify",
    size: 24,
  },
  {
    title: "Meu Discord",
    icon: `mdi-twitter`,
    href: "https://community.vuetifyjs.com/",
    size: 24,
  },
  {
    title: "Meu instagram",
    icon: `mdi-instagram`,
    href: "https://www.instagram.com/anrafaelmgz/",
    size: 24,
  },
];
</script>
