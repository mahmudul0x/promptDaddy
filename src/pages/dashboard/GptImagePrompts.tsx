import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Wand2, Copy, Check, X, ExternalLink, Search, Image, Star, Eye, ThumbsUp, Trophy } from 'lucide-react';
import { useGptImagePrompts } from '@/hooks/useData';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { GptImagePrompt } from '@/data/types';
import { cn } from '@/lib/utils';

/* ── helpers ─────────────────────────────────────────────────────── */
function formatDate(s: string | null) {
  if (!s) return null;
  try {
    return new Date(s).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return null; }
}

function formatNum(n: number | null) {
  if (n == null) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/* ── lazy image ─────────────────────────────────────────────────── */
function LazyImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.src = src; obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  if (error) return null;
  return (
    <img
      ref={ref} alt={alt}
      className={cn(className, 'transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}

/* ── copy hook ───────────────────────────────────────────────────── */
function useCopy(text: string, ms = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), ms);
  };
  return { copied, copy };
}

/* ── lazy batch ──────────────────────────────────────────────────── */
const BATCH = 24;
function useLazyBatch(total: number) {
  const [limit, setLimit] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setLimit(BATCH); }, [total]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setLimit(l => Math.min(l + BATCH, total)); },
      { rootMargin: '300px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [total]);
  return { limit, sentinelRef };
}

/* ── rating stars ────────────────────────────────────────────────── */
function RatingStars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-2.5 w-2.5', i < full ? 'text-amber-400 fill-amber-400' : half && i === full ? 'text-amber-400 fill-amber-400/50' : 'text-muted-foreground/20')}
        />
      ))}
    </span>
  );
}

