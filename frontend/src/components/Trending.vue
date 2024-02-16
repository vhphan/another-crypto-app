<script setup>
import {ref, onMounted, computed} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {trendingCoins, trendingOhlcSymbol} = storeToRefs(mainStore);

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
  {name: 'marketCapRank', required: true, label: 'Market Cap Rank', align: 'left', field: 'marketCapRank'},
  {name: 'marketCap', required: true, label: 'Market Cap', align: 'left', field: 'marketCap'},
  {name: 'marketCapBTC', required: true, label: 'Market Cap BTC', align: 'left', field: 'marketCapBTC'},
  {name: 'totalVolume', required: true, label: 'Total Volume', align: 'left', field: 'totalVolume'},
  {name: 'sparkline', required: true, label: 'Sparkline', align: 'left', field: 'sparkline'},
];

const tableRows = computed(() => {
  return trendingCoins.value.reduce((acc, coin) => {
    acc.push({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      thumb: coin.item.thumb,
      marketCapRank: coin.item.market_cap_rank,
      marketCap: coin.item.data.market_cap,
      marketCapBTC: coin.item.data.market_cap_btc,
      totalVolume: coin.item.data.total_volume,
      sparkline: coin.item.data.sparkline,
    });
    return acc;
  }, []);
});

const imageColumns = [
  'thumb',
  'sparkline',
];

const pagination = ref({
  rowsPerPage: 0
});

const rowClasses = computed(() => {
  return (row) => {
    return row.symbol.toLowerCase() === trendingOhlcSymbol.value ? mainStore.backgroundColor : '';
  };
});

const handleRowClick = (evt, row) => {
  mainStore.trendingOhlcSymbol = row.symbol.toLowerCase();
};

</script>

<template>

  <q-table
      :rows="tableRows"

      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"

      :columns="columns"
      row-key="id"
      class="my-sticky-virtscroll-table"

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

<style>
.my-sticky-virtscroll-table {
  /* height or max-height is important */
  height: 510px;
  /* this will be the loading indicator */
  /* prevent scrolling behind sticky top row on focus */
}

.my-sticky-virtscroll-table .q-table__top,
.my-sticky-virtscroll-table .q-table__bottom,
.my-sticky-virtscroll-table thead tr:first-child th {
  background-color: #484b4d;
}

.my-sticky-virtscroll-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-virtscroll-table thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

.my-sticky-virtscroll-table thead tr:first-child th {
  top: 0;
}

.my-sticky-virtscroll-table tbody {
  /* height of all previous header rows */
  scroll-margin-top: 48px;
}
</style>