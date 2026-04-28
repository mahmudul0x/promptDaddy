import { useState, useEffect, useMemo } from 'react';
import { Flame, Copy, CheckCircle, Search, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageSkeletonGrid } from '@/components/dashboard/BrandedSkeleton';

interface TrendingPrompt {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  prompt: string;
  created_at: string;
}

type SortOption = 'newest' | 'oldest';

// ── Detail modal ──────────────────────────────────────────────────────────────
function PromptDetailModal({ tp, onClose }: { tp: TrendingPrompt; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const copy = () => {
    navigator.clipboard.writeText(tp.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* On mobile: slides up from bottom (rounded top corners only).
          On sm+: centered card with full rounded corners. */}
      <div className="relative w-full sm:max-w-2xl sm:mx-4 flex flex-col bg-card border border-border/60 shadow-2xl
                      rounded-t-2xl sm:rounded-2xl
                      h-[92dvh] sm:max-h-[88vh]">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg flex items-center justify-center bg-card/90 border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-border/60" />
        </div>

        {/* Cover image — fixed height, never stretches */}
        {tp.image_url && !imgError ? (
          <div className="relative w-full h-44 sm:h-52 shrink-0 overflow-hidden sm:rounded-t-2xl">
            <img
              src={tp.image_url}
              alt={tp.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 pointer-events-none" />
          </div>
        ) : (
          <div className="h-24 sm:h-28 shrink-0 sm:rounded-t-2xl flex items-center justify-center bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent">
            <Flame className="h-10 w-10 text-orange-400/30" />
          </div>
        )}

        {/* Scrollable body — fills remaining height */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 gap-5">
          {/* Meta */}
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">
              {tp.category}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-foreground leading-snug mt-3">{tp.title}</h2>
            <p className="text-[10px] text-muted-foreground/50 mt-1.5">
              Published {new Date(tp.created_at).toLocaleDateString('en-BD', { dateStyle: 'long' })}
            </p>
          </div>

          {/* Prompt box */}
          <div className="rounded-xl border border-border/50 bg-secondary/40">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Prompt</span>
              <button
                onClick={copy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  copied
                    ? 'bg-green-400/15 text-green-400 border border-green-400/20'
                    : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {copied
                  ? <><CheckCircle className="h-3 w-3" /> Copied!</>
                  : <><Copy className="h-3 w-3" /> Copy prompt</>
                }
              </button>
            </div>
            <p className="p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{tp.prompt}</p>
          </div>

          {/* Bottom padding so last line isn't flush against screen edge on mobile */}
          <div className="h-2 shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function PromptCard({ tp, onClick }: { tp: TrendingPrompt; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tp.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-2xl border border-border/40 bg-card/60 overflow-hidden hover:border-orange-400/30 hover:shadow-lg cursor-pointer transition-all group"
    >
      {tp.image_url && !imgError ? (
        <div className="w-full shrink-0 bg-secondary/30">
          <img
            src={tp.image_url}
            alt={tp.title}
            onError={() => setImgError(true)}
            className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="w-full shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-rose-500/10" style={{ aspectRatio: '16/9' }}>
          <Flame className="h-8 w-8 text-orange-400/30 group-hover:text-orange-400/50 transition-colors" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20 self-start">
          {tp.category}
        </span>
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
          {tp.title}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-3 flex-1 leading-relaxed">{tp.prompt}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-muted-foreground/50">
            {new Date(tp.created_at).toLocaleDateString('en-BD', { dateStyle: 'medium' })}
          </span>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              copied
                ? 'bg-green-400/15 text-green-400 border border-green-400/20'
                : 'bg-secondary border border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {copied ? <><CheckCircle className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrendingPrompts() {
  const [prompts, setPrompts]   = useState<TrendingPrompt[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort]         = useState<SortOption>('newest');
  const [selected, setSelected] = useState<TrendingPrompt | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase
      .from('trending_prompts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (mounted) { setPrompts(data ?? []); setLoading(false); }
      });
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(prompts.map(p => p.category).filter(Boolean))].sort(),
    [prompts]
  );

  const filtered = useMemo(() => {
    let items = prompts;
    if (category !== 'All') items = items.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return sort === 'oldest' ? [...items].reverse() : items;
  }, [prompts, category, search, sort]);

  return (
    <div className="space-y-5">
      {selected && <PromptDetailModal tp={selected} onClose={() => setSelected(null)} />}

      <PageHeader
        icon={Flame}
        title="Trending Prompts"
        description="Hot prompts curated by our team — click any card to view the full prompt"
        count={filtered.length}
        iconColor="text-orange-400"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts…"
            className="w-full pl-8 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-primary/40 cursor-pointer transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60 pointer-events-none" />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="appearance-none pl-3 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-primary/40 cursor-pointer transition-colors"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60 pointer-events-none" />
        </div>

        <span className="text-[10px] text-muted-foreground/60 ml-auto shrink-0">
          {filtered.length} of {prompts.length}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <PageSkeletonGrid count={9} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Flame className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            {prompts.length === 0 ? 'No trending prompts yet' : 'No results found'}
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            {prompts.length === 0
              ? 'Check back soon — our team curates these regularly'
              : 'Try a different search or filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tp => (
            <PromptCard key={tp.id} tp={tp} onClick={() => setSelected(tp)} />
          ))}
        </div>
      )}
    </div>
  );
}
