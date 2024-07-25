<template>
  <v-list
    class="horizontal-list bg-background"
    style="min-width: max-content;"
    @mouseleave="setExpand(false)"
  >
    <v-list-item
      v-for="(token, index) in tokens"
      :key="index"
      :value="token"
      :class="'pa-0 ' + (props.isActive ? 'bg-primary' : 'bg-background')"
      style="overflow: visible;"
      @mouseenter="hover(index, $event.currentTarget)"
      @click="click"
    >
      <v-list-item-title
        style="overflow: visible; font-family: monospace;"
      >
        <pre>{{ token.completionProb.content }}</pre>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  
  <v-expand-transition
    v-if="tokens.length > 0"
    :rounded="false"
    :style="{ height : menuHeight + 'px'}"
  >
    <v-card
      v-show="expand && !tokens[currTokIndex].userModified"
      ref="tokenMenu"
      :style="{position: 'relative', top: 0 + 'px', fontFamily: 'monospace', 
               left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 100 + 'px',
               height : 'min-content'}"
      class="mx-auto"
      width="200"
      @mouseleave="setExpand(false)"
      @mouseenter="setExpand(true)"
    >
      <v-list>
        <v-list-item
          v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0)"
          :key="probIndex"
          :value="tokenProb"
          :disabled="tokenProb.tok_str == tokens[currTokIndex].completionProb.content"
          @click="newBranch(currTokIndex, tokenProb.tok_str)"
        >
          <v-list-item-title
            style="font-family: monospace;"
          >
            {{ tokenProb.tok_str + ':' + tokenProb.prob }}
          </v-list-item-title>
        </v-list-item>
      </v-list>  
    </v-card>
  </v-expand-transition>

  <v-expand-x-transition>
    <v-card
      v-show="openInputBox && !expand"
      :style="{position: 'relative', top: 0 + 'px', fontFamily: 'monospace', 
               left : (currTokPosition.left + currElementOffset) + 'px', width : 200 + 'px'}"
      auto-grow
      @mouseleave="openInputBox = false"
    >
      <v-text-field
        v-model="customTokenInput"
        label="New Token"
        @keydown.enter="newBranch(currTokIndex, customTokenInput)"
      />
    </v-card>
  </v-expand-x-transition>

  <v-card
    ref="virtualTokenMenu"
    :style="{position: 'absolute', top: 0 + 'px', fontFamily: 'monospace', 
             left : (currTokPosition.left + currElementOffset - currWindow.innerWidth / 2) + 'px',
             height : 'min-content'}"
    class="mx-auto hidden"
    width="200"
  >
    <v-list>
      <v-list-item
        v-for="(tokenProb, probIndex) in tokens[currTokIndex].completionProb.probs.filter(v => v.prob != 0)"
        :key="probIndex"
        :value="tokenProb"
      >
        <v-list-item-title
          style="font-family: monospace;"
        >
          {{ tokenProb.tok_str + ':' + tokenProb.prob }}
        </v-list-item-title>
      </v-list-item>
    </v-list>  
  </v-card>
</template>

<script setup lang="ts">
import type { Completionprobability, LlamaInterface } from '@/objects/LlamaInterface';
import { computed, onMounted, reactive, ref, watch, type ComputedRef, type Ref } from 'vue'
import gsap from 'gsap'
import { MutableDOMRect } from '@/objects/MutableDOMRect';
import type { VCard } from 'vuetify/components';

export interface TreeToken {
  completionProb : Completionprobability
  userModified : boolean
}

const emits = defineEmits<{
  newBranch : [tokens : TreeToken[]]
  updateTokens : [tokens : TreeToken[]]
}>()

const props = defineProps<{
  responseLLM : LlamaInterface | null,
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
const menuHeight = ref(0)
const openInputBox = ref(false)
const customTokenInput = ref("")

// Resize Observer to watch for changes in the virtual menu
let resizeObserver = new ResizeObserver(changeMenuHeight)

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

watch(() => virtualTokenMenu.value, () => {
  resizeObserver.observe(virtualTokenMenu.value?.$el)
})

watch(() => tokens.value, () => {
  emits("updateTokens", tokens.value)
})

onMounted(() => {
  emits("updateTokens", tokens.value)
})


function hover(tokenIndex : number, element : HTMLElement) : void {
  let newRect = element.getBoundingClientRect()
  gsap.to(currTokPosition.value, {duration : 0.1, ease : "power1.inOut", left : newRect.left})
  gsap.to(currElementOffset, {duration : 0.1, ease : "power1.inOut", value : props.scrollOffset})
  currTokPosition.value.top = newRect.top
  setExpand(true)
  currTokIndex.value = tokenIndex
}

function click() : void {
  openInputBox.value = true
  setExpand(false)
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
    userModified : false
  }))

  emits("newBranch", newBranchTokens)
  setExpand(false)
}

function setExpand(newValue : boolean) : void {
  if (newValue) {
    expand.value = newValue
    expandDelayedCall?.kill()
  }
  else {
    expandDelayedCall = gsap.delayedCall(0.1, function() {
      expand.value = newValue
      expandDelayedCall = null
    })
  }
}

function changeMenuHeight() : void {
  if (heightDelayedCall !== null) {
    heightDelayedCall.kill()
  }
  heightDelayedCall = gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", 
    value : virtualTokenMenu.value?.$el.getBoundingClientRect().height})
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
</style>