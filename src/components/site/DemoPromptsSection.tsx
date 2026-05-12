import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Copy, Check, Sparkles, Zap, Image, Wand2, MessageSquare,
  Bot, ArrowRight, Loader2, X, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoPrompts } from "@/hooks/useData";
import type { DemoPrompt } from "@/data/types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Email: MessageSquare, Content: Zap, Image,
  "GPT Image": Wand2, "Claude Skill": Bot, Social: Sparkles,
  Video: Zap, Automation: Zap,
};
const CATEGORY_COLORS: Record<string, string> = {
  Email: "#60a5fa", Content: "#34d399", Image: "#a78bfa",
  "GPT Image": "#f472b6", "Claude Skill": "#fb923c",
  Social: "#facc15", Video: "#22d3ee", Automation: "#4ade80",
};
function accent(cat: string) { return CATEGORY_COLORS[cat] || "#60a5fa"; }
function getIcon(cat: string): React.ElementType { return CATEGORY_ICONS[cat] || Sparkles; }

/* ── Detail Modal ─────────────────────────────────────────── */
function DetailModal({ prompt, onClose }: { prompt: DemoPrompt; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = getIcon(prompt.category);
  const color = accent(prompt.category);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {prompt.image_url && (
          <div className="w-full overflow-hidden rounded-t-2xl">
            <img src={prompt.image_url} alt={prompt.title} className="w-full object-cover" style={{ maxHeight: 420 }} />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
              <Icon style={{ color, height: 18, width: 18 }} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}18`, color }}>
              {prompt.category}
            </span>
            <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">FREE</span>
          </div>

          <h2 className="text-xl font-black text-foreground mb-4">{prompt.title}</h2>

          <div className="rounded-xl border border-border/50 bg-secondary/40 p-4 mb-5">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">{prompt.prompt}</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
              {copied ? <><Check className="h-4 w-4 text-emerald-400" />Copied!</> : <><Copy className="h-4 w-4" />Copy Prompt</>}
            </Button>
            <Button
              className="flex-1 gap-2 text-white"
              style={{ background: color }}
              onClick={() => window.open(prompt.test_url || "https://chat.openai.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4" /> Try It Free
            </Button>
          </div>

          <div className="mt-5 pt-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground mb-2">Want 1,000+ more prompts like this?</p>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/register">Get Full Access <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Prompt Card ──────────────────────────────────────────── */
function PromptCard({ prompt, onOpen }: { prompt: DemoPrompt; onOpen: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = getIcon(prompt.category);
  const color = accent(prompt.category);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onOpen}
      className="demo-card group cursor-pointer relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/80 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="h-0.5 w-full" style={{ background: color }} />

      {prompt.image_url ? (
        <div className="relative overflow-hidden">
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-black/40 border border-emerald-400/30 px-2 py-0.5 rounded-full backdrop-blur-sm">FREE</span>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center" style={{ background: `${color}08` }}>
          <Icon style={{ color, height: 28, width: 28, opacity: 0.35 }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
            <Icon className="h-3.5 w-3.5" style={{ color }} />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
            {prompt.category}
          </span>
          {!prompt.image_url && (
            <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">FREE</span>
          )}
        </div>

        <h3 className="text-sm font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{prompt.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prompt.prompt}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs h-8 rounded-lg border border-border/50 hover:border-border bg-secondary/30 hover:bg-secondary/60 transition-all font-medium"
          >
            {copied ? <><Check className="h-3 w-3 text-emerald-400" />Copied!</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
          <button
            onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs h-8 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ background: color }}
          >
            <Sparkles className="h-3 w-3" /> View
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export function DemoPromptsSection() {
  const { data: prompts = [], isLoading } = useDemoPrompts();
  const [selected, setSelected] = useState<DemoPrompt | null>(null);

  const activePrompts = prompts
    .filter(p => p.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 8);

  if (!isLoading && activePrompts.length === 0) return null;

  return (
    <section id="demo" className="py-20 relative">
      {selected && <DetailModal prompt={selected} onClose={() => setSelected(null)} />}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="demo-heading text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="h-3 w-3" />
            Free to Try — No Account Needed
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Try Before You <span className="text-gradient-primary">Buy</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Copy these free prompts into ChatGPT, Claude, or any AI tool. See the quality — then unlock 1,000+ more.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activePrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} onOpen={() => setSelected(prompt)} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/demo">
              See All Free Prompts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            900+ prompts · 600+ Claude Skills · 17,000+ image prompts & more
          </p>
        </div>
      </div>
    </section>
  );
}
