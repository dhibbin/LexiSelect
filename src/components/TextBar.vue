<template>  
  <v-app-bar
    color="surface"
    :height="280"
    location="bottom"
    flat
  >
    <v-container
      class="pa-0"
    >
      <v-tabs-window
        v-model="topLevelTab"
        class="pa-0"
      >
        <v-tabs-window-item value="input">
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
                Generate New Response
              </v-btn>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item
          value="output"
          class="pa-0"
        >
          <v-sheet
            class="d-flex flex-nowrap bg-surface pa-0"
            style="overflow-x: scroll;"
          >
            <v-col
              v-for="(_, index) in outputs"
              :key="index"
              class="pa-1"
              cols="auto"
              align-self="end"
            >
              <v-row no-gutters> 
                <v-textarea
                  v-model="outputs[index]"
                  class="fill-height d-flex flex-column pa-2"
                  label="Output 1"
                  rows="8"
                  no-resize
                  hide-details
                />
              </v-row>  
              <v-row no-gutters>
                <v-btn
                  block
                  class="pa-4"
                  color="blue"
                  base-color="blue"
                  variant="elevated"
                  rounded="lg"
                  @click="attemptLLMGeneration"
                >
                  Continue Generation
                </v-btn>
              </v-row>
            </v-col>
          </v-sheet>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>  
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
      <v-fab
        class="ms-4"
        icon="mdi-plus"
        location="start"
        size="small"
        offset
      />
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
import { ref, type Ref, watch } from 'vue';
import type { TreeToken } from './TextBranch.vue'

const userPrompt : Ref<string> = ref("Write a story about a man named Stanley")
const systemPrompt : Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging.");
const topLevelTab = ref("input")
const outputs : Ref<string[]> = ref([])

const textBarEmits = defineEmits(["onGenerationRecieved"])

const props = defineProps<{
  branchTokens : (TreeToken[] | null)[],
}>()

async function attemptLLMGeneration() : Promise<void> {
  try {
    let output = await LLMService.instance.SendPrompt(userPrompt.value, systemPrompt.value)
    console.log(output)
    textBarEmits("onGenerationRecieved", output)
  } catch (error) {
    console.log(error)
  }
}

watch(() => props.branchTokens, () => {
  console.log("new outputs received")
  for (let i = 0; i < props.branchTokens.length; i++) {
    if (props.branchTokens[i] !== null) {
      outputs.value.push(props.branchTokens[i]!.map((t : TreeToken) => t.completionProb.content).join(''))
    }
  }
})




</script>

<style>
.v-tab {
  border-radius: 0 !important;
}
</style>
