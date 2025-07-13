<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps(['addedStations'])
defineEmits(['toggleStop'])

const isOpen = ref(true)

function handleResize() {
  isOpen.value = window.innerWidth >= 640
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div>
    <div
        class="collapse bg-base-200 dark:bg-gray-700 rounded-lg"
        :class="{ 'collapse-open': isOpen }"
    >
      <button
          type="button"
          class="collapse-title pr-3 text-md font-medium flex justify-between items-center cursor-pointer w-full"
          @click="isOpen = !isOpen"
          :aria-expanded="isOpen"
          aria-controls="accordion"
      >
        Stations ajoutées ({{ addedStations.length }})
        <svg
            class="w-5 h-5 transition-transform duration-300"
            :class="{'rotate-180': isOpen}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <transition name="accordion">
        <div class="collapse-content space-y-3" v-show="isOpen" role="region" id="accordion">
          <p class="text-xs text-gray-500 italic mb-2">
            Cliquez sur un tag pour masquer visuellement une station
          </p>
          <TransitionGroup name="list" tag="ul" class="space-y-3">
            <li v-for="(stop, index) in addedStations" :key="index">
              <button
                  class="w-full text-left flex items-center px-3 py-1 rounded-full text-sm transition hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer"
                  :class="[
                  stop.isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-400 line-through opacity-50',
                ]"
                  @click="$emit('toggleStop', stop.stop_unique_id)"
              >
                {{ stop.stop_name }}
              </button>
            </li>
          </TransitionGroup>
        </div>
      </transition>
    </div>

  </div>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
.accordion-enter-to, .accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
