<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Lexi Select</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="bg-deep-purple-lighten-5 ma-0 d-flex justify-end align-end fill-height fill-width">
        <v-row align="end" no-gutters class="pa-0">
          <v-col cols="6"
            v-for="n in 2"
            :key="n"
          >
            <v-textarea class="fill-height d-flex flex-column pa-2" label="Label"></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">
  import { ref } from 'vue'

  const drawer = ref(true)
</script>
