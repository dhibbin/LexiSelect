<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field v-for="(value, key) in settingsHTML" :key="key" v-model="settings[key]" class="rounded pa-1 ma-0"
          :label="value.label" :hint="value.hint" :persistent-hint="value.presistentHint"
          :rules="key in LLMSettingsWrapper.rules ? LLMSettingsWrapper.rules[key].value : LLMSettingsWrapper.emptyRule.value" />

        <v-text-field v-model.number="seed.displayedNumber" class="rounded pa-1 ma-0"
          :label="`Seed | Current Seed : ` + seed.usedNumber.toString()" persistent-hint
          hint="RNG seed for LLM, -1 selects and keeps a random seed on first generation, -2 selects a random seed upon every generation"
          :rules="LLMSettingsWrapper.rules.seed.value" />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Prompt Template</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field v-for="(value, key) in promptTemplateHTML" :key="key" v-model="settings[key]"
          class="rounded pa-1 ma-0" :label="value.label" :hint="value.hint" :persistent-hint="value.presistentHint" />
        <v-combobox v-model="settings.responseTemplateTokens" label="Response template token "
          hint="Tokens to remove from LLM response" class="rounded pa-1 ma-0" persistent-hint closable-chips chips
          multiple />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Sampling Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field v-for="(value, key) in samplingHTML" :key="key" v-model="settings[key]" class="rounded pa-0 ma-0"
          :label="value.label" :hint="value.hint" :persistent-hint="value.presistentHint" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, type Ref, reactive, watch, onMounted } from 'vue'
import { LLMService } from '@/objects/LLMService';
import { type LLMSettings, LLMSettingsWrapper } from '@/objects/LLMSettings'

/*******************
 * Reactive varaible declarations
 *******************/


/** Defines and instantiates a reactive seed interface */
const seed = reactive({
  /** Number displayed within the seed's text-field */
  displayedNumber: -1,

  /** Seed used within LLMService.instance.sendPrompt() */
  usedNumber: -1
})

/** Interface used to create v-text-fields for settings values */
interface HTMLSettingsContents {
  /** Label of the v-text-field */
  label: string

  /** Hint of the v-text-field */
  hint: string

  /** If the v-text-field has a persitent hint */
  presistentHint: boolean
}

/** Defines the contents of the input fields for the settings expansion panel */
const settingsHTML: { [key: string]: HTMLSettingsContents } = reactive({
  ipAddress: newContents("LLM Server Address", "HTTP address to send a /completion request to", true),
  n_predict: newContents("n_predict", "Number of tokens to predict per generation", true),
  n_probs: newContents("n_probs", "Maximum number of alternative tokens per token", true),
  stoppingStrings: newContents("Stopping Strings", "JSON array of stopping strings. Default value = []", true)
})

/** Defines the contents of the input fields for the prompt template expansion panel */
const promptTemplateHTML: { [key: string]: HTMLSettingsContents } = reactive({
  systemPrepend: newContents("System prompt prepend", "Template token to prepend to system prompt", true),
  systemPostpend: newContents("System prompt postpend", "Template token to postpend to system prompt", true),
  userPrepend: newContents("User prompt prepend", "Template token to prepend to user prompt", true),
  userPostpend: newContents("User prompt postpend", "Template token to postpend to user prompt", true),
  responseTemplateTokens: newContents("Response template token", "Tokens to remove from LLM response", true)
})

/** Defines the contents of the input fields for the sampling expansion panel */
const samplingHTML: { [key: string]: HTMLSettingsContents } = reactive({
  temperature: newContents("Temperature", "", false),
  dynatemp_range: newContents("dynatemp_range", "", false),
  dynatemp_exponent: newContents("dynatemp_exponent", "", false),
  top_k: newContents("top_k", "", false),
  top_p: newContents("top_p", "", false),
  min_p: newContents("min_p", "", false),
  repeat_penalty: newContents("Repeat Penalty", "", false),
  repeat_last_n: newContents("Repeat last n", "", false),
  presence_penalty: newContents("Presence Penalty", "", false),
  frequency_penalty: newContents("Frequency Penalty", "", false),
})

/** Settings interface updated by all of the input fields within the SideBar */
const settings: LLMSettings = reactive(JSON.parse(JSON.stringify(LLMService.instance.settings)))

/** Index for the currently open expansion panel  */
const panel: Ref<number[]> = ref([0])

/*******************
 * Lifecycle hooks
 *******************/

/**
* Adds a listener to the LLMService singleton to update the seed when a response is recieved
*/
onMounted(() => {
  LLMService.instance.addListener(updateSeed.bind(this))
})

/*******************
 * Watchers
 *******************/

/**
 * Watches the settings values of this SideBar component
 *
 * When the settings are updated, the settings on the LLMService singleton are updated
 */
watch(settings, () => {
  LLMService.instance.settings = settings
}, { deep: true })

/**
 * Watches the seed's displayed number
 *
 * When seed.displayedNumber changes, this watcher updates seed.usedNumber based on the following rules:
 * - If seed.displayedNumber is -1 or -2, seed.usedNumber is set to -1
 * - For any other value of seed.displayedNumber`, seed.usedNumber is set to seed.displayedNumber
 */
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

/*******************
 * Function Definitions
 *******************/

/**
 * Updates seed.usedNumber if both seed properties are -1 and seed.usedNumber hasn't been updated yet
 *
 * @param newSeed - The new seed
 */
function updateSeed(newSeed: number): void {
  if (seed.displayedNumber == -1 && seed.usedNumber == -1) {
    seed.usedNumber = newSeed
  }
}

/**
 * Creates a new HTMLSettingsContents interface
 *
 * @param label - The label for the HTML setting
 * @param hint - The hint for the HTML setting
 * @param presistentHint - A boolean representing if the hint is presistent
 * @returns A new HTMLSettingsContents interface with the provided label, hint, and persistentHint.
 */
function newContents(label: string, hint: string, presistentHint: boolean): HTMLSettingsContents {
  let newSettingsContents: HTMLSettingsContents = {
    label: label,
    hint: hint,
    presistentHint: presistentHint,
  }
  return newSettingsContents
}

</script>
