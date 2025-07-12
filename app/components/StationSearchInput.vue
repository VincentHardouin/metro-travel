<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { searchStations } from '~~/src/utils.front';

const props = defineProps<{
  stations: string[];
}>();

const emit = defineEmits(['tryStop']);

const dropdownId = 'station-dropdown';

const station = ref('');
const dropdownIsVisible = ref(false);
const searchResults = ref<string[]>([]);
const activeIndex = ref(-1);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

function tryStop() {
  emit('tryStop', station.value);
  station.value = '';
}

function updateResults() {
  const value = station.value.trim();
  if (value.length > 0) {
    showDropdown(value);
  }
  else {
    hideDropdown();
  }
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector('.station-search-input');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    hideDropdown();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (!dropdownIsVisible.value || searchResults.value.length === 0)
    return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % searchResults.value.length;
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex.value
        = (activeIndex.value - 1 + searchResults.value.length) % searchResults.value.length;
  }
  else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault();
    addNameToInput(searchResults.value[activeIndex.value]);
  }
  else if (event.key === 'Escape') {
    hideDropdown();
  }
}

function showDropdown(value: string) {
  searchResults.value = searchStations(value, props.stations);
  dropdownIsVisible.value = true;
  activeIndex.value = -1;
}

function hideDropdown() {
  dropdownIsVisible.value = false;
  activeIndex.value = -1;
}

function addNameToInput(name: string) {
  station.value = name;
  hideDropdown();
}
</script>

<template>
  <div class="station-search-input relative w-full max-w-xl">
    <div
      class="w-full px-2 py-2 rounded-full border border-gray-300 dark:border-gray-600
             focus:outline-none focus:ring focus:ring-blue-400
             dark:bg-gray-700 dark:text-gray-200"
    >
      <input
        v-model="station"
        type="text"
        placeholder="Rechercher une station..."
        class="px-4 flex-grow bg-transparent focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
        role="combobox"
        :aria-expanded="dropdownIsVisible.toString()"
        :aria-controls="dropdownId"
        :aria-activedescendant="activeIndex >= 0 ? `option-${activeIndex}` : null"
        aria-autocomplete="list"
        @input="updateResults"
        @click="updateResults"
        @keydown="handleKeyDown"
      >
      <button
        class="btn btn-primary shadow-none ml-2 px-4 py-1.5 text-white rounded-full text-sm font-medium"
        @click="tryStop"
      >
        Essayer
      </button>
    </div>

    <Transition name="fade-slide">
      <ul
        v-if="dropdownIsVisible && searchResults.length > 0"
        :id="dropdownId"
        role="listbox"
        class="absolute w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
      >
        <li
          v-for="(stop, index) in searchResults"
          :id="`option-${index}`"
          :key="index"
          role="option"
          :aria-selected="activeIndex === index"
          class="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800"
          :class="{ 'bg-blue-200 dark:bg-blue-600 text-white': index === activeIndex }"
          @click="addNameToInput(stop)"
        >
          {{ stop }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
