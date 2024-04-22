<script setup>
defineProps(['information']);
</script>

<template>
  <div id="finish-modal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Bravo ! Défi du jour terminé
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div v-if="information" id="result" class="modal-body">
          <p>Bravo, tu as réussi à relier les deux stations en {{ information.try }} stations ! 🎉</p>
          <p>Voici le chemin optimal en {{ information.minTry }} stations : </p>
          <ul>
            <li
              v-for="(stop, index) in information.stops"
              :key="index"
              :class="{ start: index === 0, end: index === information.stops.length - 1 }"
            >
              {{ stop }}
            </li>
          </ul>
          <p>Vous avez terminé ! À demain !</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
