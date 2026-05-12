import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

/* ─── Typewriter ─────────────────────────────────────────── */
const PROMPTS = [
  "Write a viral LinkedIn post about my SaaS launch",
  "Turn Claude into an expert SEO strategist",
  "Generate a Midjourney product photo prompt",
  "Build an n8n automation for my email workflow",
  "Create a cold email sequence that converts",
  "Summarize this 50-page PDF into key insights",
  "Give me a 90-day content calendar for my brand",
];

function useTypewriter(lines: string[], speed = 36, pause = 1800, del = 16) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  useEffect(() => {
    const line = lines[idx];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < line.length) t = setTimeout(() => setText(line.slice(0, text.length + 1)), speed);
      else t = setTimeout(() => setPhase("pausing"), pause);
    } else if (phase === "pausing") {
      t = setTimeout(() => setPhase("deleting"), 200);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), del);
      else { setIdx(i => (i + 1) % lines.length); setPhase("typing"); }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, lines, speed, pause, del]);
  return { text, phase };
}

/* ─── Three.js Neural Net background ───────────────────────── */
function ThreeBackground({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    /* Scene */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* ── Node positions ── */
    const NODE_COUNT = 90;
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 38,
        (Math.random() - 0.5) * 30,
      ));
    }

    /* ── Nodes (glowing dots) ── */
    const nodeGeo = new THREE.BufferGeometry();
    const nodePts = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);
    const palette = [
      new THREE.Color("#a78bfa"),
      new THREE.Color("#60a5fa"),
      new THREE.Color("#34d399"),
      new THREE.Color("#f472b6"),
      new THREE.Color("#fbbf24"),
    ];
    positions.forEach((p, i) => {
      nodePts[i * 3] = p.x; nodePts[i * 3 + 1] = p.y; nodePts[i * 3 + 2] = p.z;
      const c = palette[Math.floor(Math.random() * palette.length)];
      nodeColors[i * 3] = c.r; nodeColors[i * 3 + 1] = c.g; nodeColors[i * 3 + 2] = c.b;
    });
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePts, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true });
    const nodesMesh = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodesMesh);

    /* ── Edges (lines between close nodes) ── */
    const edgeVerts: number[] = [];
    const edgeColors: number[] = [];
    const DIST = 14;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < DIST) {
          edgeVerts.push(positions[i].x, positions[i].y, positions[i].z);
          edgeVerts.push(positions[j].x, positions[j].y, positions[j].z);
          const c = palette[Math.floor(Math.random() * palette.length)];
          edgeColors.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(edgeVerts), 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(edgeColors), 3));
    const edgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.09 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edges);

    /* ── Floating ring accent ── */
    const ringGeo = new THREE.TorusGeometry(12, 0.05, 8, 90);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.12, wireframe: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(7.5, 0.04, 8, 70);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.09 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    scene.add(ring2);

    /* ── Mouse parallax ── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* ── Animate ── */
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.004;

      nodesMesh.rotation.y = t * 0.12 + mx * 0.18;
      nodesMesh.rotation.x = t * 0.06 + my * 0.1;
      edges.rotation.y = nodesMesh.rotation.y;
      edges.rotation.x = nodesMesh.rotation.x;

      ring.rotation.y = t * 0.2;
      ring.rotation.z = t * 0.08;
      ring2.rotation.y = -t * 0.15;
      ring2.rotation.x = t * 0.05 - Math.PI / 3;

      nodeMat.opacity = 0.7 + Math.sin(t * 1.4) * 0.15;
      edgeMat.opacity = 0.07 + Math.sin(t * 0.9) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      const nw = container.clientWidth, nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      nodeGeo.dispose(); nodeMat.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      ring2Geo.dispose(); ring2Mat.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ─── Stats ──────────────────────────────────────────────── */
const STATS = [
  { n: "19K+",   raw: 19000, label: "AI Prompts",    color: "#a78bfa", desc: "Ready-to-use"   },
  { n: "600+",   raw: 600,   label: "Claude Skills", color: "#60a5fa", desc: "Skill bundles"  },
  { n: "17K+",   raw: 17000, label: "Image Prompts", color: "#f472b6", desc: "Art & design"   },
  { n: "Weekly", raw: null,  label: "New Content",   color: "#34d399", desc: "Always fresh"   },
];

