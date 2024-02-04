<script setup>
import MainLayout from './components/MainLayout.vue'
import {useMainStore} from "@/store/mainStore.js";
import {watch} from "vue";
import {defineProps, defineEmits} from 'vue';

const props = defineProps();
const emits = defineEmits();
const mainStore = useMainStore();

watch(() => mainStore.ohlcSymbol, (value, oldValue) => {
  mainStore.getOhlcData(value);
});

</script>

<template>
  <MainLayout></MainLayout>
</template>

<style scoped></style>
