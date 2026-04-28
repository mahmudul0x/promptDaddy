import { PageHeader } from '@/components/dashboard/PageHeader';
import type { AiModelRecommendation } from '@/data/types';
import { Cpu, ExternalLink, Zap, DollarSign, Gauge, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFreeAiModels } from '@/hooks/useFreeAiModels';

/* ─── Provider config ───────────────────────────────────────────── */
const PROVIDER_STYLE: Record<string, { badge: string; dot: string }> = {
  Anthropic:   { badge: 'bg-cyan-500/15 text-cyan-400',    dot: '#22d3ee' },
  OpenAI:      { badge: 'bg-green-500/15 text-green-400',  dot: '#4ade80' },
  Google:      { badge: 'bg-blue-500/15 text-blue-400',    dot: '#60a5fa' },
  Meta:        { badge: 'bg-purple-500/15 text-purple-400', dot: '#a855f7' },
  Mistral:     { badge: 'bg-orange-500/15 text-orange-400', dot: '#fb923c' },
  DeepSeek:    { badge: 'bg-indigo-500/15 text-indigo-400', dot: '#818cf8' },
  HuggingFace: { badge: 'bg-yellow-500/15 text-yellow-400', dot: '#facc15' },
  Together:    { badge: 'bg-pink-500/15 text-pink-400',    dot: '#f472b6' },
  Cohere:      { badge: 'bg-teal-500/15 text-teal-400',    dot: '#2dd4bf' },
  'Open Source': { badge: 'bg-muted text-muted-foreground', dot: '#6b7280' },
  Other:       { badge: 'bg-muted text-muted-foreground',  dot: '#6b7280' },
};

function providerStyle(p: string) {
  return PROVIDER_STYLE[p] ?? PROVIDER_STYLE.Other;
}

const COST_COLOR: Record<string, string> = {
  Free:    'text-green-400',
  Low:    'text-green-400',
  Medium: 'text-yellow-400',
  High:   'text-red-400',
};
const SPEED_COLOR: Record<string, string> = {
  Fast:   'text-green-400',
  Medium: 'text-yellow-400',
  Slow:   'text-red-400',
};

function ModelCard({ item }: { item: AiModelRecommendation }) {
  const ps = providerStyle(item.provider);

  return (
    <div className={cn(
      'group relative flex flex-col rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300',
      'hover:border-primary/30 hover:bg-card/90 hover:shadow-card hover:-translate-y-0.5',
      item.is_featured
        ? 'border-primary/30 bg-gradient-to-b from-primary/5 via-card/80 to-card/60 shadow-lg shadow-primary/5'
        : 'border-border/50'
    )}>
      {/* Featured badge */}
      {item.is_featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-primary/15 text-primary px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Star className="h-3 w-3 fill-primary" />
          Featured
        </div>
      )}

      {/* Card header with icon and provider */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Provider circle */}
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                background: `${ps.dot}20`,
                borderColor: `${ps.dot}40`,
                boxShadow: `0 0 20px ${ps.dot}30 inset`
              }}
            >
              <Cpu style={{ height: 22, width: 22, color: ps.dot }} />
            </div>
            <div className="min-w-0">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', ps.badge)}>
                {item.provider}
              </span>
              <h3 className="font-bold text-base text-foreground leading-tight group-hover:text-primary transition-colors mt-1">
                {item.model_name}
              </h3>
            </div>
          </div>
        </div>

        {/* Task label */}
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-3">
          {item.task_name}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Metrics bar */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Performance */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/30">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground mb-1" />
            <span className="text-xs font-bold text-foreground">
              {item.performance_score}/10
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Perf</span>
          </div>

          {/* Cost */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/30">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground mb-1" />
            <span className={cn('text-xs font-bold', COST_COLOR[item.cost_rating])}>
              {item.cost_rating}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Cost</span>
          </div>

          {/* Speed */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/30">
            <Zap className="h-3.5 w-3.5 text-muted-foreground mb-1" />
            <span className={cn('text-xs font-bold', SPEED_COLOR[item.speed_rating])}>
              {item.speed_rating}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">Speed</span>
          </div>
        </div>
      </div>

      {/* CTA button */}
      {item.model_url && (
        <div className="px-5 pb-5 mt-auto">
          <a
            href={item.model_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[12px] font-semibold bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 hover:border-primary/30 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Try Model
          </a>
        </div>
      )}
    </div>
  );
}

export default function AiModelRecommendations() {
  const { models, isLoading, error } = useFreeAiModels();

  const featured = models.filter((m) => m.is_featured);
  const rest = models.filter((m) => !m.is_featured);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        icon={Cpu}
        title="AI Model Recommendations"
        description="The best AI model for every task — curated and scored by performance, cost, and speed."
        count={models.length}
        iconColor="text-cyan-400"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Featured first */}
          {featured.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-1 rounded-full text-[11px] font-bold">
                  <Star className="h-3 w-3 fill-primary" />
                  TOP PICKS
                </div>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featured.map((m) => <ModelCard key={m.id} item={m} />)}
              </div>
            </section>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-muted-foreground/60" />
                <h2 className="text-[13px] font-bold text-foreground">All Recommendations</h2>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rest.map((m) => <ModelCard key={m.id} item={m} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
