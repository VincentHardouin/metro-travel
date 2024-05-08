import { gfmHeadingId } from 'marked-gfm-heading-id';

export default {
  marked: {
    breaks: false,
    pedantic: false,
    gfm: true,
    tables: true,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    mangle: false,
    headerIds: false,
  },
  extensions: [gfmHeadingId({ prefix: 'tst-' })],
};
