<script setup lang="ts">
const { start, end } = defineProps<{
  start: string;
  end: string;
}>();
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
           z-10"
  >
    Aujourd'hui, nous allons de
    <span class="inline-flex items-center gap-1 font-semibold text-green-700 dark:text-green-400">
      {{ start }}
    </span>
    jusqu'à
    <span class="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
      {{ end }}
    </span>
    en passant par le moins de stations possible.
  </section>
</template>

<style>

</style>
