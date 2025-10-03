<script setup>
const items = [
  {
    title: "Minha Steam",
    icon: `mdi-steam`,
    href: "https://github.com/vuetifyjs/vuetify", // Lembre-se de atualizar os links
  },
  {
    title: "Meu GitHub",
    icon: `mdi-github`,
    href: "https://github.com/vuetifyjs/vuetify",
  },
  {
    title: "Meu Discord",
    icon: `mdi-discord`, // Corrigido de mdi-twitter
    href: "https://community.vuetifyjs.com/",
  },
  {
    title: "Meu instagram",
    icon: `mdi-instagram`,
    href: "https://www.instagram.com/anrafaelmgz/",
  },
];
</script>

<style scoped>
/* Adicionado um efeito de hover sutil para os botões sociais */
.social-icon {
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;
}

.social-icon:hover {
  opacity: 1;
}
</style>
