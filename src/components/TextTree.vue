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
      :previous-tokens="branch.tokens"
      :scroll-offset="scrollOffset"
      @new-branch="newBranch"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, type Ref, ref, watch } from 'vue';
import TextBranch from './TextBranch.vue'
import type { TreeToken } from './TextBranch.vue'
import type { LlamaInterface } from '@/objects/LlamaInterface';

interface BranchParameters {
    response : LlamaInterface | null,
    tokens : TreeToken[] | null
}

const branches : Ref<BranchParameters[]> = ref([])
const activeBranch : Ref<number> = ref(0)
const scrollOffset : Ref<number> = ref(0)

const props = defineProps<{
    responseLLM : LlamaInterface,
}>()

watch(() => props.responseLLM, () => {
    if (branches.value.length <= 0) {
        branches.value.push(reactive({
            response : props.responseLLM,
            tokens : null
        }))
    }
    else {
        branches.value[activeBranch.value].response = props.responseLLM
    }
})

function newBranch(tokens : TreeToken[]) : void {
    console.log("Recieved ", tokens.length, " tokens")
    branches.value.push(reactive({
        response : null,
        tokens : tokens
    }))
    activeBranch.value = branches.value.length - 1
}

function handleScroll(target : EventTarget | null) : void {
	let element : HTMLElement = target as HTMLElement
	scrollOffset.value = element.scrollLeft
}




</script>