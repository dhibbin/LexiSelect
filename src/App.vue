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
      @generation-failed="onGenerationFailed"
    />
 

    <v-main
      class="d-flex align-center justify-center"
      style="overflow-y: hidden;"
    >
      <v-snackbar
        v-model="showSnackbar"
        color="error"
        :timeout="3000"
      >
        <div class="d-flex justify-space-evenly bg-transparent">
          <v-sheet
            class="pa-2 bg-transparent"
          >
            Request to LLM server failed
          </v-sheet>  
          <v-btn
            class="align-center justify-center"
            color="background"
            @click="showSnackbar = false"
          >
            Close
          </v-btn>
        </div>  
      </v-snackbar> 
    
      <TextTree
        :response-l-l-m="latestResponse"
        @update-outputs="updateOutputs"
      />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue'
import SideBar from './components/SideBar.vue'
import TextBar from './components/TextBar.vue'
import TextTree from './components/TextTree.vue'
import testResponse from './assets/testResponse.json'
import { defaultLlamaInterface } from './objects/LlamaInterface';
import type { TreeToken } from './components/TextBranch.vue'
import { type BranchResposne } from './components/TextTree.vue';

const drawer : Ref<boolean> = ref(true)
const latestResponse : Ref<BranchResposne> = ref({ response : defaultLlamaInterface(), index : -1})
const outputs : Ref<(TreeToken[] | null)[]> = ref([])
const showSnackbar = ref(false)


function onGenerationRecieved(newReponse : BranchResposne) : void {
  latestResponse.value = newReponse
}

function sendTestJson() : void {
  latestResponse.value = reactive({
    response : JSON.parse(JSON.stringify(testResponse)),
    index : -1,
  }) 
}

function updateOutputs(newOutputs : (TreeToken[] | null)[]) : void {
  outputs.value = newOutputs
}

function onGenerationFailed() : void {
  showSnackbar.value = true
}


</script>