/* ── Detail Modal ────────────────────────────────────────────────── */
function DetailModal({ item, onClose }: { item: GptImagePrompt; onClose: () => void }) {
  const { copied, copy } = useCopy(item.prompt ?? '');

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden"
        style={{
          maxHeight: 'calc(100vh - 48px)',
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-5 border-b border-border/40 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full">
                GPT Image
              </span>
              {item.model && (
                <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  {item.model}
                </span>
              )}
              {item.rank != null && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Trophy className="h-2.5 w-2.5" /> #{item.rank}
                </span>
              )}
              {item.author && (
                <span className="text-[10px] text-muted-foreground">by {item.author}</span>
              )}
              {formatDate(item.date) && (
                <span className="text-[10px] text-muted-foreground/50">{formatDate(item.date)}</span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 flex-wrap">
              {item.rating != null && <RatingStars rating={item.rating} />}
              {item.likes != null && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />{formatNum(item.likes)}
                </span>
              )}
              {item.views != null && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Eye className="h-3 w-3" />{formatNum(item.views)}
                </span>
              )}
              {item.score != null && (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Score {item.score}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.source_url && (
              <a
                href={item.source_url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-6 flex flex-col gap-5">

          {/* Generated image */}
          {item.image_url && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">
                Generated Image
              </p>
              <a
                href={item.image_url} target="_blank" rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-border/30 hover:border-violet-500/30 transition-colors"
              >
                <LazyImg
                  src={item.image_url} alt="Generated image"
                  className="w-full object-cover max-h-80"
                />
              </a>
            </div>
          )}

          {/* Prompt */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">
              Prompt
            </p>
            <div
              className="text-sm text-foreground/85 leading-relaxed rounded-xl p-4 font-mono whitespace-pre-wrap"
              style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
            >
              {item.prompt ?? '—'}
            </div>
            <button
              onClick={copy}
              className={cn(
                'mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-violet-500/15 text-violet-400 border border-violet-500/30 hover:bg-violet-500/25',
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>

          {/* Meta */}
          {(item.categories || item.model) && (
            <div className="flex flex-wrap gap-2">
              {item.categories && item.categories.filter(Boolean).map(cat => (
                <span
                  key={cat}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-secondary border border-border/40 text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          {item.author && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20">
              <div className="h-8 w-8 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm">
                {item.author.charAt(0).toUpperCase()}
              </div>
              <p className="text-[12px] font-medium text-foreground flex-1 min-w-0 truncate">{item.author}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ────────────────────────────────────────────────────────── */
function PromptCard({ item, onClick }: { item: GptImagePrompt; onClick: () => void }) {
  const { copied, copy } = useCopy(item.prompt ?? '');

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'hsl(267 84% 65% / 0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'hsl(var(--border))')}
    >
      {/* Thumbnail */}
      <div className="relative w-full bg-secondary/30" style={{ aspectRatio: '1/1' }}>
        {item.image_url ? (
          <LazyImg
            src={item.image_url} alt={item.prompt ?? ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Wand2 className="h-8 w-8 text-violet-400/20" />
          </div>
        )}

        {/* Rank badge */}
        {item.rank != null && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full">
            <Trophy className="h-2.5 w-2.5" />#{item.rank}
          </div>
        )}

        {/* Model badge */}
        {item.model && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-sky-400 px-2 py-0.5 rounded-full">
            {item.model}
          </div>
        )}

        {/* Stats overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 py-2 flex items-center gap-2">
          {item.likes != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-white/70">
              <ThumbsUp className="h-2.5 w-2.5" />{formatNum(item.likes)}
            </span>
          )}
          {item.views != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-white/70">
              <Eye className="h-2.5 w-2.5" />{formatNum(item.views)}
            </span>
          )}
          {item.rating != null && (
            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-amber-400">
              <Star className="h-2.5 w-2.5 fill-amber-400" />{item.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <p className="text-[11px] text-muted-foreground/70 line-clamp-3 leading-relaxed font-mono">
          {item.prompt ?? '—'}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground/50 truncate">
            {item.author ?? '—'}
          </span>
          <button
            onClick={copy}
            className={cn(
              'flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all shrink-0',
              copied
                ? 'bg-green-500/15 text-green-400'
                : 'bg-white/[0.05] text-muted-foreground hover:bg-violet-500/15 hover:text-violet-400',
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
type SortOpt = 'rank' | 'top_likes' | 'top_views' | 'top_rated' | 'newest' | 'oldest';

const SORT_OPTIONS: { value: SortOpt; label: string }[] = [
  { value: 'rank',      label: 'By Rank'     },
  { value: 'top_likes', label: 'Most Liked'  },
  { value: 'top_views', label: 'Most Viewed' },
  { value: 'top_rated', label: 'Top Rated'   },
  { value: 'newest',    label: 'Newest'      },
  { value: 'oldest',    label: 'Oldest'      },
];

export default function GptImagePrompts() {
  const { data: items = [], isLoading } = useGptImagePrompts();
  const location = useLocation();

  const [search,    setSearch]    = useState('');
  const [sort,      setSort]      = useState<SortOpt>('rank');
  const [model,     setModel]     = useState('All');
  const [category,  setCategory]  = useState('All');
  const [selected,  setSelected]  = useState<GptImagePrompt | null>(null);

  useEffect(() => {
    const id = (location.state as { openId?: string })?.openId;
    if (!id || !items.length) return;
    const found = items.find(i => i.id === id);
    if (found) setSelected(found);
  }, [location.state, items]);

  /* Derive unique models and categories from data */
  const models = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => { if (i.model) set.add(i.model); });
    return Array.from(set).sort();
  }, [items]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => { 
      if (i.categories) i.categories.forEach(c => set.add(c)); 
    });
    return ['All', ...Array.from(set).sort()];
  }, [items]);

  const showModelFilter = models.length > 1;

  const filtered = useMemo(() => {
    let list = items;

    if (showModelFilter && model !== 'All') list = list.filter(i => i.model === model);

    if (category !== 'All') list = list.filter(i => i.categories?.includes(category));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        (i.prompt      ?? '').toLowerCase().includes(q) ||
        (i.author      ?? '').toLowerCase().includes(q) ||
        (i.categories ?? []).some(c => c.toLowerCase().includes(q)) ||
        (i.model       ?? '').toLowerCase().includes(q),
      );
    }

    const sorted = [...list];
    switch (sort) {
      case 'rank':
        sorted.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999)); break;
      case 'top_likes':
        sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)); break;
      case 'top_views':
        sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0)); break;
      case 'top_rated':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'newest':
        sorted.sort((a, b) => ((b.date ?? b.created_at ?? '').localeCompare(a.date ?? a.created_at ?? ''))); break;
      case 'oldest':
        sorted.sort((a, b) => ((a.date ?? a.created_at ?? '').localeCompare(b.date ?? b.created_at ?? ''))); break;
    }
    return sorted;
  }, [items, search, sort, model, category]);

  const { limit, sentinelRef } = useLazyBatch(filtered.length);
  const visible = filtered.slice(0, limit);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Wand2}
        title="GPT Image Prompts"
        description={`You have access to 298 prompts across ${categories.length} categories.`}
        count={298}
        iconColor="text-violet-400"
      />

      {/* Model filter chips */}
      {showModelFilter && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          <button
            key="All"
            onClick={() => setModel('All')}
            className={cn(
              'shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-all',
              model === 'All'
                ? 'bg-violet-500/15 text-violet-400 border-violet-500/35'
                : 'text-muted-foreground border-border/40 hover:text-foreground hover:border-border/70',
            )}
          >
            All
          </button>
          {models.map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={cn(
                'shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-all',
                model === m
                  ? 'bg-violet-500/15 text-violet-400 border-violet-500/35'
                  : 'text-muted-foreground border-border/40 hover:text-foreground hover:border-border/70',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Category filter chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-all',
              category === c
                ? 'bg-sky-500/15 text-sky-400 border-sky-500/35'
                : 'text-muted-foreground border-border/40 hover:text-foreground hover:border-border/70',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search / sort / filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts, authors, models…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border/60 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOpt)}
          className="h-10 px-3 rounded-xl border border-border/35 bg-background/80 text-[13px] text-foreground focus:outline-none focus:border-border/60 transition-all cursor-pointer appearance-none"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        

        

        <span className="text-[12px] text-muted-foreground/50 ml-auto whitespace-nowrap">
          {filtered.length} / {items.length}
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-secondary/20 animate-pulse aspect-square" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <Wand2 className="h-12 w-12 text-muted-foreground/20" />
          <h3 className="font-semibold text-foreground">No prompts found</h3>
          <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map(item => (
              <PromptCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </div>
          {limit < filtered.length && (
            <div ref={sentinelRef} className="flex justify-center py-10">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground/50">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
                Loading more…
              </div>
            </div>
          )}
        </>
      )}

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
