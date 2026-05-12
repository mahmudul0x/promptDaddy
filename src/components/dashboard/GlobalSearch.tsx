import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, MessageSquare, Image, Video, GraduationCap,
  Zap, Bot, Cpu, Wand2, Sparkles, Banana, Film, Globe,
  ArrowRight, Hash,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

/* ── types ───────────────────────────────────────────────── */
interface Hit {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  tags?: string[] | null;
  type: string;
  to: string;          // navigation target
  state?: unknown;     // optional router state
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; to: string }> = {
  prompt:           { label: 'LLM Prompt',      icon: MessageSquare, color: '#60a5fa', to: '/dashboard/prompts' },
  image_prompt:     { label: 'Image Prompt',     icon: Image,         color: '#a78bfa', to: '/dashboard/image-prompts' },
  video:            { label: 'Video',            icon: Video,         color: '#ec4899', to: '/dashboard/videos' },
  guide:            { label: 'Guide',            icon: GraduationCap, color: '#fbbf24', to: '/dashboard/fundamentals' },
  automation:       { label: 'Automation',       icon: Zap,           color: '#facc15', to: '/dashboard/automation' },
  claude_skill:     { label: 'Claude Skill',     icon: Bot,           color: '#22d3ee', to: '/dashboard/claude-skills' },
  custom_gpt:       { label: 'Custom GPT',       icon: Cpu,           color: '#f472b6', to: '/dashboard/custom-gpts' },
  gptimage_prompt:  { label: 'GPT Image',        icon: Wand2,         color: '#8b5cf6', to: '/dashboard/gptimage' },
  grok_prompt:      { label: 'Grok Imagine',     icon: Sparkles,      color: '#06b6d4', to: '/dashboard/grok-imagine' },
  nano_prompt:      { label: 'Nano Banana',      icon: Banana,        color: '#eab308', to: '/dashboard/nano-banana' },
  seedance_prompt:  { label: 'Seedance',         icon: Film,          color: '#f97316', to: '/dashboard/seedance' },
  webpage_prompt:   { label: 'Webpage Prompt',   icon: Globe,         color: '#60a5fa', to: '/dashboard/webpage-prompts' },
};

/* ── extract hits from React Query cache ─────────────────── */
function useAllHits(): Hit[] {
  const qc = useQueryClient();

  return useMemo(() => {
    const hits: Hit[] = [];

    const push = (raw: unknown[], type: string) => {
      const meta = TYPE_META[type];
      if (!meta) return;
      for (const item of raw as Record<string, unknown>[]) {
        hits.push({
          id: item.id as string | number,
          title: (item.title as string) ?? '',
          description: (item.description as string) ?? (item.content as string) ?? '',
          category: (item.category as string) ?? '',
          tags: (item.tags as string[]) ?? null,
          type,
          to: meta.to,
          state: { openId: item.id },
        });
      }
    };

    push((qc.getQueryData(['prompts']) as unknown[]) ?? [],              'prompt');
    push((qc.getQueryData(['image_prompts']) as unknown[]) ?? [],        'image_prompt');
    push((qc.getQueryData(['videos']) as unknown[]) ?? [],               'video');
    push((qc.getQueryData(['guides']) as unknown[]) ?? [],               'guide');
    push((qc.getQueryData(['custom_gpts']) as unknown[]) ?? [],          'custom_gpt');
    push((qc.getQueryData(['automation_templates']) as unknown[]) ?? [], 'automation');
    push((qc.getQueryData(['claude_skills']) as unknown[]) ?? [],        'claude_skill');
    push((qc.getQueryData(['gptimage_prompts']) as unknown[]) ?? [],     'gptimage_prompt');
    push((qc.getQueryData(['grok_imagine_prompts']) as unknown[]) ?? [], 'grok_prompt');
    push((qc.getQueryData(['nano_banana_prompts']) as unknown[]) ?? [],  'nano_prompt');
    push((qc.getQueryData(['seedance_prompts']) as unknown[]) ?? [],     'seedance_prompt');
    push((qc.getQueryData(['webpage_prompts']) as unknown[]) ?? [],      'webpage_prompt');

    return hits;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qc, qc.getQueryCache().getAll().length]);
}

