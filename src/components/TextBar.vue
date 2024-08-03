<template>
  <v-app-bar color="surface" :height="tabHeight" location="bottom" flat>
    <v-container class="pa-0">
      <v-tabs-window v-model="topLevelTab" class="pa-0">
        <v-tabs-window-item value="input">
          <v-row no-gutters align="start">
            <v-col cols="6" align-self="start">
              <v-textarea ref="systemTextArea" v-model="systemPrompt" class="fill-height d-flex flex-column pa-2"
                label="System Prompt" no-resize :rows="rows" hide-details />
            </v-col>
            <v-col cols="6" align-self="end">
              <v-textarea v-model="userPrompt" class="fill-height d-flex flex-column pa-2" label="User Prompt"
                :rows="rows" no-resize hide-details />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="px-2">
              <v-btn :loading="startButtonLoading" block class="pa-4" color="blue" base-color="blue" variant="elevated"
                rounded="lg" @click="startGeneration(-1)">
                Generate New Response
              </v-btn>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="output" class="pa-0">
          <v-sheet class="d-flex flex-nowrap bg-surface pa-0" style="overflow-x: scroll;">
            <v-col v-for="(_, index) in outputs" :key="index" class="pa-1" cols="auto" align-self="end">
              <v-row no-gutters>
                <v-textarea v-model="outputs[index].content" class="fill-height d-flex flex-column pa-2"
                  :label="'Output ' + (index + 1).toString()" :rows="rows" no-resize hide-details
                  @update:focused="onFocus(index, $event)" @input="newHandleTextAreaInput(index, $event)" />
              </v-row>
              <v-row no-gutters>
                <v-btn style="width: 70%;" :loading="outputs[index].loading" :timeout="100" color="blue"
                  variant="elevated" rounded="lg" @click="startGeneration(index)">
                  Continue Generation
                </v-btn>
                <v-btn style="width: 30%;" class="bg-red" rounded="lg"
                  :disabled="outputs.some((value: outputData) => { return value.loading === true })"
                  @click="removeBranch(index)">
                  <v-icon icon="mdi-minus-circle" />
                  Remove
                </v-btn>
              </v-row>
            </v-col>
          </v-sheet>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </v-app-bar>

  <v-app-bar color="grey-lighten-2" height="30" location="bottom" class="d-flex" flat>
    <v-btn icon="mdi-format-align-justify" @mousedown="dragMouseDown($event)" />
    <v-tabs v-model="topLevelTab" bg-color="blue" center-active rounded="lg" style="width: 100%;">
      <v-tab value="input">
        Input
      </v-tab>
      <v-tab value="output">
        Output
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup lang="ts">
import { LLMService } from '@/objects/LLMService';
import { ref, type Ref, watch, reactive, onMounted, onUnmounted } from 'vue';
import type { TreeToken } from './TextBranch.vue'
import { type LlamaInterface } from '../objects/LlamaInterface';
import { type BranchResposne } from './TextTree.vue';

/*******************
 * Reactive varaible declarations
 *******************/

/** Defines interface for containing data output from the LLM */
interface outputData {
  content: string
  loading: boolean
}

// Reactive varaibles used for the input tab
/** Boolean that sets the loading parameter of the new generation button */
const startButtonLoading: Ref<boolean> = ref(false)
/** Reference to the systemTextArea HTML element */
const systemTextArea = ref()
/** Contents of the userPrompt textarea */
const userPrompt: Ref<string> = ref("Write a story about a man named Stanley")
/** Contents of the systemPrompt textarea */
const systemPrompt: Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging.");


/** Tracks the current tab */
const topLevelTab = ref("input")


// Reactive varaibles used for tracking changes to the outputs
/** Contains the strings and loading values of all the ouput textareas */
const outputs: Ref<outputData[]> = ref([])
/** Contains a list of string queues, with the oldest outputs at the start of each array
 * Indexes correspond with outputs
 */
const previousOutputs: Ref<string[][]> = ref([])


// Reactive varaibles used for dragging the menu up and down
/** Is the dragging button being held down currently */
const isDragging = ref(false)
/** The height of the window that contains the tab contents */
const tabHeight = ref(280)
/** Tracks the mouse offest from the drag menu button */
const mouseOffset = ref(0)
/** Tracks how many rows are used by the textareas within the tabs */
const rows = ref(8)

/*******************
 * Emits, props and expose definitions
 *******************/

const emits = defineEmits<{
  /** Emitted when a new generation is recieved from LLMService 
   * 
   * @param output Response from the LLMService
  */
  onGenerationRecieved: [output: BranchResposne]

  /** Emitted when a new generation fails */
  generationFailed: []

  /** Emitted when the tokens are updated by the user 
   * 
   * @param tokens Updated tokens
   * @param index Branch index being updated
  */
  tokensUpdated: [tokens: TreeToken[], index: number]

  /** Emitted when a branch is removed by the user
   * 
   * @param index Index of branch to remove
   */
  removeBranch: [index: number]

  /** Emitted when a textarea is focuses or unfocuses 
   * 
   * @param isEditing Boolean representing if the textarea is being updated or not
  */
  editingTextArea: [isEditing: boolean]
}>()

const props = defineProps<{
  /** Latest tokens within each TextBranch */
  branchTokens: (TreeToken[] | null)[]
}>()

defineExpose({
  startGeneration
})

/*******************
 * Lifecycle hooks
 *******************/

/**
* Adds event listeners for tracking if the mouse moves or mouse 1 is let go
*/
onMounted(() => {
  window.addEventListener('mousemove', dragMouseMove)
  window.addEventListener('mouseup', () => { isDragging.value = false })
});

