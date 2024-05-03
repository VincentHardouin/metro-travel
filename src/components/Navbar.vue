<script setup>

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        Métro Travel
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li>
            <RouterLink to="/practice" class="nav-link">
              Entrainement
            </RouterLink>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-bs-toggle="modal"
              data-bs-target="#rules-modal"
            >
              Règles
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              data-bs-toggle="modal"
              data-bs-target="#about-modal"
            >
              À propos
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
