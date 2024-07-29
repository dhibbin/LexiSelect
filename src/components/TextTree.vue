<template>
  <div
    ref="root"
    style="position: relative; width: 100%; height: 100%; overflow: auto;"
    @scroll="handleScroll($event.currentTarget)"
  >
    <TextBranch 
      v-for="(branch, index) in branches"
      :key="index"
      :response-l-l-m="branch.response"
      :previous-tokens="branch.previousTokens"
      :trigger-new-token="branch.triggerEmptyTokens"
      :scroll-offset="scrollOffset"
      :is-active="activeBranch == index"
      @new-branch="newBranchFromTokens"
      @update-tokens="updateTokens($event, index)"
    />  
  </div>
</template>

<script setup lang="ts">
import { reactive, type Ref, ref, watch } from 'vue';
import TextBranch from './TextBranch.vue'
import type { TreeToken } from './TextBranch.vue'
import type { LlamaInterface } from '@/objects/LlamaInterface';

interface BranchParameters {
  response : LlamaInterface | null
  previousTokens : TreeToken[] | null
  totalTokens : TreeToken[] | null
  triggerEmptyTokens : boolean
}

export interface BranchResposne {
  response : LlamaInterface
  index : number
}

const branches : Ref<BranchParameters[]> = ref([])
const activeBranch : Ref<number> = ref(0)
const scrollOffset : Ref<number> = ref(0)

const props = defineProps<{
  responseLLM : BranchResposne
  typedTokens : [TreeToken[], number]
}>()

const emits = defineEmits<{
  updateOutputs : [outputs : (TreeToken[] | null)[]]
  generateOnNewBranch : [index : number]
}>()

defineExpose({
  removeBranch
})

watch(() => props.responseLLM, () => {
  if (branches.value.length <= 0) {
    branches.value.push(reactive({
      response : props.responseLLM.response,
      previousTokens : null,
      totalTokens : null,
      triggerEmptyTokens : false
    }))
  }
  else {
    if (props.responseLLM.index == -1) {
      newBranchFromResponse(props.responseLLM.response)
    }
    else {
      branches.value[activeBranch.value].response = props.responseLLM.response
    }
  }
})

watch(() => branches.value, () => {
  let outputs : (TreeToken[] | null)[] = branches.value.map((v : BranchParameters) => v.totalTokens);
  emits("updateOutputs", outputs)
}, {deep : true})

watch(() => props.typedTokens, () => {
  branches.value[props.typedTokens[1]].previousTokens = props.typedTokens[0]
  branches.value[props.typedTokens[1]].response = null
  branches.value[props.typedTokens[1]].triggerEmptyTokens = !branches.value[props.typedTokens[1]].triggerEmptyTokens
}, {deep : true})

function newBranchFromTokens(tokens : TreeToken[]) : void {
  console.log("Recieved ", tokens.length, " tokens")
  branches.value.push(reactive({
    response : null,
    previousTokens : tokens,
    totalTokens : null,
    triggerEmptyTokens : false
  }))
  activeBranch.value = branches.value.length - 1
  emits("generateOnNewBranch", activeBranch.value)
}

function newBranchFromResponse(response : LlamaInterface) : void {
  branches.value.push(reactive({
    response : response,
    previousTokens : null,
    totalTokens : null,
    triggerEmptyTokens : false
  }))
  activeBranch.value = branches.value.length - 1
}

function handleScroll(target : EventTarget | null) : void {
  let element : HTMLElement = target as HTMLElement
  scrollOffset.value = element.scrollLeft
}

function updateTokens(tokens : TreeToken[], index : number) : void {
  branches.value[index].totalTokens = tokens
}

function removeBranch(index : number) : void {
  branches.value.splice(index, 1)
  console.log(branches.value[1])
}



</script>