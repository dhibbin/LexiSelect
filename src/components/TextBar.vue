<template>
  <v-app-bar
    color="grey-lighten-2"
    :height="300"
    location="bottom"
    class="d-flex"
    flat
  >
    <v-container>
      <v-tabs-window v-model="lowerLevelTab">
        <v-tabs-window-item value="one">
          <v-row no-gutters>
            <v-col
              cols="6"
              align-self="end"
            >
              <v-textarea
                v-model="systemPrompt"
                class="fill-height d-flex flex-column pa-2"
                label="System Prompt"
                rows="8"
                no-resize
                hide-details
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
                rows="8"
                no-resize
                hide-details
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              class="px-2"
            >
              <v-btn
                block
                class="pa-4"
                color="blue"
                base-color="blue"
                variant="elevated"
                rounded="lg"
                @click="attemptLLMGeneration"
              >
                Generate Response
              </v-btn>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-card-text>Two</v-card-text>
        </v-tabs-window-item>
        <v-tabs-window-item value="three">
          <v-card-text>Three</v-card-text>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>  
  </v-app-bar>

  <v-app-bar
    color="grey-lighten-2"
    :height="tabState.y"
    location="bottom"
    class="d-flex"
    flat
    :style="{ marginBottom: tabState.marginBottom + 'px'}"
    style="z-index: 0;"
  >
    <v-tabs
      v-model="lowerLevelTab"
      bg-color="blue"
      center-active
      rounded="lg"
      style="width: 100%;"
    >
      <v-tab value="one">
        One
      </v-tab>
      <v-tab value="two">
        Two
      </v-tab>
      <v-tab value="three">
        Three
      </v-tab>
    </v-tabs>
  </v-app-bar>

  <v-app-bar
    color="grey-lighten-2"
    height="30"
    location="bottom"
    class="d-flex"
    flat
  >
    <v-tabs
      v-model="topLevelTab"
      bg-color="blue"
      center-active
      rounded="lg"
      style="width: 100%;"
    >
      <v-tab value="input">
        Input
      </v-tab>
      <v-tab value="output">
        Output
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>
  
<script setup lang="ts">
import { LLMService } from '@/objects/LLMService';
import { reactive, ref, watch, type Ref } from 'vue';
import gsap from 'gsap'

const userPrompt : Ref<string> = ref("Write a story about a man named Stanley")
const systemPrompt : Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging.");
const topLevelTab = ref("output")
const lowerLevelTab = ref("one")
const tabState = reactive({
  y : 30,
  marginBottom : 0
})

watch(topLevelTab, (value : string) => {
  if (value === "input") {
    gsap.to(tabState, {duration : 0.1, ease : "bounce.inOut", marginBottom : 30, y : 0})
    console.log("tweening", tabState.y)
    tabState.marginBottom = 10
  }
  else {
    gsap.to(tabState, {duration : 0.1, y : 30, ease : "power1.in", marginBottom : 0})
    console.log("tweening", tabState.y)
  }
})

const textBarEmits = defineEmits(["onGenerationRecieved"])

  async function attemptLLMGeneration() : Promise<void> {
    try {
      let output = await LLMService.instance.SendPrompt(userPrompt.value, systemPrompt.value)
      console.log(output)
      textBarEmits("onGenerationRecieved", output)
    } catch (error) {
      console.log(error)
    }
  }


</script>

<style>
.v-tab {
  border-radius: 0 !important;
}
</style>
