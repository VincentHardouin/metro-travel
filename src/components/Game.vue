<script setup>
import {onMounted, ref} from 'vue';
import * as bootstrap from 'bootstrap';
import {Game} from '../Game.js';
import RulesModal from './RulesModal.vue';
import {getUniqueStops} from '../utils.js';
import {searchStations} from '../utils.front.js';
import FinishModal from './FinishModal.vue';

const sortedStations = getUniqueStops().map(d => d.stop_name).sort();
const date = new Date();
const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

const game = new Game(dateToSeed);

const title = 'Métro travel';
const invalidFeedback = 'Le nom de station doit être valide.';

const station = ref('');
const instruction = ref('');
const information = ref(null);
const searchResults = ref([]);
const dropdownIsVisible = ref(false);
const isValid = ref(true);

function tryStop() {
  const stationName = station.value;
  try {
    const isFinish = game.addStation({station: stationName});
    if (isFinish) {
      information.value = game.getInformation();
      const modal = new bootstrap.Modal(document.getElementById('finish-modal'));
      modal.show();
    }
  } catch (e) {
    isValid.value = false;
  } finally {
    station.value = '';
  }
}

function handleDropDownVisibility() {
  if (station.value.length > 0)
    showDropdown(station.value);
  else
    hideDropdown();
}

function hideDropdown() {
  dropdownIsVisible.value = false;
}

function showDropdown(value) {
  dropdownIsVisible.value = true;
  searchResults.value = searchStations(value, sortedStations);
}

function addNameToInput(event) {
  station.value = event.target.textContent;
}

onMounted(() => {
  game.init();
  instruction.value = game.instruction;
});
</script>

<template>
  <RulesModal/>
  <FinishModal :information="information"/>
  <div class="container">
    <h1>{{ title }}</h1>
    <p id="instruction" v-html="instruction"/>
    <svg id="carte"/>
    <div class="dropdown">
      <label for="station" class="form-label">Nom d'une station</label>
      <input
          id="station"
          v-model="station"
          class="form-control"
          :class="{ show: dropdownIsVisible }"
          type="text"
          placeholder="Rechercher une station à ajouter"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-describedby="station-validation"
          @input="handleDropDownVisibility"
          @click="handleDropDownVisibility"
      >
      <div id="station-validation" class="invalid-feedback" :class="{ 'is-invalid': !isValid }">
        {{ invalidFeedback }}
      </div>
      <ul id="stations" class="dropdown-menu" :class="{ show: dropdownIsVisible }" :aria-expanded="dropdownIsVisible">
        <li v-for="(stop, index) in searchResults" :key="index">
          <button class="dropdown-item" @click="addNameToInput">
            {{ stop }}
          </button>
        </li>
      </ul>
    </div>
    <button class="btn btn-primary" @click="tryStop">
      Essayer
    </button>
  </div>
</template>

<style scoped>

</style>
