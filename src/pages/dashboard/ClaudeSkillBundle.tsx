import { useState, useMemo } from 'react';
import { Package, Download, Bot, HardDrive, Wrench, X, Heart, CheckCircle2, Layers, ChevronDown, Terminal, Globe, Lightbulb, Zap, BookOpen, Info } from 'lucide-react';
import { useClaudeSkillBundle } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { ClaudeSkillBundleItem } from '@/data/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'AI & Technology':             'bg-indigo-500/15 text-indigo-400',
  'Ads & Paid Media':            'bg-orange-500/15 text-orange-400',
  'Analytics & Data':            'bg-teal-500/15 text-teal-400',
  'Branding & Design':           'bg-purple-500/15 text-purple-400',
  'Client & Consulting':         'bg-amber-500/15 text-amber-400',
  'Content & Copywriting':       'bg-pink-500/15 text-pink-400',
  'Courses & Education':         'bg-green-500/15 text-green-400',
  'E-commerce & Products':       'bg-emerald-500/15 text-emerald-400',
  'Email Marketing & Automation':'bg-red-500/15 text-red-400',
  'Events & Speaking':           'bg-violet-500/15 text-violet-400',
  'Finance & Pricing':           'bg-cyan-500/15 text-cyan-400',
  'HR & Team':                   'bg-yellow-500/15 text-yellow-400',
  'Industry-Specific':           'bg-slate-500/15 text-slate-400',
  'Launch & Growth':             'bg-lime-500/15 text-lime-400',
  'Legal & Compliance':          'bg-gray-500/15 text-gray-400',
  'Nonprofit & Community':       'bg-rose-500/15 text-rose-400',
  'Operations & Systems':        'bg-blue-500/15 text-blue-400',
  'SEO & Search':                'bg-orange-400/15 text-orange-300',
  'Sales & Funnels':             'bg-green-400/15 text-green-300',
  'Social Media':                'bg-sky-500/15 text-sky-400',
};

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  'AI & Technology':             ['#6366f1', '#4f46e5'],
  'Ads & Paid Media':            ['#f97316', '#ea580c'],
  'Analytics & Data':            ['#14b8a6', '#0d9488'],
  'Branding & Design':           ['#a855f7', '#9333ea'],
  'Client & Consulting':         ['#f59e0b', '#d97706'],
  'Content & Copywriting':       ['#ec4899', '#db2777'],
  'Courses & Education':         ['#22c55e', '#16a34a'],
  'E-commerce & Products':       ['#10b981', '#059669'],
  'Email Marketing & Automation':['#ef4444', '#dc2626'],
  'Events & Speaking':           ['#8b5cf6', '#7c3aed'],
  'Finance & Pricing':           ['#06b6d4', '#0891b2'],
  'HR & Team':                   ['#eab308', '#ca8a04'],
  'Industry-Specific':           ['#94a3b8', '#64748b'],
  'Launch & Growth':             ['#84cc16', '#65a30d'],
  'Legal & Compliance':          ['#6b7280', '#4b5563'],
  'Nonprofit & Community':       ['#f43f5e', '#e11d48'],
  'Operations & Systems':        ['#3b82f6', '#2563eb'],
  'SEO & Search':                ['#fb923c', '#f97316'],
  'Sales & Funnels':             ['#4ade80', '#22c55e'],
  'Social Media':                ['#38bdf8', '#0ea5e9'],
};

