import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Globe, Copy, Check, Search, X, ExternalLink,
  Tag, User, Loader2, ChevronLeft, ArrowUpRight,
} from 'lucide-react';
import { useWebpagePrompts } from '@/hooks/useData';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { WebpagePrompt } from '@/data/types';
import { cn } from '@/lib/utils';

/* ── tag colors ──────────────────────────────────────────── */
const TAG_COLORS = [
  ['#a78bfa', '#a78bfa18'], ['#60a5fa', '#60a5fa18'], ['#34d399', '#34d39918'],
  ['#f472b6', '#f472b618'], ['#fbbf24', '#fbbf2418'], ['#fb923c', '#fb923c18'],
  ['#22d3ee', '#22d3ee18'], ['#e879f9', '#e879f918'],
];
function tagColor(tag: string) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[h % TAG_COLORS.length];
}

/* ── curated Unsplash thumbnails ─────────────────────────── */
const PHOTO_IDS: Record<number, string> = {
  1:  '1472851294608-062f824d29cc', 2:  '1635070041409-e63e783ce3c1',
  3:  '1461749280684-dccba630e2f6', 4:  '1523275335684-37898b6baf30',
  5:  '1511512578047-ab3e6e48d30a', 6:  '1579586337278-3befd40fd17a',
  7:  '1558655146-9f40138edfeb',   8:  '1528360983277-13d401cdc186',
  9:  '1611974789855-9c2a0a7236a3', 10: '1568702846914-96b305d2aaeb',
  11: '1534438327276-14e5300c3a48', 12: '1571019613454-1cb2f99b2d8b',
  13: '1558618666-fcd25c85cd64',   14: '1503676260728-1c4252057a14',
  15: '1518709268805-4e9042af9f23', 16: '1587620962725-abab7fe55159',
  17: '1611162617213-7d7a39e9b1d7', 18: '1516802273409-68526ee1bdd6',
  19: '1478737270239-2f02b77fc618', 20: '1419242902214-272b3f66ee7a',
  21: '1507003211169-0a1dd7228f2d', 22: '1495556650867-99590cea3169',
  23: '1504674900247-0877df9cc836', 24: '1518709268805-4e9042af9f23',
  25: '1467232004584-a241de8bcf5d', 26: '1508214751196-bcfd4ca60f91',
  27: '1511512578047-ab3e6e48d30a', 28: '1486312338219-ce68d2c6f44d',
  29: '1548919973-5cef591cdbc9',   30: '1517842645522-b9b9e237ab5e',
  31: '1611162616475-46b635cb6868', 32: '1503676260728-1c4252057a14',
  33: '1611162617213-7d7a39e9b1d7', 34: '1567401893414-76b7b1e5a7a5',
  35: '1460925895917-afdab827c52f', 36: '1468436385438-10bbf9bbf965',
  37: '1550745165-9bc0b252726f',   38: '1489824904134-891ab64532f1',
  39: '1618401471353-b98afee0b2eb', 40: '1564769662533-4f00a87bd25f',
  41: '1518709268805-4e9042af9f23', 42: '1611996015347-db6fd2e68e5a',
  43: '1574375927818-4ceface2e575', 44: '1511882150382-421056c89033',
  45: '1635070041409-e63e783ce3c1', 46: '1446776811953-b23d57bd21aa',
  47: '1593508512255-86ab42a8e620', 48: '1558618666-fcd25c85cd64',
  49: '1485738422979-f5c462d49f74',
};
function thumbUrl(id: number) {
  const pid = PHOTO_IDS[id] ?? '1461749280684-dccba630e2f6';
  return `https://images.unsplash.com/photo-${pid}?w=600&q=75&auto=format&fit=crop`;
}

/* ── lazy image ──────────────────────────────────────────── */
function LazyImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.src = src; obs.disconnect(); }
    }, { rootMargin: '300px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);
  if (error) return (
    <div className={cn(className, 'bg-secondary/40 flex items-center justify-center')}>
      <Globe className="h-8 w-8 text-muted-foreground/20" />
    </div>
  );
  return (
    <img ref={ref} alt={alt}
      className={cn(className, 'transition-opacity duration-500 object-cover', loaded ? 'opacity-100' : 'opacity-0')}
      onLoad={() => setLoaded(true)} onError={() => setError(true)}
    />
  );
}

/* ── copy button ──────────────────────────────────────────── */
function CopyBtn({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={cn(
        'flex items-center gap-1.5 font-medium rounded-lg border transition-all',
        size === 'sm' ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3 py-1.5',
        copied
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          : 'bg-secondary/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/70',
      )}>
      {copied ? <><Check className="h-3 w-3" />Copied!</> : <><Copy className="h-3 w-3" />Copy</>}
    </button>
  );
}

