import type { LlamaInterface } from './LlamaInterface'
import { type LLMSettings, LLMSettingsWrapper } from './LLMSettings'

/**
 * LLMService is a singleton class that provides methods to interact with the Llama API
 * @note The service should be easily extendible to add compatability with Kobold/OpenAI etc
 */
export class LLMService {
  /** The singleton's listening for the latest seed from the Llama  */
  private listeners : ((num : number) => void)[] = []
  
  /** The singleton instance of LLMService */
  private static wrappedInstance : LLMService  

  /** Settings used by singleton when sending prompts to the Llama API */
  private wrappedSettings : LLMSettings = {
    n_predict : 10,
    n_probs : 5,
    seed : -1,
    ipAddress : "localhost:8080",
    stoppingStrings : "[]",
    systemPrepend : "<|system|>",
    systemPostpend : "<|end|>",
    userPrepend : "<|user|>" ,
    userPostpend : "<|end|>",
    responseTemplateTokens : ["<|assistant|>"],
    temperature : 0.8,
    dynatemp_range : 0.0,
    dynatemp_exponent : 1.0,
    top_k : 40,
    top_p : 0.95,
    min_p : 0.05,
    repeat_penalty : 1.1,
    repeat_last_n : 64,
    presence_penalty : 0.0,
    frequency_penalty : 0.0,
  }

  /**
   * The LLMService constructor is private to ensure the only instance is the singleton instance
   */
  private constructor() {}

  /**
   * Static method to access the singleton instance of the LLMService class
   * @returns The singleton instance of the LLMService class
   */
  public static get instance(): LLMService {
    if (!LLMService.wrappedInstance) {
      LLMService.wrappedInstance = new LLMService()
    }
    return LLMService.wrappedInstance
  }

  /**
   * Setter for the settings property. Doesn't change the settings if the values are invalid
   * @param settings - The new settings
   */
  public set settings(settings : LLMSettings) {
    if (LLMSettingsWrapper.validate(settings)){
      this.wrappedSettings = settings
    }
  }

  /**
   * Getter for the settings property
   * @returns The current settings
   */
  public get settings() : LLMSettings {
    return this.wrappedSettings
  }

  /**
   * Adds a listener to the singleton
   * @param listener - A bound function that listens to the singleton
   */
  public addListener(listener : (num : number) => void) : void {
    this.listeners.push(listener)
  }

  /**
   * Calls all of the singleton's listeners with the provided number
   * 
   * Used to provided the updated seed to the sidebar
   * @param num -  The number to call the listeners with
   */
  private callListeners(num : number) : void {
    for (const listener of this.listeners) {
      listener(num)
    }
  }

  /**
   * Sends a prompt to the Llama API and calls the listener functions with the seed of the generation settings
   * 
   * @param userPrompt - The user prompt
   * @param systemPrompt - The system prompt
   * @param previousGeneration - The previous generation
   * @returns The response from the Llama API
   */
  public async sendPrompt(userPrompt : string, systemPrompt : string, 
    previousGeneration : string = "") : Promise<LlamaInterface> 
  {
    // Get the response and call the SideBar listener with the updated seed
    const latestReposne = await this.wrappedSendPrompt(userPrompt, systemPrompt, previousGeneration)
    this.callListeners(latestReposne.generation_settings.seed)
    
    console.log("ello")
    // Return the response
    return latestReposne
  }

  /**
   * Sends a prompt to the Llama API
   * 
   * Constructs a prompt from the user/system prompts and the previously generated tokens
   * 
   * @param userPrompt - The user prompt
   * @param systemPrompt - The system prompt
   * @param previousGeneration - The previous generation
   * @returns The response from the Llama API.
   */
  private async wrappedSendPrompt(userPrompt : string, systemPrompt : string, 
    previousGeneration : string = "") : Promise<LlamaInterface> 
  { 
    // Construct the prompt using the template tokens provided in the settings
    userPrompt = this.settings.userPrepend + userPrompt + this.settings.userPostpend;
    systemPrompt = this.settings.systemPrepend + systemPrompt + this.settings.systemPostpend;
    const prompt = userPrompt + previousGeneration;

    // Return the JSON resposne from the Llama API
    return fetch("http://" + this.wrappedSettings.ipAddress + "/completion", {
      method: 'POST',
      body: JSON.stringify({
        prompt : prompt,
        system_prompt : systemPrompt,
        stop : LLMSettingsWrapper.getJsonArray(this.wrappedSettings.stoppingStrings),
        n_predict: this.wrappedSettings.n_predict,
        n_probs : this.wrappedSettings.n_probs,
        seed : this.wrappedSettings.seed
      })
    })
      .then(async (response : Response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }

        return response.json() as Promise<LlamaInterface>
      })
  }
}

