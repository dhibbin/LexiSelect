<template>
  <v-list
    class="horizontal-list bg-background"
    style="min-width: max-content;"
    @mouseleave="setExpand(false, 0.5)"
  >
    <v-list-item
      v-for="(token, index) in tokens"
      :key="index"
      :value="token"
      :class="'pa-0 ' + (props.isActive ? 'bg-primary' : 'bg-background')"
      style="overflow: visible;"
      @click="click(index, $event)"
    >
      <v-list-item-title
        style="overflow: visible; font-family: monospace;"
      >
        <pre>{{ token.completionProb.content.replace(/[\n\r]+/g, ' ') }}</pre>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  
  <v-expand-transition
    v-if="tokens.length > 0"
    :rounded="false"
    :style="{ height : menuHeight + 'px'}"
  >
    <v-card
      v-show="expand"
      ref="tokenMenu"
      :style="{position: 'relative', top: 0 + 'px', fontFamily: 'monospace', 
               left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 100 + 'px',
               height : 'min-content'}"
      class="mx-auto animated-element"
      width="200"
      @mouseleave="setExpand(false, 0.5)"
      @mouseenter="setExpand(true)"
    >
      <v-list
        class="pa-0"
        dense="true"
      >
        <v-text-field
          v-model="customTokenInput"
          label="New Token"
          hide-details
          @keydown.enter="newBranch(currTokIndex, customTokenInput)"
        /> 
        <v-list-item
          v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0 || v.tok_str == tokens[currTokIndex].completionProb.content)"  
          :key="probIndex"
          class="pa-0 ma-0"
          :value="tokenProb"
          :disabled="tokenProb.tok_str == tokens[currTokIndex].completionProb.content"
          density="compact"
          @click="newBranch(currTokIndex, tokenProb.tok_str)"
        >   
          <v-list-item-title
            style="font-family: monospace; text-align: center;"
            class="pa-1"
          >
            {{ tokenProb.tok_str }}
          </v-list-item-title>
          <template #prepend> 
            <v-sheet
              class="pa-1 ma-1 v-align-center v-text-center"
              style="width: 58px; text-align: center;"
              color="info"
              rounded="sm"
            >
              {{ toPercentage(tokenProb.prob) + '%' }}
            </v-sheet>
          </template>
        </v-list-item>
      </v-list> 
    </v-card>
  </v-expand-transition>

  <v-card
    ref="virtualTokenMenu"
    :style="{position: 'absolute', top: 0 + 'px', fontFamily: 'monospace', 
             left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 'px',
             height : 'min-content'}"
    class="mx-auto hidden"
    width="200"
  >
    <v-list
      class="pa-0"
      dense="true"
    >
      <v-text-field
        v-model="customTokenInput"
        label="New Token"
        hide-details
        @keydown.enter="newBranch(currTokIndex, customTokenInput)"
      /> 
      <v-list-item
        v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0 || v.tok_str == tokens[currTokIndex].completionProb.content)"  
        :key="probIndex"
        class="pa-0 ma-0"
        :value="tokenProb"
        :disabled="tokenProb.tok_str == tokens[currTokIndex].completionProb.content"
        density="compact"
        @click="newBranch(currTokIndex, tokenProb.tok_str)"
      >   
        <v-list-item-title
          style="font-family: monospace; text-align: center;"
          class="pa-1"
        >
          {{ tokenProb.tok_str }}
        </v-list-item-title>
        <template #prepend> 
          <v-sheet
            class="pa-1 ma-1 v-align-center v-text-center"
            style="width: 58px; text-align: center;"
            color="info"
            rounded="sm"
          >
            {{ toPercentage(tokenProb.prob) + '%' }}
          </v-sheet>
        </template>
      </v-list-item>
    </v-list> 
  </v-card>
</template>

<script setup lang="ts">
import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
import { computed, onMounted, onUpdated, reactive, ref, watch, type ComputedRef, type Ref } from 'vue'
import gsap from 'gsap'
import { MutableDOMRect } from '@/objects/MutableDOMRect';
import type { VCard } from 'vuetify/components';

export interface TreeToken {
  completionProb : Completionprobability
}

const emits = defineEmits<{
  newBranch : [tokens : TreeToken[]]
  updateTokens : [tokens : TreeToken[]]
}>()

const props = defineProps<{
  responseLLM : LlamaInterface | null
  previousTokens : TreeToken[] | null
  scrollOffset : number
  isActive : boolean
}>()

