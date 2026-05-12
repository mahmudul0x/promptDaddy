import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  to: string;
  state?: unknown;
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; to: string }> = {
  prompt:          { label: 'LLM Prompt',    icon: MessageSquare, color: '#60a5fa', to: '/dashboard/prompts' },
  image_prompt:    { label: 'Image Prompt',  icon: Image,         color: '#a78bfa', to: '/dashboard/image-prompts' },
  video:           { label: 'Video',         icon: Video,         color: '#ec4899', to: '/dashboard/videos' },
  guide:           { label: 'Guide',         icon: GraduationCap, color: '#fbbf24', to: '/dashboard/fundamentals' },
  automation:      { label: 'Automation',    icon: Zap,           color: '#facc15', to: '/dashboard/automation' },
  claude_skill:    { label: 'Claude Skill',  icon: Bot,           color: '#22d3ee', to: '/dashboard/claude-skills' },
  custom_gpt:      { label: 'Custom GPT',    icon: Cpu,           color: '#f472b6', to: '/dashboard/custom-gpts' },
  gptimage_prompt: { label: 'GPT Image',     icon: Wand2,         color: '#8b5cf6', to: '/dashboard/gptimage' },
  grok_prompt:     { label: 'Grok Imagine',  icon: Sparkles,      color: '#06b6d4', to: '/dashboard/grok-imagine' },
  nano_prompt:     { label: 'Nano Banana',   icon: Banana,        color: '#eab308', to: '/dashboard/nano-banana' },
  seedance_prompt: { label: 'Seedance',      icon: Film,          color: '#f97316', to: '/dashboard/seedance' },
  webpage_prompt:  { label: 'Webpage',       icon: Globe,         color: '#60a5fa', to: '/dashboard/webpage-prompts' },
};

/* ── build flat hit list from RQ cache ───────────────────── */
function buildHits(qc: ReturnType<typeof useQueryClient>): Hit[] {
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
  push((qc.getQueryData(['prompts'])              as unknown[]) ?? [], 'prompt');
  push((qc.getQueryData(['image_prompts'])         as unknown[]) ?? [], 'image_prompt');
  push((qc.getQueryData(['videos'])               as unknown[]) ?? [], 'video');
  push((qc.getQueryData(['guides'])               as unknown[]) ?? [], 'guide');
  push((qc.getQueryData(['custom_gpts'])          as unknown[]) ?? [], 'custom_gpt');
  push((qc.getQueryData(['automation_templates']) as unknown[]) ?? [], 'automation');
  push((qc.getQueryData(['claude_skills'])        as unknown[]) ?? [], 'claude_skill');
  push((qc.getQueryData(['gptimage_prompts'])     as unknown[]) ?? [], 'gptimage_prompt');
  push((qc.getQueryData(['grok_imagine_prompts']) as unknown[]) ?? [], 'grok_prompt');
  push((qc.getQueryData(['nano_banana_prompts'])  as unknown[]) ?? [], 'nano_prompt');
  push((qc.getQueryData(['seedance_prompts'])     as unknown[]) ?? [], 'seedance_prompt');
  push((qc.getQueryData(['webpage_prompts'])      as unknown[]) ?? [], 'webpage_prompt');
  return hits;
}

function useAllHits(): Hit[] {
  const qc = useQueryClient();
  const [hits, setHits] = useState<Hit[]>(() => buildHits(qc));

  useEffect(() => {
    // rebuild whenever any query in the cache updates
    const unsub = qc.getQueryCache().subscribe(() => {
      setHits(buildHits(qc));
    });
    return unsub;
  }, [qc]);

  return hits;
}

/* ── score hit against query ─────────────────────────────── */
function score(hit: Hit, q: string): number {
  const tl = hit.title.toLowerCase();
  const cl = (hit.category ?? '').toLowerCase();
  const tagl = (hit.tags ?? []).join(' ').toLowerCase();
  const dl = (hit.description ?? '').toLowerCase();
  if (tl === q) return 100;
  if (tl.startsWith(q)) return 80;
  if (tl.includes(q)) return 60;
  if (cl.includes(q)) return 40;
  if (tagl.includes(q)) return 30;
  if (dl.includes(q)) return 20;
  return 0;
}

