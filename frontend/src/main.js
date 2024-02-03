import {createApp} from 'vue';
import {Loading, Quasar} from 'quasar';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';
import {createPinia} from "pinia";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue';
import router from "@/router/index.js";

const myApp = createApp(App);

import VueApexCharts from "vue3-apexcharts";

myApp.use(Quasar, {
    plugins: {Loading}, // import Quasar plugins and add here
    config: {
        loading: {
            delay: 400,
            message: 'Loading...',
            spinnerSize: 100,
            spinnerColor: 'primary',
        },
        // dark: {
        //
        // }


    },
});

myApp.use(router);

const pinia = createPinia();
myApp.use(pinia);

myApp.use(VueApexCharts);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app');
