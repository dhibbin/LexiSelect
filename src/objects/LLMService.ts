import { computed, type ComputedRef } from 'vue'
import type { LlamaInterface } from './LlamaInterface'

export class LLMService {
  private listeners : ((num : number) => void)[] = []
  private static wrappedInstance : LLMService
  
  private wrappedSettings : LLMSettings = {
    n_predict : 10,
    n_probs : 5,
    seed : -1,
    ipAddress : "localhost:8080"
  }

  private constructor() {}

  public static get instance(): LLMService {
    if (!LLMService.wrappedInstance) {
      LLMService.wrappedInstance = new LLMService()
    }
    return LLMService.wrappedInstance
  }

  public set settings(settings : LLMSettings) {
    if (LLMSettingsWrapper.validate(settings)){
      this.wrappedSettings = settings
    }
  }

  public addListener(listener : (num : number) => void) : void {
    this.listeners.push(listener)
  }

  private callListeners(num : number) : void {
    for (const listener of this.listeners) {
      listener(num)
    }
  }

  public async SendPrompt(userPrompt : string, systemPrompt : string, previousGeneration : string = "") : Promise<LlamaInterface> {
    userPrompt = "<|user|>" + userPrompt + "<|end|>";
    systemPrompt = "<|system|>" + systemPrompt + "<|end|>";
    const prompt = systemPrompt + userPrompt + previousGeneration;
	
    //http://127.0.0.1:8080/completion
    return fetch("http://" + this.wrappedSettings.ipAddress + "/completion", {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        n_predict: this.wrappedSettings.n_predict,
        n_probs : this.wrappedSettings.n_probs,
        seed : this.wrappedSettings.seed
      })
    })
      .then(async (response : Response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }

        //const parsedResponse = await response.json() as LlamaInterface
        //this.callListeners(parsedResponse.generation_settings.seed)
        
        return response.json() as Promise<LlamaInterface>
      })
  }
}

export interface LLMSettings {
  [key: string]: number | string; 
  n_predict : number
  n_probs : number
  seed : number
  ipAddress : string
}



type RuleType = ComputedRef<((v: string) => boolean | string)[]> | ComputedRef<((v: number) => boolean | string)[]>;

interface SettingsRules {
  [key : string] : RuleType;
  n_predict : RuleType,
  n_probs : RuleType,
  seed : RuleType,
  ipAddress : RuleType
}

export class LLMSettingsWrapper {
  public static readonly rules : SettingsRules = {
    n_predict : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_predict must be non-negative',
      // Add more rules as needed
    ]),
    n_probs : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_probs must be non-negative',
      // Add more rules as needed
    ]),
    seed : computed(() => [
      (v: number) : boolean | string => Number.isInteger(v) || 'seed must be an integer',
      // Add more rules as needed
    ]),
    ipAddress : computed(() => [
      (v: string) : boolean | string => !!v || 'IP address is required',
      (v: string) : boolean | string => LLMSettingsWrapper.validateIPAddress(v) || 'Invalid IP address',
    ]),
  }

  public static validate(settings : LLMSettings) : boolean {
    let isValid = true

    for (const key in LLMSettingsWrapper.rules) {
      const typedKey = key as keyof LLMSettings;
      const currentRules = LLMSettingsWrapper.rules[typedKey].value
      const settingsValue = settings[typedKey]
      currentRules.forEach((element : ((v: string) => boolean | string) | ((v: number) => boolean | string)) => { //@ts-expect-error See following line
        if (element(settingsValue) !== true) { // Not assignable to never error seems to be incorrectly flagged
          isValid = false
          console.log(isValid)
          return isValid
        }
      });
    }
    return isValid
  }

  /**
     * Validates an IP address.
     *
     * This function checks if the given IP address is valid. It supports both local and remote IP addresses.
     * For remote IP addresses, it supports optional port numbers.
     *
     * @param {string} ipAddress - The IP address to validate.
     * @returns {boolean} Returns true if the IP address is valid, false otherwise.
     */
  public static validateIPAddress(ipAddress: string) : boolean {
    // Ipv4 and localhost address regular expressions
    const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
    const localPattern : RegExp = /^(localhost):\d{1,5}$/;
    // Return true if either regular expressions are satisfied
    return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
  }

}