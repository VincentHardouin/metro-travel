<script setup lang="ts">
defineProps(['instruction'])
</script>

<template>
  <section
      class="fixed top-20 left-1/2 transform -translate-x-1/2
           w-[calc(100%-2rem)] max-w-[600px]
           bg-blue-50/80 dark:bg-gray-800/80
           backdrop-blur-sm rounded-xl
           px-5 py-3
           text-center
           text-blue-900 dark:text-blue-300
           text-sm font-medium
           shadow-md
           z-50"
      v-html="instruction"
  >
  </section>
</template>

<style scoped>

</style>