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
          :rules="key in LLMSettingsWrapper.rules ? LLMSettingsWrapper.rules[key].value : LLMSettingsWrapper.emptyRule.value"
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
  ipAddress : newContents("IP Address", "", false),
  n_predict : newContents("n_predict", "Number of tokens to predict per generation", true),
  n_probs : newContents("n_probs", "Maximum number of alternative tokens per token", true),
  stoppingStrings : newContents("Stopping Strings", "JSON array of stopping strings. Default value = []", true)
})

const promptTemplateHTML :  { [key: string]: HTMLSettingsContents } = reactive({
  systemPrepend : newContents("System prompt prepend", "Template token to prepend to system prompt", true),
  systemPostpend : newContents("System prompt postpend", "Template token to postpend to system prompt", true),
  userPrepend : newContents("User prompt prepend", "Template token to prepend to user prompt", true),
  userPostpend : newContents("User prompt postpend", "Template token to postpend to user prompt", true),
  responseTemplateTokens : newContents("Response template token", "Tokens to remove from LLM response", true)
})

const settings : LLMSettings = reactive({
  n_predict : 10,
  n_probs : 5,
  seed : seed.usedNumber,
  ipAddress : "localhost:8080",
  stoppingStrings : "[]",
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

function newContents(label : string, hint : string, presistentHint : boolean) : HTMLSettingsContents {
  let newSettingsContents : HTMLSettingsContents = {
    label : label,
    hint : hint,
    presistentHint : presistentHint
  }
  return newSettingsContents
}

LLMService.instance.addListener(updateSeed.bind(this))


</script>
