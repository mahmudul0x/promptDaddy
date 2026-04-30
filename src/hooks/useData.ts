import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'; // Auth Supabase (আগেরটা)
import type {
  Prompt, ImagePrompt, Video, Guide, TutorialResourceItem,
  AiStarterKitData,
  CustomGpt, AutomationTemplate, ClaudeSkill, AiModelRecommendation,
  ClaudeSkillBundle,
  GrokImaginePrompt, SeedancePrompt, NanoBananaPrompt,
} from '@/data/types';

// ─────────────────────────────────────────────
// Data-only Supabase client (নতুন project)
// ─────────────────────────────────────────────
const dataSupabase = createClient(
  import.meta.env.VITE_DATA_SUPABASE_URL as string,
  import.meta.env.VITE_DATA_SUPABASE_ANON_KEY as string
);

// ─────────────────────────────────────────────
// Helper: সব rows fetch করো (pagination সহ)
// ─────────────────────────────────────────────
async function fetchAll<T>(table: string): Promise<T[]> {
  const PAGE_SIZE = 1000;
  let from = 0;
  const results: T[] = [];

  while (true) {
    const { data, error, count } = await dataSupabase
      .from(table)
      .select('*', { count: 'exact' })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error(`${table} fetch error:`, error);
      throw new Error(`${table}: ${error.message}`);
    }
    
    
    
    if (!data || data.length === 0) break;

    results.push(...(data as T[]));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return results;
}

// ─────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────

export const usePrompts = () =>
  useQuery<Prompt[]>({
    queryKey: ['prompts'],
    queryFn: () => fetchAll<Prompt>('prompts'),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: 'always',
    retry: 3,
    refetchOnWindowFocus: false,
    networkMode: 'offlineFirst',
  });

export const useImagePrompts = () =>
  useQuery<ImagePrompt[]>({
    queryKey: ['image_prompts'],
    queryFn: () => fetchAll<ImagePrompt>('image_prompts'),
    staleTime: 2 * 60 * 1000,
  });

export const useVideos = () =>
  useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: () => fetchAll<Video>('videos'),
    staleTime: 2 * 60 * 1000,
  });

export const useGuides = () =>
  useQuery<Guide[]>({
    queryKey: ['guides'],
    queryFn: () => fetchAll<Guide>('guides'),
    staleTime: 2 * 60 * 1000,
  });

export const useTutorialResources = () =>
  useQuery<TutorialResourceItem[]>({
    queryKey: ['tutorial_resources'],
    queryFn: () => fetchAll<TutorialResourceItem>('tutorial_resources'),
    staleTime: 2 * 60 * 1000,
  });

export const useAiStarterKit = () =>
  useQuery<AiStarterKitData>({
    queryKey: ['ai_starter_kit'],
    queryFn: async () => {
      const [sections, prompts, claude_skills] = await Promise.all([
        fetchAll('ai_starter_kit_sections'),
        fetchAll('ai_starter_kit_prompts'),
        fetchAll('ai_starter_kit_skills'),
      ]);
      return { sections, prompts, claude_skills } as unknown as AiStarterKitData;
    },
    staleTime: 2 * 60 * 1000,
  });

export const useCustomGpts = () =>
  useQuery<CustomGpt[]>({
    queryKey: ['custom_gpts'],
    queryFn: () => fetchAll<CustomGpt>('custom_gpts'),
    staleTime: 2 * 60 * 1000,
  });

export const useAutomationTemplates = () =>
  useQuery<AutomationTemplate[]>({
    queryKey: ['automation_templates'],
    queryFn: () => fetchAll<AutomationTemplate>('automation_templates'),
    staleTime: 2 * 60 * 1000,
  });

export const useClaudeSkills = () =>
  useQuery<ClaudeSkill[]>({
    queryKey: ['claude_skills'],
    queryFn: () => fetchAll<ClaudeSkill>('claude_skills'),
    staleTime: 2 * 60 * 1000,
  });

export const useClaudeSkillBundle = () =>
  useQuery<ClaudeSkillBundle>({
    queryKey: ['claude_skills_bundle'],
    queryFn: async () => {
      const skills = await fetchAll<ClaudeSkillBundle['skills'][0]>('claude_skills_bundle');
      return {
        meta: { total_skills: skills.length },
        skills,
      } as unknown as ClaudeSkillBundle;
    },
    staleTime: 2 * 60 * 1000,
  });

export const useAiModelRecommendations = () =>
  useQuery<AiModelRecommendation[]>({
    queryKey: ['ai_model_recommendations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_model_recommendations')
          .select('*')
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch {
        return fetchAll<AiModelRecommendation>('ai_model_recommendations');
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

export const useGrokImaginePrompts = () =>
  useQuery<GrokImaginePrompt[]>({
    queryKey: ['grok_imagine_prompts'],
    queryFn: () => fetchAll<GrokImaginePrompt>('grok_imagine_prompts'),
    staleTime: 5 * 60 * 1000,
  });

export const useSeedancePrompts = () =>
  useQuery<SeedancePrompt[]>({
    queryKey: ['seedance_prompts'],
    queryFn: () => fetchAll<SeedancePrompt>('seedance_prompts'),
    staleTime: 5 * 60 * 1000,
  });

export const useNanoBananaPrompts = () =>
  useQuery<NanoBananaPrompt[]>({
    queryKey: ['nano_banana_prompts'],
    queryFn: () => fetchAll<NanoBananaPrompt>('nano_banana_prompts'),
    staleTime: 5 * 60 * 1000,
  });

export const useContentCounts = () =>
  useQuery<Record<string, number>>({
    queryKey: ['content_counts'],
    queryFn: async () => {
      const [prompts, imagePrompts, videos, guides, customGpts, automationTemplates, claudeSkills] =
        await Promise.all([
          dataSupabase.from('prompts').select('id', { count: 'exact', head: true }),
          dataSupabase.from('image_prompts').select('id', { count: 'exact', head: true }),
          dataSupabase.from('videos').select('id', { count: 'exact', head: true }),
          dataSupabase.from('guides').select('id', { count: 'exact', head: true }),
          dataSupabase.from('custom_gpts').select('id', { count: 'exact', head: true }),
          dataSupabase.from('automation_templates').select('id', { count: 'exact', head: true }),
          dataSupabase.from('claude_skills').select('id', { count: 'exact', head: true }),
        ]);
      return {
        prompts: prompts.count || 0,
        image_prompts: imagePrompts.count || 0,
        videos: videos.count || 0,
        guides: guides.count || 0,
        custom_gpts: customGpts.count || 0,
        automation_templates: automationTemplates.count || 0,
        claude_skills: claudeSkills.count || 0,
      };
    },
    staleTime: 2 * 60 * 1000,
  });

