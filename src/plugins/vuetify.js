/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "light", // Definido 'light' como padrão para consistência
    themes: {
      light: {
        dark: false,
        colors: {
          // --- Cores Principais ---
          primary: "#673AB7", // Roxo Principal (Deep Purple)
          "primary-darken-1": "#512DA8", // Tom mais escuro para hover/foco
          secondary: "#9575CD", // Roxo mais suave para elementos secundários (Deep Purple lighten-2)
          accent: "#7C4DFF", // Um roxo vibrante para destaque (Deep Purple Accent)

          // --- Cores de UI Padrão ---
          background: "#F5F3F9", // Fundo lavanda muito sutil
          surface: "#FFFFFF", // Cor para cards, menus, etc.
          error: "#B71C1C", // Vermelho forte para erros
          info: "#2196F3", // Azul para informações
          success: "#4CAF50", // Verde para sucesso
          warning: "#FB8C00", // Laranja para avisos

          // --- Cores de Texto (On-Colors) ---
          "on-primary": "#FFFFFF",
          "on-secondary": "#FFFFFF",
          "on-accent": "#FFFFFF",
          "on-surface": "#212121", // Texto escuro sobre superfícies claras
          "on-background": "#212121",
          "on-error": "#FFFFFF",
        },
      },
      dark: {
        dark: true,
        colors: {
          // --- Cores Principais ---
          primary: "#9575CD", // Roxo mais claro para contraste no escuro (Deep Purple lighten-2)
          "primary-darken-1": "#B39DDB", // Tom mais claro ainda para hover/foco
          secondary: "#673AB7", // Roxo mais escuro como secundário
          accent: "#7C4DFF", // O roxo vibrante funciona bem em ambos os modos

          // --- Cores de UI Padrão ---
          background: "#121212", // Fundo escuro padrão
          surface: "#1E1E1E", // Cor para cards, menus, etc.
          error: "#CF6679", // Vermelho claro para erros
          info: "#2196F3",
          success: "#66BB6A",
          warning: "#FFA726",

          // --- Cores de Texto (On-Colors) ---
          "on-primary": "#FFFFFF",
          "on-secondary": "#FFFFFF",
          "on-accent": "#FFFFFF",
          "on-surface": "#E0E0E0", // Texto claro sobre superfícies escuras
          "on-background": "#E0E0E0",
          "on-error": "#121212",
        },
      },
    },
  },
});
