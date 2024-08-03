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
                  @update:focused="onFocus($event)" @input="handleTextAreaInput(index, $event)" />
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
import { ref, type Ref, watch, reactive, onMounted, onUnmounted, onUpdated } from 'vue';
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

onUpdated(() => {
  console.log(mouseOffset.value)
})

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

/**
 * Watches the tabheight
 *
 * When the tabheight changes, update the lines shown within the textarea
 */
watch(() => tabHeight.value, () => {
  // Calculate how many lines can fit within the pixel height of the textarea
  const pixelLineHeight = parseInt(window.getComputedStyle(systemTextArea.value?.$el).lineHeight, 10)
  rows.value = Math.floor(tabHeight.value / pixelLineHeight) - 4
})

/*******************
 * Function Definitions
 *******************/

/**
 * Emits removeBranch with the provided index if that branch isn't loading
 *
 * @param index - The index of the branch to remove
 */
function removeBranch(index: number): void {
  if (!outputs.value[index].loading) {
    emits("removeBranch", index)
  }
}

/**
 * Calculate the offset of the mouse from the drag button and set isDragging to true
 *
 * @param event : Mouse event from the dragging button
 */
function dragMouseDown(event: MouseEvent): void {
  let element: HTMLElement = event.currentTarget as HTMLElement
  mouseOffset.value = (window.innerHeight - event.clientY) - (window.innerHeight - element.getBoundingClientRect().bottom)
  isDragging.value = true
}

/**
 * Change the tabheight as the mouse moves
 *
 * @param event : Mouse event from the dragging button
 */
function dragMouseMove(event: MouseEvent): void {
  if (isDragging.value) {
    tabHeight.value = (window.innerHeight - event.clientY) - mouseOffset.value
  }
}

/**
 * Request generation from LLMService 
 *
 * @param index - The index of the branch to use as previousOutput in the sendPrompt function call
 * - -1 Sets previousOutput to an empty string
 */
async function requestGeneration(index: number = -1): Promise<LlamaInterface> {
  // Get the previous output of the branch if continuing generation
  let previousOutput = ""
  if (index !== -1) {
    previousOutput = outputs.value[index].content
  }

  // Return the response from the LLMService singleton
  return await LLMService.instance.sendPrompt(
    userPrompt.value, systemPrompt.value, previousOutput)
}

/**
 * Start LLM generation for a branch
 *
 * @param index - The index of the branch to start generation for
 * - -1 Creates a new branch
 */
async function startGeneration(index: number = -1): Promise<void> {
  // Change that branch's generation button to the loading state
  setLoading(true, index)

  try {
    // Emit the new response if successful
    let output = await requestGeneration(index)
    emits("onGenerationRecieved", reactive({
      response: output,
      index: index
    }))
  }
  catch (error) {
    // If unsuccessful print the error to the console
    console.log(error)
    emits("generationFailed")
  }
  finally {
    // Set loading to false once generation fails or completes
    setLoading(false, index)
  }
}

/**
 * Sets loading to true on the pressed generation button 
 *
 * @param index - The branch index of the button to change the loading value of
 * - -1 Sets loading of the new generation button in the Input tab to true 
 */
function setLoading(isLoading: boolean, index: number = -1): void {
  if (index != -1) {
    outputs.value[index].loading = isLoading
  }
  else {
    startButtonLoading.value = isLoading
  }
}

/**
 * Emits editingTextArea with the provided boolean value
 *
 * @param isFocused - The value to provide with the emit
 */
function onFocus(isFocused: boolean): void {
  emits("editingTextArea", isFocused)
}

/**
 * Handles interaction between editing the textarea and changing the contents of the corresponding TextBranch
 *
 * @param index - The index of the branch that is being edited
 * @param event - The event from the textarea
 */
function handleTextAreaInput(index: number, event: Event): void {
  // Initialise variables for the previous content and list of new tokens
  let oldContent = previousOutputs.value[index].shift()
  let newTokens: TreeToken[] = []

  // Push the new content of the textarea to previousOutputs
  previousOutputs.value[index].push(outputs.value[index].content)

  // If the associated branchtokens aren't null
  if (props.branchTokens[index] !== null && oldContent !== undefined) {
    // Set newtokens to the associated tokens within this component's props
    newTokens = props.branchTokens[index]!

    // Get the new content of the textarea and the character difference between this and the old content
    let newContent = outputs.value[index].content
    let charDifference = newContent.length - oldContent.length

    // Get the cursor offset within the textarea (used to locate change) and initalise the character offset
    let cursorOffset = (event.target as HTMLTextAreaElement).selectionStart
    let charOffset = 0

    if (charDifference > 0) {
      // If new content has been added to the textarea set the offset to start at the end of the new content
      charOffset = newContent.length

      // Move backwards through the tokens of the textarea
      for (let i = newTokens.length - 1; i > 0; i--) {
        // Move the offset to the start of the currrent token 
        let endCharOffset = charOffset
        let tokenLength = newTokens[i].completionProb.content.length
        charOffset -= tokenLength

        // If the cursor offset is ahead of the character offset, then the change is within this token
        if (charOffset <= cursorOffset && charDifference > 0) {
          // Change the token content to a substring starting at the beginning of the token - character difference and ending at the offset at the start of this iteration of the for loop
          newTokens[i].completionProb.content = newContent.substring(endCharOffset - (tokenLength + charDifference), endCharOffset)
          charOffset = endCharOffset - newTokens[i].completionProb.content.length
          charDifference = 0
          break
        }
      }
    }
    else {
      // If content has been removed from the textarea, parse through the content starting at index 0
      for (let i = 0; i < newTokens.length; i++) {
        // Move the offset to the end of the current token
        let startCharOffset = charOffset
        let tokenLength = newTokens[i].completionProb.content.length
        charOffset += tokenLength

        // If the offset moves beyond the length of the new content
        if (charOffset > newContent.length) {
          // Set the current content to the remainder of the new content
          newTokens[i].completionProb.content = newContent.substring(startCharOffset)

          // Set all subsequent tokens to empty strings
          for (let j = i + 1; j < newTokens.length; j++) {
            newTokens[j].completionProb.content = ""
          }

          // Break out of for loop
          charDifference = 0
          break
        }
        else if (charOffset > cursorOffset && charDifference < 0) {
          // If the cursor offset is within the current token content then we have found the change

          // If the negative change is contained within the current token
          if (!(cursorOffset + Math.abs(charDifference) >= charOffset)) {
            // Change the current token's contents and break the for loop
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, charOffset + charDifference)
            charDifference = 0
            break
          }
          else {
            // Otherwise the negative change occurs between multiple tokens

            // Set the current token content from its start to the beginning of the negative changes
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, cursorOffset)

            // Decrease the absolute character difference using token lengths until the character difference is less than the current token length
            let j = i + 1
            while (Math.abs(charDifference) > newTokens[j].completionProb.content.length) {
              charDifference += newTokens[j].completionProb.content.length
              newTokens[j].completionProb.content = ""
              j++
            }

            // Once the final changed token has been found, set the content to a substring between the cursor offset and that token's length 
            newTokens[j].completionProb.content = newContent.substring(cursorOffset, cursorOffset + newTokens[j].completionProb.content.length)
            charDifference = 0
            break
          }
        }
      }
    }

    // If the character difference has been reduced to 0, then the algorithm has worked, otherwise print an error to the console
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
