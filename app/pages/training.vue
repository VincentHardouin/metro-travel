<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const seed = ref();

function handleSeed() {
  if (route.query.seed && validHex(route.query.seed)) {
    seed.value = hexToSeed(route.query.seed);
  }
  else {
    const hexSeed = getRandomSeed();
    router.push({ query: { seed: hexSeed } });
    seed.value = hexToSeed(hexSeed);
  }
}

handleSeed();

function validHex(hex) {
  return /^[0-9a-f]+$/i.test(hex);
}

function hexToSeed(hex) {
  return Number.parseInt(hex, 16);
}

function getRandomSeed() {
  return [...Array.from({ length: 6 })].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

watch(() => route.query.seed, () => {
  handleSeed();
});
</script>

<template>
  <Game :seed="seed" />
</template>

<style scoped>

</style>
