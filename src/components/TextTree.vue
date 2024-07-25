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
}>()

const emits = defineEmits<{
  updateOutputs : [outputs : (TreeToken[] | null)[]]
  generateOnNewBranch : [index : number]
}>()

watch(() => props.responseLLM, () => {
  if (branches.value.length <= 0) {
    branches.value.push(reactive({
      response : props.responseLLM.response,
      previousTokens : null,
      totalTokens : null
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
  console.log("branches changed")
  emits("updateOutputs", outputs)
}, {deep : true})

function newBranchFromTokens(tokens : TreeToken[]) : void {
  console.log("Recieved ", tokens.length, " tokens")
  branches.value.push(reactive({
    response : null,
    previousTokens : tokens,
    totalTokens : null
  }))
  activeBranch.value = branches.value.length - 1
  emits("generateOnNewBranch", activeBranch.value)
}

function newBranchFromResponse(response : LlamaInterface) : void {
  console.log("Recieved ", response)
  branches.value.push(reactive({
    response : response,
    previousTokens : null,
    totalTokens : null
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



</script>