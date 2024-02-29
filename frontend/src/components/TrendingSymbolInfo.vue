<script setup>
import {useMainStore} from "@/store/mainStore.js";
import {computed, watch} from "vue";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {trendingOhlcSymbol, trendingOhlcData} = storeToRefs(mainStore);


const assetDescription = computed(() => {
  const coinMarketData = trendingOhlcData.value?.filter ? trendingOhlcData.value?.filter(d => d.source === 'coinmarketcap') : null;
  const cryptoCompareData = trendingOhlcData.value?.filter ? trendingOhlcData.value?.filter(d => d.source === 'cryptocompare') : null;

  let finalDescription = '';

  if (coinMarketData?.length > 0 && coinMarketData[0]?.Data?.ASSET_DESCRIPTION) {
    finalDescription += '<b>CoinMarketCap Description:</b><br/>';
    finalDescription += '<hr/>';
    finalDescription += coinMarketData[0].Data.ASSET_DESCRIPTION;
  }

  if (cryptoCompareData?.length > 0) {
    finalDescription += '<br/>';
    finalDescription += '<br/>';
    finalDescription += `<b>CryptoCompare Description(s) :</b><br/>`;
  }
  cryptoCompareData?.forEach((data, index) => {
    if (data?.data && data.data[trendingOhlcSymbol.value.toUpperCase()]) {
      if (finalDescription) {
        //   add a separator line
        finalDescription += '<hr/>';
      }
      finalDescription += `<b>Description (${index + 1})</b><br/>`;
      finalDescription += data.data[trendingOhlcSymbol.value.toUpperCase()][0]?.description || '';
    }
  });
  return finalDescription;
});

watch(() => mainStore.trendingOhlcSymbol, (value, oldValue) => {
  mainStore.getTrendingOhlcData();
}, {immediate: true});


</script>

<template>

  <div v-if="trendingOhlcData">
    <q-card class="text-h5">
      <q-card-section>
        {{ trendingOhlcSymbol.toUpperCase() }}
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-h6">Description</div>
        <div v-html="assetDescription"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>

</style>