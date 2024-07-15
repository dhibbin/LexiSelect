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

    <v-app-bar
      color="grey-lighten-2"
      height="75"
      location="bottom"
      flat
    >
      <v-btn
        block
        class="pa-6"
        color="blue"
        base-color="blue"
        variant="elevated"
        rounded="lg"
        @click="attemptLLMGeneration"
      >
        Block Button
      </v-btn>
    </v-app-bar>

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
          <v-col
            cols="6"
            align-self="end"
          >
            <v-textarea
              v-model="systemPrompt"
              class="fill-height d-flex flex-column pa-2"
              label="System Prompt"
            />
          </v-col>
          <v-col 
            cols="6"
            align-self="end"
          >
            <v-textarea
              v-model="userPrompt"
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
  import { ref, type Ref } from 'vue'
  import SideBar from './components/SideBar.vue'
  import { LLMService } from './objects/LLMService';

  const drawer : Ref<boolean> = ref(true)
  const userPrompt : Ref<string> = ref("Write a story about a man named Stanley")
  const systemPrompt : Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging."); 

  async function attemptLLMGeneration() : Promise<void> {
    try {
      let output = await LLMService.instance.SendPrompt(userPrompt.value, systemPrompt.value)
      console.log(output)
    } catch (error) {
      console.log(error)
    }
  }


</script>