/**
* Removes event listeners for tracking if the mouse moves or mouse 1 is let go
*/
onUnmounted(() => {
  window.removeEventListener('mousemove', dragMouseMove);
  window.removeEventListener('mouseup', () => { isDragging.value = false })
});

/*******************
 * Watchers
 *******************/

/**
 * Watches the branchtokens prop
 *
 * When prop.branchtokens are updated, the outputs and previous outputs of the TexBar are updated accordingly
 */
watch(() => props.branchTokens, () => {
  outputs.value = []

  // For each token list in branchtokens
  for (let i = 0; i < props.branchTokens.length; i++) {
    // If the current token list isn't null or undefined
    if (props.branchTokens[i] !== null && props.branchTokens[i] !== undefined) {
      // Create a new outputData interface with a string of all token contents
      let newOutput: outputData = reactive({
        content: props.branchTokens[i]!.map((t: TreeToken) => t.completionProb.content).join(''),
        loading: false
      })

      // Push the new outputData to the list of outputs
      outputs.value.push(newOutput)

      // Push the new outputData to the previous responses, extending the list if it is too short
      if (i == previousOutputs.value.length || previousOutputs.value[i].length == 0) {
        previousOutputs.value.push([])
        previousOutputs.value[i].push(newOutput.content)
      }
      else {
        previousOutputs.value[i] = [newOutput.content]
      }
    }
  }
})

watch(() => tabHeight.value, () => {
  const pixelLineHeight = parseInt(window.getComputedStyle(systemTextArea.value?.$el).lineHeight, 10)
  rows.value = Math.floor(tabHeight.value / pixelLineHeight) - 4
})

function removeBranch(index: number): void {
  if (!outputs.value[index].loading) {
    emits("removeBranch", index)
  }
}

function dragMouseDown(event: MouseEvent): void {
  let element: HTMLElement = event.currentTarget as HTMLElement
  mouseOffset.value = (window.innerHeight - event.clientY) - (window.innerHeight - element.getBoundingClientRect().bottom)
  isDragging.value = true
}

function dragMouseMove(event: MouseEvent): void {
  if (isDragging.value) {
    tabHeight.value = (window.innerHeight - event.clientY) - mouseOffset.value
  }
}

async function requestGeneration(index: number = -1): Promise<LlamaInterface> {
  let previousOutput = ""
  if (index !== -1) {
    previousOutput = outputs.value[index].content
  }

  return await LLMService.instance.sendPrompt(
    userPrompt.value, systemPrompt.value, previousOutput)
}

async function startGeneration(index: number = -1): Promise<void> {
  setLoading(true, index)

  try {
    let output = await requestGeneration(index)
    emits("onGenerationRecieved", reactive({
      response: output,
      index: index
    }))
  }
  catch (error) {
    console.log(error)
    emits("generationFailed")
  }
  finally {
    setLoading(false, index)
  }
}

function setLoading(isLoading: boolean, index: number = -1): void {
  if (index != -1) {
    outputs.value[index].loading = isLoading
  }
  else {
    startButtonLoading.value = isLoading
  }
}

function onFocus(index: number, isFocused: boolean): void {
  emits("editingTextArea", isFocused)
}

function newHandleTextAreaInput(index: number, event: Event): void {
  let oldContent = previousOutputs.value[index].shift()
  let newTokens: TreeToken[] = []
  previousOutputs.value[index].push(outputs.value[index].content)

  if (props.branchTokens[index] !== null && oldContent !== undefined) {
    newTokens = props.branchTokens[index]!
    let newContent = outputs.value[index].content
    let charDifference = newContent.length - oldContent.length
    let cursorOffset = (event.target as HTMLTextAreaElement).selectionStart

    let charOffset = 0

    if (charDifference > 0) {

      charOffset = newContent.length
      for (let i = newTokens.length - 1; i > 0; i--) {
        let endCharOffset = charOffset
        let tokenLength = newTokens[i].completionProb.content.length
        charOffset -= tokenLength

        if (charOffset <= cursorOffset && charDifference > 0) {
          newTokens[i].completionProb.content = newContent.substring(endCharOffset - (tokenLength + charDifference), endCharOffset)
          charOffset = endCharOffset - newTokens[i].completionProb.content.length
          charDifference = 0
          break
        }
      }
    }
    else {
      for (let i = 0; i < newTokens.length; i++) {
        let startCharOffset = charOffset
        let tokenLength = newTokens[i].completionProb.content.length
        charOffset += tokenLength

        if (charOffset > newContent.length) {
          newTokens[i].completionProb.content = newContent.substring(startCharOffset)
          for (let j = i + 1; j < newTokens.length; j++) {
            newTokens[j].completionProb.content = ""
          }
          charDifference = 0
          break
        }
        else if (charOffset > cursorOffset && charDifference < 0) {
          if (!(cursorOffset + Math.abs(charDifference) >= charOffset)) {
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, charOffset + charDifference)
            charDifference = 0
            break
          }
          else {
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, cursorOffset)

            let j = i + 1
            while (Math.abs(charDifference) > newTokens[j].completionProb.content.length) {
              charDifference += newTokens[j].completionProb.content.length
              newTokens[j].completionProb.content = ""
              j++
            }

            newTokens[j].completionProb.content = newContent.substring(cursorOffset, cursorOffset + newTokens[j].completionProb.content.length)
            charDifference = 0

            break

          }
        }
      }
    }

    if (charDifference == 0) {
      emits("tokensUpdated", newTokens, index)
    }
    else {
      console.log(`Error : failed to locate changes in TextBar output textarea, index: ${index}`)
    }
  }
}

</script>

<style>
.v-tab {
  border-radius: 0 !important;
}
</style>
