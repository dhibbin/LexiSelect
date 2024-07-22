<template>
  <div
    ref="root"
    style="position: relative; width: 100%; height: 100%; overflow: auto;"
    @scroll="handleScroll($event.currentTarget)"
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

    
    
    <br>
    <v-expand-transition v-if="tokens.length > 0">
      <v-card
        v-show="expand"
        style="overflow: visible;"
        :style="{position: 'absolute', top: currTokPosition.top + 50 + 'px', fontFamily: 'monospace', 
                 left : currTokPosition.left + currElementOffset + 'px'}"
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
  </div>
</template>

<script setup lang="ts">
  import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
  import { computed, defineProps, reactive, ref, watch, type ComputedRef, type Ref } from 'vue'
  import gsap from 'gsap'

  interface TreeToken {
    completionProb : Completionprobability
    userModified : boolean
  }

  const expand = ref(false)
  const currTokIndex = ref(0)
  const currElementOffset : Ref<number> = ref(0)
  const currTokPosition = ref(new DOMRect)
  const scrollOffset : Ref<number> = ref(0)

  const tokens : ComputedRef<TreeToken[]> = computed(() => {
    let newTokens : TreeToken[] = []
    //let previousCharacters = 0
    for (let i = 0; i < props.responseLLM.completion_probabilities.length; i++) {
      newTokens.push( reactive({
        completionProb : props.responseLLM.completion_probabilities[i],
        //charOffset : previousCharacters,
        userModified : false,
        //expandPanel : false
      }))
      //previousCharacters += props.responseLLM.completion_probabilities[i].content.length
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
    //gsap.to(currTokPosition, {duration : 0.1, value : element.getBoundingClientRect(), ease : "power1.in"})
    currTokPosition.value = element.getBoundingClientRect()
    currElementOffset.value = scrollOffset.value
    expand.value = openHover
    currTokIndex.value = tokenIndex
    
  }

  function stripSpaces(oldString : string) : string {
    return oldString.replace(/ /g, ' ')
  }

  function handleScroll(target : EventTarget | null) : void {
    let element : HTMLElement = target as HTMLElement
    scrollOffset.value = element.scrollLeft
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