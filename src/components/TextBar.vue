<template>  
  <v-app-bar
    color="surface"
    :height="tabHeight"
    location="bottom"
    flat
  >
    <v-container
      class="pa-0"
    >
      <v-tabs-window
        v-model="topLevelTab"
        class="pa-0"
      >
        <v-tabs-window-item
          value="input"
        >        
          <v-row
            no-gutters
            align="start"
          >
            <v-col
              cols="6"
              align-self="start"
            >
              <v-textarea
                ref="systemTextArea"
                v-model="systemPrompt"
                class="fill-height d-flex flex-column pa-2"
                label="System Prompt"
                no-resize
                :rows="rows"
                hide-details
              />
            </v-col>
            <v-col 
              cols="6"
              align-self="end"
            >
              <v-textarea
                v-model="userPrompt"
                class="fill-height d-flex flex-column pa-2"
                label="User Prompt"
                :rows="rows"
                no-resize
                hide-details
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              class="px-2"
            >
              <v-btn
                :loading="startButtonLoading"
                block
                class="pa-4"
                color="blue"
                base-color="blue"
                variant="elevated"
                rounded="lg"
                @click="startGeneration(-1)"
              >
                Generate New Response
              </v-btn>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item
          value="output"
          class="pa-0"
        >
          <v-sheet
            class="d-flex flex-nowrap bg-surface pa-0"
            style="overflow-x: scroll;"
          >
            <v-col
              v-for="(_, index) in outputs"
              :key="index"
              class="pa-1"
              cols="auto"
              align-self="end"
            >
              <v-row no-gutters> 
                <v-textarea
                  v-model="outputs[index].content"
                  class="fill-height d-flex flex-column pa-2"
                  :label="'Output ' + (index + 1).toString()"
                  :rows="rows"
                  no-resize
                  hide-details
                  @input="newHandleTextAreaInput(index, $event)"
                /> 
              </v-row>  
              <v-row no-gutters>
                <v-btn
                  style="width: 70%;"
                  :loading="outputs[index].loading"
                  :timeout="100"
                  color="blue"
                  variant="elevated"
                  rounded="lg"
                  @click="startGeneration(index)"
                >
                  Continue Generation
                </v-btn>
                <v-btn
                  style="width: 30%;"
                  class="bg-red"
                  rounded="lg"
                  @click="removeBranch(index)"
                >
                  <v-icon
                    icon="mdi-minus-circle"
                  />
                  Remove
                </v-btn>
              </v-row>
            </v-col>
          </v-sheet>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>  
  </v-app-bar>

  <v-app-bar
    color="grey-lighten-2"
    height="30"
    location="bottom"
    class="d-flex"
    flat
  >
    <v-tabs
      v-model="topLevelTab"
      bg-color="blue"
      center-active
      rounded="lg"
      style="width: 100%;"
    >
      <v-fab
        class="ms-4"
        icon="mdi-plus"
        location="start"
        size="small"
        offset
        @mousedown="dragMouseDown($event)"
      />
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
import { LLMService  } from '@/objects/LLMService';
import { ref, type Ref, watch, reactive, onMounted, onUnmounted } from 'vue';
import type { TreeToken } from './TextBranch.vue'
import { type LlamaInterface } from '../objects/LlamaInterface';
import { type BranchResposne } from './TextTree.vue';

interface outputData {
  content : string 
  loading : boolean
}

const startButtonLoading : Ref<boolean> = ref(false)
const userPrompt : Ref<string> = ref("Write a story about a man named Stanley")
const systemPrompt : Ref<string> = ref("You are a talented writing assistant. Always respond by incorporating the instructions into expertly written prose that is highly detailed, evocative, vivid and engaging.");
const topLevelTab = ref("input")
const outputs : Ref<outputData[]> = ref([])
const previousOutputs : Ref<string[][]> = ref([])
const systemTextArea = ref()
const currentCursorPosition = ref(0)

const isDragging = ref(false)
const tabHeight = ref(280)
const mouseOffset = ref(0)
const rows = ref(8)

const emits = defineEmits<{
  onGenerationRecieved : [output : BranchResposne]
  generationFailed : []
  tokensUpdated : [tokens : TreeToken[], index : number]
  removeBranch : [index : number]
}>()

const props = defineProps<{
  branchTokens : (TreeToken[] | null)[]
}>()

defineExpose({
  startGeneration
})

onMounted(() => {
  window.addEventListener('mousemove', dragMouseMove)
  window.addEventListener('mouseup', () => {isDragging.value = false})
});

onUnmounted(() => {
  window.removeEventListener('mousemove', dragMouseMove);
  window.removeEventListener('mouseup', () => {isDragging.value = false})
});

watch(() => props.branchTokens, () => {
  outputs.value = []
  for (let i = 0; i < props.branchTokens.length; i++) {
    if (props.branchTokens[i] !== null) {
      let newOutput : outputData = reactive({
        content : props.branchTokens[i]!.map((t : TreeToken) => t.completionProb.content).join(''),
        loading : false
      })
      outputs.value.push(newOutput)
      previousOutputs.value.push([newOutput.content])
    }
  }
})

