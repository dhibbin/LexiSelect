<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field
          v-model="settings.ipAddress"
          label="IP Address"
          :rules="LLMSettingsWrapper.rules.ipAddress.value"
          class="rounded pa-1 ma-0"
        />
        <v-text-field
          v-model.number="settings.n_predict"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_predict"
          persistent-hint
          :rules="LLMSettingsWrapper.rules.n_predict.value"
          hint="Number of tokens to predict per generation"
        />
        <v-text-field
          v-model.number="settings.n_probs"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_probs"
          persistent-hint
          hint="Maximum number of alternative tokens per token"
          :rules="LLMSettingsWrapper.rules.n_probs.value"
        />
        <v-text-field
          v-model.number="settings.seed"
          class="rounded pa-1 ma-0"
          type="number"
          label="Seed"
          persistent-hint
          hint="RNG seed for LLM, -1 is a random seed"
          :rules="LLMSettingsWrapper.rules.seed.value"
        />
        <v-text-field v-model="settings.seed" class="rounded pa-1 ma-0"
          type="number"
          label="Seed"
          persistent-hint
          hint="RNG seed for LLM, -1 is a random seed"
          :rules="LLMSettingsWrapper.rules.seed.value"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <!-- Add more panels as needed -->
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import { ref, type Ref, reactive, watch } from 'vue'
  import { LLMService, type LLMSettings, LLMSettingsWrapper } from '@/objects/LLMService';

  const settings : LLMSettings = reactive({
    n_predict : 10,
    n_probs : 5,
    seed : -1,
    ipAddress : "localhost:8080"
  })

  const panel : Ref<number[]> = ref([0])

  watch(settings, () => {
    LLMService.instance.settings = settings
  }, {deep : true})


</script>
