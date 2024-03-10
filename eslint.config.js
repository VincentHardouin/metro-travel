import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },

  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
});
