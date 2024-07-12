<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field
          v-model="ipAddress"
          label="IP Address"
          :rules="ipAddressRules"
          class="rounded pa-1 ma-0"
        />
        <v-text-field
          v-model="n_predict"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_predict"
          persistent-hint
          hint="Number of tokens to predict per generation"
        />
        <v-text-field
          v-model="n_probs"
          class="rounded pa-1 ma-0"
          type="number"
          label="n_probs"
          persistent-hint
          hint="Maximum number of alternative tokens per token"
        />
        <v-text-field
          v-model="seed"
          class="rounded pa-1 ma-0"
          type="number"
          label="Seed"
          persistent-hint
          hint="RNG seed for LLM, -1 is a random seed"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <!-- Add more panels as needed -->
  </v-expansion-panels>
</template>

<script setup lang="ts">
  import { ref, computed, type Ref, reactive, watch } from 'vue'
  import { LLMService, LLMSettings } from '@/objects/LLMService';

  // const n_predict : Ref<number> = ref(10)
  // const n_probs : Ref<number> = ref(5)
  // const seed : Ref<number> = ref(-1)
  // const ipAddress : Ref<string> = ref("localhost:8080");

  const settings : LLMSettings = reactive({
    n_predict : 10,
    n_probs : 5,
    seed : -1,
    ipAddress : "localhost:8080"
  })

  const panel : Ref<number[]> = ref([0])
  

  const ipAddressRules = computed(() => [
    (v: string) : boolean | string => !!v || 'IP address is required',
    (v: string) : boolean | string => validateIPAddress(v) || 'Invalid IP address',
  ]);

  function validateIPAddress(ipAddress: string) : boolean {
    const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
    const localPattern : RegExp = /^(localhost)(:\d{1,5})?$/;
    return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
  }

  watch(settings, () => {
    console.log("hello")
  }, {deep : true})


</script>
