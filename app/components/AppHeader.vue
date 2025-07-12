<script setup lang="ts">
</script>

<template>
  <header
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg flex gap-4 items-center z-10
           w-[calc(100%-2rem)] max-w-[600px] mx-auto transition-colors duration-300"
  >
    <div class="text-lg font-bold text-gray-800 dark:text-gray-200">
      🚇 Metro Travel
    </div>
    <nuxt-link
        class="btn btn-primary btn-sm shadow-none px-4 py-2 rounded-full text-sm font-semibold"
        to="/training"
    >
      S'entrainer
    </nuxt-link>
    <ul class="flex gap-4 style-none">
      <li>
        <nuxt-link to="/" class="text-base font-medium hover:text-primary no-underline">Accueil</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/blog" class="text-base font-medium hover:text-primary no-underline">Blog</nuxt-link>
      </li>
    </ul>
  </header>
</template>
