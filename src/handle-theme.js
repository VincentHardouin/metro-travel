const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMedia.addEventListener('change', () => {
  const theme = getCurrentTheme();
  if (theme === 'auto')
    setTheme('auto');
});

export function setTheme(theme) {
  const realTheme = theme === 'auto' ? (darkModeMedia.matches ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-theme', realTheme);
  document.documentElement.setAttribute('data-bs-theme', realTheme);
  localStorage.setItem('theme', theme);
}

export function initTheme() {
  const theme = localStorage.getItem('theme') || 'auto';
  setTheme(theme);
}

export function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}
