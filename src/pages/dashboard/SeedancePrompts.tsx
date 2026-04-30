import { useState, useMemo, useRef, useEffect } from 'react';
import { Film, Copy, Check, X, ExternalLink, Search, Image, Video } from 'lucide-react';
import { useSeedancePrompts } from '@/hooks/useData';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { SeedancePrompt } from '@/data/types';
import { cn } from '@/lib/utils';

/* ── JSON-string-safe coercions ─────────────────────────────────── */
function parseField(v: unknown): unknown {
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return null; }
  }
  return v;
}

function toStrArr(v: unknown): string[] {
  const parsed = parseField(v);
  if (!parsed || !Array.isArray(parsed)) return [];
  return parsed
    .map((item: unknown) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        return (o.url ?? o.src ?? o.image_url ?? '') as string;
      }
      return '';
    })
    .filter(Boolean);
}

function toVideoArr(v: unknown): { url: string; thumbnail: string | null }[] {
  const parsed = parseField(v);
  if (!parsed || !Array.isArray(parsed)) return [];
  return parsed
    .map((item: unknown) => {
      if (typeof item === 'string') return { url: item, thumbnail: null };
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        return {
          url: (o.url ?? o.videoUrl ?? '') as string,
          thumbnail: (o.thumbnail ?? o.thumbnailUrl ?? null) as string | null,
        };
      }
      return null;
    })
    .filter((v): v is { url: string; thumbnail: string | null } => !!v && !!v.url);
}

function getImages(item: SeedancePrompt): string[] {
  return [...toStrArr(item.sourceMedia), ...toStrArr(item.sourceReferenceImages)];
}
function getVideos(item: SeedancePrompt) { return toVideoArr(item.sourceVideos); }

function formatDate(s: string | null) {
  if (!s) return null;
  try { return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return null; }
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
    <img ref={ref} alt={alt}
      className={cn(className, 'transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
      onLoad={() => setLoaded(true)} onError={() => setError(true)} />
  );
}

/* ── copy hook ─────────────────────────────────────────────────── */
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

/* ── lazy batch loader ──────────────────────────────────────────── */
const BATCH = 24;
function useLazyBatch(total: number) {
  const [limit, setLimit] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setLimit(BATCH); }, [total]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setLimit(l => Math.min(l + BATCH, total));
    }, { rootMargin: '300px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [total]);
  return { limit, sentinelRef };
}

