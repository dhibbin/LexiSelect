<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Lexi Select</v-app-bar-title>
      <v-btn 
        icon="mdi-magnify" 
        variant="text" 
      />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :width="400"
      app
    >
      <!--  -->
      <SideBar />
    </v-navigation-drawer>

    <v-main>
      <v-container
        fluid
        class="bg-grey-lighten-5 ma-0 d-flex justify-end align-end fill-height fill-width"
      >
        <v-row
          align="end"
          no-gutters
          class="pa-0"
        >
          <v-col cols="6">
            <v-textarea
              class="fill-height d-flex flex-column pa-2"
              label="System Prompt"
            />
          </v-col>
          <v-col cols="6">
            <v-textarea
              class="fill-height d-flex flex-column pa-2"
              label="User Prompt"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import SideBar from './components/SideBar.vue'

const drawer = ref(true)



</script>
