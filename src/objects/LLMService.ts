import { computed, type ComputedRef } from 'vue'
import { ru } from 'vuetify/locale'

export class LLMService {
    private static wrappedInstance : LLMService
    private wrappedSettings : LLMSettings = {
        n_predict : 10,
        n_probs : 5,
        seed : -1,
        ipAddress : "localhost:8080"
    }

    private constructor() {

    }

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
}

export interface LLMSettings {
    [key: string]: number | string; 
    n_predict : number
    n_probs : number
    seed : number
    ipAddress : string
}

type RuleType = ComputedRef<((v: string) => boolean | string)[]> | ComputedRef<((v: number) => boolean | string)[]>;

class SettingsValue {
    public value : string | number
    public readonly rule : RuleType

    public constructor(value : string | number, rule : RuleType) {
        this.value = value
        this.rule = rule
    }
}

export class SettingsList {
    public n_predict : SettingsValue = new SettingsValue(
        0,
        computed(() => [
            (v: number) : boolean | string => v >= 0 || 'n_predict must be non-negative',
            // Add more rules as needed
        ])
    )
}


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
            currentRules.forEach(element => {
                if (element(value) !== true) { // This argument do
                    isValid = false
                    console.log(typeof value)
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