/* ── Detail Page ─────────────────────────────────────────── */
function DetailPage({ p, onBack }: { p: WebpagePrompt; onBack: () => void }) {
  const [c0] = tagColor(p.tags?.[0] ?? 'web');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* back bar */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Webpage Prompts
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* hero image */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <LazyImg src={thumbUrl(p.id)} alt={p.title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* model badge */}
          {p.model && (
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/80 backdrop-blur-sm text-white">
              {p.model}
            </div>
          )}

          {/* title on image */}
          <div className="absolute bottom-5 left-5 right-5">
            <h1 className="text-white text-xl sm:text-2xl font-black leading-snug drop-shadow-lg">
              {p.title}
            </h1>
            {p.author && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: c0 }}>
                  {p.author.replace('@', '').charAt(0).toUpperCase()}
                </div>
                <span className="text-white/80 text-xs font-medium">{p.author}</span>
              </div>
            )}
          </div>
        </div>

        {/* content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* tags row */}
          {p.tags && p.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.tags.map(tag => {
                const [c, bg] = tagColor(tag);
                return (
                  <span key={tag} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: bg, color: c, border: `1px solid ${c}30` }}>
                    <Tag className="h-3 w-3" />{tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* description */}
          {p.description && (
            <div className="rounded-xl border border-border/40 bg-card/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">About this prompt</p>
              <p className="text-sm text-foreground/85 leading-relaxed">{p.description}</p>
            </div>
          )}

          {/* prompt */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${c0}30` }}>
            <div className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: `${c0}20`, background: `${c0}08` }}>
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: c0 }}>Prompt</p>
              <CopyBtn text={p.prompt} size="sm" />
            </div>
            <div className="p-5 bg-secondary/20">
              <p className="text-sm text-foreground/90 font-mono leading-relaxed whitespace-pre-wrap">{p.prompt}</p>
            </div>
          </div>

          {/* source tweet */}
          {p.source_tweet && (
            <div className="rounded-xl border border-border/40 bg-card/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Original Source</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                This prompt was shared on X (Twitter). Click below to see the original post with screenshots or demo videos of the result.
              </p>
              <a href={p.source_tweet} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: c0 }}>
                <ArrowUpRight className="h-4 w-4" />
                View Original Tweet & Demo
              </a>
            </div>
          )}

          {/* how to use */}
          <div className="rounded-xl border border-border/40 bg-card/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">How to use</p>
            <ol className="space-y-2">
              {[
                'Copy the prompt above using the Copy button.',
                'Open ChatGPT, Claude, Gemini, or any AI tool.',
                'Paste the prompt and run it.',
                'Want to see the real demo? Click "View Original Tweet" above.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5"
                    style={{ background: `${c0}20`, color: c0 }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────── */
function PromptCard({ p, onClick }: { p: WebpagePrompt; onClick: () => void }) {
  const [c0] = tagColor(p.tags?.[0] ?? 'web');

  return (
    <div onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-border/40 bg-card/60 overflow-hidden hover:border-border/70 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">

      {/* thumbnail */}
      <div className="relative overflow-hidden h-44">
        <LazyImg src={thumbUrl(p.id)} alt={p.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        {/* model badge */}
        {p.model && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/80 backdrop-blur-sm text-white">
            {p.model}
          </div>
        )}

        {/* title on image */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-xs font-bold leading-snug line-clamp-2 drop-shadow">
            {p.title}
          </p>
        </div>
      </div>

      {/* content */}
      <div className="p-4">
        {/* author only */}
        {p.author && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3">
            <User className="h-3 w-3 shrink-0" />
            <span className="font-medium truncate">{p.author}</span>
          </div>
        )}

        {/* description */}
        {p.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {p.description}
          </p>
        )}

        {/* prompt preview */}
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3 mb-3">
          <p className="text-[11px] text-foreground/80 font-mono leading-relaxed line-clamp-3">
            {p.prompt}
          </p>
          <p className="text-[10px] font-semibold mt-1.5" style={{ color: c0 }}>
            Click to view full prompt →
          </p>
        </div>

        {/* tags */}
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.tags.slice(0, 3).map(tag => {
              const [c, bg] = tagColor(tag);
              return (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: bg, color: c, border: `1px solid ${c}30` }}>
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* copy button */}
        <div onClick={e => e.stopPropagation()}>
          <CopyBtn text={p.prompt} />
        </div>
      </div>
    </div>
  );
}

/* ── tag frequency ───────────────────────────────────────── */
function getAllTags(prompts: WebpagePrompt[]) {
  const freq: Record<string, number> = {};
  for (const p of prompts) for (const t of (p.tags ?? [])) freq[t] = (freq[t] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([t]) => t);
}

/* ── Page ─────────────────────────────────────────────────── */
export default function WebpagePrompts() {
  const { data: prompts = [], isLoading, error } = useWebpagePrompts();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<WebpagePrompt | null>(null);

  const topTags = useMemo(() => getAllTags(prompts), [prompts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return prompts.filter(p => {
      if (activeTag && !(p.tags ?? []).includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.author ?? '').toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q))
      );
    });
  }, [prompts, search, activeTag]);

  /* detail view */
  if (selected) {
    return <DetailPage p={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        icon={Globe}
        title="Webpage Prompts"
        description={`${prompts.length} curated AI webpage & UI prompts — click any card for details`}
        accentColor="#60a5fa"
      />

      {/* search + tag filter only */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/40 space-y-3">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts, tags, authors…"
            className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-border/50 bg-secondary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setActiveTag(null)}
            className={cn(
              'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all',
              !activeTag ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-secondary/20 border-border/30 text-muted-foreground hover:text-foreground',
            )}>All</button>
          {topTags.map(tag => {
            const [c, bg] = tagColor(tag);
            const active = activeTag === tag;
            return (
              <button key={tag}
                onClick={() => setActiveTag(active ? null : tag)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all"
                style={active
                  ? { background: bg, color: c, borderColor: `${c}50` }
                  : { background: 'hsl(var(--secondary)/0.3)', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border)/0.4)' }}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2 border-b border-border/20">
        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Loading…' : `${filtered.length} prompt${filtered.length !== 1 ? 's' : ''}`}
          {(search || activeTag) && !isLoading && ' matching your filters'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading webpage prompts…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Globe className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Failed to load. Please refresh.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">No prompts match your search.</p>
            <button onClick={() => { setSearch(''); setActiveTag(null); }}
              className="text-xs text-primary hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(p => (
              <PromptCard key={p.id} p={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
