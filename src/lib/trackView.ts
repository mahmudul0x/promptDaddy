import { supabase } from './supabase';

export type PromptType =
  | 'llm_prompt'
  | 'image_prompt'
  | 'claude_skill'
  | 'claude_skill_bundle'
  | 'guide'
  | 'automation'
  | 'custom_gpt'
  | 'video';

export interface TrackViewParams {
  promptId: string;
  promptTitle: string;
  promptType: PromptType;
  category: string;
  userId?: string | null;
}

export function trackView(params: TrackViewParams): void {
  // Fire-and-forget — never throws, never blocks UI
  supabase
    .from('prompt_views')
    .insert({
      prompt_id: params.promptId,
      prompt_title: params.promptTitle,
      prompt_type: params.promptType,
      category: params.category,
      user_id: params.userId ?? null,
    })
    .then(() => {})
    .catch(() => {});
}
