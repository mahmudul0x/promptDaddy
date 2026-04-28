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

export interface UserStat {
  total_viewed: number;
  this_week: number;
  top_categories: { category: string; count: number }[];
  recently_viewed: { prompt_id: string; prompt_title: string; prompt_type: string; viewed_at: string }[];
}

export function useUserAnalytics(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-analytics', userId],
    enabled: !!userId,
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [{ data: all }, { data: week }, { data: recent }] = await Promise.all([
        supabase.from('prompt_views').select('id', { count: 'exact', head: true }).eq('user_id', userId!),
        supabase.from('prompt_views').select('id', { count: 'exact', head: true })
          .eq('user_id', userId!).gte('created_at', weekAgo.toISOString()),
        supabase.from('prompt_views').select('prompt_id, prompt_title, prompt_type, created_at')
          .eq('user_id', userId!).order('created_at', { ascending: false }).limit(5),
      ]);

      // top categories from recent views
      const { data: catRows } = await supabase
        .from('prompt_views')
        .select('category')
        .eq('user_id', userId!)
        .gte('created_at', weekAgo.toISOString());

      const catMap: Record<string, number> = {};
      (catRows ?? []).forEach(r => { if (r.category) catMap[r.category] = (catMap[r.category] ?? 0) + 1; });
      const top_categories = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([category, count]) => ({ category, count }));

      return {
        total_viewed: (all as any)?.count ?? 0,
        this_week: (week as any)?.count ?? 0,
        top_categories,
        recently_viewed: (recent ?? []).map(r => ({
          prompt_id: r.prompt_id,
          prompt_title: r.prompt_title,
          prompt_type: r.prompt_type,
          viewed_at: r.created_at,
        })),
      } as UserStat;
    },
    staleTime: 60_000,
  });
}
