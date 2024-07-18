<template>
  <div style="position: relative; width: 100%; height: 200px; overflow-y: scroll; overflow-x: scroll;">
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
      @mouseover="hover(true, index)"

    >{{ word }}</span>

    <v-expand-transition>
      <v-card
        v-show="expand"
        :style="{ position: 'absolute', top: '20px', left: characterLengths[expandPanelIndex] + 'ch' }"
        class="mx-auto bg-secondary"
        height="100"
        width="100"
        @mouseover="expand = true"
        @mouseleave="expand = false"
      />
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch, type Ref } from 'vue'

const emits = defineEmits<{
    textUpdate : [newText : string]
}>()

const props = defineProps<{
    generatedText : string
}>()

const localText = ref(props.generatedText)
const expandPanelIndex : Ref<number> = ref(-1)
const expand = ref(false)

const words = computed(() => {
  let splitWords = localText.value.split(" ")
  return splitWords.map((str : string, index : number) => index !== 0 ? "_" + str : str);
})

const expandPanels = computed(() => {
  return new Array(words.value.length).fill(false)
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

watch(props, () => {
  localText.value = props.generatedText
})

watch(localText, () => {
  emits("textUpdate", localText.value)
})

function hover(openHover : boolean, tokenIndex : number) : void {
  expandPanelIndex.value = tokenIndex
  expandPanels.value[tokenIndex] = openHover
  console.log(expandPanels.value[expandPanelIndex.value])
  expand.value = openHover
}

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