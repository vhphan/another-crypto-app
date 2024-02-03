<script setup>
import {ref, onMounted, computed} from 'vue';
import {apiGet, apiRoutes} from '../api/apiCalls.js';
import {useMainStore} from "@/store/mainStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();
const {headlines} = storeToRefs(mainStore);

const fetchNewsData = async () => {
  const responseData = (await apiGet(apiRoutes.headlines)).data;
  // check if the response is valid
  if (!responseData.success || !responseData.data) {
    return;
  }
  headlines.value = responseData?.data;
  console.log(headlines.value);
};

onMounted(fetchNewsData);

const chartHeight = `${Math.max(window.innerHeight - 600, 250)}px`;

</script>

<template>
  <div class="col-xs-12 col-sm-4"
       :style="`min-height: 50px; max-height: ${chartHeight}; overflow-y: auto;`
">
    <q-card
        v-for="headline in headlines"
        flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <q-card-section>
        <div class="row items-center no-wrap">

          <div class="col">
            <div class="text-h6">{{ headline.title }}}</div>
            <div class="text-subtitle2">{{ headline.published_at }}</div>
          </div>

        </div>
      </q-card-section>


      <q-separator/>

      <q-card-actions>
        <q-btn flat><a target="_blank" :href="`${headline.url}`">Read more</a></q-btn>
        <q-space />
        <div class="text-subtitle2">Source: {{ headline.source.title }}</div>

      </q-card-actions>
    </q-card>
  </div>
  <!--  create a card component that loops over headlines-->

</template>

<style scoped>

</style>