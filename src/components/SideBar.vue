<template>
    <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Settings</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field class="rounded pa-0"
          type="number"
          label="Number Input"
          v-model="number"
        ></v-text-field>
        <v-text-field
          label="IP Address"
          v-model="ipAddress"
          :rules="ipAddressRules"
      ></v-text-field>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <!-- Add more panels as needed -->
  </v-expansion-panels>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const number = ref(10)
const panel = ref([0])

const ipAddress = ref("");
    const ipAddressRules = computed(() => [
      (v: string) => !!v || 'IP address is required',
      (v: string) => validateIPAddress(v) || 'Invalid IP address',
    ]);

function validateIPAddress(ipAddress: string) {
  const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
  const localPattern : RegExp = /^(localhost)(:\d{1,5})?$/;
  return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
}

</script>
