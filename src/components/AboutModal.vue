<script setup>

</script>

<template>
  <div id="about-modal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            À propos
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <p>
            Métro Travel est un jeu quotidien, dont l'objectif est de trouver
            les différentes stations entre celle de départ et d'arrivée.
          </p>
          <p>
            Le site est développé par
            <a href="https://vincentHardouin.dev/">Vincent Hardouin</a>, le
            code source est disponible sur
            <a href="https://github.com/VincentHardouin/metro-travel/">GitHub</a>.
          </p>
          <p>L'idée originale est de Marianne.</p>
          <p>
            N'hésitez pas à me faire des retours, des suggestions
            d'améliorations et/ou à contribuer.
          </p>
          <p>Uniquement les statistiques de visite sont récupérées.</p>
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
