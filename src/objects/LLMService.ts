import { computed, type ComputedRef, reactive } from 'vue'

export class LLMService {
    private static wrappedInstance : LLMService
    private wrappedSettings : LLMSettings = LLMSettingsWrapper.rules

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

type RuleType = ComputedRef<((v: string) => boolean | string)[]> | ComputedRef<((v: number) => boolean | string)[]>;

class SettingsValue {
    public value : string | number
    public readonly rule : RuleType

    public constructor(value : string | number, rule : RuleType) {
        this.value = value
        this.rule = rule
    }
}

export interface LLMSettings {
    [key: string]: SettingsValue; 
    n_predict : SettingsValue,
    n_probs : SettingsValue,
    seed : SettingsValue,
    ipAddress : SettingsValue
}


export class LLMSettingsWrapper {
    public static readonly rules : LLMSettings = reactive({
        n_predict : new SettingsValue(
            0, 
            computed(() => [
            (v: number) : boolean | string => v >= 0 || 'n_predict must be non-negative',
            // Add more rules as needed
        ])),
        n_probs : new SettingsValue(
            0,
            computed(() => [
                (v: number) : boolean | string => v >= 0 || 'n_probs must be non-negative',
                // Add more rules as needed
            ])
        ),
        seed : new SettingsValue(
            -1,
            computed(() => [
                (v: number) : boolean | string => Number.isInteger(v) || 'seed must be an integer',
                // Add more rules as needed
            ])
        ),
        ipAddress : new SettingsValue(
            "localhost:0000",
            computed(() => [
                (v: string) : boolean | string => !!v || 'IP address is required',
                (v: string) : boolean | string => LLMSettingsWrapper.validateIPAddress(v) || 'Invalid IP address',
            ])
        )
    })

    public static validate(settings : LLMSettings) : boolean {
        let isValid = true

        for (const key in settings) {
            for (const rule in settings[key].rule) {
                console.log(settings[key].value)
            }
        }

        return isValid
    }

    public static validateIPAddress(ipAddress: string) : boolean {
        const ipPattern : RegExp = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$/;
        const localPattern : RegExp = /^(localhost):\d{1,5}$/;
        return localPattern.test(ipAddress) || ipPattern.test(ipAddress);
    }

}