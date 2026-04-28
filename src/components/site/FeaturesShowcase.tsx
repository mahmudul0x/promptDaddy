import { Link } from "react-router-dom";
import {
  Bot, Image, TrendingUp, BriefcaseBusiness, MessageSquare,
  Sparkles, ArrowRight, Zap, Star, Copy, Eye, Lock,
  ChevronRight, Flame, Crown, CheckCircle, Wand2, Search,
  BookOpen, Cpu, Video, GraduationCap,
} from "lucide-react";

/* ── Shared primitives ─────────────────────────────────── */

function Badge({ children, color = "primary" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border"
      style={{
        background: `${color}18`,
        borderColor: `${color}35`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
      <span className="h-px w-6 bg-primary/50 inline-block" />
      {text}
    </p>
  );
}

function GlowOrb({ color, className }: { color: string; className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ background: color }}
    />
  );
}

/* ── 1. Prompt Library ─────────────────────────────────── */

const PROMPT_PILLS = [
  { label: "Content Writing", color: "#60a5fa" },
  { label: "SEO & Marketing", color: "#a78bfa" },
  { label: "Business Strategy", color: "#22d3ee" },
  { label: "Code & Dev", color: "#4ade80" },
  { label: "Design Briefs", color: "#f472b6" },
  { label: "Email Sequences", color: "#facc15" },
  { label: "Social Media", color: "#fb923c" },
  { label: "Research", color: "#f87171" },
];

const PROMPT_CARDS = [
  {
    title: "Viral LinkedIn Post Generator",
    category: "Social Media",
    badge: "Free",
    badgeColor: "#4ade80",
    views: "12.4k",
    icon: "💼",
  },
  {
    title: "Cold Email That Actually Converts",
    category: "Email",
    badge: "Pro",
    badgeColor: "#a78bfa",
    views: "9.8k",
    icon: "✉️",
  },
  {
    title: "SEO Blog Post Framework",
    category: "Marketing",
    badge: "Pro",
    badgeColor: "#a78bfa",
    views: "8.1k",
    icon: "📝",
  },
];

function PromptLibraryCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">prompt_library.tsx</span>
      </div>
      {/* Search */}
      <div className="px-4 pt-4 pb-3 border-b border-border/20">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/40">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground/60">Search 1,000+ prompts...</span>
        </div>
      </div>
      {/* Category pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-b border-border/20">
        {PROMPT_PILLS.map((p) => (
          <span
            key={p.label}
            className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
            style={{ background: `${p.color}18`, color: p.color }}
          >
            {p.label}
          </span>
        ))}
      </div>
      {/* Cards */}
      <div className="p-3 space-y-2">
        {PROMPT_CARDS.map((c, i) => (
          <div
            key={c.title}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/20 hover:border-border/50 transition-colors cursor-pointer group"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className="text-lg">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{c.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Eye className="h-3 w-3" />{c.views}
              </span>
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: `${c.badgeColor}20`, color: c.badgeColor }}
              >
                {c.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
          <Sparkles className="h-3 w-3" /> 1,000+ prompts — updated weekly
        </div>
      </div>
    </div>
  );
}

/* ── 2. Claude Skills ──────────────────────────────────── */

const SKILLS = [
  { emoji: "📊", name: "Data Analyst", desc: "SQL, charts, insights", color: "#60a5fa" },
  { emoji: "✍️", name: "Copywriter Pro", desc: "Sales copy that converts", color: "#a78bfa" },
  { emoji: "🎯", name: "SEO Strategist", desc: "Rankings & content plans", color: "#22d3ee" },
  { emoji: "💻", name: "Code Reviewer", desc: "Clean, secure, fast code", color: "#4ade80" },
  { emoji: "📧", name: "Email Expert", desc: "Cold outreach sequences", color: "#facc15" },
  { emoji: "🎨", name: "Brand Designer", desc: "Identity & style guides", color: "#f472b6" },
];

function ClaudeSkillsCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">claude_skills.tsx</span>
      </div>
      {/* Claude chat mock */}
      <div className="p-4 space-y-3 border-b border-border/20">
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">C</div>
          <div className="flex-1 px-3 py-2 rounded-xl bg-secondary/50 border border-border/20">
            <p className="text-[11px] text-foreground/80">/data-analyst Analyze my Q3 sales data and find the top 3 growth opportunities</p>
          </div>
        </div>
        <div className="flex items-start gap-2 flex-row-reverse">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
            <Bot className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-[11px] text-foreground/80">
              Activating <strong className="text-primary">Data Analyst</strong> skill... Analyzing your Q3 data →
              <span className="text-primary"> Revenue up 23%</span>, churn down in Enterprise tier,
              upsell opportunity in SMB segment worth ~$180k.
            </p>
          </div>
        </div>
      </div>
      {/* Skills grid */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {SKILLS.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-secondary/30 border border-border/20 hover:border-border/50 cursor-pointer transition-colors group"
          >
            <span className="text-base">{s.emoji}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{s.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3 pt-1 text-center">
        <span className="text-[10px] font-mono text-muted-foreground/50">100+ Claude Skills — one click deploy</span>
      </div>
    </div>
  );
}

/* ── 3. AI Starter Kit ─────────────────────────────────── */

const KIT_SECTIONS = [
  { icon: "🎯", name: "Client Acquisition", count: 48, color: "#60a5fa" },
  { icon: "✍️", name: "Content Creation", count: 62, color: "#a78bfa" },
  { icon: "💰", name: "Sales & Revenue", count: 55, color: "#4ade80" },
  { icon: "⚡", name: "Productivity", count: 71, color: "#facc15" },
  { icon: "🤖", name: "AI Automation", count: 44, color: "#f472b6" },
  { icon: "📈", name: "Growth & Scale", count: 38, color: "#22d3ee" },
];

function StarterKitCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">ai_starter_kit.tsx</span>
      </div>
      {/* Kit header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">AI Starter Kit</p>
            <p className="text-[10px] text-muted-foreground">450 prompts · 20 Claude Skills · for solopreneurs</p>
          </div>
          <div className="ml-auto">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-[10px] font-bold text-amber-400">NEW</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Your progress</span><span>12 / 450</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[3%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
          </div>
        </div>
      </div>
      {/* Sections */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {KIT_SECTIONS.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-2 px-2.5 py-2.5 rounded-lg bg-secondary/30 border border-border/20 hover:border-border/50 cursor-pointer transition-all group"
          >
            <span className="text-base">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{s.name}</p>
              <p className="text-[9px] text-muted-foreground">{s.count} prompts</p>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 4. Image Prompts ──────────────────────────────────── */

const IMG_CATEGORIES = [
  { label: "Product Photography", emoji: "📸", color: "#60a5fa" },
  { label: "UGC Style Photos", emoji: "🤳", color: "#a78bfa" },
  { label: "Social Media Graphics", emoji: "🎨", color: "#22d3ee" },
  { label: "Logo & Branding", emoji: "✨", color: "#f472b6" },
  { label: "Portraits & Headshots", emoji: "👤", color: "#4ade80" },
  { label: "Cinematic Scenes", emoji: "🎬", color: "#facc15" },
];

const IMG_PROMPT_DEMO = "cinematic close-up of [product], rim lighting, shallow depth of field, studio white background, commercial photography, 4K, ultra-realistic —ar 4:3 —style raw";

function ImagePromptCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">image_prompts.tsx</span>
      </div>
      {/* Image preview area */}
      <div className="relative h-36 bg-gradient-to-br from-violet-950/80 via-purple-900/60 to-pink-900/40 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 flex items-center justify-center gap-3 p-3">
          {[
            { bg: "from-violet-600 to-purple-800", label: "Studio Shot" },
            { bg: "from-pink-600 to-rose-800", label: "Lifestyle" },
            { bg: "from-blue-600 to-cyan-800", label: "Cinematic" },
          ].map((img) => (
            <div
              key={img.label}
              className={`flex-1 h-full rounded-xl bg-gradient-to-br ${img.bg} flex flex-col items-center justify-end pb-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
            >
              <span className="text-[9px] text-white/80 font-medium">{img.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <Image className="h-3 w-3 text-purple-400" />
          <span className="text-[9px] text-white/80 font-mono">500+ prompts</span>
        </div>
      </div>
      {/* Categories */}
      <div className="p-3 grid grid-cols-2 gap-1.5">
        {IMG_CATEGORIES.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-secondary/30 border border-border/20 cursor-pointer hover:border-border/50 transition-colors group"
          >
            <span className="text-sm">{c.emoji}</span>
            <span className="text-[10px] text-foreground/80 truncate group-hover:text-primary transition-colors">{c.label}</span>
          </div>
        ))}
      </div>
      {/* Prompt preview */}
      <div className="px-3 pb-3">
        <div className="rounded-lg bg-secondary/40 border border-border/20 px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest">prompt preview</span>
            <Copy className="h-3 w-3 text-muted-foreground/40" />
          </div>
          <p className="text-[10px] text-muted-foreground/70 font-mono leading-relaxed line-clamp-2">{IMG_PROMPT_DEMO}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Trending Prompts ───────────────────────────────── */

const TRENDING = [
  { rank: 1, title: "Viral Thread Writer", change: "+240%", hot: true, emoji: "🔥", color: "#f87171" },
  { rank: 2, title: "GPT-5 System Prompt", change: "+180%", hot: true, emoji: "⚡", color: "#facc15" },
  { rank: 3, title: "AI Image Branding Kit", change: "+120%", hot: false, emoji: "🎨", color: "#a78bfa" },
  { rank: 4, title: "Cold DM That Books Calls", change: "+95%", hot: false, emoji: "📩", color: "#60a5fa" },
  { rank: 5, title: "Resume ATS Optimizer", change: "+88%", hot: false, emoji: "📄", color: "#4ade80" },
];

function TrendingCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">trending_prompts.tsx</span>
      </div>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-bold text-foreground">This Week's Hot Picks</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
      {/* List */}
      <div className="p-2 space-y-1">
        {TRENDING.map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer transition-colors group"
          >
            <span className="text-[13px] font-black text-muted-foreground/30 w-4 text-right tabular-nums">{t.rank}</span>
            <span className="text-base">{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{t.title}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {t.hot && <Flame className="h-3 w-3 text-orange-400" />}
              <span className="text-[10px] font-bold text-emerald-400">{t.change}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Chart preview */}
      <div className="px-4 pb-4 pt-2">
        <div className="h-12 flex items-end gap-1">
          {[20, 35, 28, 55, 42, 68, 90, 75, 88, 100, 85, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: i >= 8
                  ? "linear-gradient(to top, #f59e0b, #f97316)"
                  : "hsl(var(--border) / 0.4)",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-mono text-muted-foreground/40">30 days ago</span>
          <span className="text-[9px] font-mono text-orange-400 font-bold">🔥 Now</span>
        </div>
      </div>
    </div>
  );
}

/* ── Feature Section wrapper ───────────────────────────── */

function FeatureSection({
  id, label, eyebrow, title, subtitle, description, bullets, ctaText, ctaHref,
  accentColor, card, flip = false,
}: {
  id?: string; label: string; eyebrow: string; title: string; subtitle: string;
  description: string; bullets: { icon: React.ElementType; text: string }[];
  ctaText: string; ctaHref: string; accentColor: string; card: React.ReactNode; flip?: boolean;
}) {
  return (
    <section id={id} className="relative py-24 sm:py-32 overflow-hidden">
      <GlowOrb color={`${accentColor}18`} className="w-[600px] h-[600px] -top-40 -left-40" />
      <GlowOrb color={`${accentColor}10`} className="w-[400px] h-[400px] bottom-0 right-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          {/* Text side */}
          <div>
            <SectionLabel text={eyebrow} />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
              {title}{" "}
              <span
                className="inline"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {subtitle}
              </span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{description}</p>

            <ul className="mt-6 space-y-3">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
                  >
                    <Icon className="h-3 w-3" style={{ color: accentColor }} />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to={ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}88)` }}
              >
                {ctaText} <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-muted-foreground">
                {label}
              </span>
            </div>
          </div>

          {/* Card side */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
            />
            <div className="relative">
              {card}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats bar ─────────────────────────────────────────── */

const STATS = [
  { value: "1,000+", label: "AI Prompts", icon: MessageSquare, color: "#60a5fa" },
  { value: "100+", label: "Claude Skills", icon: Bot, color: "#a78bfa" },
  { value: "500+", label: "Image Prompts", icon: Image, color: "#f472b6" },
  { value: "450+", label: "Starter Kit Items", icon: BriefcaseBusiness, color: "#facc15" },
  { value: "Weekly", label: "New Content", icon: Zap, color: "#4ade80" },
];

function StatsBar() {
  return (
    <div className="relative py-12 border-y border-border/30 bg-secondary/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div
                className="text-3xl font-black tabular-nums"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section divider ───────────────────────────────────── */
function Divider() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  );
}

/* ── Main export ───────────────────────────────────────── */

export const FeaturesShowcase = () => {
  return (
    <div>
      {/* Stats */}
      <StatsBar />

      {/* Intro heading */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center pt-24 pb-4">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Everything inside</p>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          Five powerful tools.{" "}
          <span className="text-gradient-primary">One membership.</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Everything a serious AI user needs — curated, updated weekly, and built to save you
          hours every single day.
        </p>
      </div>

      {/* 1. Prompt Library */}
      <FeatureSection
        id="prompt-library"
        label="1,000+ prompts ready to use"
        eyebrow="Prompt Library"
        title="Every prompt you'll ever need,"
        subtitle="hand-tested and ready."
        description="Stop staring at a blank screen. Our library has 1,000+ expert prompts for ChatGPT, Claude, and Gemini — organised by category, tagged by use case, and updated every week as models evolve."
        bullets={[
          { icon: MessageSquare, text: "LLM prompts for writing, marketing, sales, coding, and 20+ categories" },
          { icon: Search, text: "Instant search — find exactly what you need in seconds" },
          { icon: Star, text: "Featured & recommended prompts curated by our team weekly" },
          { icon: Copy, text: "One-click copy — paste straight into any AI tool" },
        ]}
        ctaText="Browse the library"
        ctaHref="/register"
        accentColor="#60a5fa"
        card={<PromptLibraryCard />}
      />

      <Divider />

      {/* 2. Claude Skills */}
      <FeatureSection
        id="claude-skills"
        label="100+ specialist skills"
        eyebrow="Claude Skills"
        title="Turn Claude into any"
        subtitle="expert you need."
        description="Claude Skills are pre-built instruction sets that transform Claude into a domain specialist — data analyst, copywriter, SEO strategist, and more. Activate with a slash command. Get expert output instantly."
        bullets={[
          { icon: Bot, text: "600+ skills across business, marketing, tech, and creative domains" },
          { icon: Zap, text: "Activate with /skill-name — no complex setup required" },
          { icon: CheckCircle, text: "Each skill is tested and refined for maximum output quality" },
          { icon: Crown, text: "Exclusive skills not available anywhere else" },
        ]}
        ctaText="See all skills"
        ctaHref="/register"
        accentColor="#a78bfa"
        card={<ClaudeSkillsCard />}
        flip
      />

      <Divider />

      {/* 3. AI Starter Kit */}
      <FeatureSection
        id="ai-starter-kit"
        label="450 prompts + 20 skills"
        eyebrow="AI Starter Kit"
        title="Everything a solopreneur needs"
        subtitle="to go from zero to AI-powered."
        description="The AI Starter Kit is a structured, step-by-step collection of 450 prompts and 20 Claude Skills built specifically for solopreneurs — organised by business function so you know exactly what to use and when."
        bullets={[
          { icon: BriefcaseBusiness, text: "6 business sections: acquisition, content, sales, productivity, automation, growth" },
          { icon: GraduationCap, text: "Beginner-friendly — no AI experience required to get results" },
          { icon: Wand2, text: "Pairs perfectly with Claude Skills for end-to-end workflows" },
          { icon: Zap, text: "New sections added regularly based on member feedback" },
        ]}
        ctaText="Explore the kit"
        ctaHref="/register"
        accentColor="#f59e0b"
        card={<StarterKitCard />}
      />

      <Divider />

      {/* 4. Image Prompts */}
      <FeatureSection
        id="image-prompts"
        label="500+ image prompts"
        eyebrow="Image Prompts"
        title="Professional visuals from"
        subtitle="a single prompt."
        description="Stop guessing with Midjourney and DALL·E. Our 500+ image prompts are engineered to produce gallery-quality visuals — product photography, UGC-style photos, social media graphics, and more."
        bullets={[
          { icon: Image, text: "500+ prompts for Midjourney, DALL·E 3, Flux, and Stable Diffusion" },
          { icon: Sparkles, text: "Categories: product photography, UGC, branding, portraits, cinematic" },
          { icon: Eye, text: "Real generated image examples shown for every prompt" },
          { icon: Copy, text: "Copy-paste ready — just swap your product or concept" },
        ]}
        ctaText="See image prompts"
        ctaHref="/register"
        accentColor="#f472b6"
        card={<ImagePromptCard />}
        flip
      />

      <Divider />

      {/* 5. Trending Prompts */}
      <FeatureSection
        id="trending"
        label="Updated in real-time"
        eyebrow="Trending Prompts"
        title="What's working right now,"
        subtitle="not six months ago."
        description="AI changes fast. The prompts that worked last month might be obsolete today. Trending Prompts surfaces what's actually performing right now — ranked by real usage data from our entire member community."
        bullets={[
          { icon: TrendingUp, text: "Live leaderboard updated weekly from real member usage" },
          { icon: Flame, text: "Hot picks — the fastest-rising prompts this week" },
          { icon: Zap, text: "First to know when a new AI capability makes a prompt go viral" },
          { icon: Star, text: "Community-verified — these prompts have thousands of real uses" },
        ]}
        ctaText="See what's trending"
        ctaHref="/register"
        accentColor="#f97316"
        card={<TrendingCard />}
      />
    </div>
  );
};

// Need Image import for the card
function Image(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
