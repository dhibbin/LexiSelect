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
 

    <v-main
      class="d-flex align-center justify-center"
      style="overflow-y: hidden;"
    >
      <TextTree :generated-text="paragraph" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref, type Ref } from 'vue'
  import SideBar from './components/SideBar.vue'
  import TextBar from './components/TextBar.vue'
  import TextTree from './components/TextTree.vue'
  import type { LlamaInterface } from './objects/LlamaInterface';

  const drawer : Ref<boolean> = ref(true)
  const paragraph : Ref<string> = ref("Hello World")

  function onGenerationRecieved(value : LlamaInterface) : void {
    paragraph.value = value.content
  }


</script>
