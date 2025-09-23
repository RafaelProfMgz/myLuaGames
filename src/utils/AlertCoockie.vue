<template>
  <v-snackbar
    v-model="showSnackbar"
    location="bottom left"
    :timeout="-1"
    multi-line
    color="grey-darken-4"
    elevation="4"
    class="cookie-snackbar"
  >
    <div class="text-subtitle-1 pb-2">Nós valorizamos sua privacidade</div>

    <p>
      Utilizamos cookies para aprimorar sua experiência de navegação, exibir
      anúncios ou conteúdo personalizado e analisar nosso tráfego. Ao clicar em
      “Aceitar todos”, você concorda com nosso uso de cookies.
    </p>

    <template v-slot:actions>
      <v-btn color="indigo" variant="text" @click="acceptCookies">
        Aceitar Todos
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showSnackbar = ref(false);

onMounted(() => {
  if (!getCookie("cookie_consent")) {
    showSnackbar.value = true;
  }
});

const acceptCookies = () => {
  setCookie("cookie_consent", "true", 365);
  showSnackbar.value = false;
};

/**
 * Define um cookie no navegador.
 * @param {string} name - O nome do cookie.
 * @param {string} value - O valor do cookie.
 * @param {number} days - O número de dias até o cookie expirar.
 */

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Obtém o valor de um cookie.
 * @param {string} name
 * @returns {string|null}
 */

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
</script>

<style scoped>
.cookie-snackbar {
  width: 100%;
  margin: 12px;
}
</style>
