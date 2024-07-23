<script setup lang="ts">
import { onMounted, ref } from "vue";
import { VCard } from 'vuetify/components';
const headline = ref<InstanceType<typeof VCard> | null>(null);
onMounted(()=>{
  console.log(headline.value?.$el.getBoundingClientRect()) 
})
</script>

<template>
  <v-card ref="headline">
    hello world
  </v-card>
</template>