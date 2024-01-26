import { createApp } from 'vue'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import {createPinia} from "pinia";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import router from "@/router/index.js";

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})

myApp.use(router);

const pinia = createPinia()
myApp.use(pinia)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
