<script setup>
import {ref, onMounted, computed} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import Sparkline from "@/components/Sparkline.vue";

const mainStore = useMainStore();
const {topCoins} = storeToRefs(mainStore);

const fetchTopCoinsData = async () => {
  const responseData = (await apiGet(apiRoutes.topCoins)).data;
  // check if the response is valid
  if (!responseData.success || !responseData.data) {
    return;
  }
  topCoins.value = responseData?.data;
};

onMounted(fetchTopCoinsData);

const columns = [
  {name: 'id', required: true, label: 'ID', align: 'left', field: 'id'},
  {name: 'name', required: true, label: 'Name', align: 'left', field: 'name'},
  {name: 'symbol', required: true, label: 'Symbol', align: 'left', field: 'symbol'},
  {name: 'image', required: true, label: 'Image', align: 'left', field: 'image'},
  {name: 'current_price', required: true, label: 'Current Price', align: 'left', field: 'current_price'},
  {
    name: 'price_change_percentage_24h',
    required: true,
    label: 'Price Change',
    align: 'left',
    field: 'price_change_percentage_24h'
  },
  {name: 'sparkline', required: true, label: 'Sparkline', align: 'left', field: 'sparkline'},
];

const tableRows = computed(() => {
  return topCoins.value.reduce((acc, coin) => {
    acc.push({
      id: coin?.id,
      name: coin?.name,
      symbol: coin?.symbol,
      image: coin?.image,
      current_price: coin?.current_price,
      price_change_percentage_24h: coin?.price_change_percentage_24h,
      sparkline: coin?.sparkline_in_7d?.price,
    });
    return acc;
  }, []);
});

const imageColumns = [
  'image',
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
            :class="imageColumns.includes(col.name) ? 'q-pa-none' : ''"
        >
          <q-avatar v-if="col.name === 'image'" :src="props.row.image"/>

          <sparkline v-if="col.name==='sparkline'" v-bind:data="[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]"></sparkline>

          <q-td v-else>
            {{ props.row[col.name] }}
          </q-td>
        </q-td>
      </q-tr>
    </template>

  </q-table>

</template>

<style scoped>

</style>