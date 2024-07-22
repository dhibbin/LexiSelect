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
        :value="token"
        class="pa-0"
        style="overflow: visible;"
        @mouseover="hover(true, index, $event.currentTarget)"
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
        :style="{position: 'absolute', top: currTokPosition.top + 'px', fontFamily: 'monospace', 
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
import { MutableDOMRect } from '@/objects/MutableDOMRect';

export interface TreeToken {
	completionProb : Completionprobability
	userModified : boolean
}

const emits = defineEmits<{
 	newBranch : [tokens : TreeToken[]]
}>()

const props = defineProps<{
	responseLLM : LlamaInterface,
  previousTokens : TreeToken[] | null
}>()

const expand = ref(false)
const currTokIndex = ref(0)
const currElementOffset : Ref<number> = ref(0)
const currTokPosition = ref(new MutableDOMRect)
const scrollOffset : Ref<number> = ref(0)
const responses : Ref<LlamaInterface[]> = ref([props.responseLLM])

const tokens : ComputedRef<TreeToken[]> = computed(() => {
	let newTokens : TreeToken[] = []

  if (props.previousTokens !== null) {
    props.previousTokens.forEach((token : TreeToken) => tokens.value.push(token))
  }

	for (let i = 0; i < responses.value.length; i++) {
    for (let n = 0; n < responses.value[i].completion_probabilities.length; n++) {
      newTokens.push( reactive({
        completionProb : responses.value[i].completion_probabilities[n],
        userModified : false,
		  }))
    }
	}
	return newTokens
})

watch(() => props.responseLLM, () => {
  responses.value.push(props.responseLLM)
})

function hover(openHover : boolean, tokenIndex : number, element : HTMLElement) : void {
	let newRect = element.getBoundingClientRect()
	gsap.to(currTokPosition.value, {duration : 0.2, ease : "power1.inOut", left : newRect.left})
  gsap.to(currElementOffset, {duration : 0.2, ease : "power1.inOut", value : scrollOffset.value})
	currTokPosition.value.top = newRect.top
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