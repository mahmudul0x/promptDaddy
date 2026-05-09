import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ArrowRight, Zap, Copy, Bot, Image, Wand2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Typewriter for the animated prompt line ─── */
const ROTATING_PROMPTS = [
  "Write a viral LinkedIn post about my SaaS launch",
  "Turn Claude into an expert SEO strategist",
  "Generate a product photo prompt for Midjourney",
  "Build an n8n automation for my email workflow",
  "Create a cold email sequence that actually converts",
  "Summarize this 50-page PDF into key insights",
  "Give me a 90-day content calendar for my brand",
  "Debug and improve my Python function",
];

function useTypewriter(lines: string[], typingSpeed = 38, pauseMs = 1800, deleteSpeed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [lineIdx, setLineIdx]     = useState(0);
  const [phase, setPhase]         = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const line = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < line.length) {
        timeout = setTimeout(() => setDisplayed(line.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 200);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setLineIdx((i) => (i + 1) % lines.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, lineIdx, lines, typingSpeed, pauseMs, deleteSpeed]);

  return { displayed, phase };
}

/* ─── Floating prompt cards (pure CSS animated) ─── */
const FLOAT_CARDS = [
  { icon: Zap,       text: "Viral tweet generator",     color: "#facc15", delay: "0s",    dur: "7s",  x: "-8%",  y: "18%" },
  { icon: Bot,       text: "Claude: /data-analyst",     color: "#DA7756", delay: "1.2s",  dur: "9s",  x: "82%",  y: "12%" },
  { icon: Copy,      text: "Cold email → 42% open rate",color: "#60a5fa", delay: "0.6s",  dur: "8s",  x: "-4%",  y: "68%" },
  { icon: Image,     text: "Midjourney product shot",   color: "#f472b6", delay: "1.8s",  dur: "10s", x: "78%",  y: "64%" },
  { icon: Wand2,     text: "Prompt enhancer",           color: "#c084fc", delay: "2.4s",  dur: "7.5s",x: "88%",  y: "38%" },
  { icon: TrendingUp,text: "Trending: +240% this week", color: "#4ade80", delay: "3s",    dur: "8.5s",x: "-10%", y: "44%" },
];

/* ─── Particle Network ─── */
function CursorGlow({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle colors: purple, blue, teal
  const COLORS = ["#a78bfa", "#60a5fa", "#34d399"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    interface Particle {
      x: number; y: number; vx: number; vy: number; r: number; color: string;
    }
    
    const particles: Particle[] = [];
    const n = Math.min(Math.floor((canvas.width * canvas.height) / 4000), 120);
    
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    let raf: number;
    
    const toRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    const tick = () => {
      const { x, y } = mouseRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height;
      
      for (const p of particles) {
        const dx = x - p.x, dy = y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < 180) {
          const s = (180 - d) / 180;
          p.vx += (dx / d) * s * 0.03;
          p.vy += (dy / d) * s * 0.03;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x = ((p.x + p.vx) + w) % w;
        p.y = ((p.y + p.vy) + h) % h;
      }
      
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${toRgb(a.color)},${(1 - d / 100) * 0.15})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
        const cdx = a.x - x, cdy = a.y - y;
        const cd = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < 150) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(${toRgb(a.color)},${(1 - cd / 150) * 0.3})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      
      for (const p of particles) {
        const cdx = p.x - x, cdy = p.y - y;
        const cd = Math.sqrt(cdx * cdx + cdy * cdy);
        const glow = cd < 150 ? (1 - cd / 150) * 0.5 : 0;
        const rgb = toRgb(p.color);
        
        if (glow > 0.1) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          grad.addColorStop(0, `rgba(${rgb},${glow * 0.2})`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.fill();
      }
      
      raf = requestAnimationFrame(tick);
    };
    
    raf = requestAnimationFrame(tick);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.5 }}
    />
  );
}

