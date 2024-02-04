<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const mainStore = useMainStore();
const {headlines, ohlcSymbol} = storeToRefs(mainStore);

const filterHeadlinesBySymbol = ref(false);

const fetchNewsData = async () => {
  const options = {method: 'GET'};
  if (ohlcSymbol.value && filterHeadlinesBySymbol.value) {
    options.params = {symbol: ohlcSymbol.value};
  }
  const responseData = (await apiGet(apiRoutes.headlines, options)).data;
  // check if the response is valid
  if (!responseData.success || !responseData.data) {
    return;
  }
  headlines.value = responseData?.data;
  console.log(headlines.value);
};

onMounted(fetchNewsData);

const chartHeight = `${Math.max(window.innerHeight - 600, 250)}px`;

const timeAgo = (date) => {
  const now = new Date();
  const publishedDate = new Date(date);
  const seconds = Math.floor((now - publishedDate) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

const $q = useQuasar();
const classObj = computed(() => ({
  'text-red-3': $q.dark.isActive,
  'text-blue-10': !$q.dark.isActive
}));
// watch(() => $q.dark.isActive, val => {
//   console.log(val ? 'On dark mode' : 'On light mode');
// });
watch([() => filterHeadlinesBySymbol.value, () => ohlcSymbol.value],
    () => {
      if (filterHeadlinesBySymbol.value || ohlcSymbol.value) {
        fetchNewsData();
      }
    }
);
</script>

<template>
  <div
      class="col-xs-12 col-sm-4"
      :style="`min-height: 50px; max-height: ${chartHeight}; overflow-y: auto;`"
  >
    <div>
      <q-space/>
      <q-toggle
          label="Filter by symbol"
          v-model="filterHeadlinesBySymbol"
      />
    </div>
    <q-card
        v-for="headline in headlines"
        flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-bold text-subtitle1">{{ headline.title }}}</div>
            <div class="text-subtitle2">{{ timeAgo(headline.published_at) }}</div>
          </div>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions>
        <q-btn flat><a
            target="_blank" :href="`${headline.url}`"
            :class="classObj"
        >Read more</a></q-btn>
        <q-space/>
        <div class="text-subtitle2">Source: {{ headline.source.title }}</div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped>

</style>