/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Guardião de Rota
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const token = localStorage.getItem("auth_token");

  // Rota não encontrada
  if (to.matched.length === 0) {
    if (!token) {
      next("/login/Login"); // Redireciona para o login se não estiver autenticado
    } else {
      next("/"); // Redireciona para a home se estiver autenticado
    }
  }
  // Rota que requer autenticação, mas o usuário não tem token
  else if (requiresAuth && !token) {
    next("/login/Login");
  }
  // Usuário autenticado tentando acessar a página de login
  else if (token && to.path === "/login/Login") {
    next("/");
  }
  // Todas as outras condições
  else {
    next();
  }
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
