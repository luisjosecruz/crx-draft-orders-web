<template>
  <v-app class="bg-blue-grey-lighten-4" :class="layout_class">
    <component :is="layout">
      <router-view />
    </component>

    <Loader />
    <Alerts />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Alerts from '@/components/Modals/Alerts.vue'
import Loader from '@/components/Partials/Loader.vue'

const default_layout = 'default'
const default_class_layout = ''

const route = useRoute()

const layout = computed(() => `${route?.meta?.layout || default_layout}-layout`)
// const layout_class = computed(() => `${route?.name || default_class_layout}`)
const layout_class = computed(() => 
    typeof route?.name === 'string' ? route?.name : default_class_layout
);
</script>

<style lang="scss">
@import "@/assets/scss/app.scss";
</style>
