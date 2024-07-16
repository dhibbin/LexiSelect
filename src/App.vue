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

    <TextBar @on-generation-recieved="onGenerationRecieved" />
 

    <v-main style="overflow-y: hidden;">
      <textarea
        v-model="paragraph"
      />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref, type Ref } from 'vue'
  import SideBar from './components/SideBar.vue'
  import TextBar from './components/TextBar.vue'
import type { LlamaInterface } from './objects/LlamaInterface';

  const drawer : Ref<boolean> = ref(true)
  const paragraph : Ref<string> = ref("")

  function onGenerationRecieved(value : LlamaInterface) : void {
    paragraph.value = value.content
  }


</script>
