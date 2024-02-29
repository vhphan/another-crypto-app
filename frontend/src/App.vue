<script setup>
import MainLayout from './components/MainLayout.vue'
import {useMainStore} from "@/store/mainStore.js";
import {defineEmits, defineProps, watch} from "vue";
import {useQuasar} from "quasar";

const props = defineProps();
const emits = defineEmits();
const mainStore = useMainStore();

watch(() => mainStore.ohlcSymbol, () => {
      mainStore.getOhlcData(mainStore.ohlcSymbol, 'USD', 90, mainStore.ohlcTimeResolution);
    }, {immediate: true}
);



const $q = useQuasar();

window.onbeforeunload = () => {
  mainStore.darkMode = $q.dark.isActive;
};

window.onload = () => {
  $q.dark.set(mainStore.darkMode);
};

</script>

<template>
  <MainLayout></MainLayout>
</template>

<style scoped></style>
