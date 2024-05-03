<script setup>
import { ref } from 'vue';
import { getCurrentTheme, setTheme } from '../handle-theme.js';
import ThemeIcon from './ThemeIcon.vue';

const currentTheme = ref(getCurrentTheme());

function changeTheme(event) {
  const theme = event.target.value;
  currentTheme.value = theme;
  setTheme(theme);
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container container-fluid">
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
          <li class="nav-item dropdown">
            <button
              id="themeDropdown"
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <ThemeIcon :icon="currentTheme" />
              Theme
            </button>
            <ul class="dropdown-menu" aria-labelledby="themeDropdown">
              <li>
                <button class="dropdown-item" type="button" value="auto" @click="changeTheme">
                  <ThemeIcon icon="auto" />
                  OS Default
                </button>
              </li>
              <li>
                <button class="dropdown-item" type="button" value="dark" @click="changeTheme">
                  <ThemeIcon icon="dark" />
                  Dark
                </button>
              </li>
              <li>
                <button class="dropdown-item" type="button" value="light" @click="changeTheme">
                  <ThemeIcon icon="light" />
                  Light
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
