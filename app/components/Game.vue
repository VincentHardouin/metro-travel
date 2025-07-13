<script setup>
import { ref, watch } from 'vue';
import ListAddedStations from '~/components/ListAddedStations.vue';
import MetroMap from '~/components/MetroMap.vue';
import { Game } from '../../src/Game.js';
import { getUniqueStops } from '../../src/utils.js';

const props = defineProps(['seed']);
let game = new Game({ seed: props.seed, mode: 'station' });

const sortedStations = getUniqueStops().map(d => d.stop_name).sort();

const information = ref(null);
const addedStops = ref([]);
const lines = ref([]);
const isFinished = ref(false);
const showModal = ref(false);

watch(() => props.seed, (newSeed) => {
  game = new Game({ seed: newSeed, mode: 'station' });
});

function tryStop(station) {
  const isFinish = game.addStation(station);
  addedStops.value = game.addedStations;
  lines.value = game.visibleLines;
  isFinished.value = isFinish;
  if (isFinished.value) {
    information.value = game.getInformation();
    showModal.value = true;
  }
}

function toggleStop(stopId) {
  game.toggleStop(stopId);
  addedStops.value = game.addedStations;
  lines.value = game.visibleLines;
}
</script>

<template>
  <div class="w-full h-screen">
    <MetroMap :start="game.startStation" :end="game.endStation" :stations="addedStops" :lines="lines" />
  </div>
  <Instruction :start="game.startStation.stop_name" :end="game.endStation.stop_name" />
  <aside
    class="fixed top-40 left-4 right-auto md:right-auto
         bg-white/80 dark:bg-gray-800/80
         backdrop-blur-lg rounded-2xl shadow-xl
         p-6 space-y-6
         z-10
         transition-colors duration-300"
  >
    <StationSearchInput
      :stations="sortedStations"
      @try-stop="tryStop"
    />
    <ListAddedStations :added-stations="addedStops" @toggle-stop="toggleStop" />
  </aside>
  <CongratsModal v-if="isFinished && showModal" :information="information" @close="showModal = false" />
</template>

<style scoped>
</style>
