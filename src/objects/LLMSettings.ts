import { computed, type ComputedRef } from 'vue'

/**
 * The settings used in requests to the LLM Server
 * @interface 
 */
export interface LLMSettings {
  /**
   * Settings consist of numbers, strings or string arrays
   * @note Add more types here as necessary if extending settings used by LexiSelect
   */
  [key: string]: number | string | string[]; 
  
  // Basic settings

  /**
   * The number of token predictions to make
   */
  n_predict : number

  /**
   * The number of alternative token probabilities to return
   */
  n_probs : number

  /**
   * The seed for the random number generator
   */
  seed : number

  /**
   * The IP address of the server
   */
  ipAddress : string

  // Prompt template settings

  /**
   * The string to prepend to the system prompt
   */
  systemPrepend : string

  /**
   * The string to append to the system prompt
   */
  systemPostpend : string

  /**
   * The string to prepend to the user prompt
   */
  userPrepend : string

  /**
   * The string to append to the user prompt
   */
  userPostpend : string

  /**
   * The tokens to use in the response template.
   */
  responseTemplateTokens : string[]
}


/**
 * Type used for declaring rules for settings within SettingsRules
 */
export type RuleType = ComputedRef<((v: string) => boolean | string)[]> | ComputedRef<((v: number) => boolean | string)[]>;

/**
 * Represents the rules for LLMSettings
 * 
 * Each property represents a rule for the property of the same keyname in LLMSettings
 * @interface 
 */
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
     */
  public static readonly rules : SettingsRules = {
    n_predict : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_probs must be non-negative integer',
    ]),
    n_probs : computed(() => [
      (v: number) : boolean | string => (v >= 0 && Number.isInteger(v)) || 'n_probs must be non-negative integer',
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
     * @param settings - The settings address to validate.
     * @returns Returns true if the settings are valid, false otherwise.
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
     * @param ipAddress - The IP address to validate.
     * @returns Returns true if the IP address is valid, false otherwise.
     */
  public static validateIPAddress(ipAddress: string) : boolean {
    // Ipv4 and localhost address regular expressions
    const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
    const localPattern : RegExp = /^(localhost):\d{1,5}$/;
    // Return true if either regular expressions are satisfied
    return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
  }
}

