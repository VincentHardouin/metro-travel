import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Metro Travel',
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Défiez vos connaissances du métro parisien chaque jour en trouvant le trajet optimal.',
        },
        { name: 'keywords', content: 'metro, paris, travel, challenge, game, daily, GTFS' },
        { name: 'author', content: 'Vincent Hardouin' },
        { name: 'robots', content: 'index, follow' },
        { name: 'og:title', content: 'Metro travel' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      script: [
        {
          'src': 'https://analytics.vincenthardouin.dev/js/script.js',
          'defer': true,
          'data-domain': 'metro-travel.vincenthardouin.dev',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/app.css'],
  modules: ['@nuxt/content', '@nuxtjs/leaflet'],

  content: {
    highlight: {
      theme: {
        default: 'github-light', // ou 'github-dark'
        dark: 'github-dark',
      },
    },
  },
});
