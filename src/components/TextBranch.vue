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
      @mouseenter="setMenuHeight(index)"
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
        v-for="(tokenProb, probIndex) in completionProbFilter(tokens[currTokIndex].completionProb)"  
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

  <v-card
    :style="{position: 'absolute', top: 0 + 'px', fontFamily: 'monospace', 
             left : 0 + 'px', height : 'min-content'}"
    class="mx-auto hidden"
    width="200"
  >
    <v-list
      class="pa-0"
      dense="true"
    >
      <v-text-field
        ref="exampleTextField"
        hide-details
      /> 
      <v-list-item
        class="pa-0 ma-0"
        density="compact"
      >   
        <v-list-item-title
          ref="exampleTokenListItem"
          style="font-family: monospace; text-align: center;"
          class="pa-1"
        >
          {{ "Example" }}
        </v-list-item-title>
        <template #prepend> 
          <v-sheet
            class="pa-1 ma-1 v-align-center v-text-center"
            style="width: 58px; text-align: center;"
            color="info"
            rounded="sm"
          >
            {{ "100%" }}
          </v-sheet>
        </template>
      </v-list-item>
    </v-list> 
  </v-card>
</template>

<script setup lang="ts">
import type { Completionprobability, LlamaInterface, Prob } from '@/objects/LlamaInterface';
import { computed, onMounted, onUpdated, reactive, ref, watch, type ComputedRef, type Ref } from 'vue'
import gsap from 'gsap'
import { MutableDOMRect } from '@/objects/MutableDOMRect';
import type { VCard, VListItemTitle, VTextField } from 'vuetify/components';
import { LLMService } from '@/objects/LLMService';

export interface TreeToken {
  completionProb : Completionprobability
  listHeight : number
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
  triggerNewToken : boolean
}>()

const expand = ref(false)
const currTokIndex = ref(0)
const currElementOffset : Ref<number> = ref(0)
const currTokPosition = ref(new MutableDOMRect)
const responses : Ref<LlamaInterface[]> = ref(props?.responseLLM ? [props.responseLLM] : [])
const currWindow = ref(window)
const tokenMenu = ref<InstanceType<typeof VCard> | null>(null);
const virtualTokenMenu = ref<InstanceType<typeof VCard> | null>(null);
const exampleTextField = ref();
const exampleTokenListItem = ref();
const menuHeight = ref(100)
const customTokenInput = ref("")

// Delayed calls for lerped values
let expandDelayedCall : gsap.core.Tween | null = null

const tokens : ComputedRef<TreeToken[]> = computed(() => {
  let newTokens : TreeToken[] = []

  if (exampleTextField.value === undefined || exampleTokenListItem.value === undefined) {
    return [reactive({
      completionProb : {content : "EMPTY BRANCH TOKEN", probs : [{prob : 1.0, tok_str : ""}]} as Completionprobability,
      listHeight : 0
    })]
  }


  if (props.previousTokens !== null) {
    props.previousTokens.forEach((token : TreeToken) => {
      newTokens.push(token)
    })
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
        currToken.probs.push(reactive({
          prob : 0,
          tok_str : currToken.content
        }))
      }

      const textFieldPadding = getVerticalPadding(exampleTextField.value.$el)
      const listItemPadding = getVerticalPadding(exampleTokenListItem.value.$el)
      let currListHeight = exampleTextField.value?.$el.getBoundingClientRect().height + textFieldPadding + 
        ((exampleTokenListItem.value?.$el.getBoundingClientRect().height + listItemPadding) * completionProbFilter(currToken).length)
      console.log("is this a number", (completionProbFilter(currToken).length))


      if (!LLMService.instance.settings.responseTemplateTokens.includes(currToken.content)) {
        newTokens.push( reactive({
          completionProb : responses.value[i].completion_probabilities[n],
          listHeight : currListHeight
        }))
      }


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

watch(() => props.triggerNewToken, () => {
  emptyTokens()
})

onMounted(() => {
  console.log("textarea height", exampleTextField.value?.$el.getBoundingClientRect().height)
  console.log("v-list height", exampleTokenListItem.value?.$el.getBoundingClientRect().height)
  
  emits("updateTokens", tokens.value)
  //heightDelayedCall = gsap.to(menuHeight, {duration : 0, ease : "power1.inOut", value : 0})
  setExpand(true)
  setExpand(false)
})

onUpdated(() => {
  // let targetHeight : number = virtualTokenMenu.value?.$el.getBoundingClientRect().height
  
  // if (!expand.value) {
  //   return
  // }
  
  // if (Math.abs(menuHeight.value - targetHeight) >= 1) {
  //   if (heightDelayedCall?.isActive() == false || heightDelayedCall?.vars.value != targetHeight ) {
  //     console.log("CHANGING HEIGHT RN", targetHeight)

  //     heightDelayedCall?.kill()
  //     //heightDelayedCall = gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", value : targetHeight})
  //     heightDelayedCall = gsap.delayedCall(0.3, () => {console.log("finished up", targetHeight); menuHeight.value = targetHeight})
  //   }
  // }
})

defineExpose({
  emptyTokens
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
  
  gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", value : tokens.value[tokenIndex].listHeight})

  // gsap.delayedCall(0.01, () => {  
  //   let targetHeight = virtualTokenMenu.value?.$el.getBoundingClientRect().height
  //   console.log(targetHeight)
  //   //console.log(virtualTokenMenu.value?.$el.getBoundingClientRect().height)
  //   heightDelayedCall?.kill()
  //   menuHeight.value = targetHeight
  //   //heightDelayedCall = gsap.to(menuHeight, {duration : 0.1, ease : "power1.inOut", value : targetHeight})
  // })
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
    listHeight : exampleTextField.value?.$el.getBoundingClientRect().height 
  }))
  emits("newBranch", newBranchTokens)

  setExpand(false)
}

function setExpand(newValue : boolean, delay : number = 0.1) : void {
  if (newValue) {
    expand.value = newValue
    expandDelayedCall?.kill()
    console.log("expand true now")
  }
  else {
    expandDelayedCall = gsap.delayedCall(delay, function() {
      expand.value = newValue
      expandDelayedCall = null
    })
    console.log("expand flase now")
    
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

function emptyTokens() : void {
  responses.value = []
}

function completionProbFilter(completionProb : Completionprobability) : Prob[] {
  return completionProb.probs.filter((v : Prob) => v.prob != 0 || v.tok_str == completionProb.content)
}

function getVerticalPadding(element : Element) : number {
  const style = window.getComputedStyle(element)
  const verticalPadding = parseFloat(style.paddingTop.replace('px', '')) + parseFloat(style.paddingBottom.replace('px', ''))
  return verticalPadding
}

function setMenuHeight(index : number) : void {
  if (!expand.value) {
    menuHeight.value = tokens.value[index].listHeight
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
      transition: height 0.1s ease-out;
      overflow: hidden;
    }
</style>