function StatCard({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const num = numRef.current;
    if (!card || !num) return;

    const delay = 0.9 + index * 0.1; // after main timeline finishes

    // fade in
    gsap.fromTo(card,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, delay, ease: "power2.out" }
    );

    // count-up
    if (stat.raw !== null) {
      const isK = stat.n.includes("K");
      const target = isK ? stat.raw / 1000 : stat.raw;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        delay: delay + 0.1,
        ease: "power2.out",
        onUpdate: () => {
          const v = Math.floor(obj.val);
          num.textContent = isK ? `${v}K+` : `${v}+`;
        },
        onComplete: () => { num.textContent = stat.n; },
      });
    }
  }, [stat, index]);

  return (
    <div
      ref={cardRef}
      className="ih-stat-card group relative rounded-2xl border overflow-hidden text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
      style={{ borderColor: `${stat.color}40`, background: `${stat.color}10` }}
    >
      {/* top accent bar */}
      <div className="ih-stat-bar h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />

      {/* hover glow orb */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${stat.color}18, transparent)` }} />

      <div className="px-5 py-5 relative">
        {/* number */}
        <div className="ih-stat-num text-2xl sm:text-3xl font-black mb-1 tabular-nums" style={{ color: stat.color }}>
          <span ref={numRef}>{stat.raw !== null ? (stat.n.includes("K") ? "0K+" : "0+") : stat.n}</span>
        </div>

        {/* label */}
        <div className="ih-stat-label text-[12px] font-bold text-foreground/80 tracking-wide">{stat.label}</div>

        {/* desc */}
        <div className="ih-stat-desc text-[10px] mt-0.5 font-medium" style={{ color: `${stat.color}90` }}>{stat.desc}</div>
      </div>
    </div>
  );
}

/* ─── Tools ──────────────────────────────────────────────── */
const TOOLS = [
  "ChatGPT", "Claude", "Gemini", "Midjourney", "n8n", "Make",
  "Google Flow", "Seedance", "Grok", "Lovable", "NanoBanana",
];

/* ════════════════════════════════════════════════════════════
   INTRO SECTION
════════════════════════════════════════════════════════════ */
export const IntroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { text, phase } = useTypewriter(PROMPTS);
  const { t } = useLanguage();

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.from(".ih-badge",    { opacity: 0, y: 18, duration: 0.5 })
        .from(".ih-heading",  { opacity: 0, y: 28, duration: 0.65 }, "-=0.2")
        .from(".ih-terminal", { opacity: 0, y: 20, duration: 0.5  }, "-=0.3")
        .from(".ih-sub",      { opacity: 0, y: 16, duration: 0.45 }, "-=0.25")
        .from(".ih-cta",      { opacity: 0, y: 14, duration: 0.4  }, "-=0.2")
        .from(".ih-tools",    { opacity: 0, y: 10, duration: 0.35 }, "-=0.15");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes cursorPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-text {
          background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399, #f472b6, #a78bfa);
          background-size: 300% 300%;
          animation: gradientShift 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .terminal-glow {
          box-shadow: 0 0 0 1px rgba(167,139,250,0.15), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(167,139,250,0.07);
        }
        .cta-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6366f1, #a21caf);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
        .cta-btn-primary:hover { opacity: 0.92; transform: translateY(-2px); }

        /* ── Hero grid ── */
        .ih-grid {
          opacity: 0.03;
          background-image:
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .light .ih-grid {
          opacity: 1;
          background-image:
            linear-gradient(hsl(252 80% 57% / 0.12) 1px, transparent 1px),
            linear-gradient(90deg, hsl(252 80% 57% / 0.12) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%);
        }

        /* ── Light mode overrides ── */
        .light .animated-gradient-text {
          background: linear-gradient(135deg, #6d28d9, #4f46e5, #0ea5e9, #6d28d9);
          background-size: 300% 300%;
          animation: gradientShift 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .light .cta-btn-primary {
          background: linear-gradient(135deg, #6d28d9, #4f46e5) !important;
          animation: none !important;
        }
        .light .terminal-glow {
          box-shadow: 0 0 0 1px rgba(109,40,217,0.15), 0 8px 32px rgba(0,0,0,0.12) !important;
        }
        .light .ih-badge {
          background: hsl(252 80% 57% / 0.1) !important;
          border-color: hsl(252 80% 57% / 0.25) !important;
          color: hsl(252 80% 45%) !important;
        }

        /* trust line */
        .light .ih-trust {
          color: hsl(224 30% 35%) !important;
          font-weight: 500;
        }
        .light .ih-trust-dot { color: hsl(252 80% 55%) !important; }

        /* "Works with" label */
        .light .ih-works-label {
          color: hsl(224 25% 45%) !important;
          font-weight: 700;
        }
        .light .ih-works-line {
          background: hsl(220 18% 80%) !important;
          opacity: 1 !important;
        }

        /* tool pills in light mode — dark text on light tinted bg */
        .light .ih-tool-pill {
          background: hsl(220 18% 95%) !important;
          border-color: hsl(220 18% 82%) !important;
          color: hsl(224 40% 18%) !important;
          font-weight: 600 !important;
          box-shadow: 0 1px 3px hsl(224 20% 20% / 0.06) !important;
        }
        .light .ih-tool-pill:hover {
          background: hsl(252 80% 57% / 0.08) !important;
          border-color: hsl(252 80% 57% / 0.35) !important;
          color: hsl(252 80% 40%) !important;
        }

        /* stat cards in light mode */
        .light .ih-stat-card {
          background: hsl(0 0% 100%) !important;
          border-color: hsl(220 18% 84%) !important;
          box-shadow: 0 2px 12px hsl(224 20% 20% / 0.07), 0 0 0 1px hsl(220 18% 88%) !important;
        }
        .light .ih-stat-num { color: hsl(252 80% 48%) !important; }
        .light .ih-stat-label { color: hsl(224 40% 18%) !important; }
        .light .ih-stat-desc { color: hsl(224 20% 48%) !important; }
        .light .ih-stat-bar {
          background: linear-gradient(90deg, transparent, hsl(252 80% 57% / 0.5), transparent) !important;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16"
      >
        {/* ── Three.js neural network ── */}
        <ThreeBackground containerRef={sectionRef} />

        {/* ── Gradient overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" style={{ zIndex: 1 }} />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(260 80% 60% / 0.12), transparent)",
        }} />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ zIndex: 2,
          background: "linear-gradient(to bottom, transparent, hsl(var(--background)))",
        }} />

        {/* ── Grid pattern ── */}
        <div className="ih-grid absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

        {/* ── Main content ── */}
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center" style={{ zIndex: 4 }}>

          {/* Badge */}
          <div className="ih-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            Bangladesh's #1 AI Prompt Library
          </div>

          {/* Heading */}
          <h1 className="ih-heading text-5xl sm:text-6xl lg:text-[4.2rem] font-black tracking-tight leading-[1.07] mb-0">
            <span className="animated-gradient-text">Get real results</span>
            <span className="block text-foreground mt-1">with AI — from day&nbsp;one.</span>
          </h1>

          {/* Terminal typewriter */}
          <div className="ih-terminal mt-8 mx-auto max-w-xl">
            <div className="terminal-glow relative rounded-2xl border overflow-hidden text-left"
              style={{ background: "hsl(228 32% 7% / 0.92)", borderColor: "rgba(167,139,250,0.18)", backdropFilter: "blur(20px)" }}>

              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "hsl(228 32% 5% / 0.6)" }}>
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 text-[10px] font-mono text-white/25 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  promptland.ai — AI Prompt Terminal
                </span>
              </div>

              {/* Prompt line */}
              <div className="px-4 pt-3 pb-0.5 flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400/50 uppercase tracking-widest">›_ your prompt</span>
              </div>

              {/* Typewriter text */}
              <div className="px-4 pb-4 min-h-[3.2rem] flex items-start">
                <span className="text-sm font-mono leading-relaxed" style={{ color: "hsl(40 25% 90%)" }}>
                  {text}
                  <span className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle rounded-sm bg-purple-400"
                    style={{ animation: phase === "pausing" ? "cursorPulse 0.8s ease infinite" : "none", opacity: phase === "deleting" ? 0.3 : 1 }} />
                </span>
              </div>

              {/* Shimmer */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{ opacity: 0.025 }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
                  background: "linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)",
                  animation: "shimmer 5s ease-in-out infinite" }} />
              </div>
            </div>
          </div>

          {/* Sub copy */}
          <p className="ih-sub mt-5 text-sm sm:text-[0.97rem] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            The ultimate AI toolkit for creators, marketers & developers — including{" "}
            <span className="text-foreground font-medium">49 webpage prompts</span> to build any website or UI in one click.{" "}
            <span className="text-foreground font-medium">Copy. Paste. Go live.</span>
          </p>

          {/* CTAs */}
          <div className="ih-cta mt-7 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link to="/register" className="cta-btn-primary group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg overflow-hidden transition-all duration-200">
              <span className="absolute inset-0 pointer-events-none" style={{
                background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.12) 50%,transparent 100%)",
                transform: "translateX(-100%)", animation: "shimmer 3s ease-in-out infinite 1s",
              }} />
              Get Full Access — ৳199/mo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/demo" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200 backdrop-blur-sm">
              Try Free Prompts
            </Link>
          </div>

          <p className="ih-trust mt-2 text-[11px] text-muted-foreground/50">
            No traps
            <span className="ih-trust-dot mx-1.5 opacity-60">·</span>
            Instant access
            <span className="ih-trust-dot mx-1.5 opacity-60">·</span>
            bKash / Nagad accepted
          </p>

          {/* Works with */}
          <div className="ih-tools mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="ih-works-line h-px w-12 bg-gradient-to-r from-transparent to-border/50" />
              <span className="ih-works-label text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">Works with</span>
              <div className="ih-works-line h-px w-12 bg-gradient-to-l from-transparent to-border/50" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {TOOLS.map((tool, i) => {
                const colors = ["#a78bfa","#60a5fa","#34d399","#f472b6","#fbbf24","#fb923c","#22d3ee","#a78bfa","#60a5fa","#34d399","#f472b6"];
                const color = colors[i % colors.length];
                return (
                  <span
                    key={tool}
                    className="ih-tool-pill px-3.5 py-1.5 rounded-full text-[12px] font-semibold border backdrop-blur-sm transition-all duration-200 cursor-default"
                    style={{
                      background: `${color}12`,
                      borderColor: `${color}35`,
                      color: color,
                    }}
                  >
                    {tool}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <StatCard key={s.label} stat={s} index={i} />
            ))}
          </div>
        </div>

        {/* ── bottom divider ── */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ zIndex: 4,
          background: "linear-gradient(90deg,transparent,hsl(var(--border)/0.4),transparent)" }} />
      </section>
    </>
  );
};