/* ── Detail Modal ───────────────────────────────────────────────── */
function DetailModal({ item, onClose }: { item: SeedancePrompt; onClose: () => void }) {
  const { copied, copy } = useCopy(item.content ?? '');
  const images = getImages(item);
  const videos = getVideos(item);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 48px)', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-start gap-4 px-6 py-5 border-b border-border/40 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">Seedance</span>
              {item.author?.name && <span className="text-[10px] text-muted-foreground">by {item.author.name}</span>}
              {formatDate(item.sourcePublishedAt) && <span className="text-[10px] text-muted-foreground/60">{formatDate(item.sourcePublishedAt)}</span>}
            </div>
            <h2 className="font-bold text-base text-foreground leading-snug">{item.title}</h2>
            {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.sourceLink && (
              <a href={item.sourceLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-6 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Prompt</p>
            <div className="text-sm text-foreground/85 leading-relaxed rounded-xl p-4 font-mono whitespace-pre-wrap"
              style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
              {item.content}
            </div>
            <button onClick={copy}
              className={cn('mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25')}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>

          {images.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Media ({images.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {images.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden bg-secondary/30">
                    <LazyImg src={url} alt="" className="w-full h-full object-cover hover:opacity-80" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Videos ({videos.length})</p>
              <div className="flex flex-col gap-2">
                {videos.map((v, i) => (
                  <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border/70 hover:bg-white/[0.02] transition-all">
                    <div className="h-12 w-20 rounded-lg bg-secondary/50 overflow-hidden shrink-0 flex items-center justify-center">
                      {v.thumbnail
                        ? <LazyImg src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                        : <Video className="h-5 w-5 text-muted-foreground/40" />}
                    </div>
                    <span className="text-xs text-muted-foreground truncate flex-1">Video {i + 1}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */
function PromptCard({ item, onClick }: { item: SeedancePrompt; onClick: () => void }) {
  const images = getImages(item);
  const videos = getVideos(item);
  const thumb = images[0] ?? videos[0]?.thumbnail ?? null;
  const { copied, copy } = useCopy(item.content ?? '');

  return (
    <div onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', boxShadow: '0 2px 12px hsl(var(--shadow-card, 230 50% 2% / 0.4))' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'hsl(var(--border))')}>

      <div className="relative w-full bg-secondary/30" style={{ aspectRatio: '16/9' }}>
        {thumb ? (
          <LazyImg src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Film className="h-8 w-8 text-orange-400/20" /></div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="bg-black/70 backdrop-blur-sm text-[10px] font-bold text-orange-400 px-2 py-0.5 rounded-full">Seedance</span>
          {videos.length > 0 && (
            <span className="bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Video className="h-2.5 w-2.5" /> Video
            </span>
          )}
        </div>
        {images.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-white/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Image className="h-2.5 w-2.5" /> {images.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
        {item.description && <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>}
        <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed font-mono mt-0.5">{item.content}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground/50 truncate">{item.author?.name ?? '—'}</span>
          <button
            onClick={copy}
            className={cn(
              'flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-all shrink-0',
              copied ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.05] text-muted-foreground hover:bg-orange-500/15 hover:text-orange-400',
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

/* ── Page ───────────────────────────────────────────────────────── */
type SortOpt = 'newest' | 'oldest';

const SEEDANCE_CATEGORIES = [
  'All',
  'Cinematic Scene Showcase',
  'Vlog / Social Lifestyle',
  'Short Film',
  'Music Video',
  'Brand / Product Commercial',
  'UGC / Talking Head Ad',
  'Explainer / Tutorial',
  'Channel Intro / Brand Asset',
  'Game Cinematic / PV',
] as const;

export default function SeedancePrompts() {
  const { data: items = [], isLoading } = useSeedancePrompts();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOpt>('newest');
  const [mediaOnly, setMediaOnly] = useState(false);
  const [videoOnly, setVideoOnly] = useState(false);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<SeedancePrompt | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    if (mediaOnly) list = list.filter(i => getImages(i).length > 0);
    if (videoOnly) list = list.filter(i => getVideos(i).length > 0);
    if (category !== 'All') {
      list = list.filter(i => i.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        (i.title ?? '').toLowerCase().includes(q) ||
        (i.content ?? '').toLowerCase().includes(q) ||
        (i.description ?? '').toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => (b.sourcePublishedAt ?? '').localeCompare(a.sourcePublishedAt ?? ''));
    else sorted.sort((a, b) => (a.sourcePublishedAt ?? '').localeCompare(b.sourcePublishedAt ?? ''));
    return sorted;
  }, [items, search, sort, mediaOnly, videoOnly, category]);

  const { limit, sentinelRef } = useLazyBatch(filtered.length);
  const visible = filtered.slice(0, limit);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader icon={Film} title="Seedance Prompts"
        description="Detailed video generation prompts ready for Seedance 2.0 AI."
        count={items.length} iconColor="text-orange-400" />

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {SEEDANCE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-all',
              category === cat
                ? 'bg-orange-500/15 text-orange-400 border-orange-500/35'
                : 'text-muted-foreground border-border/40 hover:text-foreground hover:border-border/70',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border/60 transition-all" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
        </div>

        <select value={sort} onChange={e => setSort(e.target.value as SortOpt)}
          className="h-10 px-3 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground focus:outline-none focus:border-border/60 transition-all cursor-pointer">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button onClick={() => setMediaOnly(v => !v)}
          className={cn('flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-[12px] font-medium transition-all',
            mediaOnly ? 'bg-orange-500/15 border-orange-500/35 text-orange-400' : 'bg-white/[0.03] border-border/35 text-muted-foreground hover:text-foreground hover:border-border/50')}>
          <Image className="h-3.5 w-3.5" /> With Media
        </button>
        <button onClick={() => setVideoOnly(v => !v)}
          className={cn('flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-[12px] font-medium transition-all',
            videoOnly ? 'bg-purple-500/15 border-purple-500/35 text-purple-400' : 'bg-white/[0.03] border-border/35 text-muted-foreground hover:text-foreground hover:border-border/50')}>
          <Video className="h-3.5 w-3.5" /> With Video
        </button>

        {(mediaOnly || videoOnly) && (
          <button onClick={() => { setMediaOnly(false); setVideoOnly(false); }}
            className="h-10 px-3 rounded-xl text-[12px] text-red-400/80 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all">
            Clear
          </button>
        )}
        <span className="text-[12px] text-muted-foreground/50 ml-auto whitespace-nowrap">{filtered.length} / {items.length}</span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-secondary/20 animate-pulse" style={{ aspectRatio: '3/4' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <Film className="h-12 w-12 text-muted-foreground/20" />
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
