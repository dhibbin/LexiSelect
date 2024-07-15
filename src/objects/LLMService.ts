import { computed, type ComputedRef } from 'vue'

export class LLMService {
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

    public async SendPrompt(userPrompt : string, systemPrompt : string) : Promise<JSON> {
        userPrompt = "<|user|>" + userPrompt + "<|end|>";
        systemPrompt = "<|system|>" + systemPrompt + "<|end|>";
        const prompt = systemPrompt + userPrompt;
        
        return fetch(this.wrappedSettings.ipAddress + "/completion", {
            method: 'POST',
            body: JSON.stringify({
                prompt,
                n_predict: this.wrappedSettings.n_predict,
                n_probs : this.wrappedSettings.n_probs,
                seed : this.wrappedSettings.seed
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<JSON>
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
            const value = settings[typedKey]
            currentRules.forEach(element => { //@ts-ignore
                if (element(value) !== true) { // Not assignable to never error seems to be incorrectly flagged
                    isValid = false
                    console.log(isValid)
                    return isValid
                }
            });
        }
        return isValid
    }

    public static validateIPAddress(ipAddress: string) : boolean {
        const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
        const localPattern : RegExp = /^(localhost):\d{1,5}$/;
        return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
    }

}