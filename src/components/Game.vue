<script setup>
import { onMounted, ref } from 'vue';
import * as bootstrap from 'bootstrap';
import { Game } from '../Game.js';
import { getUniqueStops } from '../utils.js';
import { searchStations } from '../utils.front.js';
import RulesModal from './RulesModal.vue';
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
const addedStops = ref([]);

onMounted(() => {
  game.init();
  instruction.value = game.instruction;
});

function tryStop() {
  const stationName = station.value;
  try {
    const isFinish = game.addStation({ station: stationName });
    addedStops.value = game.getAddedStops();
    if (isFinish) {
      information.value = game.getInformation();
      const modal = new bootstrap.Modal(document.getElementById('finish-modal'));
      modal.show();
    }
  }
  catch (e) {
    isValid.value = false;
  }
  finally {
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

function toggleStop(event) {
  const stopId = event.target.id;
  game.toggleStop(stopId);
}
</script>

<template>
  <RulesModal />
  <FinishModal :information="information" />
  <div class="container">
    <h1>{{ title }}</h1>
    <p id="instruction" v-html="instruction" />
    <div class="map">
      <svg id="carte" />
      <div class="btn-group-vertical map__actions">
        <button id="map-zoom-in" type="button" class="btn btn-outline-primary" aria-label="Zoomer la carte">
          +
        </button>
        <button id="map-zoom-out" type="button" class="btn btn-outline-primary" aria-label="Dézoomer la carte">
          -
        </button>
      </div>
    </div>
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
    <div v-if="addedStops.length > 0" class="stop-list-section">
      <p>Stations ajoutées</p>
      <ul class="stop-list">
        <li v-for="(stop, index) in addedStops" :key="index" class="form-check stop-list__item">
          <input
            :id="stop.stop_unique_id" class="form-check-input" type="checkbox" :value="stop.stop_unique_id" checked
            @click="toggleStop"
          >
          <label class="form-check-label" :for="stop.stop_unique_id">
            {{ stop.stop_name }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stop-list-section {
  margin-top: 1rem;
}

.stop-list {
  list-style-type: none;
}

.stop-list__item {
  padding-left: 0;
}

.map {
  position: relative;
}

.map__actions {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
