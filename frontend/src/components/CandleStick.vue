<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {useQuasar} from "quasar";

const mainStore = useMainStore();
const {ohlcData, ohlcSymbol} = storeToRefs(mainStore);
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

const $q = useQuasar();

const options = computed(() => ({
  title: {
    text: (ohlcSymbol.value + '/usd').toUpperCase(),
    align: 'center',
    style: {
      fontSize: '20px',
      color: $q.dark.isActive ? '#fff' : '#000'
    }
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tooltip: {
      enabled: true
    }
  },
  tooltip: {
    theme: $q.dark.isActive ? 'dark' : 'light',
    style: {
      fontSize: '14px',
      fontFamily: 'arial',
      backgroundColor: '#ee0505',
      color: '#e51010'
    }
  },
}));

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