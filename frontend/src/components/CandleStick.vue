<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const mainStore = useMainStore();
const {ohlcData} = storeToRefs(mainStore);

const cleanedData = computed(() => {
      return ohlcData.value.map((item) => {
        return {
          x: new Date(item['time']),
          y: [item['open'], item['high'], item['low'], item['close']]
        };
      });
    }
);

const options = {
  title: {
    text: 'CandleStick Chart',
    align: 'left'
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  }
};
const series = computed(() => {
  return [
    {
      name: 'candle',
      data: cleanedData.value
    }
  ];
});

</script>

<template>
  <div class="row">
    <apexchart class="col-12" type="candlestick" :options="options" :series="series"></apexchart>
  </div>


</template>

<style scoped>

</style>