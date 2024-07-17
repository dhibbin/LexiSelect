<template>
  <div style="position: relative; width: 100%; height: 200px; overflow-y: hidden; overflow-x: scroll;">
    <input
      v-model="localText"
      type="text"
      style="position: absolute; top: 0; left: 0; overflow-y: hidden; font-family: monospace;"
      :style="{ width: localText.length + 'ch' }"
      rows="1"
    >
    <div>
      <span
        v-for="(word, index) in words"
        :key="index"
        style="display: inline-block; top: 1px; left: 0; font-family: monospace;"
        class="spanText"
      >{{ word }}</span> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'

const emits = defineEmits<{
    textUpdate : [newText : string]
}>()

const props = defineProps<{
    generatedText : string
}>()

const localText = ref(props.generatedText)
const words = computed(() => {
  let splitWords = localText.value.split(" ")
  return splitWords.map((str : string) => str.replace(/ /g, "&nbsp;"))
})

watch(props, () => {
  localText.value = props.generatedText
})

watch(localText, () => {
  emits("textUpdate", localText.value)
})




</script>

<style scoped>
    .spanText:hover {
      box-shadow: 0px 0px 1px blue;
    }
    .spanText {
      color: transparent;
    }
    .spanText:active {
      pointer-events: none;
    }
    .scrollable-input input {
      white-space: nowrap;
      overflow-x: scroll;
      width: 100%;
    }
</style>