import { createApp } from 'vue';
import App from './App.vue';

import { router } from './router';

import { initTheme } from './handle-theme.js';

const app = createApp(App);

app.use(router).mount('#app');

initTheme();
