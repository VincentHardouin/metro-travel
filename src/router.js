import { createRouter, createWebHistory } from 'vue-router';
import Index from './pages/Index.vue';
import Post from './pages/Post.vue';
import Posts from './pages/Posts.vue';
import PageNotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/practice', name: 'Practice', component: Index },
    { path: '/posts/', name: 'Posts', component: Posts },
    { path: '/posts/:slug', name: 'Post', component: Post },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
  ],
});

export { router };
