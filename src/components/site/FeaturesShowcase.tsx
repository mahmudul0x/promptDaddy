import { Link } from "react-router-dom";
import product1 from "@/assets/img/product1.jpeg";
import product2 from "@/assets/img/product2.jpeg";
import product3 from "@/assets/img/product3.jpeg";
import { useState, useEffect, useRef } from "react";
import {
  Bot, TrendingUp, BriefcaseBusiness, MessageSquare,
  Sparkles, ArrowRight, Zap, Star, Copy, Eye,
  ChevronRight, Flame, Crown, CheckCircle, Wand2, Search,
  GraduationCap, Paperclip, Send, Clock, FileText,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════
   1. PROMPT LIBRARY CARD
═══════════════════════════════════════════════════════ */

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
  { title: "Viral LinkedIn Post Generator", category: "Social Media", badge: "Free", badgeColor: "#4ade80", views: "12.4k", icon: "💼" },
  { title: "Cold Email That Actually Converts", category: "Email", badge: "Pro", badgeColor: "#a78bfa", views: "9.8k", icon: "✉️" },
  { title: "SEO Blog Post Framework", category: "Marketing", badge: "Pro", badgeColor: "#a78bfa", views: "8.1k", icon: "📝" },
];

function PromptLibraryCard() {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">prompt_library.tsx</span>
      </div>
      <div className="px-4 pt-4 pb-3 border-b border-border/20">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/40">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground/60">Search 1,000+ prompts...</span>
        </div>
      </div>
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-b border-border/20">
        {PROMPT_PILLS.map((p) => (
          <span key={p.label} className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
            style={{ background: `${p.color}18`, color: p.color }}>
            {p.label}
          </span>
        ))}
      </div>
      <div className="p-3 space-y-2">
        {PROMPT_CARDS.map((c) => (
          <div key={c.title} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/30 border border-border/20 hover:border-border/50 transition-colors cursor-pointer group">
            <span className="text-lg">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{c.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.category}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Eye className="h-3 w-3" />{c.views}
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background: `${c.badgeColor}20`, color: c.badgeColor }}>
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

/* ═══════════════════════════════════════════════════════
   2. CLAUDE SKILLS CARD — FULLY FIXED
   ✓ Full chat visible (scroll inside card only)
   ✓ No page scroll
   ✓ All messages render completely
═══════════════════════════════════════════════════════ */

const CLAUDE_ORANGE = "#DA7756";
const CLAUDE_BG = "#F5F0E8";

const SCENARIOS = [
  {
    skillFile: "data-analyst.md",
    skillLabel: "Data Analyst",
    skillIcon: "📊",
    userMsg: "Analyze my Q3 sales data and find the top 3 growth opportunities",
    replyLines: [
      { text: "Activating ", plain: true },
      { text: "Data Analyst", highlight: true },
      { text: " skill — deep-diving your Q3 numbers...", plain: true },
      { text: "\n\n━━ GROWTH OPPORTUNITIES DETECTED ━━", plain: false, color: "#94a3b8" },
      { text: "\n\n① Enterprise Tier  ▲ +23% YoY revenue", plain: false, color: "#4ade80" },
      { text: "\n   → Avg. deal size grew from $4.2k → $6.8k", plain: false, color: "#4ade80" },
      { text: "\n\n② SMB Segment  ⚠ Churn risk (14 accounts)", plain: false, color: "#f87171" },
      { text: "\n   → 60-day inactivity detected · Intervene now", plain: false, color: "#f87171" },
      { text: "\n\n③ Dormant Accounts  💰 ~$180k upsell gap", plain: false, color: CLAUDE_ORANGE },
      { text: "\n   → 31 accounts on Starter, qualify for Pro", plain: false, color: CLAUDE_ORANGE },
    ],
    timeSaved: "4 hrs saved",
  },
  {
    skillFile: "copywriter-pro.md",
    skillLabel: "Copywriter Pro",
    skillIcon: "✍️",
    userMsg: "Write a cold email for my SaaS targeting e-commerce founders",
    replyLines: [
      { text: "Activating ", plain: true },
      { text: "Copywriter Pro", highlight: true },
      { text: " skill — crafting high-converting copy...", plain: true },
      { text: "\n\n━━ COLD EMAIL — VARIANT A ━━", plain: false, color: "#94a3b8" },
      { text: '\n\n✉ Subject: "We cut Shopify returns by 34% for brands like yours"', plain: false, color: CLAUDE_ORANGE },
      { text: "\n\nHi [Name], I noticed [Brand] hit $2M+ GMV last quarter —", plain: false, color: "#a78bfa" },
      { text: "\ncongrats. Most stores at your scale are quietly losing", plain: false, color: "#a78bfa" },
      { text: "\n12–18% revenue to cart abandonment. We fix that.", plain: false, color: "#a78bfa" },
      { text: "\n\n→ Open rate: 41%  · Reply rate: 9%  · 3 variants ready", plain: false, color: "#60a5fa" },
    ],
    timeSaved: "2 hrs saved",
  },
  {
    skillFile: "seo-strategist.md",
    skillLabel: "SEO Strategist",
    skillIcon: "🎯",
    userMsg: "Give me a 90-day SEO content plan for my fintech startup",
    replyLines: [
      { text: "Activating ", plain: true },
      { text: "SEO Strategist", highlight: true },
      { text: " skill — building your 90-day roadmap...", plain: true },
      { text: "\n\n━━ 90-DAY SEO BATTLE PLAN ━━", plain: false, color: "#94a3b8" },
      { text: "\n\n📍 Week 01–04 · Foundation", plain: false, color: "#4ade80" },
      { text: "\n   12 low-KD, high-intent keywords · Est. 3.2k visits/mo", plain: false, color: "#4ade80" },
      { text: "\n\n📍 Week 05–08 · Authority", plain: false, color: CLAUDE_ORANGE },
      { text: "\n   3 pillar articles · 8 cluster posts · internal linking map", plain: false, color: CLAUDE_ORANGE },
      { text: "\n\n📍 Week 09–12 · Scale", plain: false, color: "#60a5fa" },
      { text: "\n   Link-building outreach · 4 featured snippet targets", plain: false, color: "#60a5fa" },
    ],
    timeSaved: "6 hrs saved",
  },
  {
    skillFile: "financial-advisor.md",
    skillLabel: "Financial Advisor",
    skillIcon: "💹",
    userMsg: "Review my startup's burn rate and give me a runway forecast",
    replyLines: [
      { text: "Activating ", plain: true },
      { text: "Financial Advisor", highlight: true },
      { text: " skill — running your financial model...", plain: true },
      { text: "\n\n━━ BURN RATE ANALYSIS ━━", plain: false, color: "#94a3b8" },
      { text: "\n\n🔴 Current burn: $48k/mo · Runway: 7.2 months", plain: false, color: "#f87171" },
      { text: "\n   Action required before month 5", plain: false, color: "#f87171" },
      { text: "\n\n✂ Cut scenario: $31k/mo → extends runway to 11.4 mo", plain: false, color: CLAUDE_ORANGE },
      { text: "\n   Top savings: contractor fees (-$9k) · SaaS stack (-$4k)", plain: false, color: CLAUDE_ORANGE },
      { text: "\n\n🎯 Fundraise target: $350k bridge · 3 mo to close buffer", plain: false, color: "#4ade80" },
    ],
    timeSaved: "5 hrs saved",
  },
];

function ClaudeAvatar() {
  return (
    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: CLAUDE_ORANGE }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M12 4C9 4 7 6 7 8.5c0 1.5.7 2.8 1.8 3.6L7 20h2.5l1-4h3l1 4H17l-1.8-7.9c1.1-.8 1.8-2.1 1.8-3.6C17 6 15 4 12 4z" fill="white" opacity="0.95" />
      </svg>
    </div>
  );
}

function ClaudeSkillsCard() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "uploading" | "typing-user" | "thinking" | "typing-reply" | "done">("idle");
  const [userText, setUserText] = useState("");
  const [replyCharIdx, setReplyCharIdx] = useState(0);
  const [dots, setDots] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIdx];

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  }

  function addTimeout(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  }

  function addInterval(fn: () => void, ms: number) {
    const t = setInterval(fn, ms);
    intervalsRef.current.push(t);
    return t;
  }

  function runSequence(idx: number) {
    clearAll();
    setPhase("idle");
    setUserText("");
    setReplyCharIdx(0);

    const sc = SCENARIOS[idx];
    const msg = sc.userMsg;
    const reply = sc.replyLines.map((l) => l.text).join("");

    addTimeout(() => setPhase("uploading"), 700);

    const typeStart = 1500;
    addTimeout(() => {
      setPhase("typing-user");
      let i = 0;
      const iv = addInterval(() => {
        i++;
        setUserText(msg.slice(0, i));
        if (i >= msg.length) {
          intervalsRef.current = intervalsRef.current.filter((x) => x !== iv);
          clearInterval(iv);
        }
      }, 28);
    }, typeStart);

    const thinkStart = typeStart + msg.length * 28 + 200;
    addTimeout(() => setPhase("thinking"), thinkStart);

    const replyStart = thinkStart + 900;
    addTimeout(() => {
      setPhase("typing-reply");
      let i = 0;
      const iv = addInterval(() => {
        i++;
        setReplyCharIdx(i);
        if (i >= reply.length) {
          intervalsRef.current = intervalsRef.current.filter((x) => x !== iv);
          clearInterval(iv);
          setPhase("done");
        }
      }, 16);
    }, replyStart);

    const nextAt = replyStart + reply.length * 16 + 2800;
    addTimeout(() => {
      setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    }, nextAt);
  }

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    runSequence(scenarioIdx);
    return clearAll;
  }, [scenarioIdx, isVisible]);

  useEffect(() => {
    if (phase !== "thinking") return;
    const iv = setInterval(() => setDots((d) => (d >= 3 ? 1 : d + 1)), 380);
    return () => clearInterval(iv);
  }, [phase]);

  // ✅ KEY FIX: scroll only inside the chatBox div, never the page
  useEffect(() => {
    const box = chatBoxRef.current;
    if (!box) return;
    requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; });
  }, [userText, replyCharIdx, phase]);

  function buildReplySegments() {
    let remaining = replyCharIdx;
    return scenario.replyLines.reduce<typeof scenario.replyLines>((acc, line) => {
      if (remaining <= 0) return acc;
      const take = Math.min(remaining, line.text.length);
      acc.push({ ...line, text: line.text.slice(0, take) });
      remaining -= take;
      return acc;
    }, []);
  }

  const showUser = phase === "typing-user" || phase === "thinking" || phase === "typing-reply" || phase === "done";

  return (
    <div ref={cardRef} className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl flex flex-col">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 shrink-0" style={{ background: CLAUDE_BG }}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <div className="ml-3 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill={CLAUDE_ORANGE} opacity="0.9" />
            <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-semibold" style={{ color: "#1a1a1a" }}>Claude</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${CLAUDE_ORANGE}20`, color: CLAUDE_ORANGE }}>Sonnet</span>
        </div>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5">
          <span className="text-[10px]">{scenario.skillIcon}</span>
          <span className="text-[10px] font-medium" style={{ color: "#555" }}>{scenario.skillLabel}</span>
        </div>
      </div>

      {/* ✅ FIXED: Chat box scrolls internally, shows full conversation */}
      <div
        ref={chatBoxRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto"
        style={{
          minHeight: 300,
          maxHeight: 440,
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: `${CLAUDE_ORANGE}30 transparent`,
        }}
      >
        {/* Skill file badge */}
        {phase !== "idle" && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px]"
              style={{ background: `${CLAUDE_ORANGE}10`, borderColor: `${CLAUDE_ORANGE}30` }}>
              <FileText className="h-3.5 w-3.5" style={{ color: CLAUDE_ORANGE }} />
              <span className="font-mono font-medium" style={{ color: CLAUDE_ORANGE }}>{scenario.skillFile}</span>
              <span className="text-muted-foreground text-[9px]">skill added</span>
            </div>
          </div>
        )}

        {/* User message */}
        {showUser && userText && (
          <div className="flex justify-end">
            <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-secondary/60 border border-border/30">
              <p className="text-[11px] text-foreground/90 leading-relaxed">
                {userText}
                {phase === "typing-user" && (
                  <span className="inline-block w-0.5 h-3 ml-0.5 align-middle rounded-full animate-pulse" style={{ background: CLAUDE_ORANGE }} />
                )}
              </p>
            </div>
          </div>
        )}

        {/* Thinking dots */}
        {phase === "thinking" && (
          <div className="flex items-start gap-2">
            <ClaudeAvatar />
            <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm border border-border/20 bg-card/60">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full"
                    style={{ background: CLAUDE_ORANGE, opacity: i < dots ? 1 : 0.2, transition: "opacity 0.25s" }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ✅ FIXED: Full reply — no line-clamp, whitespace-pre-wrap for newlines */}
        {(phase === "typing-reply" || phase === "done") && replyCharIdx > 0 && (
          <div className="flex items-start gap-2">
            <ClaudeAvatar />
            <div className="flex-1 px-3 py-2.5 rounded-2xl rounded-tl-sm border"
              style={{ borderColor: `${CLAUDE_ORANGE}25`, background: `${CLAUDE_ORANGE}08` }}>
              <p className="text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {buildReplySegments().map((seg, i) =>
                  seg.highlight
                    ? <strong key={i} style={{ color: CLAUDE_ORANGE }}>{seg.text}</strong>
                    : seg.color
                      ? <span key={i} style={{ color: seg.color }}>{seg.text}</span>
                      : <span key={i}>{seg.text}</span>
                )}
                {phase === "typing-reply" && (
                  <span className="inline-block w-0.5 h-3 ml-0.5 align-middle rounded-full animate-pulse" style={{ background: CLAUDE_ORANGE }} />
                )}
              </p>
            </div>
          </div>
        )}

        {/* Time saved */}
        {phase === "done" && (
          <div className="flex justify-center pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border"
              style={{ background: "#4ade8015", borderColor: "#4ade8030", color: "#4ade80" }}>
              <Clock className="h-3 w-3" />
              {scenario.timeSaved}
            </span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 pb-3 pt-1 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ background: CLAUDE_BG, borderColor: "#e0d8ce" }}>
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="flex-1 text-[11px] text-muted-foreground/40 select-none">Add a skill.md file and ask anything...</span>
          <div className="h-6 w-6 rounded-lg flex items-center justify-center" style={{ background: CLAUDE_ORANGE }}>
            <Send className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex gap-1">
            {SCENARIOS.map((_, i) => (
              <span key={i} className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === scenarioIdx ? "16px" : "4px", background: i === scenarioIdx ? CLAUDE_ORANGE : "#ccc" }} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-muted-foreground/40">skill demo</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. AI STARTER KIT CARD
═══════════════════════════════════════════════════════ */

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
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Your progress</span><span>12 / 450</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[3%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
          </div>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {KIT_SECTIONS.map((s) => (
          <div key={s.name} className="flex items-center gap-2 px-2.5 py-2.5 rounded-lg bg-secondary/30 border border-border/20 hover:border-border/50 cursor-pointer transition-all group">
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

/* ═══════════════════════════════════════════════════════
   4. IMAGE PROMPTS CARD — FULLY REDESIGNED
   ✓ Real prompt → AI generation animation
   ✓ Gorgeous generated image reveal with shimmer
   ✓ Cycles through 3 professional image styles
═══════════════════════════════════════════════════════ */

const IMAGE_DEMOS = [
  {
    prompt: "Environmental product shot of hiking boots on a mossy rock beside a stream, morning mist in the forest background, 35mm lens at f/4, natural diffused light, adventure lifestyle context",
    label: "Product Photography",
    emoji: "📸",
    accentColor: "#60a5fa",
    // Simulated generated image using pure CSS gradients + shapes
    imageSrc: product1,
  },
  {
    prompt: "1970s crime scene: detective examining evidence in industrial building, harsh tungsten light, cool shadows, grainy documentary quality, 2.39:1 scope, procedural tension mood.",
    label: "Fake Film Screenshots",
    emoji: "👤",
    accentColor: "#f472b6",
    imageSrc: product2,
  },
  {
    prompt: "A cyclist in a dark jacket speeding through a busy four-way intersection captured with 1/15 second shutter panning technique, the cyclist sharp and frozen against a horizontally motion-blurred background of storefronts, cars, and pedestrians, golden hour backlighting creating a rim light halo around the rider, tire spray from a wet road catching the light, dynamic diagonal composition with the cyclist moving left to right, street-level camera position",
    label: "Street Photography",
    emoji: "✨",
    accentColor: "#a78bfa",
    imageSrc: product3,
  },
];

// Simulated beautiful "generated" images using SVG/CSS art
function GeneratedImageCanvas({ style: imageContent }: { style: string }) {
  if (imageContent === "product") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg1" cx="35%" cy="40%">
            <stop offset="0%" stopColor="#e8e0d4" />
            <stop offset="60%" stopColor="#f5f0e8" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>
          <radialGradient id="cup1" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#2d2d2d" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <radialGradient id="rim1" cx="50%" cy="10%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="100%" stopColor="#222" />
          </radialGradient>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background */}
        <rect width="280" height="200" fill="url(#bg1)" />
        {/* Soft shadow on surface */}
        <ellipse cx="140" cy="170" rx="55" ry="10" fill="#00000018" filter="url(#blur1)" />
        {/* Cup body */}
        <path d="M110 80 Q108 140 115 155 Q140 162 165 155 Q172 140 170 80 Z" fill="url(#cup1)" />
        {/* Cup rim */}
        <ellipse cx="140" cy="80" rx="30" ry="8" fill="url(#rim1)" />
        {/* Inner rim highlight */}
        <ellipse cx="140" cy="80" rx="24" ry="5" fill="#1a1a1a" />
        {/* Rim light — key light from left */}
        <path d="M110 80 Q108 110 112 130" stroke="#888" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Steam wisps */}
        <path d="M130 72 Q127 58 131 44 Q134 30 130 18" stroke="white" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M140 68 Q143 52 139 38 Q136 24 141 12" stroke="white" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
        <path d="M150 72 Q153 56 149 40 Q146 26 151 14" stroke="white" strokeWidth="1.2" fill="none" opacity="0.35" strokeLinecap="round" />
        {/* Handle */}
        <path d="M168 100 Q186 100 186 118 Q186 136 168 136" stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M168 100 Q180 100 180 118 Q180 136 168 136" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Specular highlight */}
        <ellipse cx="128" cy="95" rx="4" ry="8" fill="white" opacity="0.12" transform="rotate(-15 128 95)" />
        {/* Surface reflection */}
        <ellipse cx="140" cy="168" rx="40" ry="6" fill="#00000008" />
        {/* Bokeh circles bg */}
        <circle cx="40" cy="30" r="18" fill="white" opacity="0.04" />
        <circle cx="240" cy="50" r="24" fill="white" opacity="0.03" />
        <circle cx="220" cy="160" r="14" fill="white" opacity="0.05" />
        {/* Camera settings watermark */}
        <text x="10" y="190" fill="white" opacity="0.25" fontSize="7" fontFamily="monospace">f/1.4 · 1/200s · ISO 100 · 85mm</text>
      </svg>
    );
  }

  if (imageContent === "portrait") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg2" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#c2410c" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7c2d12" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1c0a00" />
          </radialGradient>
          <radialGradient id="skin2" cx="45%" cy="35%">
            <stop offset="0%" stopColor="#f4c49a" />
            <stop offset="70%" stopColor="#d4956a" />
            <stop offset="100%" stopColor="#b8724a" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="bokeh">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <rect width="280" height="200" fill="url(#bg2)" />
        {/* Bokeh lights background */}
        {[
          [30, 40, 16], [220, 30, 20], [250, 80, 12], [20, 120, 14],
          [260, 150, 18], [50, 170, 10], [200, 170, 16],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#f97316" opacity="0.12" filter="url(#bokeh)" />
        ))}
        {/* Golden rim light behind subject */}
        <ellipse cx="140" cy="95" rx="55" ry="70" fill="#f97316" opacity="0.15" filter="url(#softBlur)" />
        {/* Shoulders */}
        <path d="M70 200 Q80 155 105 145 Q120 140 140 140 Q160 140 175 145 Q200 155 210 200 Z" fill="#1a0f0a" />
        {/* Suit lapel highlight */}
        <path d="M120 145 Q130 155 140 160 Q150 155 160 145" stroke="#2a1a10" strokeWidth="1" fill="none" opacity="0.6" />
        {/* Neck */}
        <rect x="128" y="125" width="24" height="20" rx="4" fill="url(#skin2)" />
        {/* Head */}
        <ellipse cx="140" cy="100" rx="34" ry="38" fill="url(#skin2)" />
        {/* Hair */}
        <path d="M106 88 Q108 62 140 62 Q172 62 174 88 Q170 68 140 66 Q110 66 106 88 Z" fill="#1a0a00" />
        <path d="M107 90 Q104 80 106 70 Q108 62 118 60" stroke="#1a0a00" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="127" cy="98" rx="6" ry="4" fill="#1a0a00" />
        <ellipse cx="153" cy="98" rx="6" ry="4" fill="#1a0a00" />
        <circle cx="129" cy="97" r="1.5" fill="white" opacity="0.9" />
        <circle cx="155" cy="97" r="1.5" fill="white" opacity="0.9" />
        {/* Eyebrows */}
        <path d="M120 91 Q127 88 133 90" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M147 90 Q153 88 160 91" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <path d="M138 102 Q136 110 138 113 Q140 115 142 113 Q144 110 142 102" stroke="#c27a50" strokeWidth="1" fill="none" opacity="0.6" />
        {/* Lips */}
        <path d="M130 120 Q135 117 140 118 Q145 117 150 120 Q145 125 140 126 Q135 125 130 120 Z" fill="#a0522d" opacity="0.8" />
        {/* Rim light on face edge */}
        <path d="M174 80 Q178 100 174 120" stroke="#f97316" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        {/* Vogue watermark */}
        <text x="10" y="18" fill="white" opacity="0.4" fontSize="10" fontFamily="serif" fontStyle="italic" letterSpacing="3">VOGUE</text>
        <text x="10" y="190" fill="white" opacity="0.25" fontSize="7" fontFamily="monospace">Leica Q3 · 50mm · f/1.2 · Golden Hour</text>
      </svg>
    );
  }

  // flatlay
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8f4f0" />
          <stop offset="40%" stopColor="#ede8e3" />
          <stop offset="70%" stopColor="#f0ebe5" />
          <stop offset="100%" stopColor="#e8e0d8" />
        </linearGradient>
        <filter id="shadow3">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodOpacity="0.15" />
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Marble surface */}
      <rect width="280" height="200" fill="url(#marble)" />
      {/* Marble veins */}
      <path d="M0 60 Q70 55 140 65 Q210 75 280 60" stroke="#d4cec8" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M0 100 Q90 92 180 105 Q230 110 280 100" stroke="#ccc6c0" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M50 0 Q55 80 45 140 Q40 170 55 200" stroke="#d0cac4" strokeWidth="0.7" fill="none" opacity="0.5" />
      <path d="M180 0 Q185 60 175 120 Q170 160 185 200" stroke="#c8c2bc" strokeWidth="0.6" fill="none" opacity="0.4" />

      {/* Serum bottle — tall elegant glass */}
      <rect x="118" y="30" width="44" height="110" rx="8" fill="#e8e0d8" filter="url(#shadow3)" />
      <rect x="120" y="32" width="40" height="106" rx="7" fill="#f0ece8" />
      {/* Bottle glass highlight */}
      <rect x="122" y="35" width="8" height="80" rx="4" fill="white" opacity="0.5" />
      {/* Label */}
      <rect x="124" y="65" width="32" height="42" rx="3" fill="white" opacity="0.85" />
      <text x="140" y="81" textAnchor="middle" fill="#8b7355" fontSize="5" fontFamily="serif" letterSpacing="1">SÉRUM</text>
      <text x="140" y="91" textAnchor="middle" fill="#a08060" fontSize="4" fontFamily="serif">LUXE No.3</text>
      <line x1="127" y1="96" x2="153" y2="96" stroke="#c4a882" strokeWidth="0.5" opacity="0.6" />
      <text x="140" y="102" textAnchor="middle" fill="#b09070" fontSize="3.5" fontFamily="serif">30 ML · PARIS</text>
      {/* Dropper top */}
      <rect x="130" y="15" width="20" height="16" rx="3" fill="#d4ccc4" />
      <ellipse cx="140" cy="15" rx="10" ry="3" fill="#c8c0b8" />
      <rect x="137" y="5" width="6" height="12" rx="2" fill="#b8b0a8" />

      {/* Rose petals scattered */}
      {[
        [80, 80, -25], [72, 100, 15], [88, 115, -10],
        [200, 70, 20], [208, 90, -15], [195, 108, 10],
        [100, 155, -30], [175, 150, 25],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x} cy={y} rx="10" ry="6"
          fill="#f4a8b0" opacity="0.75"
          transform={`rotate(${rot} ${x} ${y})`}
          filter="url(#shadow3)"
        />
      ))}

      {/* Small botanical sprig */}
      <path d="M55 50 Q65 70 55 90 Q45 110 55 130" stroke="#8fbc8f" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <ellipse cx="62" cy="65" rx="7" ry="4" fill="#90c090" opacity="0.6" transform="rotate(30 62 65)" />
      <ellipse cx="48" cy="80" rx="7" ry="4" fill="#80b080" opacity="0.55" transform="rotate(-20 48 80)" />
      <ellipse cx="61" cy="98" rx="6" ry="3.5" fill="#88b888" opacity="0.6" transform="rotate(15 61 98)" />

      {/* Diffused light bloom top-left */}
      <circle cx="30" cy="20" r="50" fill="white" opacity="0.12" filter="url(#softglow)" />

      {/* Harper's Bazaar watermark */}
      <text x="10" y="18" fill="#8b7355" opacity="0.5" fontSize="7" fontFamily="serif" letterSpacing="2">HARPER'S BAZAAR</text>
      <text x="10" y="192" fill="#8b7355" opacity="0.35" fontSize="6.5" fontFamily="monospace">Hasselblad X2D · 90mm Macro · f/5.6</text>
    </svg>
  );
}

