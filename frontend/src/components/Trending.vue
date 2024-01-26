<script setup>
import {ref, onMounted, computed} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {trendingCoins} = storeToRefs(mainStore);

const fetchTrendingData = async () => {
  const responseData = (await apiGet(apiRoutes.trending)).data;
  // check if the response is valid
  if (!responseData.success || !responseData.data || !responseData.data['coins']) {
    return;
  }
  trendingCoins.value = responseData?.data['coins'];
};

onMounted(fetchTrendingData);

const columns = [
  {name: 'id', required: true, label: 'ID', align: 'left', field: 'id'},
  {name: 'name', required: true, label: 'Name', align: 'left', field: 'name'},
  {name: 'symbol', required: true, label: 'Symbol', align: 'left', field: 'symbol'},
  {name: 'thumb', required: true, label: 'Thumb', align: 'left', field: 'thumb'},
  {name: 'sparkline', required: true, label: 'Sparkline', align: 'left', field: 'sparkline'},
];

const tableRows = computed(() => {
  return trendingCoins.value.reduce((acc, coin) => {
    acc.push({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      thumb: coin.item.thumb,
      sparkline: coin.item.data.sparkline,

    });
    return acc;
  }, []);
});

const imageColumns = [
  'thumb',
  'sparkline',
];

</script>

<template>

  <q-table
      :rows="tableRows"
      :columns="columns"
      row-key="id"
  >

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
        >
            <span v-if="!imageColumns.includes(col.name)">
              {{ col.value }}</span>

          <span v-else>
            <img :src="props.row[col.field]" alt="">
          </span>

        </q-td>
      </q-tr>
    </template>

  </q-table>

</template>

<style scoped>

</style>