/* ─── Floating card component ─── */
function FloatCard({
  icon: Icon, text, color, delay, dur, x, y,
}: {
  icon: React.ElementType; text: string; color: string;
  delay: string; dur: string; x: string; y: string;
}) {
  return (
    <div
      className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm select-none pointer-events-none"
      style={{
        left: x, top: y,
        background: `${color}12`,
        borderColor: `${color}30`,
        animation: `floatCard ${dur} ease-in-out ${delay} infinite alternate`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}40` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2} />
      </div>
      <span className="text-[11px] font-mono font-medium whitespace-nowrap" style={{ color }}>
        {text}
      </span>
    </div>
  );
}

/* ─── Stats counter strip ─── */
const STATS = [
  { value: "19,000+", label: "AI Prompts" },
  { value: "500+",    label: "Claude Skills" },
  { value: "17,000+", label: "Image Prompts" },
  { value: "Weekly",  label: "New Content" },
];

/* ─── Main pills ─── */
const PILLS = [
  { emoji: "⚡", text: "Save 5+ hrs/week" },
  { emoji: "✅", text: "Copy-paste ready" },
  { emoji: "🔄", text: "Updated weekly" },
  { emoji: "🇧🇩", text: "bKash / Nagad" },
];

const TOOLS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "n8n"];

/* ═══════════════════════════════════════════════
   INTRO SECTION
═══════════════════════════════════════════════ */
export const IntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef   = useRef({ x: -200, y: -200 });
  const { displayed, phase } = useTypewriter(ROTATING_PROMPTS);
  const { t } = useLanguage();

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);
  const onLeave = useCallback(() => { mouseRef.current = { x: -200, y: -200 }; }, []);

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([".intro-eyebrow",".intro-heading",".intro-typewriter",
                ".intro-sub",".intro-pills",".intro-cta",
                ".intro-tools",".intro-stats"], { opacity: 0, y: 24 });

      gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
        .to(".intro-eyebrow",    { opacity: 1, y: 0, duration: 0.55 })
        .to(".intro-heading",    { opacity: 1, y: 0, duration: 0.7  }, "-=0.25")
        .to(".intro-typewriter", { opacity: 1, y: 0, duration: 0.55 }, "-=0.4")
        .to(".intro-sub",        { opacity: 1, y: 0, duration: 0.5  }, "-=0.3")
        .to(".intro-pills",      { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .to(".intro-cta",        { opacity: 1, y: 0, duration: 0.45 }, "-=0.2")
        .to(".intro-tools",      { opacity: 1, y: 0, duration: 0.4  }, "-=0.15")
        .to(".intro-stats",      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.2");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* keyframe for floating cards */}
      <style>{`
        @keyframes floatCard {
          0%   { transform: translateY(0px) rotate(-0.5deg); opacity: 0.75; }
          50%  { transform: translateY(-14px) rotate(0.5deg); opacity: 0.95; }
          100% { transform: translateY(-6px) rotate(-0.3deg); opacity: 0.82; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden"
      >
        {/* ── Background layers ── */}
        <div className="absolute inset-0 bg-gradient-hero -z-10" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orb top-left */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, hsl(260 80% 65% / 0.18), transparent 65%)",
            animation: "floatCard 9s ease-in-out infinite alternate",
          }}
        />
        {/* Orb bottom-right */}
        <div
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, hsl(48 100% 60% / 0.13), transparent 65%)",
            animation: "floatCard 11s ease-in-out 2s infinite alternate",
          }}
        />

        {/* ── Particle Network ── */}
        <CursorGlow mouseRef={mouseRef} />

        {/* ── Main content ── */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">

          {/* Heading */}
<h1 className="intro-heading text-4xl sm:text-5xl lg:text-[3.6rem] font-black tracking-tight leading-[1.1] -mt-6">
              <span
                style={{
                  background: "var(--gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Get real results
              </span>
              <span className="block text-foreground mt-1">with AI — from day one.</span>
            </h1>

          {/* Typewriter terminal box */}
          <div className="intro-typewriter mt-7 mx-auto max-w-xl">
            <div
              className="relative rounded-xl border overflow-hidden text-left"
              style={{
                background: "hsl(230 28% 8% / 0.85)",
                borderColor: "hsl(230 22% 26% / 0.8)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Terminal top bar */}
              <div
                className="flex items-center gap-1.5 px-3 py-2 border-b"
                style={{ borderColor: "hsl(230 22% 22% / 0.6)", background: "hsl(230 28% 11% / 0.6)" }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-[10px] font-mono text-muted-foreground/50 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "cursorBlink 2s ease infinite" }} />
                  prompt_master.ai
                </span>
              </div>

              {/* Prompt label row */}
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">Your prompt →</span>
              </div>

              {/* Typewriter text */}
              <div className="px-4 pb-4 min-h-[3rem] flex items-start">
                <span
                  className="text-sm font-mono leading-relaxed"
                  style={{ color: "hsl(40 30% 92%)" }}
                >
                  {displayed}
                  <span
                    className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle rounded-sm"
                    style={{
                      background: "hsl(var(--primary))",
                      animation: phase === "pausing" ? "cursorBlink 0.8s ease infinite" : "none",
                      opacity: phase === "deleting" ? 0.4 : 1,
                    }}
                  />
                </span>
              </div>

              {/* Scanline shimmer */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                style={{ opacity: 0.03 }}
              >
                <div
                  style={{
                    position: "absolute", top: 0, left: 0, width: "60%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                    animation: "scanline 4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground/40 font-mono text-center">
              {t('hero.prompts')}
            </p>
          </div>

          {/* Sub copy */}
          <p className="intro-sub mt-5 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed text-center">
            <span className="text-primary font-semibold">{t('hero.subtitle')}</span> {t('hero.subtitle2')}
          </p>

          {/* Pills */}
          <div className="intro-pills mt-5 flex flex-wrap items-center justify-center gap-2">
            {PILLS.map((p) => (
              <span
                key={p.text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/40 text-xs font-medium text-muted-foreground"
              >
                <span>{p.emoji}</span>{p.text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="intro-cta mt-7 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold shadow-glow transition-all hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
            >
              {/* Button shimmer */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  transform: "translateX(-100%)",
                  transition: "transform 0s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transition = "transform 0.5s ease";
                  el.style.transform = "translateX(100%)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transition = "none";
                  el.style.transform = "translateX(-100%)";
                }}
              />
              Get Full Access — ৳199/mo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
            >
              See what's inside
            </a>
          </div>

          <p className="mt-2.5 text-xs text-muted-foreground/40">
            No traps · Instant access after payment
          </p>

          {/* Works with */}
          <div className="intro-tools mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/40">
            <span>Works with →</span>
            {TOOLS.map((t) => (
              <span key={t} className="hover:text-primary transition-colors cursor-default text-muted-foreground/60">
                {t}
              </span>
            ))}
          </div>

          {/* Stats strip */}
          <div className="intro-stats mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/30 bg-secondary/20 px-4 py-3 text-center"
              >
                <div
                  className="text-xl font-black"
                  style={{
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>
      </section>
    </>
  );
};