watch(() => tabHeight.value, () => {
  const pixelLineHeight = parseInt(window.getComputedStyle(systemTextArea.value?.$el).lineHeight, 10)
  rows.value = Math.floor(tabHeight.value / pixelLineHeight) - 4
})

function removeBranch(index : number) : void {
  emits("removeBranch", index)
}

function dragMouseDown(event : MouseEvent) : void {
  let element : HTMLElement = event.currentTarget as HTMLElement
  mouseOffset.value = (window.innerHeight - event.clientY) - (window.innerHeight - element.getBoundingClientRect().bottom)
  isDragging.value = true
}

function dragMouseMove(event : MouseEvent) : void {
  if (isDragging.value) {
    tabHeight.value = (window.innerHeight - event.clientY) - mouseOffset.value
  }
}

async function requestGeneration(index : number = -1) : Promise<LlamaInterface> {
  let previousOutput = ""
  if (index !== -1) {
    previousOutput = outputs.value[index].content
  }

  return await LLMService.instance.sendPrompt(
    userPrompt.value, systemPrompt.value, previousOutput)
}

async function startGeneration(index : number = -1) : Promise<void> {
  console.log(index)
  
  setLoading(true, index)

  try {
    let output = await requestGeneration(index)
    emits("onGenerationRecieved", reactive({
      response : output,
      index : index
    }))
  }
  catch(error) {
    console.log(error)
    emits("generationFailed")
  }
  finally {
    setLoading(false, index)
  }
}

function setLoading(isLoading : boolean, index : number = -1) : void {
  if (index != -1) {
    outputs.value[index].loading = isLoading
  }
  else {
    startButtonLoading.value = isLoading 
  }
}

function newHandleTextAreaInput(index : number, event : Event) : void {
  let oldContent = previousOutputs.value[index].shift()
  let newTokens : TreeToken[] = []
  previousOutputs.value[index].push(outputs.value[index].content)

  if (props.branchTokens[index] !== null && oldContent !== undefined) {
    newTokens = JSON.parse(JSON.stringify(props.branchTokens[index])) 
    let newContent = outputs.value[index].content
    let charDifference = newContent.length - oldContent.length
    let cursorOffset = (event.target as HTMLTextAreaElement).selectionStart
    currentCursorPosition.value = cursorOffset < newContent.length ? cursorOffset : currentCursorPosition.value

    let charOffset = 0

    if (charDifference > 0) {
      charOffset = newContent.length
      for (let i = newTokens.length; i > 0; i--) { 
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
          if(!(cursorOffset + Math.abs(charDifference) >= charOffset)) {
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, charOffset + charDifference)
            charDifference = 0
            break
          }
          else {
            newTokens[i].completionProb.content = newContent.substring(startCharOffset, cursorOffset)

            let j = i + 1
            while(Math.abs(charDifference) > newTokens[j].completionProb.content.length) {
              charDifference += newTokens[j].completionProb.content.length
              newTokens[j].completionProb.content = ""
              j++
            }

            newTokens[j].completionProb.content = newContent.substring(cursorOffset, cursorOffset + newTokens[j].completionProb.content.length + 1)
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
      console.log("Error : failed to locate changes in TextBar output textarea, index: ${index}")
    }
  }
}

function handleTextAreaInput(index : number) : void {
  // Create copy of textarea contents and empty TreeToken array
  let textContent = outputs.value[index].content
  let newTokens : TreeToken[] = []
  if (props.branchTokens[index] !== null) {
    // If not null, copy array contents and start iteration
    newTokens = JSON.parse(JSON.stringify(props.branchTokens[index])) 
    
    for (let n = 0; n < props.branchTokens[index].length; n++) {
      // Get current token from token list and current word from text area
      let currentToken = props.branchTokens[index][n].completionProb.content
      let currentWord = textContent.slice(0, currentToken.length)
      
      // If not at end of token array, iterate over text area until next token found
      if (n < props.branchTokens[index].length - 1) { 
        if(currentWord != currentToken) {
          //TODO : Rewrite this to check against all tokens ahead of current token
          let nextToken = props.branchTokens[index][n+1].completionProb.content
          
          for (let m = 0; m < textContent.length; m++) {
            // If next token found, update contents of token array and remove contents from textarea
            if (nextToken == textContent.slice(m, m + nextToken.length)) {
              newTokens[n].completionProb.content = textContent.slice(0, m)
              textContent = textContent.slice(m)
              break
            }
          }
        }
        else {
          // If current token and word match, remove current word from textarea
          newTokens[n].completionProb.content = currentWord
          textContent = textContent.slice(currentToken.length)
        }
      }
      else {
        // If at end of token array, add remaining text area to final token and remove contents from textarea
        newTokens[n].completionProb.content = textContent
        textContent = textContent.slice(textContent.length)
      }
    }
  }

  if (textContent.length == 0) {
    emits("tokensUpdated", newTokens, index)
  }
  else {
    console.log("Error : failed to locate changes in TextBar output textarea, index: ${index}")
  }
}

</script>

<style>
.v-tab {
  border-radius: 0 !important;
}
</style>
