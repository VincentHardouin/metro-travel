<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Game from '../components/Game.vue';
import AboutModal from '../components/AboutModal.vue';
import RulesModal from '../components/RulesModal.vue';

const route = useRoute();
const router = useRouter();

const date = new Date();
const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
const seed = ref();

function handleSeed() {
  if (route.path === '/') {
    seed.value = dateToSeed;
  }
  else if (route.query.seed && validHex(route.query.seed)) {
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
  return /^[0-9a-fA-F]+$/.test(hex);
}

function hexToSeed(hex) {
  return Number.parseInt(hex, 16);
}

function getRandomSeed() {
  return [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

watch(() => route.query.seed, () => {
  handleSeed();
});

watch(() => route.path, () => {
  handleSeed();
});
</script>

<template>
  <AboutModal />
  <RulesModal />
  <Game :seed="seed" />
</template>

<style scoped>

</style>
