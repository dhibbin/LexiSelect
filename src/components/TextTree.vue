<template>
  <TextBranch 
    v-for="(branch, index) in branches"
    :key="index"
    :response-l-l-m="branch.response"
    :previous-tokens="branch.tokens"
  />
</template>

<script setup lang="ts">
import { reactive, type Ref, ref, watch } from 'vue';
import TextBranch from './TextBranch.vue'
import type { TreeToken } from './TextBranch.vue'
import type { LlamaInterface } from '@/objects/LlamaInterface';

interface BranchParameters {
    response : LlamaInterface,
    tokens : TreeToken[] | null
}


const branches : Ref<BranchParameters[]> = ref([])
const activeBranch : Ref<number> = ref(0)


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




</script>