/* ── highlight match ─────────────────────────────────────── */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm px-0.5 not-italic">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/* ── result row ──────────────────────────────────────────── */
function ResultRow({ hit, q, active, onSelect }: {
  hit: Hit; q: string; active: boolean; onSelect: (h: Hit) => void;
}) {
  const meta = TYPE_META[hit.type];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onSelect(hit); }}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-lg',
        active ? 'bg-primary/10' : 'hover:bg-white/[0.05]',
      )}
    >
      <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}28` }}>
        <Icon style={{ height: 13, width: 13, color: meta.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-foreground leading-none truncate">
          <Highlight text={hit.title} q={q} />
        </p>
        {hit.category && (
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-none flex items-center gap-0.5">
            <Hash style={{ height: 8, width: 8 }} />
            <Highlight text={hit.category} q={q} />
          </p>
        )}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 leading-none"
        style={{ background: `${meta.color}18`, color: meta.color }}>
        {meta.label}
      </span>
      {active && <ArrowRight style={{ height: 11, width: 11 }} className="text-primary shrink-0" />}
    </button>
  );
}

/* ══ GlobalSearch ════════════════════════════════════════════ */
export function GlobalSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const allHits = useAllHits();

  /* position the portal dropdown below the input */
  const updatePos = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDropPos({ top: r.bottom + 6, left: r.left, width: r.width });
  }, []);

  /* Ctrl/Cmd+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        updatePos();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [updatePos]);

  /* reposition on scroll/resize */
  useEffect(() => {
    if (!open) return;
    const update = () => updatePos();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, updatePos]);

  /* scored results — max 10 */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return allHits
      .map(h => ({ hit: h, sc: score(h, q) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 10)
      .map(x => x.hit);
  }, [allHits, query]);

  useEffect(() => { setActiveIdx(0); }, [results]);

  const doSelect = useCallback((hit: Hit) => {
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    navigate(hit.to, { state: hit.state });
    onNavigate?.();
  }, [navigate, onNavigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter' && results[activeIdx]) { e.preventDefault(); doSelect(results[activeIdx]); return; }
    if (e.key === 'Escape')    { setOpen(false); inputRef.current?.blur(); }
  };

  /* scroll active row into view */
  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const showDropdown = open && query.trim().length >= 1 && dropPos;

  /* ── render ── */
  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0 max-w-sm mx-auto">
      {/* Input bar */}
      <div
        className="relative flex items-center h-8 rounded-lg transition-all duration-150"
        style={{
          background: open ? 'hsl(var(--muted))' : 'hsl(var(--secondary))',
          border: `1px solid ${open ? 'hsl(var(--primary) / 0.45)' : 'hsl(var(--border))'}`,
          boxShadow: open ? '0 0 0 3px hsl(var(--primary) / 0.08)' : 'none',
        }}
      >
        <Search className="absolute left-2.5 text-muted-foreground/50 pointer-events-none" style={{ height: 13, width: 13 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); updatePos(); setOpen(true); }}
          onFocus={() => { updatePos(); setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder="Search everything…"
          className="w-full bg-transparent pl-8 pr-14 text-[12.5px] text-foreground placeholder:text-muted-foreground/40 outline-none"
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
          <div className="absolute right-2 pointer-events-none">
            <kbd className="text-[9px] text-muted-foreground/35 font-mono bg-white/[0.04] border border-border/30 rounded px-1 py-0.5 leading-none">K</kbd>
          </div>
        )}
      </div>

      {/* Portal dropdown — renders above all content */}
      {showDropdown && createPortal(
        <div
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            width: Math.max(dropPos.width, 340),
            zIndex: 99999,
            background: 'hsl(var(--background))',
          }}
          className="rounded-xl border border-border/60 shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-hidden"
          onMouseDown={e => e.preventDefault()}
        >
            {results.length === 0 ? (
              <div className="px-4 py-4 text-center">
                <p className="text-xs text-muted-foreground">No results for <strong className="text-foreground">"{query}"</strong></p>
                <p className="text-[10px] text-muted-foreground/40 mt-1">Try a different keyword</p>
              </div>
            ) : (
              <>
                <div className="px-3 pt-2.5 pb-1 flex items-center justify-between border-b border-border/20">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-[9px] text-muted-foreground/35">↑↓ move · Enter open · Esc close</span>
                </div>
                <div ref={listRef} className="px-1.5 py-1.5 max-h-[340px] overflow-y-auto space-y-0.5">
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
                <div className="px-3 py-2 border-t border-border/20 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/35">Click to navigate directly</span>
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
                      setQuery(''); setOpen(false);
                    }}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    See all →
                  </button>
                </div>
              </>
            )}
        </div>,
        document.body
      )}
    </div>
  );
}
