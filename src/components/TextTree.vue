<template>
  <textarea
    v-model="latestText"
  />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps<{
    generatedText : string
}>()

const latestText = computed(() => props.generatedText)

</script>