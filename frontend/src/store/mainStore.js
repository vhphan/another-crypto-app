import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";


export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        version: useLocalStorage('version', '0.0.0'),

        
    }),

    actions: {
        

    },
    getters: {
        

    }
});