const ACRONYMS = new Set(['ai', 'seo', 'roi', 'crm', 'cta', 'kpi', 'b2b', 'b2c', 'hr', 'api', 'saas', 'gtm', 'pr']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSkillAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}&backgroundColor=transparent`;
}

function formatSkillName(name: string): string {
  return name.split('-').map(w =>
    ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

function getCatGrad(cat: string): [string, string] {
  return CATEGORY_GRADIENTS[cat] ?? ['#6366f1', '#4f46e5'];
}

function getCatColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? 'bg-violet-500/15 text-violet-400';
}

function parseDescription(b64: string): string {
  try {
    const text = atob(b64);
    const m = text.match(/description:\s*"([^"]+)"/);
    return m?.[1]?.trim() ?? '';
  } catch {
    return '';
  }
}

function downloadSkillMd(skill: ClaudeSkillBundleItem) {
  try {
    const content = atob(skill.md_content_b64);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Skill download failed', e);
  }
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  name,
  count,
  isActive,
  onClick,
}: {
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [from, to] = getCatGrad(name);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 w-full rounded-xl border px-3.5 py-3 text-left transition-all duration-200',
        isActive
          ? 'border-primary/40 bg-primary/8 shadow-[0_0_16px_hsl(var(--primary)/0.12)]'
          : 'border-border/40 bg-card/50 hover:border-border/70 hover:bg-card/80',
      )}
    >
      <div
        className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: isActive ? `0 0 12px ${from}55` : `0 2px 8px ${from}33`,
        }}
      >
        <Layers style={{ width: 14, height: 14, color: '#fff' }} />
      </div>

      <span className={cn(
        'flex-1 text-[12px] font-medium leading-snug truncate transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
      )}>
        {name}
      </span>

      <span className={cn(
        'shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full leading-none transition-colors',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'bg-secondary text-muted-foreground group-hover:bg-secondary/80',
      )}>
        {count}
      </span>

      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
        />
      )}
    </button>
  );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────

function SkillBundleCard({
  skill,
  description,
  onClick,
}: {
  skill: ClaudeSkillBundleItem;
  description: string;
  onClick: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(skill.id);
  const [from, to] = getCatGrad(skill.category);
  const displayName = formatSkillName(skill.name);
  const catColor = getCatColor(skill.category);

  return (
    <div
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-border/40 bg-card/60 overflow-hidden cursor-pointer hover:border-primary/30 hover:bg-card/90 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.08)] transition-all duration-200"
    >
      <div
        className="relative h-24 flex items-center justify-center overflow-hidden shrink-0"
        style={{ background: `linear-gradient(135deg, ${from}14 0%, ${to}28 100%)` }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${from}16 1px, transparent 1px), linear-gradient(90deg, ${from}16 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${from}1a 0%, transparent 65%)` }}
        />
        <img
          src={getSkillAvatar(skill.name)}
          alt={displayName}
          className="relative h-14 w-14 rounded-xl transition-transform duration-300 group-hover:scale-110 shrink-0"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 4px 16px ${from}55` }}
        />
        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-black/50 backdrop-blur-sm text-white/60 px-1.5 py-0.5 rounded">
          v{skill.version}
        </span>
        <span className="absolute bottom-2 right-2 flex items-center gap-0.5 text-[9px] text-white/35">
          <HardDrive style={{ width: 8, height: 8 }} />
          {skill.file_size_kb}KB
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <span className={cn('self-start text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none', catColor)}>
          {skill.category}
        </span>
        <h3 className="font-semibold text-[13px] text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {displayName}
        </h3>
        {description ? (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground/40 italic">Claude Code slash command</p>
        )}

        {skill.allowed_tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {skill.allowed_tools.slice(0, 4).map(tool => (
              <span
                key={tool}
                className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded"
              >
                <Wrench style={{ width: 7, height: 7 }} />
                {tool}
              </span>
            ))}
            {skill.allowed_tools.length > 4 && (
              <span className="text-[9px] text-muted-foreground/40">+{skill.allowed_tools.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3.5 pb-3 pt-2.5 border-t border-white/[0.04]">
        <button
          onClick={e => { e.stopPropagation(); downloadSkillMd(skill); }}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Download style={{ width: 11, height: 11 }} />
          Download .md
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            toggleFavorite({ id: skill.id, type: 'claude_skill', title: displayName, description, category: skill.category });
          }}
          className={cn('p-1.5 rounded-full transition-all', favorited ? 'text-red-400' : 'text-muted-foreground hover:text-red-400')}
        >
          <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
        </button>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function SkillModal({ skill, description, onClose }: { skill: ClaudeSkillBundleItem; description: string; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);
  const [from, to] = getCatGrad(skill.category);
  const displayName = formatSkillName(skill.name);
  const catColor = getCatColor(skill.category);

  const mdContent = useMemo(() => {
    try { return atob(skill.md_content_b64); } catch { return ''; }
  }, [skill.md_content_b64]);

  const handleDownload = () => {
    downloadSkillMd(skill);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border/60 bg-card shadow-elegant overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 p-5 border-b border-border/50 shrink-0">
          <div
            className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 4px 16px ${from}55` }}
          >
            <Bot style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none', catColor)}>
                {skill.category}
              </span>
              <span className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                v{skill.version}
              </span>
            </div>
            <h2 className="font-bold text-base text-foreground leading-snug">{displayName}</h2>
            {description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div className="flex items-center gap-5 px-5 py-2.5 border-b border-border/30 bg-secondary/20 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <HardDrive style={{ width: 11, height: 11 }} />
            {skill.file_size_kb} KB
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Wrench style={{ width: 11, height: 11 }} />
            {skill.allowed_tools.join(', ')}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
          <pre className="text-[11px] font-mono text-foreground/70 whitespace-pre-wrap leading-relaxed break-words">
            {mdContent}
          </pre>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-border/50 shrink-0 bg-secondary/20">
          <p className="text-[11px] text-muted-foreground">
            By <span className="text-foreground/70">{skill.author}</span>
          </p>
          <Button
            onClick={handleDownload}
            className="gap-2 text-sm bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {downloaded ? (
              <><CheckCircle2 style={{ width: 14, height: 14 }} /> Downloaded!</>
            ) : (
              <><Download style={{ width: 14, height: 14 }} /> Download SKILL.md</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Quickstart Guide Modal ───────────────────────────────────────────────────

function QuickstartGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border/60 bg-card shadow-elegant overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-border/50 shrink-0">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-500/15 border border-violet-500/25">
            <Info style={{ width: 18, height: 18, color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-foreground">How to Use Claude Skills</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Get up and running in under 2 minutes</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Step strip */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border/40 bg-secondary/20 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { n: '1', label: 'Download skills below' },
            { n: '2', label: 'Install on your platform' },
            { n: '3', label: 'Describe what you need' },
            { n: '4', label: 'Claude does the rest' },
          ].map((step, i) => (
            <div key={step.n} className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/50">
                <span className="h-5 w-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">
                  {step.n}
                </span>
                <span className="text-[12px] font-medium text-foreground whitespace-nowrap">{step.label}</span>
              </div>
              {i < 3 && <ChevronDown className="rotate-[-90deg] text-muted-foreground/30 shrink-0" style={{ width: 14, height: 14 }} />}
            </div>
          ))}
        </div>

        {/* 3 cards */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Card 1 — Installation */}
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Terminal style={{ width: 15, height: 15, color: '#60a5fa' }} />
                </div>
                <span className="text-[13px] font-bold text-foreground">Installation</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe style={{ width: 10, height: 10, color: '#a78bfa' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Claude.ai (Web)</span>
                  </div>
                  <ol className="space-y-1.5">
                    {[
                      'Open claude.ai → Profile icon',
                      'Go to Customize → Skills',
                      'Upload the skill folders',
                      'Claude auto-detects them',
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                        <span className="text-violet-400/70 font-mono shrink-0 mt-px text-[11px]">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="h-px bg-border/40" />

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Terminal style={{ width: 10, height: 10, color: '#60a5fa' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Claude Code (CLI)</span>
                  </div>
                  <div className="rounded-lg bg-black/25 border border-border/40 p-3 font-mono text-[11px] text-emerald-400/80 leading-relaxed">
                    <div className="text-muted-foreground/40 text-[10px]"># Global (all projects)</div>
                    <div className="mt-0.5">cp -r skills/* ~/.claude/skills/</div>
                    <div className="mt-2 text-muted-foreground/40 text-[10px]"># Single project only</div>
                    <div className="mt-0.5">cp -r skills/* .claude/skills/</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 — How to Use */}
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Zap style={{ width: 15, height: 15, color: '#34d399' }} />
                </div>
                <span className="text-[13px] font-bold text-foreground">How to Use</span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Auto Detection</p>
                  <p className="text-[12px] text-muted-foreground mb-2.5">Just describe what you need — Claude picks the right skill automatically.</p>
                  <div className="space-y-2">
                    {[
                      { prompt: '"Write a blog post about…"', skill: 'blog-post skill' },
                      { prompt: '"I need a freelance contract"', skill: 'contract-writer' },
                      { prompt: '"Plan a product launch"', skill: 'launch-checklist' },
                    ].map((ex, i) => (
                      <div key={i} className="rounded-lg bg-black/15 border border-border/30 px-3 py-2">
                        <p className="text-[11px] text-foreground/75 italic">{ex.prompt}</p>
                        <p className="text-[10px] text-emerald-400/80 mt-0.5">→ triggers {ex.skill}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2">Slash Commands (Claude Code)</p>
                  <div className="rounded-lg bg-black/25 border border-border/40 p-3 font-mono text-[11px] text-sky-400/80 leading-relaxed space-y-1">
                    {['/blog-post', '/email-sequence', '/sales-funnel-builder', '/contract-writer', '/sop-builder'].map(cmd => (
                      <div key={cmd}>{cmd}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 — How Skills Work + Tips */}
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <Lightbulb style={{ width: 15, height: 15, color: '#fbbf24' }} />
                </div>
                <span className="text-[13px] font-bold text-foreground">How Skills Work</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { step: 'Discovery', desc: 'Asks targeted questions about your situation', color: '#60a5fa' },
                  { step: 'Framework', desc: 'Applies proven methods (PAS, AIDA, etc.)', color: '#a78bfa' },
                  { step: 'Output', desc: 'Delivers polished, ready-to-use results', color: '#34d399' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                      style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground leading-none mb-0.5">{item.step}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border/40" />

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen style={{ width: 11, height: 11, color: '#fbbf24' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Pro Tips</span>
                </div>
                <ul className="space-y-2">
                  {[
                    'Start with the categories you need today — no need to install all 500+',
                    'Skills stack — blog post → social repurpose → email promo',
                    'Each SKILL.md is plain Markdown — edit freely to match your brand',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                      <span className="text-amber-400/60 shrink-0 mt-px">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ClaudeSkillBundle() {
  const { data, isLoading } = useClaudeSkillBundle();
  const skills = data?.skills ?? [];
  const meta = data?.meta;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<ClaudeSkillBundleItem | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const descriptions = useMemo(() => {
    const map: Record<string, string> = {};
    skills.forEach(s => { map[s.id] = s.description || parseDescription(s.md_content_b64); });
    return map;
  }, [skills]);

  const categories = useMemo(
    () => meta?.categories ?? [...new Set(skills.map(s => s.category))].sort(),
    [meta, skills]
  );

  const categoryCounts = useMemo(() => {
    if (meta?.category_counts) return meta.category_counts;
    const counts: Record<string, number> = {};
    skills.forEach(s => { counts[s.category] = (counts[s.category] ?? 0) + 1; });
    return counts;
  }, [meta, skills]);

  const filtered = useMemo(() => {
    let list = category === 'All' ? skills : skills.filter(s => s.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (descriptions[s.id] ?? '').toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [skills, search, category, descriptions]);

  const activeCatGrad = category !== 'All' ? getCatGrad(category) : ['#6366f1', '#8b5cf6'] as [string, string];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <PageHeader
        icon={Package}
        title="Claude Skill Bundle"
        description="501 ready-to-use Claude Code skills across 20 categories. Pick a category then download any SKILL.md file."
        count={skills.length || undefined}
        iconColor="text-violet-400"
      />

      {/* Stats */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Skills',  value: (meta?.total_skills ?? skills.length).toLocaleString() },
            { label: 'Categories',    value: meta?.total_categories ?? categories.length },
            { label: 'Version',       value: meta?.version ?? '2.0' },
            { label: 'Author',        value: 'Abin' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border/40 bg-card/40 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className="font-bold text-sm text-foreground mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Skills grid ────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            {category !== 'All' && (
              <div
                className="h-3 w-3 rounded-sm shrink-0"
                style={{ background: `linear-gradient(135deg, ${activeCatGrad[0]}, ${activeCatGrad[1]})` }}
              />
            )}
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 select-none">
              {category === 'All' ? 'All Skills' : category}
            </span>
          </div>
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-[11px] font-mono text-muted-foreground/40">{filtered.length} skills</span>
          <button
            onClick={() => setGuideOpen(true)}
            className="relative flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1.5 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_hsl(260_80%_65%/0.5)] animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
          >
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ background: 'linear-gradient(135deg, #8b5cf6, #818cf8)' }} />
            <Info style={{ width: 11, height: 11, position: 'relative' }} />
            <span style={{ position: 'relative' }}>How to Use</span>
          </button>
        </div>

        <div className="mb-5">
          <FilterBar
            search={search}
            onSearch={setSearch}
            categories={categories}
            activeCategory={category}
            onCategory={setCategory}
            placeholder="Search skills by name or category..."
            total={skills.length}
            filtered={filtered.length}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground">No skills found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(skill => (
              <SkillBundleCard
                key={skill.id}
                skill={skill}
                description={descriptions[skill.id] ?? ''}
                onClick={() => setSelected(skill)}
              />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <SkillModal
          skill={selected}
          description={descriptions[selected.id] ?? ''}
          onClose={() => setSelected(null)}
        />
      )}

      {guideOpen && <QuickstartGuideModal onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
