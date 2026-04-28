import { TrendingUp, Eye, BookOpen, Flame, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  useTrendingPrompts, useTopCategories, useDailyViews, useTodayStats,
} from '@/hooks/useAnalytics';
import { format, parseISO } from 'date-fns';

const TYPE_LABELS: Record<string, string> = {
  llm_prompt: '💬',
  image_prompt: '🎨',
  claude_skill: '⚡',
  claude_skill_bundle: '📦',
  guide: '📖',
  automation: '🔄',
  custom_gpt: '🤖',
  video: '🎬',
};

const PALETTE = [
  '#60a5fa', '#a78bfa', '#22d3ee', '#facc15',
  '#f472b6', '#4ade80', '#fb923c', '#f87171',
];

function StatPill({
  icon: Icon, label, value, accent,
}: { icon: React.ElementType; label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border/40 bg-card/60 text-center">
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon style={{ height: 15, width: 15, color: accent }} />
      </div>
      <div className="text-xl font-black tabular-nums leading-none" style={{ color: accent }}>
        {value.toLocaleString()}
      </div>
      <div className="text-[10px] text-muted-foreground leading-none">{label}</div>
    </div>
  );
}

export function AnalyticsSection() {
  const { data: trending, isLoading: trendingLoading } = useTrendingPrompts();
  const { data: categories } = useTopCategories();
  const { data: daily } = useDailyViews();
  const { data: todayStats } = useTodayStats();

  const maxViews = Math.max(...(trending?.map((t) => Number(t.views)) ?? [1]), 1);
  const hasActivity = (trending?.length ?? 0) > 0;

  const dailyFormatted = (daily ?? []).map((d) => ({
    day: format(parseISO(d.day), 'MMM d'),
    views: Number(d.views),
  }));

  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <TrendingUp className="text-primary" style={{ height: 16, width: 16 }} />
        <h2 className="text-[15px] font-bold text-foreground">Live Activity</h2>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Live
        </span>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatPill icon={Eye} label="Views Today" value={Number(todayStats?.total_views ?? 0)} accent="#60a5fa" />
        <StatPill icon={BookOpen} label="Prompts Opened" value={Number(todayStats?.unique_prompts ?? 0)} accent="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trending prompts */}
        <div className="md:col-span-2 rounded-2xl border border-border/40 bg-card/60 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="text-orange-400" style={{ height: 14, width: 14 }} />
            <span className="text-[13px] font-bold text-foreground">Trending This Week</span>
          </div>

          {trendingLoading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg bg-border/20 animate-pulse" />
              ))}
            </div>
          ) : !hasActivity ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet — data appears here as users browse prompts.
            </p>
          ) : (
            <div className="space-y-3">
              {trending?.map((item, i) => (
                <div key={item.prompt_id} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-muted-foreground/40 w-4 shrink-0 text-right tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-sm shrink-0">{TYPE_LABELS[item.prompt_type] ?? '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium text-foreground truncate leading-none">
                        {item.prompt_title}
                      </span>
                      <span className="text-[9px] text-muted-foreground/50 shrink-0 leading-none">
                        {item.category}
                      </span>
                    </div>
                    <div className="relative h-1 rounded-full bg-border/30 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{
                          width: `${(Number(item.views) / maxViews) * 100}%`,
                          background: 'hsl(var(--primary))',
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-muted-foreground shrink-0">
                    {Number(item.views).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-primary" style={{ height: 14, width: 14 }} />
            <span className="text-[13px] font-bold text-foreground">Top Categories</span>
          </div>
          {(categories?.length ?? 0) === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={categories}
                layout="vertical"
                margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={95}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--border) / 0.15)' }}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 11,
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                  {categories?.map((_, index) => (
                    <Cell key={`cat-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Daily activity chart */}
      {dailyFormatted.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-primary" style={{ height: 14, width: 14 }} />
            <span className="text-[13px] font-bold text-foreground">Daily Activity (7 days)</span>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={dailyFormatted} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'hsl(var(--border) / 0.15)' }}
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
