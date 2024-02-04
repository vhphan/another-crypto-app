import {createRouter, createWebHistory} from 'vue-router';
import {basePath} from "../../config.js";

const routes = [
    {
        path: basePath + 'about',
        name: 'About',
        component: () => import('@/pages/About.vue'),
    },
    {
        path: basePath + 'topCoins',
        name: 'TopCoins',
        component: () => import('@/pages/TopCoinsPage.vue'),
    },
    {
      path: basePath + 'trending',
        name: 'Trending',
        component: () => import('@/pages/TrendingPage.vue'),
    },
    // path / redirects to /main
    {
        path: basePath,
        redirect: basePath +'topCoins',
    }
];

const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});

export default router;