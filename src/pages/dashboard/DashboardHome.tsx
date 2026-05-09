import { Link } from 'react-router-dom';
import {
  MessageSquare, Image, Zap, Bot, Cpu, Video,
  GraduationCap, Wand2, Sparkles, Search, ArrowRight,
  BookOpen, Heart, TrendingUp, Flame, Newspaper, Star,
  Crown, Infinity, BriefcaseBusiness, Lock, Eye, Activity, Clock, Banana, Film,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { useContentCounts } from '@/hooks/useData';
import { useUserAnalytics } from '@/hooks/useAnalytics';
import { formatDistanceToNow, parseISO } from 'date-fns';

const STAT_DEFS = [
  { label: 'LLM Prompts', key: 'prompts' as const, icon: MessageSquare, to: '/dashboard/prompts', accent: '#60a5fa' },
  { label: 'Image Prompts', key: 'image_prompts' as const, icon: Image, to: '/dashboard/image-prompts', accent: '#a78bfa' },
  { label: 'GPT Image', key: 'gptimage_prompts' as const, icon: Wand2, to: '/dashboard/gptimage', accent: '#8b5cf6' },
  { label: 'Grok Imagine', key: 'grok_imagine_prompts' as const, icon: Sparkles, to: '/dashboard/grok-imagine', accent: '#06b6d4' },
  { label: 'Nano Banana', key: 'nano_banana_prompts' as const, icon: Banana, to: '/dashboard/nano-banana', accent: '#eab308' },
  { label: 'Seedance', key: 'seedance_prompts' as const, icon: Film, to: '/dashboard/seedance', accent: '#f97316' },
  { label: 'Claude Skills', key: 'claude_skills' as const, icon: Bot, to: '/dashboard/claude-skills', accent: '#22d3ee' },
  { label: 'Automation', key: 'automation_templates' as const, icon: Zap, to: '/dashboard/automation', accent: '#facc15' },
  { label: 'Custom GPTs', key: 'custom_gpts' as const, icon: Cpu, to: '/dashboard/custom-gpts', accent: '#f472b6' },
  { label: 'Videos', key: 'videos' as const, icon: Video, to: '/dashboard/videos', accent: '#ec4899' },
  { label: 'Starter Kit', key: 'ai_starter_kit_prompts' as const, icon: BriefcaseBusiness, to: '/dashboard/ai-starter-kit', accent: '#fb923c' },
  { label: 'Guides', key: 'guides' as const, icon: GraduationCap, to: '/dashboard/fundamentals', accent: '#fbbf24' },
];

const TOOLS = [
  {
    to: '/dashboard/ai-starter-kit',
    icon: BriefcaseBusiness,
    label: 'AI Starter Kit',
    desc: '450 prompts and 20 Claude skills for solopreneurs',
    accent: '#f59e0b',
    badge: 'New',
  },
  {
    to: '/dashboard/search',
    icon: Search,
    label: 'AI Search',
    desc: 'Search across all 1,167 resources',
    accent: 'hsl(var(--primary))',
    badge: 'Most used',
  },
  {
    to: '/dashboard/prompt-enhancer',
    icon: Wand2,
    label: 'Prompt Enhancer',
    desc: 'Turn basic prompts into expert-level ones',
    accent: 'hsl(var(--accent))',
    badge: null,
  },
  {
    to: '/dashboard/image-enhancer',
    icon: Sparkles,
    label: 'Image Enhancer',
    desc: 'Build optimised Midjourney & DALL·E prompts',
    accent: '#a78bfa',
    badge: null,
  },
  {
    to: '/dashboard/favorites',
    icon: Heart,
    label: 'Favorites',
    desc: 'Your personally curated collection',
    accent: '#f87171',
    badge: null,
  },
  {
    to: '/dashboard/ai-news',
    icon: Newspaper,
    label: 'AI News Feed',
    desc: 'Daily AI news from the dev community',
    accent: '#38bdf8',
    badge: 'Live',
  },
];

const BROWSE_DEFS = [
  { to: '/dashboard/prompts', icon: MessageSquare, label: 'LLM Prompts', countKey: 'prompts' as const, desc: 'ChatGPT · Claude · Gemini', accent: '#60a5fa' },
  { to: '/dashboard/image-prompts', icon: Image, label: 'Image Prompts', countKey: 'image_prompts' as const, desc: 'Midjourney · DALL·E · Flux', accent: '#a78bfa' },
  { to: '/dashboard/gptimage', icon: Wand2, label: 'GPT Image Prompts', countKey: 'gptimage_prompts' as const, desc: 'OpenAI GPT Image', accent: '#8b5cf6' },
  { to: '/dashboard/grok-imagine', icon: Sparkles, label: 'Grok Imagine', countKey: 'grok_imagine_prompts' as const, desc: 'xAI Grok Image', accent: '#06b6d4' },
  { to: '/dashboard/nano-banana', icon: Banana, label: 'Nano Banana', countKey: 'nano_banana_prompts' as const, desc: '12K+ Image Prompts', accent: '#eab308' },
  { to: '/dashboard/seedance', icon: Film, label: 'Seedance', countKey: 'seedance_prompts' as const, desc: 'AI Video Prompts', accent: '#f97316' },
  { to: '/dashboard/claude-skills', icon: Bot, label: 'Claude Skills', countKey: 'claude_skills' as const, desc: 'Claude Code Commands', accent: '#22d3ee' },
  { to: '/dashboard/automation', icon: Zap, label: 'Automation', countKey: 'automation_templates' as const, desc: 'n8n · Zapier · Make', accent: '#facc15' },
  { to: '/dashboard/custom-gpts', icon: Cpu, label: 'Custom GPTs', countKey: 'custom_gpts' as const, desc: 'ChatGPT Configs', accent: '#f472b6' },
  { to: '/dashboard/ai-starter-kit', icon: BriefcaseBusiness, label: 'Starter Kit', countKey: 'ai_starter_kit_prompts' as const, desc: 'Prompts & Skills', accent: '#fb923c' },
  { to: '/dashboard/videos', icon: Video, label: 'Videos', countKey: 'videos' as const, desc: 'Video Tutorials', accent: '#ec4899' },
  { to: '/dashboard/fundamentals', icon: GraduationCap, label: 'Guides', countKey: 'guides' as const, desc: 'AI Education', accent: '#fbbf24' },
  { to: '/dashboard/ai-models', icon: Star, label: 'AI Model Picks', countKey: null, staticCount: 13 as const, desc: 'Best Models', accent: '#f59e0b' },
];

type StatDef = typeof STAT_DEFS[number];

function StatCard({ label, icon: Icon, to, accent, value }: StatDef & { value: number | null }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/90 transition-all duration-200 text-center relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at top, ${accent}08 0%, transparent 70%)` }}
      />
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon style={{ height: 18, width: 18, color: accent }} />
      </div>
      <div>
        <div className="text-2xl font-black leading-none tabular-nums" style={{ color: accent }}>
          {value == null ? (
            <span className="inline-block w-10 h-6 rounded bg-secondary/50 animate-pulse" />
          ) : value.toLocaleString()}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 leading-none">{label}</div>
      </div>
    </Link>
  );
}

function ToolCard({ to, icon: Icon, label, desc, accent, badge }: typeof TOOLS[number]) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/90 transition-all duration-200 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at left, ${accent}06 0%, transparent 60%)` }}
      />
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 relative"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon style={{ height: 20, width: 20, color: accent }} />
      </div>
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-none">
            {label}
          </span>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-none truncate">{desc}</p>
      </div>
      <ArrowRight
        className="text-muted-foreground/30 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all shrink-0 relative"
        style={{ height: 14, width: 14 }}
      />
    </Link>
  );
}

