import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Sparkles, Zap, Image, Wand2, MessageSquare, Bot, ArrowRight, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { useDemoPrompts } from "@/hooks/useData";
import type { DemoPrompt } from "@/data/types";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Email: MessageSquare,
  Content: Zap,
  Image,
  "GPT Image": Wand2,
  "Claude Skill": Bot,
  Social: Sparkles,
  Video: Zap,
  Automation: Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  Email: "#60a5fa",
  Content: "#34d399",
  Image: "#a78bfa",
  "GPT Image": "#f472b6",
  "Claude Skill": "#fb923c",
  Social: "#facc15",
  Video: "#22d3ee",
  Automation: "#4ade80",
};

function PromptCard({ prompt, index }: { prompt: DemoPrompt; index: number }) {
  const [copied, setCopied] = useState(false);
  const Icon = CATEGORY_ICONS[prompt.category] || Sparkles;
  const accent = CATEGORY_COLORS[prompt.category] || "#60a5fa";

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="demo-card group relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/80 hover:-translate-y-1 hover:shadow-lg"
      style={{ opacity: 0, transform: "translateY(24px)" }}
    >
      {/* accent top bar */}
      <div className="h-0.5 w-full" style={{ background: accent }} />

      {prompt.image_url && (
        <div className="relative overflow-hidden">
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accent}20` }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} />
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>
            {prompt.category}
          </span>
          <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">FREE</span>
        </div>

        <h3 className="text-sm font-bold mb-2 line-clamp-1">{prompt.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{prompt.prompt}</p>

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="flex-1 text-xs h-8 border border-border/40 hover:border-border"
          >
            {copied ? (
              <><Check className="h-3 w-3 mr-1 text-emerald-400" />Copied!</>
            ) : (
              <><Copy className="h-3 w-3 mr-1" />Copy Prompt</>
            )}
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs h-8"
            style={{ background: accent }}
            onClick={() => window.open(prompt.test_url || "https://chat.openai.com", "_blank")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Try It
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DemoPromptsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: prompts = [], isLoading } = useDemoPrompts();

  const activePrompts = prompts.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (!sectionRef.current || activePrompts.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".demo-heading", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".demo-heading",
          start: "top 85%",
        },
      });

      gsap.to(".demo-card", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".demo-card",
          start: "top 88%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activePrompts.length]);

  if (!isLoading && activePrompts.length === 0) return null;

  return (
    <section id="demo" ref={sectionRef} className="py-20 relative">
      {/* subtle bg glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="demo-heading text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="h-3 w-3" />
            Free to Try — No Account Needed
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Try Before You{" "}
            <span className="text-gradient-primary">Buy</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Copy these free prompts and paste them into ChatGPT, Claude, or any AI tool. See the quality yourself — then unlock 1,000+ more.
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activePrompts.map((prompt, i) => (
              <PromptCard key={prompt.id} prompt={prompt} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/demo">
              See All Free Prompts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            900+ prompts, 600+ Claude Skills, 17,000+ image prompts & more
          </p>
        </div>
      </div>
    </section>
  );
}
