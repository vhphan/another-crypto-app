<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

const mainStore = useMainStore();
const {ohlcData} = storeToRefs(mainStore);
const apexChart = ref(null);

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
  },

};

const series = computed(() => {
  return [
    {
      name: 'candle',
      data: cleanedData.value
    }
  ];
});

const chartHeight = `${Math.max(window.innerHeight - 600, 250)}px`;

window.addEventListener('resize', () => {
      const heightValue = Math.max(window.innerHeight - 600, 250);
      // chartHeight.value = `${heightValue}px`;
      apexChart.value.updateOptions({
        chart: {
          height: heightValue
        }
      });
    }
);

</script>

<template>
  <div class="row">
    <apexchart class="col-12"
               type="candlestick"
               :options="options"
               :series="series"
               :height="chartHeight"
               ref="apexChart"
    ></apexchart>
  </div>


</template>

<style scoped>

</style>