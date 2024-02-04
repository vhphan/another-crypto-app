<script setup>

import Headlines from "@/components/Headlines.vue";
import TopCoins from "@/components/TopCoins.vue";
import CandleStick from "@/components/CandleStick.vue";
</script>

<template>
  <div class="row">
    <candle-stick
        class="col-xs-12 col-sm-8 "
    />
    <headlines/>
  </div>
  <top-coins/>
</template>

<style scoped>

</style>