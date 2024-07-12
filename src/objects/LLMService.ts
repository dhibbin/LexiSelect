import { computed, type ComputedRef } from 'vue'

export class LLMService {
    private static instance : LLMService
    private wrappedSettings : LLMSettings

    private constructor() {

    }

    public static getInstance() : LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService()
        }
        return LLMService.instance
    }
}

export interface LLMSettings {
    [key: string]: number | string; 
    n_predict : number
    n_probs : number
    seed : number
    ipAddress : string
}

interface SettingsRules {
    [key: string]: ComputedRef<((v: string) => boolean | string)[]> | 
        ComputedRef<((v: number) => boolean | string)[]>;
    n_predict : ComputedRef<((v: number) => boolean | string)[]>
    n_probs : ComputedRef<((v: number) => boolean | string)[]>
    seed : ComputedRef<((v: number) => boolean | string)[]>
    ipAddress : ComputedRef<((v: string) => boolean | string)[]>
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

    public static validateAndUpdate(settings : LLMSettings) : boolean {
        let isValid = true

        for (const key in LLMSettingsWrapper.rules) {
            const typedKey = key as keyof LLMSettings;
            const currentRules = LLMSettingsWrapper.rules[typedKey].value
            const value = settings[typedKey]
            currentRules.forEach(element => {
                console.log(element)
            });
        }
        return isValid
    }


    public static validateIPAddress(ipAddress: string) : boolean {
        const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
        const localPattern : RegExp = /^(localhost)(:\d{1,5})?$/;
        return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
    }

}