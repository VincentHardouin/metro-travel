<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const date = new Date();
const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
const seed = ref();

function handleSeed() {
  seed.value = dateToSeed;
  if (route.query.seed && validHex(route.query.seed)) {
    console.log(route.query.seed);
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

function getRandomSeed() {
  return [...Array.from({ length: 6 })].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
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
