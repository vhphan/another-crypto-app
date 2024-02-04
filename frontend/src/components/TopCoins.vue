<script setup>
import {ref, onMounted, computed} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import Sparkline from "@/components/Sparkline.vue";
import {useQuasar} from "quasar";

const mainStore = useMainStore();
const {topCoins, ohlcSymbol} = storeToRefs(mainStore);

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

    if (!coin || !coin?.id) {
      return acc;
    }

    acc.push({
      id: coin?.id ?? 'N/A',
      name: coin?.name ?? 'N/A',
      symbol: coin?.symbol ?? 'N/A',
      image: coin?.image ?? 'N/A',
      current_price: coin?.current_price ?? 'N/A',
      price_change_percentage_24h: coin?.price_change_percentage_24h ?? 'N/A',
      sparkline: coin?.sparkline_in_7d?.price ?? 'N/A',
    });
    return acc;

  }, []);
});

const imageColumns = [
  'image',
];

const handleRowClick = (evt, row) => {
  mainStore.ohlcSymbol = row.symbol;
};

const $q = useQuasar();
const rowClasses = computed(() => {
  return (row) => {
      return row.symbol === ohlcSymbol.value ? mainStore.backgroundColor : '';
  };
});

</script>

<template>

  <q-table
      :rows="tableRows"
      :columns="columns"
      row-key="id"
  >

    <template v-slot:body="props">
      <q-tr :props="props"
            @click="(evt) => handleRowClick(evt, props.row)"
            :class="rowClasses(props.row)"
      >
        <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="imageColumns.includes(col.name) ? 'q-pa-none' : ''"
        >

          <sparkline v-if="col.name==='sparkline'" v-bind:data="props.row[col.name]"></sparkline>

          <q-td v-else-if="col.name==='image'">
            <img :src="props.row[col.field]" alt="" style="max-height: 1.5rem;">
          </q-td>

          <q-td v-else>
            <div>
              {{ props.row[col.name] }}
            </div>
          </q-td>

        </q-td>
      </q-tr>
    </template>

  </q-table>

</template>

<style scoped>
.selected-row {
  background-color: red;
}
</style>