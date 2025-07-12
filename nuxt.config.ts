import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/app.css"],
  modules: ["@nuxt/content", "@nuxtjs/leaflet"],

  content: {
    highlight: {
      theme: {
        default: 'github-light', // ou 'github-dark'
        dark: 'github-dark',
      },
    }
  }
})