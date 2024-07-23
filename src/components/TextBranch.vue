<template>
  <br>
    
  <v-list
    class="horizontal-list"
    style="min-width: max-content;"
    @mouseleave="expand=false"
  >
    <v-list-item
      v-for="(token, index) in tokens"
      :key="index"
      :value="token"
      class="pa-0"
      style="overflow: visible;"
      @mouseover="hover(index, $event.currentTarget)"
    >
      <v-list-item-title style="overflow: visible; font-family: monospace;">
        <pre>{{ token.completionProb.content }}</pre>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  
  <v-expand-transition v-if="tokens.length > 0">
    <v-card
      v-show="expand"
      ref="tokenMenu"
      style="overflow: visible;"
      :style="{position: 'relative', top: 0 + 'px', fontFamily: 'monospace', 
               left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 'px',
               height : 'min-content'}"
      class="mx-auto bg-secondary"
      width="200"
      @mouseleave="expand=false"
      @mouseover="expand=true"
    >
      <v-list>
        <v-list-item
          v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0)"
          :key="probIndex"
          :value="tokenProb"
          @click="newBranch(currTokIndex, probIndex)"
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

  <v-expand-transition v-if="tokens.length > 0">
    <v-card 
      v-show="expand"
      ref="headline"
      style="overflow: visible;"
      :style="{position: 'relative', top: 0 + 'px', fontFamily: 'monospace', 
               left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 'px',
               height : 'min-content'}"
      class="mx-auto bg-secondary"
      width="200"
      @mouseleave="expand=false"
      @mouseover="expand=true"
    >
    <v-list>
        <v-list-item
          v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0)"
          :key="probIndex"
          :value="tokenProb"
          @click="newBranch(currTokIndex, probIndex)"
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
</template>

<script setup lang="ts">
import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
import { computed, defineProps, onMounted, reactive, ref, watch, type ComputedRef, type Ref, type VNodeRef } from 'vue'
import gsap from 'gsap'
import { MutableDOMRect } from '@/objects/MutableDOMRect';
import type { VCard } from 'vuetify/components';

export interface TreeToken {
	completionProb : Completionprobability
	userModified : boolean
}

const emits = defineEmits<{
 	newBranch : [tokens : TreeToken[]]
}>()

const props = defineProps<{
	responseLLM : LlamaInterface | null,
  previousTokens : TreeToken[] | null
  scrollOffset : number
}>()

const expand = ref(false)
const currTokIndex = ref(0)
const currElementOffset : Ref<number> = ref(0)
const currTokPosition = ref(new MutableDOMRect)
const responses : Ref<LlamaInterface[]> = ref(props?.responseLLM ? [props.responseLLM] : [])
const currWindow = ref(window)
let delayedCall : gsap.core.Tween | null = null
const tokenMenu = ref<InstanceType<typeof VCard> | null>(null);
const headline = ref<InstanceType<typeof VCard> | null>(null);


const tokens : ComputedRef<TreeToken[]> = computed(() => {
	let newTokens : TreeToken[] = []

  if (props.previousTokens !== null) {
    props.previousTokens.forEach((token : TreeToken) => newTokens.push(token))
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
  if (props.responseLLM !== null) {
    responses.value.push(props.responseLLM)
  }
})

function hover(tokenIndex : number, element : HTMLElement) : void {
	let newRect = element.getBoundingClientRect()
	gsap.to(currTokPosition.value, {duration : 0.2, ease : "power1.inOut", left : newRect.left})
  gsap.to(currElementOffset, {duration : 0.2, ease : "power1.inOut", value : props.scrollOffset})
	currTokPosition.value.top = newRect.top
	expand.value = true
	currTokIndex.value = tokenIndex
  console.log(tokenMenu.value?.$el.getBoundingClientRect())
  // if (delayedCall !== null) {
  //   delayedCall.kill()
  // }
  // delayedCall = gsap.delayedCall(1.0, function() {
  //   expand.value = true
  // })
}

function newBranch(tokenIndex : number, altIndex : number) : void {
  let newBranchTokens : TreeToken[] = []
  for (let i = 0; i < tokenIndex; i++) {
    newBranchTokens.push(tokens.value[i])
  }
  newBranchTokens.push(reactive({
    completionProb : {
      content : tokens.value[tokenIndex].completionProb.probs[altIndex].tok_str,
      probs : []
    },
    userModified : false
  }))

  emits("newBranch", newBranchTokens)
}

onMounted(() => {
  console.log(tokenMenu.value?.$el.getBoundingClientRect()) 
  console.log(headline.value?.$el.getBoundingClientRect()) 
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
    .horizontal-list {
      display: flex;
      flex-direction: row;
      overflow: visible;
    }
</style>