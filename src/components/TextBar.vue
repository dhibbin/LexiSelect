<template>
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
      />
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col cols="12">
      <v-btn
        block
        class="pa-6"
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
</template>
  
<script setup lang="ts">
import { LLMService } from '@/objects/LLMService';
import { ref, type Ref } from 'vue';

const userPrompt : Ref<string> = ref("Write a story about a man named Stanley")
const systemPrompt : Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging.");
//const tab = ref(null) 

  async function attemptLLMGeneration() : Promise<void> {
    try {
      let output = await LLMService.instance.SendPrompt(userPrompt.value, systemPrompt.value)
      console.log(output)
    } catch (error) {
      console.log(error)
    }
  }
</script>