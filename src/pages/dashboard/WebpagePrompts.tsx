import { useState, useMemo } from 'react';
import {
  Globe, Copy, Check, Search, X, ExternalLink,
  Tag, User, Calendar, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useWebpagePrompts } from '@/hooks/useData';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { WebpagePrompt } from '@/data/types';
import { cn } from '@/lib/utils';

/* ── helpers ─────────────────────────────────────────────── */
function fmtDate(s: string | null) {
  if (!s) return null;
  try { return new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return null; }
}

const LANG_FLAG: Record<string, string> = { EN: '🇺🇸', JA: '🇯🇵', ZH: '🇨🇳', KO: '🇰🇷', ES: '🇪🇸', FR: '🇫🇷' };

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

/* ── copy button ──────────────────────────────────────────── */
function CopyBtn({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all',
        copied
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          : 'bg-secondary/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/70',
        className,
      )}
    >
      {copied ? <><Check className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
    </button>
  );
}

/* ── prompt card ─────────────────────────────────────────── */
function PromptCard({ p }: { p: WebpagePrompt }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = p.prompt.length > 220;
  const displayPrompt = isLong && !expanded ? p.prompt.slice(0, 220) + '…' : p.prompt;

  return (
    <div className="group rounded-2xl border border-border/40 bg-card/60 overflow-hidden hover:border-border/70 hover:shadow-lg transition-all duration-200">
      {/* top accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-500/60 via-blue-500/60 to-emerald-500/60" />

      <div className="p-5">
        {/* header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {p.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {p.language && (
              <span className="text-base" title={p.language}>
                {LANG_FLAG[p.language] ?? '🌐'}
              </span>
            )}
          </div>
        </div>

        {/* meta */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-3">
          {p.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {p.author_x_url
                ? <a href={p.author_x_url} target="_blank" rel="noreferrer"
                    className="hover:text-primary transition-colors" onClick={e => e.stopPropagation()}>
                    {p.author}
                  </a>
                : p.author}
            </span>
          )}
          {p.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {fmtDate(p.published_at)}
            </span>
          )}
          {p.model && (
            <span className="px-2 py-0.5 rounded-full bg-violet-500/12 text-violet-400 border border-violet-500/20 font-medium">
              {p.model}
            </span>
          )}
        </div>

        {/* description */}
        {p.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {p.description}
          </p>
        )}

        {/* prompt box */}
        <div className="rounded-xl border border-border/40 bg-secondary/30 p-3.5 mb-3 relative">
          <p className="text-xs text-foreground/85 font-mono leading-relaxed whitespace-pre-wrap">
            {displayPrompt}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary mt-2 hover:opacity-80 transition-opacity"
            >
              {expanded
                ? <><ChevronUp className="h-3 w-3" />Show less</>
                : <><ChevronDown className="h-3 w-3" />Show full prompt</>}
            </button>
          )}
        </div>

        {/* tags */}
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {p.tags.slice(0, 5).map(tag => {
              const [c, bg] = tagColor(tag);
              return (
                <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: bg, color: c, border: `1px solid ${c}30` }}>
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* actions */}
        <div className="flex items-center gap-2">
          <CopyBtn text={p.prompt} className="flex-1 justify-center" />
          {p.source_tweet && (
            <a
              href={p.source_tweet}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── All tags for filter bar ────────────────────────────── */
function getAllTags(prompts: WebpagePrompt[]) {
  const freq: Record<string, number> = {};
  for (const p of prompts) {
    for (const t of (p.tags ?? [])) { freq[t] = (freq[t] ?? 0) + 1; }
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t]) => t);
}

/* ── Page ─────────────────────────────────────────────────── */
export default function WebpagePrompts() {
  const { data: prompts = [], isLoading, error } = useWebpagePrompts();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);

  const topTags = useMemo(() => getAllTags(prompts), [prompts]);

  const langs = useMemo(() => {
    const s = new Set<string>();
    for (const p of prompts) { if (p.language) s.add(p.language); }
    return [...s].sort();
  }, [prompts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return prompts.filter(p => {
      if (lang && p.language !== lang) return false;
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
  }, [prompts, search, activeTag, lang]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader
        icon={Globe}
        title="Webpage Prompts"
        description={`${prompts.length} curated AI webpage prompts from the community — copy & build instantly`}
        accentColor="#60a5fa"
      />

      {/* Search + filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/40 space-y-3">
        {/* search bar */}
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

        {/* lang filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Language:</span>
          {['All', ...langs].map(l => (
            <button key={l}
              onClick={() => setLang(l === 'All' ? null : l)}
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all',
                (l === 'All' ? !lang : lang === l)
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-secondary/30 border-border/40 text-muted-foreground hover:text-foreground',
              )}>
              {l !== 'All' && <span>{LANG_FLAG[l] ?? '🌐'}</span>}
              {l}
            </button>
          ))}
        </div>

        {/* tag filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Filter:</span>
          <button
            onClick={() => setActiveTag(null)}
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

      {/* Results count */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-border/20">
        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Loading…' : `${filtered.length} prompt${filtered.length !== 1 ? 's' : ''}`}
          {(search || activeTag || lang) && !isLoading && ` matching your filters`}
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading webpage prompts…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Globe className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Failed to load prompts. Please refresh.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">No prompts match your search.</p>
            <button onClick={() => { setSearch(''); setActiveTag(null); setLang(null); }}
              className="text-xs text-primary hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(p => <PromptCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
