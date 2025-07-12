<script setup>
import confetti from 'canvas-confetti';
import { onMounted, ref } from 'vue';
import RouteTimeline from '~/components/RouteTimeline.vue';

defineProps(['information']);
defineEmits(['close']);
const canvas = ref(null);

onMounted(() => {
  const myConfetti = confetti.create(canvas.value, {
    resize: true,
    useWorker: true,
  });

  myConfetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 },
  });
});
</script>

<template>
  <div>
    <div
      class="fixed inset-0 z-40 bg-black/50 flex items-center justify-center text-center"
      @click="$emit('close')"
    >
      <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-xl z-50 relative">
        <h2 class="text-4xl font-bold text-primary mb-4">
          🎉 Félicitations !
        </h2>

        <template v-if="information.minTry !== information.try">
          <p class="mb-4 text-gray-600 dark:text-gray-300">
            Vous avez terminé votre parcours en
            <span class="font-semibold text-primary">{{ information.try }}</span> tentative<span
              v-if="information.try > 1"
            >s</span>.<br>
            Le meilleur chemin nécessite
            <span class="font-semibold text-green-600">{{ information.minTry }}</span> arrêt<span
              v-if="information.minTry > 1"
            >s</span>.
          </p>
        </template>
        <template v-else>
          <p class="mb-4 text-gray-600 dark:text-gray-300">
            Vous avez trouvé le trajet idéal !
          </p>
        </template>

        <section class="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6">
          <h3 class="font-medium mb-2">
            Trajet idéal
          </h3>

          <RouteTimeline :stops="information.stops" />
        </section>

        <button class="btn btn-primary rounded-full" @click="$emit('close')">
          Fermer
        </button>
      </div>
    </div>

    <canvas
      ref="canvas"
      class="fixed inset-0 z-50 pointer-events-none"
    />
  </div>
</template>
