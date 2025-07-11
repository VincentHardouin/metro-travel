<script setup lang="ts">

const props = defineProps(['addedStations', 'toggleStop']);
const emit = defineEmits(['toggleStop'])

</script>

<template>
  <div v-if="addedStations.length > 0" class="space-y-4">
    <p class="text-lg font-medium mb-4">Stations ajoutées</p>
    <p class="text-xs text-gray-500 italic">Cliquez sur un tag pour masquer visuellement une station</p>
    <TransitionGroup name="list" tag="ul" class="space-y-3">
      <li v-for="(stop, index) in addedStations"
          :key="index">
        <button @click="$emit('toggleStop', stop.stop_unique_id)"
                :class="[
            'w-full text-left flex items-center px-3 py-1 rounded-full text-sm transition',
            'hover:bg-blue-200 dark:hover:bg-blue-800',
            stop.isActive
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-400 line-through opacity-50'
          ]">
          {{ stop.stop_name }}
        </button>
      </li>
    </TransitionGroup>
  </div>
  <div v-else class="stop-list-section">
    <p class="text-center text-lg font-medium mb-4">Pas encore de station ajoutée !</p>
  </div>
</template>

<style scoped>
</style>
