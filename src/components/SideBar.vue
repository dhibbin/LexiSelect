<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field
          v-model="settings.ipAddress.value"
          label="IP Address"
          :rules="LLMSettingsWrapper.rules.ipAddress.rule.value"
          class="rounded pa-1 ma-0"
        />
        <v-text-field
          v-model="settings.n_predict.value"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_predict"
          persistent-hint
          :rules="LLMSettingsWrapper.rules.n_predict.rule.value"
          hint="Number of tokens to predict per generation"
        />
        <v-text-field
          v-model="settings.n_probs.value"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_probs"
          persistent-hint
          hint="Maximum number of alternative tokens per token"
          :rules="LLMSettingsWrapper.rules.n_probs.rule.value"
        />
        <v-text-field
          v-model.number="settings.seed.value"
          class="rounded pa-1 ma-0"
          type="number"
          label="Seed"
          persistent-hint
          hint="RNG seed for LLM, -1 is a random seed"
          :rules="LLMSettingsWrapper.rules.seed.rule.value"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <!-- Add more panels as needed -->
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import { ref, type Ref, reactive, watch } from 'vue'
  import { LLMService, type LLMSettings, LLMSettingsWrapper } from '@/objects/LLMService';

  const settings : LLMSettings = LLMSettingsWrapper.rules

  const panel : Ref<number[]> = ref([0])

  watch(settings, () => {
    LLMService.instance.settings = settings
  }, {deep : true})


</script>
