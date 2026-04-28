import { useRef, useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

/* --- Counter hook -------------------------------------------------------- */

function useCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* --- Particle network canvas -------------------------------------------- */

interface P { x: number; y: number; vx: number; vy: number; r: number; a: number }

function ParticleNet({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: P[] = [];
    let raf = 0;

    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const n = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 110);
      particles = Array.from({ length: n }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r:  Math.random() * 1.4 + 0.5,
        a:  Math.random() * 0.45 + 0.2,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const { x: mx, y: my } = mouseRef.current;

      for (const p of particles) {
        const dx = mx - p.x, dy = my - p.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < 190) {
          const s = (190 - d) / 190;
          if (d < 75) {
            p.vx -= (dx / d) * s * 0.07;
            p.vy -= (dy / d) * s * 0.07;
          } else {
            p.vx += (dx / d) * s * 0.022;
            p.vy += (dy / d) * s * 0.022;
          }
        }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = ((p.x + p.vx) + W) % W;
        p.y = ((p.y + p.vy) + H) % H;
      }

      const LD = 125;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LD) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(245,200,66,${(1 - d / LD) * 0.22})`;
            ctx.lineWidth   = 0.55;
            ctx.stroke();
          }
        }

        const cdx = a.x - mx, cdy = a.y - my;
        const cd  = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cd < 190) {
          const op = (1 - cd / 190) * 0.55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(245,200,66,${op})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }

      for (const p of particles) {
        const cdx = p.x - mx, cdy = p.y - my;
        const cd  = Math.sqrt(cdx * cdx + cdy * cdy);
        const glow = cd < 190 ? (1 - cd / 190) * 0.9 : 0;
        const radius = p.r + glow * 1.8;
        const alpha  = Math.min(1, p.a + glow * 0.45);

        if (glow > 0) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
          grad.addColorStop(0, `rgba(245,200,66,${glow * 0.25})`);
          grad.addColorStop(1, "rgba(245,200,66,0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,200,66,${alpha})`;
        ctx.fill();
      }

      if (mx > 0 && mx < W && my > 0 && my < H) {
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 18);
        cg.addColorStop(0, "rgba(245,200,66,0.65)");
        cg.addColorStop(1, "rgba(245,200,66,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 18, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    init();
    frame();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* --- Hero --------------------------------------------------------------- */

const BRAND_TOOLS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "n8n · Zapier · Make"] as const;

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const count      = useCounter(60000);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (r) mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-background/75 to-background" />
      <div className="absolute inset-0 -z-10 bg-gradient-hero" />

      {/* Floating color orbs */}
      <div
        className="absolute top-1/4 -left-48 w-[520px] h-[520px] rounded-full blur-[130px] opacity-[0.17] pointer-events-none animate-orb-drift-1"
        style={{ background: "radial-gradient(circle, hsl(260 80% 65%), transparent 70%)", zIndex: 0 }}
      />
      <div
        className="absolute -bottom-16 -right-48 w-[440px] h-[440px] rounded-full blur-[110px] opacity-[0.14] pointer-events-none animate-orb-drift-2"
        style={{ background: "radial-gradient(circle, hsl(48 100% 60%), transparent 70%)", zIndex: 0 }}
      />

      {/* Particle canvas */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <ParticleNet mouseRef={mouseRef} />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 1 }}>

        {/* Badge — animated gradient border + live counter */}
        <div className="animate-fade-up inline-block" style={{ animationDelay: "0ms" }}>
          <div className="hero-badge-border">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              {count.toLocaleString()}+ prompt sorcerers initiated
            </div>
          </div>
        </div>

        <h1
          className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <span className="text-gradient">Cast spells your competitors </span>
          <span className="text-gradient-primary">haven&apos;t decoded yet.</span>
        </h1>

        {/* Shimmer tagline */}
        <p
          className="mt-4 text-2xl sm:text-3xl font-bold tracking-wide animate-fade-up"
          style={{ animationDelay: "310ms" }}
        >
          <span className="animate-shimmer-sweep">CAST BETTER. CREATE MORE. BE LIMITLESS.</span>
        </p>

        <p
          className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up"
          style={{ animationDelay: "450ms" }}
        >
          1,000+ battle-tested prompt incantations, arcane tutorials, and automation rituals.
          Forged for developers, founders, and digital sorcerers who refuse to fall behind.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up"
          style={{ animationDelay: "590ms" }}
        >
          {/* Primary CTA with expanding pulse ring */}
          <div className="relative">
            <span className="hero-cta-ring absolute inset-0" />
            <Button asChild variant="hero" size="xl">
              <Link to="/register">
                Start Early Access for 119 BDT
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Button asChild variant="glass" size="xl">
            <a href="#features">Explore the Grimoire</a>
          </Button>
        </div>

        {/* Brand logos — staggered per-item */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {BRAND_TOOLS.map((tool, i) => (
            <span key={tool} className="inline-flex items-center gap-x-8">
              <span
                className="hover:text-primary transition-colors duration-300 cursor-default animate-fade-up"
                style={{ animationDelay: `${720 + i * 70}ms` }}
              >
                {tool}
              </span>
              {i < BRAND_TOOLS.length - 1 && (
                <span className="opacity-30">&bull;</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
