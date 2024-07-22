<template>
  <div
    ref="root"
    style="position: relative; width: 100%; height: 100%; overflow: auto;"
  >
    <br>
    
    <v-list
      class="horizontal-list"
      style="min-width: max-content;"
    >
      <v-list-item
        v-for="(token, index) in tokens"
        :key="index"
        :ref="'list' + index.toString()"
        :value="token"
        class="pa-0"
        style="overflow: visible;"
        @mouseover="hover(true, index, 'list' + index.toString(), $event.currentTarget)"
      >
        <v-list-item-title style="overflow: visible; font-family: monospace;">
          <pre>{{ stripSpaces(token.completionProb.content) }}</pre>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-expand-transition v-if="tokens.length > 0">
      <v-card
        v-show="expand"
        style="overflow: visible;"
        :style="{ position: 'absolute', top: '100px', fontFamily: 'monospace', left : tokens[currTokIndex].charOffset + 'ch'}"
        class="mx-auto bg-secondary"
        width="200"
      >
        <v-list style="min-height: min-content;">
          <v-list-item
            v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0)"
            :key="probIndex"
            :value="tokenProb"
          >
            <v-list-item-title
              style="overflow: visible; font-family: monospace;"
            >
              {{ tokenProb.tok_str + ':' + tokenProb.prob }}
            </v-list-item-title>
          </v-list-item>
        </v-list>  
      </v-card>
    </v-expand-transition>
    
    <br>
  </div>
</template>

<script setup lang="ts">
  import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
  import { computed, defineProps, reactive, ref, watch, type ComputedRef } from 'vue'

  interface TreeToken {
    completionProb : Completionprobability
    charOffset : number
    userModified : boolean
    expandPanel : boolean
  }

  const expand = ref(false)
  const currTokIndex = ref(0)

  const tokens : ComputedRef<TreeToken[]> = computed(() => {
    let newTokens : TreeToken[] = []
    let previousCharacters = 0
    for (let i = 0; i < props.responseLLM.completion_probabilities.length; i++) {
      newTokens.push( reactive({
        completionProb : props.responseLLM.completion_probabilities[i],
        charOffset : previousCharacters,
        userModified : false,
        expandPanel : false
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
  //const expand = ref(false)

  const tokenLength = computed(() => {
    return tokens.value.reduce(
      (totalLength : number, currentToken : TreeToken) => totalLength + currentToken.completionProb.content.length,
      0
    )
  })

  watch(props, () => {
    localText.value = props.responseLLM.content
    console.log(tokenLength.value)
  })

  watch(localText, () => {
    emits("textUpdate", localText.value)
  })

  function hover(openHover : boolean, tokenIndex : number, reference : string, element : HTMLElement) : void {
    console.log(element.getBoundingClientRect())
    tokens.value[tokenIndex].expandPanel = openHover
    expand.value = openHover
    currTokIndex.value = tokenIndex
    
  }

  function stripSpaces(oldString : string) : string {
    return oldString.replace(/ /g, ' ')
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
    .horizontal-list {
      display: flex;
      flex-direction: row;
      overflow: visible;
    }
</style>