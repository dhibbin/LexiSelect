<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Lexi Select</v-app-bar-title>
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
        class="bg-grey-lighten-5 ma-0 justify-end align-end fill-width flex-nowrap"
      > 
      <v-row>
        hello
      </v-row>
      <TextBar />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref, type Ref } from 'vue'
  import SideBar from './components/SideBar.vue'
  import TextBar from './components/TextBar.vue'

  const drawer : Ref<boolean> = ref(true)


</script>
