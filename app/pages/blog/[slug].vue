<script setup>
const route = useRoute();
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first();
});
if (!post.value) {
  throw createError({ statusCode: 404, message: 'Article non trouvé' });
}
</script>

<template>
  <article
    class="max-w-3xl mx-auto pt-34 py-12 px-4 prose prose-gray dark:prose-invert prose prose-lg dark:prose-invert leading-relaxed"
  >
    <template v-if="post">
      <ContentRenderer :value="post" />
    </template>
    <template v-else>
      <div class="empty-page">
        <h1>Page Not Found</h1>
        <p>Oops! The content you're looking for doesn't exist.</p>
        <NuxtLink to="/">
          Go back home
        </NuxtLink>
      </div>
    </template>
  </article>
</template>

<style>
@reference "~/assets/app.css";

h1 {
  @apply text-4xl font-bold text-gray-900;
  padding-bottom: 2rem;
}

h2 {
  @apply text-3xl font-semibold text-gray-800;
}

p {
  @apply text-base text-gray-700 leading-relaxed;
}

ul {
  @apply list-disc list-inside;
}

a {
  @apply text-blue-600 underline hover:text-blue-800;
}
</style>
