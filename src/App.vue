<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Lexi Select</v-app-bar-title>
      <v-btn icon="mdi-gavel" variant="text" @click="sendTestJson" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="sidebarWidth" app>
      <!--  -->
      <SideBar />
    </v-navigation-drawer>

    <TextBar ref="textBar" :branch-tokens="outputs" @tokens-updated="textAreaUpdateOutput"
      @on-generation-recieved="onGenerationRecieved" @generation-failed="onGenerationFailed"
      @remove-branch="textTree?.removeBranch"
      @editing-text-area="(isEditing: boolean) => { editingTextArea = isEditing }" />


    <v-main class="d-flex align-center justify-center" style="overflow-y: hidden;">
      <v-snackbar v-model="showSnackbar" color="error" :timeout="3000">
        <div class="d-flex justify-space-evenly bg-transparent">
          <v-sheet class="pa-2 bg-transparent">
            Request to LLM server failed
          </v-sheet>
          <v-btn class="align-center justify-center" color="background" @click="showSnackbar = false">
            Close
          </v-btn>
        </div>
      </v-snackbar>

      <TextTree ref="textTree" :response-l-l-m="latestResponse" :typed-tokens="typedTokens"
        :text-bar-is-focused="editingTextArea" @generate-on-new-branch="generateOnNewBranch"
        @update-outputs="updateOutputs" :sidebar-width="drawer ? sidebarWidth : 0" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue'
import SideBar from './components/SideBar.vue'
import TextBar from './components/TextBar.vue'
import TextTree from './components/TextTree.vue'
import testResponse from './assets/testResponse.json'
import { defaultLlamaInterface } from './objects/LlamaInterface';
import type { TreeToken } from './components/TextBranch.vue'
import { type BranchResposne } from './components/TextTree.vue';
import gsap from 'gsap'

/*******************
 * Reactive varaible declarations
 *******************/

/** Boolean tracking if the drawer is open */
const drawer: Ref<boolean> = ref(true)

/** The latest response from the LLM server */
const latestResponse: Ref<BranchResposne> = ref({ response: defaultLlamaInterface(), index: -1 })

/** Tokens updated by the user and the corresponding branch index */
const typedTokens = ref<[TreeToken[], number]>([[], 0])

/** List of tokens in every branch */
const outputs: Ref<(TreeToken[] | null)[]> = ref([])

/** Boolean tracking if the error snackbar is shown */
const showSnackbar = ref(false)

/** Reference to the textBar DOM object */
const textBar = ref()

/** Reference to the textTree DOM object */
const textTree = ref<InstanceType<typeof TextTree> | null>(null)

/** Boolean tracking if a textarea is being edited */
const editingTextArea = ref(false)

/** Number setting the target width of the sidebar */
const sidebarWidth = ref(400)

/*******************
 * Function Definitions
 *******************/

/**
 * Called on new generation being recieved from the TextBar
 *
 * @param newResponse - The newest resposne from the LLM server
 */
function onGenerationRecieved(newReponse: BranchResposne): void {
  latestResponse.value = newReponse
}

/**
 * Sends a pre-made test response to the TextTree component
 */
function sendTestJson(): void {
  latestResponse.value = reactive({
    response: JSON.parse(JSON.stringify(testResponse)),
    index: -1,
  })
}

/**
 * Updates textbar's outputs with the latest branch tokens
 *
 * @param newOutputs - The latest tokens from the TextTree's branches
 */
function updateOutputs(newOutputs: (TreeToken[] | null)[]): void {
  outputs.value = newOutputs
}

/**
 * Shows the snackbar when the generation fails
 */
function onGenerationFailed(): void {
  showSnackbar.value = true
}

/**
 * Starts generation for a new branch
 *
 * @param index - The index of the branch to start generation for
 */
function generateOnNewBranch(index: number): void {
  gsap.delayedCall(0.1, () => { textBar.value.startGeneration(index) })
}

/**
 * Updates the typedTokens of the TextTree using new input from the user
 *
 * @param newTokens - The new tokens updated by the user
 * @param index - The index of the branch to update
 */
function textAreaUpdateOutput(newTokens: TreeToken[], index: number): void {
  typedTokens.value = [newTokens, index]
}


</script>
