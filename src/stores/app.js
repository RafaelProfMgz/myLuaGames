// "@/stores/app.js" (ou o nome do seu arquivo)
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { initializeSocket, socket } from "@/plugins/socket";
// import { initializeSocket, socket } from "@/socket"; // Importa a função de inicialização e a instância reativa

const USER_COOKIE_KEY = "user_session";

export const useAppStore = defineStore("app", {
  state: () => ({
    darkMode: false,
    user: null,
  }),
  actions: {
    login(userData) {
      this.user = userData;
      const fiveHours = 5 / 24;

      Cookies.set(USER_COOKIE_KEY, JSON.stringify(userData), {
        expires: fiveHours,
      });

      // *** IMPORTANTE: Inicializa o socket após o login ***
      initializeSocket();
    },

    logout() {
      this.user = null;
      Cookies.remove(USER_COOKIE_KEY);

      // *** IMPORTANTE: Desconecta o socket no logout ***
      // O watcher em initializeSocket já lida com isso, mas é bom ter certeza.
      if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
      }
    },

    checkAuth() {
      const userCookie = Cookies.get(USER_COOKIE_KEY);

      if (userCookie) {
        try {
          this.user = JSON.parse(userCookie);
          // *** IMPORTANTE: Inicializa o socket se o usuário já estiver autenticado (na recarga da página) ***
          initializeSocket();
        } catch (error) {
          console.error("Erro ao ler o cookie de autenticação:", error);
          this.logout();
        }
      }
    },
  },
});
