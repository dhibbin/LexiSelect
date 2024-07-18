<template>
  <div style="position: relative; width: 100%; height: 200px; overflow-y: scroll; overflow-x: scroll;">
    <input
      ref="inputText"
      v-model="localText"
      type="text"
      style="position: absolute; top: 0; left: 0; overflow-y: hidden; font-family: monospace;"
      :style="{ width: localText.length + 'ch' }"
      rows="1"
      @keydown="locateCursor"
    >

    <span
      v-for="(token, index) in tokens"
      :key="index"
      style="position: absolute; top: 1px; left: 0; font-family: monospace;"
      :style="{ left : tokens[index].charOffset + 'ch'}"
      class="spanText"
      @mouseover="hover(true, index)"
    >{{ stripSpaces(token.completionProb.content) }}</span>

    <v-expand-transition>
      <v-card
        v-show="expand && !tokens[expandPanelIndex].userModified"
        style="overflow: visible;"
        :style="{ position: 'absolute', top: '20px', 
                  left: (tokens.length > 0 ? tokens[expandPanelIndex].charOffset : '0')
                    + 'ch', fontFamily: 'monospace' }"
        class="mx-auto bg-secondary"
        width="200px"
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
  import { computed, defineProps, reactive, ref, watch, type Ref, type ComputedRef } from 'vue'

  interface TreeToken {
    completionProb : Completionprobability
    charOffset : number
    userModified : boolean
  }

  const tokens : ComputedRef<TreeToken[]> = computed(() => {
    let newTokens : TreeToken[] = []
    let previousCharacters = 0
    for (let i = 0; i < props.responseLLM.completion_probabilities.length; i++) {
      newTokens.push( reactive({
        completionProb : props.responseLLM.completion_probabilities[i],
        charOffset : previousCharacters,
        userModified : false
      }))
      previousCharacters += props.responseLLM.completion_probabilities[i].content.length
    }
    return newTokens
  })

  const emits = defineEmits<{
      textUpdate : [newText : string]
  }>()

  const props = defineProps<{
      responseLLM : LlamaInterface
  }>()

  const localText = ref(props.responseLLM.content)
  const expandPanelIndex : Ref<number> = ref(0)
  const expand = ref(false)
  const inputText = ref()

  watch(props, () => {
    localText.value = props.responseLLM.content
    //previousLocalText = props.responseLLM.content
  })

  watch(localText, () => {
    emits("textUpdate", localText.value)
    let foundChange = false
    for (let i = 0; i < tokens.value.length; i++) {
      for (let n = 0; n < tokens.value[i].completionProb.content.length; n++) {
        let globalIndex = tokens.value[i].charOffset
        //console.log(localText.value[globalIndex], tokens.value[i].completionProb.content[n])
        if (localText.value[globalIndex + n] != tokens.value[i].completionProb.content[n] && !foundChange) {
          console.log("found changed char", globalIndex, localText.value[n], tokens.value[i].completionProb.content[n])
          console.log(tokens.value[i].completionProb.content)
          foundChange = true
        }
      }
      
    }
  })

  function hover(openHover : boolean, tokenIndex : number) : void {
    expandPanelIndex.value = tokenIndex
    expand.value = openHover
  }

  function stripSpaces(oldString : string) : string {
    return oldString.replace(/ /g, '_')
  }

  function locateCursor(event : Event) : void {
    event.preventDefault()
    let textBody = inputText
    console.log(event.clientX)
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