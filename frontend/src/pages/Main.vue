<script setup>
import {ref} from 'vue';
import Trending from "@/components/Trending.vue";
import TopCoins from "@/components/TopCoins.vue";
import CandleStick from "@/components/CandleStick.vue";


const tab = ref('trending');
</script>

<template>
  <q-tabs
      v-model="tab"
      class="text-teal"
  >
    <q-tab name="trending" icon="mail" label="Trending"/>
    <q-tab name="topCoins" icon="mail" label="Top Coins"/>
  </q-tabs>
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="trending">
      <trending/>
    </q-tab-panel>

    <q-tab-panel name="topCoins">
      <candle-stick/>
      <top-coins/>
    </q-tab-panel>

  </q-tab-panels>

</template>