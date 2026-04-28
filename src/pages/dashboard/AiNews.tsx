import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, Clock, RefreshCw, Tag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { cn } from '@/lib/utils';

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  social_image: string;
  url: string;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  user: { name: string; profile_image: string };
  positive_reactions_count: number;
  comments_count: number;
}

const TAG_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: 'ai',                    label: 'AI',                  emoji: '🤖' },
  { value: 'artificialintelligence', label: 'AI General',         emoji: '🧠' },
  { value: 'machinelearning',       label: 'Machine Learning',    emoji: '📊' },
  { value: 'deeplearning',          label: 'Deep Learning',       emoji: '🔬' },
  { value: 'llm',                   label: 'LLMs',                emoji: '💬' },
  { value: 'openai',                label: 'OpenAI',              emoji: '🌐' },
  { value: 'chatgpt',               label: 'ChatGPT',             emoji: '💡' },
  { value: 'claude',                label: 'Claude',              emoji: '⚡' },
  { value: 'agents',                label: 'AI Agents',           emoji: '🕵️' },
  { value: 'nlp',                   label: 'NLP',                 emoji: '📝' },
  { value: 'computervision',        label: 'Computer Vision',     emoji: '👁️' },
  { value: 'generativeai',          label: 'Generative AI',       emoji: '🎨' },
  { value: 'automation',            label: 'Automation',          emoji: '⚙️' },
  { value: 'productivity',          label: 'Productivity',        emoji: '🚀' },
  { value: 'python',                label: 'AI + Python',         emoji: '🐍' },
  { value: 'tutorial',              label: 'Tutorials',           emoji: '📚' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NewsCard({ article }: { article: DevToArticle }) {
  const navigate = useNavigate();
  const image = article.cover_image || article.social_image;

  return (
    <div
      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/dashboard/ai-news/${article.id}`, { state: { article } })}
    >
      {/* Cover */}
      <div className="relative w-full h-40 bg-secondary/40 overflow-hidden shrink-0">
        {image ? (
          <img src={image} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm text-primary/90 px-2 py-0.5 rounded-full">
          dev.to
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1 flex-wrap">
          {article.tag_list.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-semibold bg-primary/10 text-primary/80 px-1.5 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">{article.description}</p>

        <div className="flex items-center gap-2 pt-2 border-t border-border/30 mt-auto">
          <img src={article.user.profile_image} alt={article.user.name}
            className="h-5 w-5 rounded-full object-cover shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-[11px] text-muted-foreground flex-1 truncate">{article.user.name}</span>
          <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />{article.reading_time_minutes}m
          </span>
          <span className="text-[10px] text-muted-foreground/50 shrink-0">{timeAgo(article.published_at)}</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/50 transition-colors shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function AiNews() {
  const [activeTag, setActiveTag] = useState('ai');

  const { data: articles = [], isLoading, isError, refetch, isFetching } = useQuery<DevToArticle[]>({
    queryKey: ['ai_news', activeTag],
    queryFn: async () => {
      const res = await fetch(`https://dev.to/api/articles?tag=${activeTag}&per_page=24&top=7`);
      if (!res.ok) throw new Error('Failed to fetch AI news');
      return res.json();
    },
    staleTime: 1000 * 60 * 15,
    retry: 2,
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <PageHeader
          icon={Newspaper} title="AI News Feed"
          description="Daily AI news and insights from the developer community."
          count={articles.length} iconColor="text-blue-400"
        />
        <button
          onClick={() => refetch()} disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-all shrink-0 mt-1 disabled:opacity-50"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Category scrollable pill row */}
      <div className="relative mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <Tag className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 mr-1" />
          {TAG_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTag(t.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border whitespace-nowrap shrink-0',
                activeTag === t.value
                  ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.12)]'
                  : 'text-muted-foreground border-border/50 hover:border-border hover:text-foreground'
              )}
            >
              <span className="text-[11px]">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        {/* Fade-out right edge hint */}
        <div className="absolute right-0 top-0 h-full w-12 pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, hsl(var(--background)))' }} />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Failed to load news</h3>
          <p className="text-sm text-muted-foreground mb-4">Check your connection and try again.</p>
          <button onClick={() => refetch()}
            className="px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No articles found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