/* ── score a hit against query ───────────────────────────── */
function score(hit: Hit, q: string): number {
  const tl = hit.title.toLowerCase();
  const dl = (hit.description ?? '').toLowerCase();
  const cl = (hit.category ?? '').toLowerCase();
  const tagl = (hit.tags ?? []).join(' ').toLowerCase();
  if (tl === q) return 100;
  if (tl.startsWith(q)) return 80;
  if (tl.includes(q)) return 60;
  if (cl.includes(q)) return 40;
  if (tagl.includes(q)) return 30;
  if (dl.includes(q)) return 20;
  return 0;
}

/* ── highlight matching text ─────────────────────────────── */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/* ── single result row ───────────────────────────────────── */
function ResultRow({
  hit, q, active, onSelect,
}: { hit: Hit; q: string; active: boolean; onSelect: (h: Hit) => void }) {
  const meta = TYPE_META[hit.type];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onSelect(hit); }}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
        active ? 'bg-primary/10' : 'hover:bg-white/[0.04]',
      )}
    >
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
        <Icon style={{ height: 14, width: 14, color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-foreground leading-none truncate">
          <Highlight text={hit.title} q={q} />
        </p>
        {hit.category && (
          <p className="text-[10px] text-muted-foreground mt-1 leading-none flex items-center gap-1">
            <Hash style={{ height: 9, width: 9 }} />
            <Highlight text={hit.category} q={q} />
          </p>
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
        style={{ background: `${meta.color}18`, color: meta.color }}>
        {meta.label}
      </span>
      {active && <ArrowRight style={{ height: 12, width: 12 }} className="text-primary shrink-0" />}
    </button>
  );
}

/* ══ GlobalSearch ════════════════════════════════════════════ */
interface Props {
  onNavigate?: () => void; // called after navigation (e.g. close mobile menu)
}

export function GlobalSearch({ onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const allHits = useAllHits();

  /* Ctrl/Cmd+K to focus */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* filtered + scored results — max 12 */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return allHits
      .map(h => ({ hit: h, sc: score(h, q) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 12)
      .map(x => x.hit);
  }, [allHits, query]);

  /* reset active index when results change */
  useEffect(() => { setActiveIdx(0); }, [results]);

  const doSelect = useCallback((hit: Hit) => {
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    // navigate to the section page, pass openId so the page can pre-select the item
    navigate(hit.to, { state: hit.state });
    onNavigate?.();
  }, [navigate, onNavigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIdx]) doSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  /* scroll active row into view */
  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className="relative flex-1 min-w-0 max-w-sm mx-auto">
      {/* Input */}
      <div
        className="relative flex items-center h-8 rounded-lg transition-all duration-200"
        style={{
          background: open ? 'hsl(var(--muted))' : 'hsl(var(--secondary))',
          border: `1px solid ${open ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border))'}`,
          boxShadow: open ? '0 0 0 3px hsl(var(--primary) / 0.08)' : 'none',
        }}
      >
        <Search className="absolute left-2.5 text-muted-foreground/50 pointer-events-none" style={{ height: 13, width: 13 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search everything…"
          className="w-full bg-transparent pl-8 pr-16 text-[12.5px] text-foreground placeholder:text-muted-foreground/40 outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X style={{ height: 12, width: 12 }} />
          </button>
        ) : (
          <div className="absolute right-2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[9px] text-muted-foreground/40 font-mono bg-white/[0.04] border border-border/40 rounded px-1 py-0.5 leading-none">K</kbd>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-xl border border-border/50 overflow-hidden shadow-2xl"
          style={{ background: 'hsl(var(--background))', minWidth: 320, maxWidth: 480 }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="text-xs text-muted-foreground">No results for <strong className="text-foreground">"{query}"</strong></p>
              <p className="text-[10px] text-muted-foreground/50 mt-1">Try a different keyword or category</p>
            </div>
          ) : (
            <>
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
                <span className="text-[9px] text-muted-foreground/40">↑↓ navigate · Enter select</span>
              </div>
              <div ref={listRef} className="px-1.5 pb-1.5 max-h-[360px] overflow-y-auto space-y-0.5">
                {results.map((hit, i) => (
                  <ResultRow
                    key={`${hit.type}-${hit.id}`}
                    hit={hit}
                    q={query.trim()}
                    active={i === activeIdx}
                    onSelect={doSelect}
                  />
                ))}
              </div>
              <div className="px-3 py-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/40">Click any result to go directly</span>
                <button
                  onMouseDown={e => { e.preventDefault(); navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); setOpen(false); }}
                  className="text-[10px] font-semibold text-primary hover:underline"
                >
                  See all →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
