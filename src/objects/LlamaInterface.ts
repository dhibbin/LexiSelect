export interface LlamaInterface {
  content: string;
  id_slot: number;
  stop: boolean;
  model: string;
  tokens_predicted: number;
  tokens_evaluated: number;
  generation_settings: Generationsettings;
  prompt: string;
  truncated: boolean;
  stopped_eos: boolean;
  stopped_word: boolean;
  stopped_limit: boolean;
  stopping_word: string;
  tokens_cached: number;
  timings: Timings;
  completion_probabilities: Completionprobability[];
}

export function defaultLlamaInterface() : LlamaInterface {
  const defaultInterface : LlamaInterface = {
    content : "",
    id_slot : 0,
    stop : false,
    model : "",
    tokens_predicted : 0,
    tokens_evaluated : 0,
    generation_settings : {} as Generationsettings,
    prompt : "",
    truncated : false,
    stopped_eos : false,
    stopped_word : false,
    stopped_limit : false,
    stopping_word : "",
    tokens_cached : 0,
    timings : {} as Timings,
    completion_probabilities : []
  }
  return defaultInterface
}

export interface Completionprobability {
  content: string;
  probs: Prob[];
}

export interface Prob {
  tok_str: string;
  prob: number;
}

export interface Timings {
  prompt_n: number;
  prompt_ms: number;
  prompt_per_token_ms: number;
  prompt_per_second: number;
  predicted_n: number;
  predicted_ms: number;
  predicted_per_token_ms: number;
  predicted_per_second: number;
}

export interface Generationsettings {
  n_ctx: number;
  n_predict: number;
  model: string;
  seed: number;
  temperature: number;
  dynatemp_range: number;
  dynatemp_exponent: number;
  top_k: number;
  top_p: number;
  min_p: number;
  tfs_z: number;
  typical_p: number;
  repeat_last_n: number;
  repeat_penalty: number;
  presence_penalty: number;
  frequency_penalty: number;
  penalty_prompt_tokens: null | string | number[]; // Manually adjusted
  use_penalty_prompt_tokens: boolean;
  mirostat: number;
  mirostat_tau: number;
  mirostat_eta: number;
  penalize_nl: boolean;
  stop: string[]; // Manually adjusted
  n_keep: number;
  n_discard: number;
  ignore_eos: boolean;
  stream: boolean;
  logit_bias: [[number, (number | boolean)]]; // Manually adjusted
  n_probs: number;
  min_keep: number;
  grammar: string;
  samplers: string[];
}