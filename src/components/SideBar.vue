<template>
    <v-expansion-panels>
        <v-expansion-panel
            title="Settings"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima"
        >
            <v-text-field class="rounded pa-1"
                type="number"
                label="Number Input"
                v-model="number"
            ></v-text-field>
    
        </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>Input Panel</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-0">
        <v-text-field class="rounded pa-0"
                type="number"
                label="Number Input"
                v-model="number"
        ></v-text-field>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <!-- Add more panels as needed -->
  </v-expansion-panels>

</template>

<script setup lang="ts">
import { ref } from 'vue'

const number = ref(10)
</script>
