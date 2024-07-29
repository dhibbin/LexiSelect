import { computed, type ComputedRef } from 'vue'
import type { LlamaInterface } from './LlamaInterface'

export class LLMService {
  private listeners : ((num : number) => void)[] = []
  private static wrappedInstance : LLMService
  
  private wrappedSettings : LLMSettings = {
    n_predict : 10,
    n_probs : 5,
    seed : -1,
    ipAddress : "localhost:8080",
    systemPrepend : "<|system|>",
    systemPostpend : "<|end|>",
    userPrepend : "<|user|>" ,
    userPostpend : "<|end|>",
    responseTemplateTokens : ["<|assistant|>"],
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

  public get settings() : LLMSettings {
    return this.wrappedSettings
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
    userPrompt = this.settings.userPrepend + userPrompt + this.settings.userPostpend;
    systemPrompt = this.settings.systemPrepend + systemPrompt + this.settings.systemPostpend;
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
  [key: string]: number | string | string[]; 
  
  // Basic settings
  n_predict : number
  n_probs : number
  seed : number
  ipAddress : string

  // Prompt template settings
  systemPrepend : string
  systemPostpend : string
  userPrepend : string
  userPostpend : string 
  responseTemplateTokens : string[]
}



type RuleType = ComputedRef<((v: string) => boolean | string)[]> | ComputedRef<((v: number) => boolean | string)[]>;

interface SettingsRules {
  [key : string] : RuleType;
  n_predict : RuleType,
  n_probs : RuleType,
  seed : RuleType,
  ipAddress : RuleType
}

/**
 * A class that wraps functionality for settings
 */
export class LLMSettingsWrapper {
  
  /**
     * An object that defines validation rules for each setting.
     * 
     * Each rule is a computed property that returns an array of validation functions.
     * Each function takes a value and returns a boolean or string.
     * Returns true if value is valid, returns a string error message if value is invalid
     * @type {SettingsRules}
     * @public
     * @static
     * @readonly
     */
  public static readonly rules : SettingsRules = {
    n_predict : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_predict must be non-negative',
    ]),
    n_probs : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_probs must be non-negative',
    ]),
    seed : computed(() => [
      (v: number) : boolean | string => Number.isInteger(v) || 'seed must be an integer',
    ]),
    ipAddress : computed(() => [
      (v: string) : boolean | string => !!v || 'IP address is required',
      (v: string) : boolean | string => LLMSettingsWrapper.validateIPAddress(v) || 'Invalid IP address',
    ]),
  }

  /**
     * Validates an LLMSettings instance
     *
     * Checks if the provided LLMSettings comply with the rules defined in LLMSettingsWrapper.rules
     *
     * @param {LLMSettings} settings - The settings address to validate.
     * @returns {boolean} Returns true if the settings are valid, false otherwise.
     */
  public static validate(settings : LLMSettings) : boolean {
    // Boolean to set to false if a rule is broken
    let isValid = true

    // For every settings value that has an associated rule:
    for (const key in LLMSettingsWrapper.rules) {
      // Get the current rules and settings value from provided settings
      const typedKey = key as keyof LLMSettings;
      const currentRules = LLMSettingsWrapper.rules[typedKey].value
      const settingsValue = settings[typedKey]

      // For each rule for the current settings value, check if the rule function returns true
      currentRules.forEach((element : ((v: string) => boolean | string) | ((v: number) => boolean | string)) => { //@ts-expect-error See following line
        if (element(settingsValue) !== true) { // Not assignable to never error seems to be incorrectly flagged
          // If rule doesn't return true, validation has failed, return false
          isValid = false
          return isValid
        }
      });
    }

    // If the settings values have passed all declared rules, return true
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
