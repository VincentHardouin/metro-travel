<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const date = new Date();
const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
const seed = ref();

function handleSeed() {
  seed.value = dateToSeed;
  if (route.query.seed && validHex(route.query.seed)) {
    seed.value = hexToSeed(route.query.seed);
  }
}

handleSeed();

function validHex(hex) {
  return /^[0-9a-f]+$/i.test(hex);
}

function hexToSeed(hex) {
  return Number.parseInt(hex, 16);
}

watch(() => route.query.seed, () => {
  handleSeed();
});

watch(() => route.path, () => {
  handleSeed();
});
</script>

<template>
  <Game :seed="seed" />
</template>

<style scoped>

</style>
