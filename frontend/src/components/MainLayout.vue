
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { basePath } from "../../config";


const route = useRoute();
const routeName = computed(() => route.name);

const sideBarItems = [
    {
        label: 'Main',
        icon: 'mdi-home',
        to: `${basePath}main`
    },
    {
        label: 'About',
        icon: 'mdi-information',
        to: `${basePath}about`
    },
]


</script>

<template>
    <v-layout class="rounded rounded-md">
        <v-app-bar title="Application bar"></v-app-bar>

        <v-navigation-drawer>
            <v-list>
                <v-list-item title="Navigation drawer"></v-list-item>
                <v-divider></v-divider>
                <v-list-item-group>
                    <v-list-item v-for="item in sideBarItems" :key="item.label" :to="item.to" :value="item.to" :class="{'v-list-item--active': routeName === item.to}">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.label }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <router-view></router-view>
        </v-main>
    </v-layout>
</template>