<script setup lang="ts">
</script>

<template>
  <header
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-3 py-3 rounded-full shadow-lg flex justify-between items-center z-10
           w-[calc(100%-2rem)] max-w-[640px] mx-auto transition-colors duration-300"
  >
    <div class="text-m md:text-lg font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap px-1 md:px-3">
      🚇 Metro Travel
    </div>

    <div class="flex items-center gap-2 md:gap-6">
      <ul class="hidden sm:flex gap-2 md:gap-4 items-center">
        <li>
          <nuxt-link to="/" class="text-sm md:text-base font-medium hover:text-primary no-underline">
            Accueil
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/blog" class="text-sm md:text-base font-medium hover:text-primary no-underline">
            Blog
          </nuxt-link>
        </li>
      </ul>

      <nuxt-link
        to="/training"
        class="btn btn-primary btn-sm shadow-none px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
      >
        S'entraîner
      </nuxt-link>
    </div>
  </header>
</template>
