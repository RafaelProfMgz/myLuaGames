import { defineStore } from "pinia";
import Cookies from "js-cookie";

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
    },

    logout() {
      this.user = null;
      Cookies.remove(USER_COOKIE_KEY);
    },

    checkAuth() {
      const userCookie = Cookies.get(USER_COOKIE_KEY);

      if (userCookie) {
        try {
          this.user = JSON.parse(userCookie);
        } catch (error) {
          console.error("Erro ao ler o cookie de autenticação:", error);
          this.logout();
        }
      }
    },
  },
});
