// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    sidebarOpen: false,
    darkMode: false,
    notifications: [],
    user: null,
  }),
});
