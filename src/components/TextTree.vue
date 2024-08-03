<template>
  <div ref="root" style="position: relative; width: 100%; height: 100%; overflow: auto;"
    @scroll="handleScroll($event.currentTarget)">
    <TextBranch v-for="(branch, index) in branches" :key="index" :response-l-l-m="branch.response"
      :previous-tokens="branch.previousTokens" :trigger-new-token="branch.triggerEmptyTokens"
      :scroll-offset="scrollOffset" :is-active="activeBranch == index" @new-branch="newBranchFromTokens"
      @update-tokens="updateTokens($event, index)" :sidebar-width="props.sidebarWidth" />
  </div>
</template>

<script setup lang="ts">
import { reactive, type Ref, ref, watch } from 'vue';
import TextBranch from './TextBranch.vue'
import type { TreeToken } from './TextBranch.vue'
import type { LlamaInterface } from '@/objects/LlamaInterface';

/*******************
 * Reactive varaible declarations
 *******************/

/** Interface used to populate TextBranch props */
interface BranchParameters {
  response: LlamaInterface | null
  previousTokens: TreeToken[] | null
  totalTokens: TreeToken[] | null
  triggerEmptyTokens: boolean
}

/** Interface used to store a new resposne and associated branch index together */
export interface BranchResposne {
  response: LlamaInterface
  index: number
}

/** Array of TextBranches */
const branches: Ref<BranchParameters[]> = ref([])

/** Index of currently active branch */
const activeBranch: Ref<number> = ref(0)

/** Horizontal scroll offset of the div containing all of the TextBranches */
const scrollOffset: Ref<number> = ref(0)

/** Reference to the root div */
const root = ref()

/*******************
 * Emits, props and expose definitions
 *******************/

const props = defineProps<{
  /** Latest resposne from the LLM server */
  responseLLM: BranchResposne

  /** Tokens that have been modified by the user using a textarea, and associated branch index */
  typedTokens: [TreeToken[], number]

  /** Boolean for if any of the textareas are currently focused */
  textBarIsFocused: boolean

  /** Number representing the pixel width of the sidebar */
  sidebarWidth: number
}>()

const emits = defineEmits<{
  /** Emitted when branch contents are updated
   * 
   * @param outputs Array of token arrays containing tokens within each branch
  */
  updateOutputs: [outputs: (TreeToken[] | null)[]]

  /** Emitted when a new branch is created from selecting or entering an alternative token
   * 
   * @param index Index of the new branch
  */
  generateOnNewBranch: [index: number]
}>()

defineExpose({
  removeBranch
})

/*******************
 * Watchers
 *******************/

/**
 * Watches the resposneLLM prop
 *
 * When updated, a new branch is created using the provided response and index
 */
watch(() => props.responseLLM, () => {
  if (branches.value.length <= 0) {
    branches.value.push(reactive({
      response: props.responseLLM.response,
      previousTokens: null,
      totalTokens: null,
      triggerEmptyTokens: false
    }))
  }
  else {
    if (props.responseLLM.index == -1) {
      newBranchFromResponse(props.responseLLM.response)
    }
    else {
      activeBranch.value = props.responseLLM.index
      branches.value[props.responseLLM.index].response = props.responseLLM.response
    }
  }
})

/**
 * Watches the branches
 *
 * When updated, emits "updateOutputs" if no textarea is currently in focus
 */
watch(() => branches.value, () => {
  let outputs: (TreeToken[] | null)[] = branches.value.map((v: BranchParameters) => v.totalTokens);

  if (!props.textBarIsFocused) {
    emits("updateOutputs", outputs)
  }
}, { deep: true })

/**
 * Watches the typedTokens prop
 *
 * When updated, updates the corresponding branch's previousTokens value with the provided tokens
 */
watch(() => props.typedTokens, () => {
  let newTokens: TreeToken[] = []

  for (let i = 0; i < props.typedTokens[0].length; i++) {
    if (props.typedTokens[0][i].completionProb.content.length != 0) {
      newTokens.push(props.typedTokens[0][i])
    }
  }

  branches.value[props.typedTokens[1]].previousTokens = newTokens
  branches.value[props.typedTokens[1]].response = null
  branches.value[props.typedTokens[1]].triggerEmptyTokens = !branches.value[props.typedTokens[1]].triggerEmptyTokens
}, { deep: true })

/*******************
 * Function Definitions
 *******************/

/**
 * Creates a new branch from a list of TreeTokens and emits "generateOnNewBranch"
 *
 * @param tokens - Tokens to create the new branch with
 */
function newBranchFromTokens(tokens: TreeToken[]): void {
  branches.value.push(reactive({
    response: null,
    previousTokens: tokens,
    totalTokens: null,
    triggerEmptyTokens: false
  }))
  activeBranch.value = branches.value.length - 1
  emits("generateOnNewBranch", activeBranch.value)
}

/**
 * Creates a new branch from a LlamaInterface
 *
 * @param response - The response to create the new branch with
 */
function newBranchFromResponse(response: LlamaInterface): void {
  branches.value.push(reactive({
    response: response,
    previousTokens: null,
    totalTokens: null,
    triggerEmptyTokens: false
  }))
  activeBranch.value = branches.value.length - 1
}

/**
 * Handles updating the scroll offset values of all branches
 *
 * @param target - The div that is being scrolled
 */
function handleScroll(target: EventTarget | null): void {
  let element: HTMLElement = target as HTMLElement
  scrollOffset.value = element.scrollLeft
}

/**
 * Updates the tokens of a branch
 *
 * @param index - The index of the branch to update
 * @param tokens - The tokens to update the branch with
 */
function updateTokens(tokens: TreeToken[], index: number): void {
  branches.value[index].totalTokens = tokens
}

/**
 * Removes a branch from the list of branches 
 *
 * @param index - The index of the branch to remove
 */
function removeBranch(index: number): void {
  branches.value.splice(index, 1)
  let outputs: (TreeToken[] | null)[] = branches.value.map((v: BranchParameters) => v.totalTokens);
  emits("updateOutputs", outputs)
}

</script>