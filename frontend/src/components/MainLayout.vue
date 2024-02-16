<script setup>
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {basePath} from "../../config";
import {useQuasar} from "quasar";


const route = useRoute();
const routeName = computed(() => route.name);

const sideBarItems = [
  {
    label: 'Trending Coins',
    icon: 'mdi-home',
    to: `${basePath}trending`
  },
  {
    label: 'Top Coins',
    icon: 'mdi-currency-usd',
    to: `${basePath}topCoins`
  },

  {
    label: 'About',
    icon: 'mdi-information',
    to: `${basePath}about`
  },
];

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const $q = useQuasar();
const toggleDarkMode = () => {
  $q.dark.set(!$q.dark.isActive);
};

</script>

<template>
  <q-layout view="lHh lpR lFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!--        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>-->
        <q-toolbar-title class="col-3" shrink>
          Crypto App
        </q-toolbar-title>
        <q-tabs align="left" dense style="margin-top: 0; padding-top: 0;">
          <q-route-tab
              v-for="item in sideBarItems"
              :key="item.label"
              :to="item.to"
              :value="item.to"
              :label="item.label"
              :class="{'q-tab--active': routeName === item.to}"
          />
        </q-tabs>
        <q-space/>
        <q-btn icon="contrast" flat round dense
               @click="toggleDarkMode"
        />
      </q-toolbar>
    </q-header>

    <!--    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>-->
    <!--      &lt;!&ndash; drawer content &ndash;&gt;-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>
