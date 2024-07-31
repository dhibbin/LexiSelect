<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field 
          v-for="(value, key) in settingsHTML"
          :key="key"
          v-model="settings[key]"
          class="rounded pa-1 ma-0"
          :label="value.label"
          :hint="value.hint"
          :persistent-hint="value.presistentHint"
          :rules="LLMSettingsWrapper.rules[key].value"
        />

        <v-text-field
          v-model.number="seed.displayedNumber"
          class="rounded pa-1 ma-0"
          :label="`Seed | Current Seed : ` + seed.usedNumber.toString()"
          persistent-hint
          hint="RNG seed for LLM, -1 selects and keeps a random seed on first generation, -2 selects a random seed upon every generation"
          :rules="LLMSettingsWrapper.rules.seed.value"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Prompt Template</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        
        
        <v-text-field 
          v-for="(value, key) in promptTemplateHTML"
          :key="key"
          v-model="settings[key]"
          class="rounded pa-1 ma-0"
          :label="value.label"
          :hint="value.hint"
          :persistent-hint="value.presistentHint"
        />
        
        
        <v-text-field
          v-model="settings.systemPrepend"
          label="System prompt prepend"
          hint="Template token to prepend to system prompt"
          persistent-hint
          class="rounded pa-1 ma-0"
        />
        <v-text-field
          v-model.number="settings.systemPostpend"
          class="rounded pa-1 ma-0"
          label="System prompt postpend"
          persistent-hint
          hint="Template token to postpend to system prompt"
        />
        <v-text-field
          v-model.number="settings.userPrepend"
          class="rounded pa-1 ma-0"
          label="User prompt prepend"
          persistent-hint
          hint="Template token to prepend to user prompt"
        />
        <v-text-field
          v-model.number="settings.userPostpend"
          class="rounded pa-1 ma-0"
          label="User prompt postpend"
          persistent-hint
          hint="Template token to postpend to user prompt"
        />
        <v-combobox
          v-model="settings.responseTemplateTokens"
          label="Response template token "
          hint="Tokens to remove from LLM response"
          class="rounded pa-1 ma-0"
          persistent-hint
          closable-chips
          chips
          multiple
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, type Ref, reactive, watch } from 'vue'
import { LLMService } from '@/objects/LLMService';
import { type LLMSettings, LLMSettingsWrapper } from '@/objects/LLMSettings'


const seed = reactive({
  displayedNumber : -1,
  usedNumber : -1
})

interface HTMLSettingsContents {
  label : string
  hint : string
  presistentHint : boolean
}

const settingsHTML : { [key: string]: HTMLSettingsContents } = reactive({
  ipAddress : {
    label : "IP Address",
    hint : "",
    presistentHint : false,
  },
  n_predict : {
    label : "n_predict",
    hint : "Number of tokens to predict per generation",
    presistentHint : true,
  },
  n_probs : {
    label : "n_probs",
    hint : "Maximum number of alternative tokens per token",
    presistentHint : true,
  }
})

const promptTemplateHTML :  { [key: string]: HTMLSettingsContents } = reactive({
  systemPrepend : {
    label : "System prompt prepend",
    hint : "Template token to prepend to system prompt",
    presistentHint : true
  }
})


const settings : LLMSettings = reactive({
  n_predict : 10,
  n_probs : 5,
  seed : seed.usedNumber,
  ipAddress : "localhost:8080",
  systemPrepend : "<|system|>",
  systemPostpend : "<|end|>",
  userPrepend : "<|user|>" ,
  userPostpend : "<|end|>",
  responseTemplateTokens : ["<|assistant|>"],
})

const panel : Ref<number[]> = ref([0])

watch(settings, () => {
  LLMService.instance.settings = settings
}, {deep : true})

watch(() => seed.displayedNumber, () => {
  switch (seed.displayedNumber) {
    case -1:
    case -2:
      seed.usedNumber = -1
      break
    default:
      seed.usedNumber = seed.displayedNumber 
  }
})

function updateSeed(newSeed : number) : void {
  if (seed.displayedNumber == -1 && seed.usedNumber == -1) {
    seed.usedNumber = newSeed
  }
}

LLMService.instance.addListener(updateSeed.bind(this))


</script>
