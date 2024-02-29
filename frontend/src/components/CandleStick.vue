<script setup>

import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {debounce, useQuasar} from "quasar";

const mainStore = useMainStore();
const {ohlcData, ohlcSymbol} = storeToRefs(mainStore);
const apexChart = ref(null);

const cleanedData = computed(() => {
      return ohlcData.value.map((item) => {
        return {
          x: new Date(item['time'] * 1000),
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


window.addEventListener('resize', debounce(() => {
      // chartHeight.value = `${heightValue}px`;
      if (!apexChart.value || !apexChart.value.updateOptions) return;
      apexChart.value.updateOptions({
        chart: {
          height: mainStore.chartHeight
        }
      });
    }, 1000)
);

const {ohlcTimeResolution} = storeToRefs(mainStore);
</script>

<template>
  <div class="chart-container">
    <q-select
        class='select-box'
        v-model="ohlcTimeResolution"
        :options="['daily', 'hourly']"
        label="Resolution"
        dense
        bg-color="blue-1"
        outlined
        standout
    />
    <apexchart class="col-12"
               type="candlestick"
               :options="options"
               :series="series"
               :height="mainStore.chartHeight"
               ref="apexChart"
    ></apexchart>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}

.select-box {
  position: absolute;
  top: 1px; /* adjust as needed */
  left: 5px; /* adjust as needed */
  z-index: 10;
  width: 150px;
}
</style>