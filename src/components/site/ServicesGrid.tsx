import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageSquare, Bot, Image, BriefcaseBusiness, TrendingUp,
  Workflow, Search, Wand2, Video, ArrowRight,
  Sparkles, Banana, Zap, Cpu, GraduationCap, Film,
} from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: MessageSquare,
    title: "LLM Prompts",
    desc: "900+ expert prompts for ChatGPT, Claude & Gemini — organized by category, copy-paste ready.",
    tag: "900+ prompts",
    accent: "#60a5fa",
    badge: "Most Popular",
  },
  {
    icon: Image,
    title: "Image Prompts",
    desc: "146+ prompts for Midjourney, DALL·E 3 & Flux. Product photography, UGC, social graphics.",
    tag: "146+ prompts",
    accent: "#a78bfa",
  },
  {
    icon: Wand2,
    title: "GPT Image",
    desc: "298+ prompts for OpenAI GPT Image generation with scores and ratings.",
    tag: "298+ prompts",
    accent: "#8b5cf6",
  },
  {
    icon: Sparkles,
    title: "Grok Imagine",
    desc: "1,200+ prompts for xAI Grok image generation from curated sources.",
    tag: "1,200+ prompts",
    accent: "#06b6d4",
  },
  {
    icon: Banana,
    title: "Nano Banana",
    desc: "13,900+ curated image generation prompts with reference media.",
    tag: "13,900+ prompts",
    accent: "#eab308",
  },
  {
    icon: Film,
    title: "Seedance",
    desc: "2,300+ AI video generation prompts for Seedance platform.",
    tag: "2,300+ prompts",
    accent: "#f97316",
  },
  {
    icon: Bot,
    title: "Claude Skills",
    desc: "50+ instruction sets that turn Claude into a specialist.",
    tag: "50+ skills",
    accent: "#22d3ee",
  },
  {
    icon: Video,
    title: "Videos",
    desc: "32+ video tutorials covering advanced AI techniques.",
    tag: "32+ videos",
    accent: "#ec4899",
  },
  {
    icon: BriefcaseBusiness,
    title: "Starter Kit",
    desc: "500+ prompts & 20 Claude Skills structured for solopreneurs.",
    tag: "500+ items",
    accent: "#fb923c",
    badge: "Beginner Friendly",
  },
];

export const ServicesGrid = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        ".sg-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7,
          scrollTrigger: {
            trigger: ".sg-heading",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Cards stagger
      gsap.fromTo(
        ".sg-card",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sg-grid",
            start: "top 80%",
            once: true,
          },
        }
      );

      // CTA row
      gsap.fromTo(
        ".sg-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: {
            trigger: ".sg-cta",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="sg-heading text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-primary/50 inline-block" />
            One membership. Everything inside.
            <span className="h-px w-5 bg-primary/50 inline-block" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Nine tools to supercharge
            <span
              className="block"
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              your AI workflow.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            Every resource is hand-tested, organized, and updated weekly — so you always have what's working right now.
          </p>
        </div>

        {/* Grid */}
        <div className="sg-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, tag, accent, badge }) => (
            <div
              key={title}
              className="sg-card group relative rounded-2xl border border-border/40 bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-lg overflow-hidden cursor-pointer"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${accent}10 0%, transparent 65%)` }}
              />

              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={2} />
                </div>
                {badge && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    {badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>

              {/* Tag */}
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-bold px-2 py-1 rounded-lg"
                  style={{ 
                    color: accent,
                    background: `${accent}18`,
                    border: `1px solid ${accent}35`,
                  }}
                >
                  {tag}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="sg-cta mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold shadow-glow transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
          >
            Get Full Access — ৳199/mo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Or{" "}
            <a href="#pricing" className="text-primary hover:underline">
              see all plans including Lifetime
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
