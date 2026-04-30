import { useState, useMemo } from 'react';
import { Banana, Copy, Check, X, ExternalLink, Search, Image } from 'lucide-react';
import { useNanoBananaPrompts } from '@/hooks/useData';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { NanoBananaPrompt } from '@/data/types';
import { cn } from '@/lib/utils';

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

function formatDate(s: string | null) {
  if (!s) return null;
  return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── Detail Modal ───────────────────────────────────────────────── */
function DetailModal({ item, onClose }: { item: NanoBananaPrompt; onClose: () => void }) {
  const { copied, copy } = useCopy(item.content);
  const images = item.sourceMedia ?? [];

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
        <div className="flex items-start gap-4 px-6 py-5 border-b border-border/40 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full">
                Nano Banana
              </span>
              {item.author?.name && (
                <span className="text-[10px] text-muted-foreground">by {item.author.name}</span>
              )}
              {formatDate(item.sourcePublishedAt) && (
                <span className="text-[10px] text-muted-foreground/60">{formatDate(item.sourcePublishedAt)}</span>
              )}
            </div>
            <h2 className="font-bold text-base text-foreground leading-snug">{item.title}</h2>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.sourceLink && (
              <a
                href={item.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
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

        <div className="flex-1 overflow-y-auto custom-scroll p-6 flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">Prompt</p>
            <div
              className="text-sm text-foreground/85 leading-relaxed rounded-xl p-4 font-mono whitespace-pre-wrap"
              style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
            >
              {item.content}
            </div>
            <button
              onClick={copy}
              className={cn(
                'mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25',
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>

          {images.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-2">
                Media ({images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {images.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      className="w-full rounded-lg object-cover aspect-square hover:opacity-80 transition-opacity"
                      onError={e => { (e.currentTarget.closest('a') as HTMLElement).style.display = 'none'; }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {item.author && (item.author.name || item.author.link) && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20">
              <div className="h-8 w-8 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0 text-yellow-400 font-bold text-sm">
                {item.author.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-foreground">{item.author.name}</p>
              </div>
              {item.author.link && (
                <a
                  href={item.author.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ───────────────────────────────────────────────────────── */
function PromptCard({ item, onClick }: { item: NanoBananaPrompt; onClick: () => void }) {
  const images = item.sourceMedia ?? [];
  const thumb = images[0] ?? null;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 2px 12px hsl(var(--shadow-card, 230 50% 2% / 0.4))',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'hsl(var(--border))')}
    >
      <div className="relative w-full overflow-hidden bg-secondary/30" style={{ aspectRatio: '16/9' }}>
        {thumb ? (
          <img
            src={thumb}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Banana className="h-8 w-8 text-yellow-400/20" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-black/70 backdrop-blur-sm text-[10px] font-bold text-yellow-400 px-2 py-0.5 rounded-full">
            NanoBanana
          </span>
        </div>
        {images.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-white/70 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Image className="h-2.5 w-2.5" /> {images.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed font-mono mt-0.5">
          {item.content}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          {item.author?.name ? (
            <span className="text-[10px] text-muted-foreground/50 truncate">{item.author.name}</span>
          ) : (
            <span className="text-[10px] text-muted-foreground/30">—</span>
          )}
          {formatDate(item.sourcePublishedAt) && (
            <span className="text-[10px] text-muted-foreground/40">{formatDate(item.sourcePublishedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
type SortOpt = 'newest' | 'oldest';
const PAGE_SIZE = 60;

export default function NanoBananaPrompts() {
  const { data: items = [], isLoading } = useNanoBananaPrompts();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOpt>('newest');
  const [mediaOnly, setMediaOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<NanoBananaPrompt | null>(null);

  /* derive unique authors for a quick filter */
  const authors = useMemo(
    () => [...new Set(items.map(i => i.author?.name).filter(Boolean) as string[])].sort(),
    [items],
  );
  const [author, setAuthor] = useState('All');

  const filtered = useMemo(() => {
    let list = items;
    if (mediaOnly) list = list.filter(i => (i.sourceMedia?.length ?? 0) > 0);
    if (author !== 'All') list = list.filter(i => i.author?.name === author);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => (b.sourcePublishedAt ?? '').localeCompare(a.sourcePublishedAt ?? ''));
    else sorted.sort((a, b) => (a.sourcePublishedAt ?? '').localeCompare(b.sourcePublishedAt ?? ''));
    return sorted;
  }, [items, search, sort, mediaOnly, author]);

  /* reset to page 1 on filter change */
  const paged = useMemo(() => {
    setPage(1);
    return filtered;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, search, sort, mediaOnly, author]);

  const totalPages = Math.ceil(paged.length / PAGE_SIZE);
  const visible = paged.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Banana}
        title="Nano Banana Prompts"
        description="12,000+ curated prompts sourced from X (Twitter) — with images."
        count={items.length}
        iconColor="text-yellow-400"
      />

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search 12k+ prompts…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border/60 focus:bg-white/[0.05] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOpt)}
          className="h-10 px-3 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground focus:outline-none focus:border-border/60 transition-all cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        {/* Author filter — only show if ≤50 unique authors to keep UI sane */}
        {authors.length <= 50 && authors.length > 1 && (
          <select
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border/35 bg-white/[0.03] text-[13px] text-foreground focus:outline-none focus:border-border/60 transition-all cursor-pointer max-w-[160px]"
          >
            <option value="All">All Authors</option>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        )}

        <button
          onClick={() => setMediaOnly(v => !v)}
          className={cn(
            'flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-[12px] font-medium transition-all',
            mediaOnly
              ? 'bg-yellow-500/15 border-yellow-500/35 text-yellow-400'
              : 'bg-white/[0.03] border-border/35 text-muted-foreground hover:text-foreground hover:border-border/50',
          )}
        >
          <Image className="h-3.5 w-3.5" /> With Media
        </button>

        <span className="text-[12px] text-muted-foreground/50 ml-auto whitespace-nowrap">
          {filtered.length} / {items.length}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-secondary/20 animate-pulse" style={{ aspectRatio: '3/4' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <Banana className="h-12 w-12 text-muted-foreground/20" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-lg border border-border/35 text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                ← Prev
              </button>
              <span className="text-[13px] text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-lg border border-border/35 text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
