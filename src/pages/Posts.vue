<script setup>
import * as posts from '../../docs/diary/*.md';

const sortedPosts = Object.entries(posts)
  .map(([_, post]) => {
    return {
      slug: post.default.slug,
      title: post.default.title,
    };
  })
  .sort((a, b) => {
    return a.title.localeCompare(b.title);
  })
  .reverse();
</script>

<template>
  <div class="container main">
    <h1>Journal</h1>
    <p>
      Ceci est le journal de la construction de ce jeu. Il contient mes découvertes, mes choix et leurs explications
      ainsi que les erreurs que j'ai pu faire.
    </p>
    <ul class="slide-enter-content px-0">
      <li
        v-for="post in sortedPosts" :key="post"
        class="list-group my-2"
      >
        <router-link :to="`/posts/${post.slug}`" class="list-group-item list-group-item-action post-link">
          {{ post.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding-bottom: 1rem;
}

.post-link {
  text-decoration: none;
  color: inherit;
}
</style>
