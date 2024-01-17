import {createRouter, createWebHistory} from 'vue-router';
import {basePath} from "../../config.js";

const routes = [
    {
        path: basePath + 'about',
        name: 'About',
        component: () => import('@/pages/About.vue'),
    },
    {
        path: basePath + 'main',
        name: 'Main',
        component: () => import('@/pages/Main.vue'),
    },
    // path / redirects to /main
    {
        path: basePath,
        redirect: basePath +'main',
    }
];

const router = createRouter({
    base: basePath,
    history: createWebHistory(),
    mode: 'history',
    routes,
});

export default router;