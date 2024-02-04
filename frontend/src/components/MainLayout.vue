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
<!--          <q-avatar>-->
<!--            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">-->
<!--          </q-avatar>-->
          Title
        </q-toolbar-title>
          <q-tabs align="left" dense style="margin: 0; padding-top: 0; max-height: 50px;">
            <q-route-tab
                style="margin-top: 0;"
                v-for="item in sideBarItems"
                :key="item.label"
                :to="item.to"
                :value="item.to"
                :label="item.label"
                :icon="item.icon"
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

<!--<template>-->
<!--    <v-layout class="rounded rounded-md">-->
<!--        <v-app-bar title="Application bar"></v-app-bar>-->

<!--        <v-navigation-drawer>-->
<!--            <v-list>-->
<!--                <v-list-item title="Navigation drawer"></v-list-item>-->
<!--                <v-divider></v-divider>-->
<!--                <v-list-item-group>-->
<!--                    <v-list-item v-for="item in sideBarItems" :key="item.label" :to="item.to" :value="item.to" :class="{'v-list-item&#45;&#45;active': routeName === item.to}">-->
<!--                        <v-list-item-icon>-->
<!--                            <v-icon>{{ item.icon }}</v-icon>-->
<!--                        </v-list-item-icon>-->
<!--                        <v-list-item-content>-->
<!--                            <v-list-item-title>{{ item.label }}</v-list-item-title>-->
<!--                        </v-list-item-content>-->
<!--                    </v-list-item>-->
<!--                </v-list-item-group>-->
<!--            </v-list>-->

<!--        </v-navigation-drawer>-->

<!--        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">-->
<!--            <router-view></router-view>-->
<!--        </v-main>-->
<!--    </v-layout>-->
<!--</template>-->