function ImagePromptCard() {
  const [demoIdx, setDemoIdx] = useState(0);
  const [genPhase, setGenPhase] = useState<"idle" | "typing-prompt" | "generating" | "revealing" | "done">("idle");
  const [promptText, setPromptText] = useState("");
  const [shimmerProgress, setShimmerProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const demo = IMAGE_DEMOS[demoIdx];

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  }

  function addT(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  }

  function addI(fn: () => void, ms: number) {
    const t = setInterval(fn, ms);
    intervalsRef.current.push(t);
    return t;
  }

  function runGen(idx: number) {
    clearAll();
    setGenPhase("idle");
    setPromptText("");
    setShimmerProgress(0);

    const sc = IMAGE_DEMOS[idx];
    const prompt = sc.prompt;

    // Step 1: type the prompt
    addT(() => {
      setGenPhase("typing-prompt");
      let i = 0;
      const iv = addI(() => {
        i++;
        setPromptText(prompt.slice(0, i));
        if (i >= prompt.length) {
          intervalsRef.current = intervalsRef.current.filter((x) => x !== iv);
          clearInterval(iv);
        }
      }, 22);
    }, 600);

    // Step 2: generating — shimmer progress bar
    const genStart = 600 + prompt.length * 22 + 300;
    addT(() => {
      setGenPhase("generating");
      setShimmerProgress(0);
      let p = 0;
      const iv = addI(() => {
        p += 1.2;
        setShimmerProgress(Math.min(p, 100));
        if (p >= 100) {
          intervalsRef.current = intervalsRef.current.filter((x) => x !== iv);
          clearInterval(iv);
        }
      }, 28);
    }, genStart);

    // Step 3: reveal image with wipe animation
    const revealStart = genStart + 100 * 28 + 200;
    addT(() => setGenPhase("revealing"), revealStart);

    // Step 4: done
    addT(() => setGenPhase("done"), revealStart + 800);

    // Step 5: next
    addT(() => {
      setDemoIdx((prev) => (prev + 1) % IMAGE_DEMOS.length);
    }, revealStart + 800 + 3500);
  }

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    runGen(demoIdx);
    return clearAll;
  }, [demoIdx, isVisible]);

  const showImage = genPhase === "revealing" || genPhase === "done";

  return (
    <div ref={cardRef} className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/30 bg-secondary/30">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">image_prompts.tsx</span>
        <div className="ml-auto flex items-center gap-1">
          {IMAGE_DEMOS.map((_, i) => (
            <span key={i} className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === demoIdx ? "14px" : "4px", background: i === demoIdx ? demo.accentColor : "#555" }} />
          ))}
        </div>
      </div>

      {/* ── Prompt input area ── */}
      <div className="px-3 pt-3 pb-2">
        <div className="rounded-xl border border-border/30 bg-secondary/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-md flex items-center justify-center"
              style={{ background: `${demo.accentColor}20`, border: `1px solid ${demo.accentColor}40` }}>
              <Wand2 className="h-3 w-3" style={{ color: demo.accentColor }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: demo.accentColor }}>
              {demo.label}
            </span>
            <span className="ml-auto text-base">{demo.emoji}</span>
          </div>
          <div className="min-h-[48px] rounded-lg bg-background/50 border border-border/20 px-2.5 py-2">
            <p className="text-[10px] font-mono text-muted-foreground/80 leading-relaxed">
              {promptText || <span className="opacity-30">your prompt will appear here...</span>}
              {genPhase === "typing-prompt" && (
                <span className="inline-block w-0.5 h-3 ml-0.5 align-middle rounded-full animate-pulse"
                  style={{ background: demo.accentColor }} />
              )}
            </p>
          </div>

          {/* Generate button area */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-7 rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-bold text-white cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${demo.accentColor}cc, ${demo.accentColor}88)` }}>
              <Sparkles className="h-3 w-3" />
              {genPhase === "idle" || genPhase === "typing-prompt" ? "Generate Image" : genPhase === "generating" ? "Generating..." : "Generated ✓"}
            </div>
            <span className="text-[9px] text-muted-foreground/40 font-mono shrink-0">Midjourney · v6</span>
          </div>
        </div>
      </div>

      {/* ── Generation progress ── */}
      {genPhase === "generating" && (
        <div className="px-3 pb-2">
          <div className="rounded-xl border border-border/20 bg-secondary/10 p-3">
            {/* Shimmer progress bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground/60 font-mono">Rendering pixels...</span>
              <span className="text-[10px] font-bold" style={{ color: demo.accentColor }}>{Math.round(shimmerProgress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${shimmerProgress}%`,
                  background: `linear-gradient(90deg, ${demo.accentColor}88, ${demo.accentColor}, ${demo.accentColor}88)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.2s infinite linear",
                }}
              />
            </div>
            {/* Diffusion steps visual */}
            <div className="mt-2.5 grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-8 rounded-md overflow-hidden"
                  style={{
                    background: shimmerProgress > i * 12.5
                      ? `hsl(${200 + i * 20}, 60%, ${20 + i * 5}%)`
                      : "hsl(var(--border) / 0.3)",
                    transition: "background 0.3s ease",
                  }}>
                  {shimmerProgress > i * 12.5 && (
                    <div className="w-full h-full opacity-60"
                      style={{
                        background: `linear-gradient(${i * 45}deg, ${demo.accentColor}30, transparent)`,
                      }} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground/30 font-mono mt-1.5 text-center">
              Denoising step {Math.round(shimmerProgress / 5)} / 20
            </p>
          </div>
        </div>
      )}

      {/* ── GENERATED IMAGE — Full reveal ── */}
      {showImage && (
        <div className="px-3 pb-3">
          <div className="relative rounded-xl overflow-hidden border border-border/20"
            style={{ height: 200 }}>
            {/* The actual "generated" image */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: genPhase === "revealing"
                  ? "inset(0 100% 0 0)"
                  : "inset(0 0% 0 0)",
                transition: "clip-path 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* <GeneratedImageCanvas style={demo.imageContent} /> */}
              <img
  src={demo.imageSrc}
  alt={demo.label}
  className="w-full h-full object-cover"
/>
            </div>

            {/* Overlay badges */}
            {genPhase === "done" && (
              <>
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[9px] text-white font-bold">Generated</span>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="text-[9px] text-white/80 font-mono">4096×4096</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                    style={{ background: `${demo.accentColor}cc`, color: "white" }}>
                    {demo.label}
                  </span>
                  <div className="flex gap-1">
                    <div className="h-6 w-6 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                      <Copy className="h-3 w-3 text-white/80" />
                    </div>
                    <div className="h-6 w-6 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                      <Star className="h-3 w-3 text-white/80" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Idle state placeholder */}
      {(genPhase === "idle") && (
        <div className="px-3 pb-3">
          <div className="h-[200px] rounded-xl border border-border/20 bg-secondary/10 flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-border/20 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-[10px] text-muted-foreground/30 font-mono">Awaiting prompt...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-3 pt-0">
        <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/40 font-mono">
          <Sparkles className="h-3 w-3" /> 500+ image prompts — Midjourney · DALL·E 3 · Flux
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// Small image icon for idle state
function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   5. TRENDING CARD
═══════════════════════════════════════════════════════ */

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
      <div className="p-2 space-y-1">
        {TRENDING.map((t) => (
          <div key={t.title} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer transition-colors group">
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
      <div className="px-4 pb-4 pt-2">
        <div className="h-12 flex items-end gap-1">
          {[20, 35, 28, 55, 42, 68, 90, 75, 88, 100, 85, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: i >= 8 ? "linear-gradient(to top, #f59e0b, #f97316)" : "hsl(var(--border) / 0.4)",
              }} />
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

/* ═══════════════════════════════════════════════════════
   FEATURE SECTION WRAPPER
   ✅ Claude Skills subtitle uses Claude logo gradient
═══════════════════════════════════════════════════════ */

function FeatureSection({
  id, label, eyebrow, title, subtitle, description, bullets, ctaText, ctaHref,
  accentColor, card, flip = false,
}: {
  id?: string; label: string; eyebrow: string; title: string; subtitle: string;
  description: string; bullets: { icon: React.ElementType; text: string }[];
  ctaText: string; ctaHref: string; accentColor: string; card: React.ReactNode; flip?: boolean;
}) {
  // ✅ Claude Skills gets the actual Claude logo gradient
  const isClaudeSkills = id === "claude-skills";
  const subtitleStyle = isClaudeSkills
    ? {
        background: "linear-gradient(135deg, #DA7756 0%, #C85E3A 35%, #E8936A 65%, #D46B45 100%)",
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
        backgroundClip: "text" as const,
        filter: "drop-shadow(0 1px 3px rgba(218,119,86,0.3))",
      }
    : {
        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
        backgroundClip: "text" as const,
      };

  return (
    <section id={id} className="relative py-24 sm:py-32 overflow-hidden">
      <GlowOrb color={`${accentColor}18`} className="w-[600px] h-[600px] -top-40 -left-40" />
      <GlowOrb color={`${accentColor}10`} className="w-[400px] h-[400px] bottom-0 right-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-14 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div>
            <SectionLabel text={eyebrow} />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
              {title}{" "}
              <span className="inline" style={subtitleStyle}>
                {subtitle}
              </span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{description}</p>
            <ul className="mt-6 space-y-3">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
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
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }} />
            <div className="relative">{card}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR
═══════════════════════════════════════════════════════ */

const STATS = [
  { value: "1,000+", label: "AI Prompts", icon: MessageSquare, color: "#60a5fa" },
  { value: "600+", label: "Claude Skills", icon: Bot, color: "#a78bfa" },
  { value: "500+", label: "Image Prompts", icon: ImageIcon, color: "#f472b6" },
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
              <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="text-3xl font-black tabular-nums" style={{ color }}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */

export const FeaturesShowcase = () => {
  return (
    <div>
      <StatsBar />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center pt-24 pb-4">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Everything inside</p>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          Five powerful tools.{" "}
          <span className="text-gradient-primary">One membership.</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Everything a serious AI user needs — curated, updated weekly, and built to save you hours every single day.
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
        label="600+ specialist skills"
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

      {/* 4. Image Prompts — FULLY REDESIGNED */}
      <FeatureSection
        id="image-prompts"
        label="500+ image prompts"
        eyebrow="Image Prompts"
        title="Professional visuals from"
        subtitle="a single prompt."
        description="Stop guessing with Midjourney and DALL·E. Our 500+ image prompts are engineered to produce gallery-quality visuals — product photography, UGC-style photos, social media graphics, and more."
        bullets={[
          { icon: ImageIcon, text: "500+ prompts for Midjourney, DALL·E 3, Flux, and Stable Diffusion" },
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