import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface TrendingPrompt {
  prompt_id: string;
  prompt_title: string;
  prompt_type: string;
  category: string;
  views: number;
}

export interface TopCategory {
  category: string;
  views: number;
}

export interface DailyView {
  day: string;
  views: number;
}

export interface TodayStats {
  total_views: number;
  unique_prompts: number;
}

export function useTrendingPrompts(daysBack = 7, limit = 8) {
  return useQuery({
    queryKey: ['trending-prompts', daysBack, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_trending_prompts', {
        days_back: daysBack,
        limit_count: limit,
      });
      if (error) throw error;
      return (data ?? []) as TrendingPrompt[];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useTopCategories(daysBack = 7) {
  return useQuery({
    queryKey: ['top-categories', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_categories', {
        days_back: daysBack,
      });
      if (error) throw error;
      return (data ?? []) as TopCategory[];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useDailyViews(daysBack = 7) {
  return useQuery({
    queryKey: ['daily-views', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_daily_views', {
        days_back: daysBack,
      });
      if (error) throw error;
      return (data ?? []) as DailyView[];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useTodayStats() {
  return useQuery({
    queryKey: ['today-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_today_stats');
      if (error) throw error;
      return (data?.[0] ?? { total_views: 0, unique_prompts: 0 }) as TodayStats;
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}