const expand = ref(false)
const currTokIndex = ref(0)
const currElementOffset : Ref<number> = ref(0)
const currTokPosition = ref(new MutableDOMRect)
const responses : Ref<LlamaInterface[]> = ref(props?.responseLLM ? [props.responseLLM] : [])
const currWindow = ref(window)
const tokenMenu = ref<InstanceType<typeof VCard> | null>(null);
const virtualTokenMenu = ref<InstanceType<typeof VCard> | null>(null);
const menuHeight = ref(virtualTokenMenu.value?.$el.getBoundingClientRect().height)
const customTokenInput = ref("")

// Delayed calls for lerped values
let expandDelayedCall : gsap.core.Tween | null = null
let heightDelayedCall : gsap.core.Tween | null = null

const tokens : ComputedRef<TreeToken[]> = computed(() => {
  let newTokens : TreeToken[] = []

  if (props.previousTokens !== null) {
    props.previousTokens.forEach((token : TreeToken) => newTokens.push(token))
  }

  for (let i = 0; i < responses.value.length; i++) {
    for (let n = 0; n < responses.value[i].completion_probabilities.length; n++) {
      let currToken = responses.value[i].completion_probabilities[n]
      let tokenInList = false

      for (let m = 0; m < currToken.probs.length; m++) {
        if (currToken.content == currToken.probs[m].tok_str) {
          tokenInList = true
        }
      }

      if (!tokenInList) {
        console.log(currToken.content)
        currToken.probs.push(reactive({
          prob : 0,
          tok_str : currToken.content
        }))
      }
      
      newTokens.push( reactive({
        completionProb : responses.value[i].completion_probabilities[n],
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

watch(() => tokens.value, () => {
  emits("updateTokens", tokens.value)
})

onMounted(() => {
  emits("updateTokens", tokens.value)
  heightDelayedCall = gsap.to(menuHeight, {duration : 0, ease : "power1.inOut", value : 0})
  setExpand(true)
})

onUpdated(() => {
  let targetHeight : number = virtualTokenMenu.value?.$el.getBoundingClientRect().height
  //console.log(targetHeight, menuHeight.value)
  if (Math.abs(menuHeight.value - targetHeight) >= 1) {
    if (heightDelayedCall?.isActive() == false || heightDelayedCall?.vars.value != targetHeight ) {
      heightDelayedCall?.kill()
      heightDelayedCall = gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", value : targetHeight})
    }
  }
})

function click(tokenIndex : number, event : Event) : void {
  let element : HTMLElement = event.currentTarget as HTMLElement
  let newRect = element.getBoundingClientRect()
  //gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", value : virtualTokenMenu.value?.$el.getBoundingClientRect.height})
  gsap.to(currTokPosition.value, {duration : 0.1, ease : "power1.inOut", left : newRect.left})
  gsap.to(currElementOffset, {duration : 0.1, ease : "power1.inOut", value : props.scrollOffset})
  //menuHeight.value = virtualTokenMenu.value?.$el.getBoundingClientRect.height
  currTokPosition.value.top = newRect.top
  setExpand(true)
  currTokIndex.value = tokenIndex
}

function newBranch(tokenIndex : number, newToken : string) : void {
  let newBranchTokens : TreeToken[] = []
  for (let i = 0; i < tokenIndex; i++) {
    newBranchTokens.push(tokens.value[i])
  }
  newBranchTokens.push(reactive({
    completionProb : {
      content : newToken,
      probs : []
    },
  }))
  emits("newBranch", newBranchTokens)

  setExpand(false)
}

function setExpand(newValue : boolean, delay : number = 0.1) : void {
  if (newValue) {
    expand.value = newValue
    expandDelayedCall?.kill()
    //gsap.delayedCall(0.2, changeMenuHeight)
  }
  else {
    expandDelayedCall = gsap.delayedCall(delay, function() {
      expand.value = newValue
      expandDelayedCall = null
    })
  }
}

function toPercentage(num : number) : string {
  if (num >= 1) {
    return (num * 100).toFixed(1).toString().slice(0,3)
  }
  else {
    return (num * 100).toFixed(1).toString()
  }
}

//TODO: Figure out why on first hover the lerp fails


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
    .hidden {
      visibility: hidden;
    }

    .animated-element {
      transition: height 0.3s ease-out;
      overflow: hidden;
    }
</style>