function BrowseCard({ to, icon: Icon, label, count, desc, accent }: Omit<typeof BROWSE[number], 'count'> & { count: number | string }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-4 rounded-2xl border border-border/40 bg-card/50 hover:border-border/80 hover:bg-card/90 transition-all duration-200 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(ellipse at top-left, ${accent}07 0%, transparent 60%)` }}
      />
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 relative"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon style={{ height: 18, width: 18, color: accent }} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-none">
            {label}
          </span>
          <span
            className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full leading-none"
            style={{ background: `${accent}18`, color: accent }}
          >
            {count}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-none">{desc}</p>
      </div>
    </Link>
  );
}

function SectionHeading({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub?: string }) {
  return (
    <div className="flex items-end gap-3 mb-5">
      <div className="flex items-center gap-2">
        <Icon className="text-primary" style={{ height: 16, width: 16 }} />
        <h2 className="text-[15px] font-bold text-foreground">{label}</h2>
      </div>
      {sub && <span className="text-[11px] text-muted-foreground mb-0.5">{sub}</span>}
    </div>
  );
}

const TYPE_EMOJI: Record<string, string> = {
  llm_prompt: '💬', image_prompt: '🎨', claude_skill: '⚡',
  claude_skill_bundle: '📦', guide: '📖', automation: '🔄',
  custom_gpt: '🤖', video: '🎬',
};

function UserAnalytics({ userId }: { userId: string }) {
  const { data, isLoading } = useUserAnalytics(userId);

  if (isLoading) return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-7 rounded-lg bg-border/20 animate-pulse" />)}
    </div>
  );

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 space-y-4">
      {/* Stat pills */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/40 border border-border/30">
          <Eye style={{ height: 14, width: 14, color: '#60a5fa' }} />
          <span className="text-xl font-black tabular-nums text-[#60a5fa]">{data.total_viewed.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground">Total viewed</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/40 border border-border/30">
          <Activity style={{ height: 14, width: 14, color: '#a78bfa' }} />
          <span className="text-xl font-black tabular-nums text-[#a78bfa]">{data.this_week.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground">This week</span>
        </div>
      </div>

      {/* Top categories */}
      {data.top_categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Your top categories</p>
          {data.top_categories.map(c => (
            <div key={c.category} className="flex items-center gap-2 text-xs">
              <span className="truncate flex-1 text-foreground/80">{c.category}</span>
              <span className="font-bold tabular-nums text-primary">{c.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recently viewed */}
      {data.recently_viewed.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Recently viewed</p>
          {data.recently_viewed.map(r => (
            <div key={r.prompt_id + r.viewed_at} className="flex items-center gap-2">
              <span className="text-sm shrink-0">{TYPE_EMOJI[r.prompt_type] ?? '📄'}</span>
              <span className="text-xs text-foreground/80 truncate flex-1">{r.prompt_title}</span>
              <span className="text-[10px] text-muted-foreground/50 shrink-0 flex items-center gap-1">
                <Clock style={{ height: 9, width: 9 }} />
                {formatDistanceToNow(parseISO(r.viewed_at), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const { user, subType, daysLeft } = useAuth();
  const { favorites } = useFavorites();
  const { data: counts } = useContentCounts();

  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (user?.name?.trim() || '').split(' ')[0] || 'there';

  const totalResources = counts
    ? Object.values(counts).reduce((a, b) => a + b, 0)
    : null;

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 sm:space-y-10">

      {/* Hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
        style={{
          background: 'var(--dash-hero-bg)',
          border: '1px solid var(--dash-hero-border)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'hsl(var(--accent))' }} />
        <div className="absolute top-8 left-1/3 h-32 w-32 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: 'hsl(220 80% 60%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary/70 mb-2">{greeting}</p>
            <h1 className="text-3xl sm:text-4xl font-black leading-[1.1] text-foreground">
              Welcome back,{' '}
              <span
                className="inline-block"
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {firstName}
              </span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
              You have access to{' '}
              <strong className="text-foreground font-semibold">
                {totalResources != null ? `${totalResources.toLocaleString()} AI resources` : 'thousands of AI resources'}
              </strong>{' '}
              across 13 categories.
              {favorites.length > 0 && (
                <> You've saved <strong className="text-foreground">{favorites.length}</strong> favourite{favorites.length !== 1 ? 's' : ''}.</>
              )}
            </p>

            {/* Subscription badge */}
            {subType && (
              <div className="mt-3 inline-flex items-center gap-2">
                {subType === 'lifetime' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    <Crown style={{ height: 11, width: 11 }} />
                    Lifetime Pro
                    <Infinity style={{ height: 10, width: 10 }} />
                  </span>
                )}
                {subType === 'monthly' && daysLeft !== null && (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${daysLeft <= 5 ? 'bg-red-500/15 text-red-400 border-red-500/20' : daysLeft <= 14 ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-primary/15 text-primary border-primary/20'}`}>
                    <Crown style={{ height: 11, width: 11 }} />
                    Monthly Pro · {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                  </span>
                )}
                {subType === 'manual' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <Crown style={{ height: 11, width: 11 }} />
                    Pro Member
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CTA strip */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <Link
              to="/dashboard/prompts"
              className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              <Flame style={{ height: 14, width: 14 }} />
              Browse Prompts
              <ArrowRight style={{ height: 13, width: 13 }} className="ml-auto hidden sm:block" />
            </Link>
            <Link
              to="/dashboard/search"
              className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-medium text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-all"
            >
              <Search style={{ height: 14, width: 14 }} />
              AI Search
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section>
        <SectionHeading icon={TrendingUp} label="Content Library" sub="Click any card to browse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {STAT_DEFS.map((s) => (
            <StatCard key={s.to} {...s} value={counts ? counts[s.key] : null} />
          ))}
        </div>
      </section>

      {/* User personal analytics */}
      {user && (
        <section>
          <SectionHeading icon={Activity} label="Your Activity" sub="Your personal usage stats" />
          <UserAnalytics userId={user.id} />
        </section>
      )}

      {/* Live analytics */}
      <AnalyticsSection />

      {/* Quick tools */}
      <section>
        <SectionHeading icon={Sparkles} label="Quick Tools" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOOLS.map((t) => <ToolCard key={t.to} {...t} />)}
        </div>
      </section>

      {/* Browse */}
      <section>
        <SectionHeading icon={BookOpen} label="Browse Content" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BROWSE_DEFS.map((b) => (
            <BrowseCard
              key={b.to}
              {...b}
              count={b.countKey && counts ? counts[b.countKey] : (b.staticCount ?? 0)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
