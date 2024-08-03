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

  /**
   * String of a JSON array of stopping strings
   */
  stoppingStrings : string

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

  // Sampling Settings

  /** Randomness of the generated text */
  temperature : number
  
  /** Range of the temperature */
  dynatemp_range : number

  /** Dynamic temperature exponent */
  dynatemp_exponent : number

  /** Top k of the request to /completion */
  top_k : number

  /** Top p of the request to /completion */
  top_p : number

  /** Min p of the request to /completion */
  min_p : number

  /** Control the repetition of token sequences in the generated text */
  repeat_penalty : number
  
  /** Last n tokens to consider for penalizing repetition */
  repeat_last_n : number

  /** Repeat alpha presence penalty */
  presence_penalty : number

  /** Repeat alpha frequency penalty */
  frequency_penalty : number
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
  ipAddress : RuleType,
  stoppingStrings : RuleType
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
      (v: number) : boolean | string => v >= 0 || 'n_predict must be non-negative integer',
    ]),
    n_probs : computed(() => [
      (v: number) : boolean | string => v >= 0 || 'n_probs must be non-negative integer',
    ]),
    seed : computed(() => [
      (v: number) : boolean | string => Number.isInteger(v) || 'seed must be an integer',
    ]),
    ipAddress : computed(() => [
      (v: string) : boolean | string => !!v || 'IP address is required',
      (v: string) : boolean | string => LLMSettingsWrapper.validateIPAddress(v) || 'Invalid IP address',
    ]),
    stoppingStrings : computed(() => [
      (v: string) : boolean | string => this.getJsonArray(v) !== false || 'Must be a valid array. Use square [] brackets and comma separated',
    ]),
    temperature : this.createNumberRuleInRange(0, false, "Temperature", false),
    dynatemp_range : this.createNumberRuleInRange(0, false, "Dynamic Temperature Range", false),
    dynatemp_exponent : this.createNumberRuleInRange(false, false, "Dynamic Temperature Exponent", false),
    top_k : this.createNumberRuleInRange(0, false, "top_k", false),
    top_p : this.createNumberRuleInRange(0, 1, "top_p", false),
    min_p : this.createNumberRuleInRange(0, 1, "min_p", false),
    repeat_penalty : this.createNumberRuleInRange(0, false, "Repeat penalty", false),
    repeat_last_n : this.createNumberRuleInRange(-1, false, "repeat_last_n", true),
    presence_penalty : this.createNumberRuleInRange(0, false, "Presence penalty", false),
    frequency_penalty : this.createNumberRuleInRange(0, false, "Frequency penalty", false),
  }

  public static readonly emptyRule : ComputedRef<((v: number) => boolean | string)[]> = computed(() => [
    (v: number) : boolean | string => v !== undefined || 'Value must not be undefined',
  ])

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

  /**
   * Turns a string of a JSON array into a string array
   *
   * @param ipAddress - The string to turn into a string array
   * @returns Returns a string array if successful and false if not successful
   */
  public static getJsonArray(str: string): boolean | string[] {
    try {
      const json = JSON.parse(str);
      if (Array.isArray(json)) {
        return json
      }
      else {
        return false
      }
    } catch (e) {
      return false;
    }
  }

  /**
   * Creates a rule for a number given four parameters
   *
   * @param min - Minimum (inclusive) allowed numerical value, provide boolean to ignore
   * @param max - Maximum (inclusive) allowed numerical value, provide boolean to ignore
   * @param name - Name of value, to be used in the error message return by rule
   * @param integerOnly - Determines if number must be an integer or not
   * @returns Returns a rule of type RuleType that corresponds with the parameters
   */
  public static createNumberRuleInRange(min : number | boolean, max : number | boolean, name : string, integerOnly : boolean = true) : RuleType {
    return computed(() => [
      (v: number) : boolean | string => 
        ((typeof min !== 'boolean' ? v >= min : true) && 
         (typeof max !== 'boolean' ? v <= max : true) && 
         (!integerOnly || Number.isInteger(v))) || 
         `${name} must be a ${integerOnly ? 'integer' : 'number'} ${typeof min !== 'boolean' ? ',greater than ' + min.toString + "," : ""}, ${typeof max !== 'boolean' ? ',less than ' + max.toString : ""}`,
    ])
  }
}
