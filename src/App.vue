<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Lexi Select</v-app-bar-title>
      <v-btn
        icon="mdi-gavel" 
        variant="text" 
        @click="sendTestJson"
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

    <TextBar
      :branch-tokens="outputs"
      @on-generation-recieved="onGenerationRecieved"
    />
 

    <v-main
      class="d-flex align-center justify-center"
      style="overflow-y: hidden;"
    >
      <TextTree
        :response-l-l-m="latestResponse"
        @update-outputs="updateOutputs"
      />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import SideBar from './components/SideBar.vue'
import TextBar from './components/TextBar.vue'
import TextTree from './components/TextTree.vue'
import testResponse from './assets/testResponse.json'
import { defaultLlamaInterface, type LlamaInterface } from './objects/LlamaInterface';
import type { TreeToken } from './components/TextBranch.vue'


const drawer : Ref<boolean> = ref(true)
const paragraph : Ref<string> = ref("")
const latestResponse : Ref<LlamaInterface> = ref(defaultLlamaInterface())
const outputs : Ref<(TreeToken[] | null)[]> = ref([])
let number = 0

function onGenerationRecieved(value : LlamaInterface) : void {
  paragraph.value = value.content
  latestResponse.value = value
}

function sendTestJson() : void {
  latestResponse.value = JSON.parse(JSON.stringify(testResponse))
  latestResponse.value.content += (number++).toString()
}

function updateOutputs(newOutputs : (TreeToken[] | null)[]) : void {
  outputs.value = newOutputs
}


</script>
