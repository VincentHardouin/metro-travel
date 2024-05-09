<script setup>
import { useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';

import * as posts from '../../docs/diary/*.md';

const route = useRoute();

const slug = route.params.slug;
const markdown = ref(null);

watchEffect(async () => {
  markdown.value = posts[slug].default;
});
</script>

<template>
  <div class="container main">
    <div v-if="markdown" class="slide-enter-content" v-html="markdown.__content" />
  </div>
</template>

<style>
img {
  width: 100%;
}
</style>
