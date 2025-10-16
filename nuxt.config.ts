import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui"],
  vite: {
    plugins: [tailwindcss()],
  },
  ui: {
    prefix: "U",
    fonts: false,
    colorMode: false,
    theme: {
      colors: ["primary", "secondary", "success", "info", "warning", "error"],
      transitions: true,
    },
  },
});
