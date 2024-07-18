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
        style="overflow: visible;"
        :style="{ position: 'absolute', top: '20px', left: characterLengths[expandPanelIndex] + 'ch', fontFamily: 'monospace' }"
        class="mx-auto bg-secondary"
        
        @mouseover="expand = true"
        @mouseleave="expand = false"
      >
        <v-list :items="[{title:'hellotitle', value : 1}]" />
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
  import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
  import { computed, defineProps, ref, watch, type Ref } from 'vue'

  interface TreeToken {
    completionProb : Completionprobability
    spanContent : string
    characterOffset : number
  }

  const currentTokens : Ref<TreeToken[]> = ref([])

  const emits = defineEmits<{
      textUpdate : [newText : string]
  }>()

  const props = defineProps<{
      responseLLM : LlamaInterface
  }>()

  const localText = ref(props.responseLLM.content)
  const expandPanelIndex : Ref<number> = ref(-1)
  const expand = ref(false)

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

  watch(props, () => {
    localText.value = props.responseLLM.content
    for (const token in props.responseLLM.completion_probabilities) {
      console.log(token)
    }
    
    console.log(JSON.stringify(props.responseLLM))
  })

  watch(localText, () => {
    emits("textUpdate", localText.value)
  })

  function hover(openHover : boolean, tokenIndex : number) : void {
    expandPanelIndex.value = tokenIndex
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