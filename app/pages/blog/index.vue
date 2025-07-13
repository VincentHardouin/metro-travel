<script setup lang="ts">
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('path', 'DESC').all());

if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true,
  });
}
</script>

<template>
  <div class="max-w-4xl mx-auto pt-24 py-12 px-4">
    <h1 class="text-3xl font-bold mb-8">
      Articles de blog
    </h1>
    <div class="grid gap-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="block p-6 rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <h2 class="text-xl font-semibold mb-2">
          {{ post.title }}
        </h2>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>
