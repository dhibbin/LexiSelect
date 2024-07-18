<template>
  <div style="position: relative; width: 100%; height: 200px; overflow-y: hidden; overflow-x: scroll;">
    <input
      v-model="localText"
      type="text"
      style="position: absolute; top: 0; left: 0; overflow-y: hidden; font-family: monospace;"
      :style="{ width: localText.length + 'ch' }"
      rows="1"
    >

    <span
      v-for="(word, index) in words"
      :key="index"
      style="position: absolute; top: 1px; left: 0; font-family: monospace;"
      :style="{ left : characterLengths[index] + 'ch'}"
      class="spanText"
    >{{ word }}</span>
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
  return splitWords.map((str : string, index : number) => index !== 0 ? "_" + str : str);
})
const characterLengths = computed(() => {
  let previousCharacters = 0
  let prevCharList : number[] = []
  for (let i = 0; i < words.value.length; i++) {
    prevCharList.push(previousCharacters)
    previousCharacters += words.value[i].length
  }
  return prevCharList
})
console.log(characterLengths.value)

watch(words, () => {
  console.log(words.value)
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
      white-space: nowrap;
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