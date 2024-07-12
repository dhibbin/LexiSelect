export class LLMService {
    private static instance : LLMService
    private _settings : LLMSettings = new LLMSettings()

    private constructor() {

    }

    public static getInstance() : LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService()
        }
        return LLMService.instance
    }

    set settings(settings : LLMSettings) {
        this.settings = settings
    }

    public static test() : void {
        console.log(this.instance._settings)
    }
}

export interface LLMSettings {
    n_predict : number
    n_probs : number
    seed : number
    ipAddress : string
}