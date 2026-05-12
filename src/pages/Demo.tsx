import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Copy, Check, Sparkles, Zap, Image, Wand2, MessageSquare,
  Bot, Loader2, X, ExternalLink, ArrowRight, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useDemoPrompts } from "@/hooks/useData";
import type { DemoPrompt } from "@/data/types";

/* ── constants ─────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Email: MessageSquare, Content: Zap, Image, "GPT Image": Wand2,
  "Claude Skill": Bot, Social: Sparkles, Video: Zap, Automation: Zap,
};
const CATEGORY_COLORS: Record<string, string> = {
  Email: "#60a5fa", Content: "#34d399", Image: "#a78bfa",
  "GPT Image": "#f472b6", "Claude Skill": "#fb923c",
  Social: "#facc15", Video: "#22d3ee", Automation: "#4ade80",
};
function accent(cat: string) { return CATEGORY_COLORS[cat] || "#60a5fa"; }
function getIcon(cat: string): React.ElementType { return CATEGORY_ICONS[cat] || Sparkles; }

/* ── Detail Modal ───────────────────────────────────────────── */
function DetailModal({ prompt, onClose }: { prompt: DemoPrompt; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = getIcon(prompt.category);
  const color = accent(prompt.category);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* full image */}
        {prompt.image_url && (
          <div className="w-full overflow-hidden rounded-t-2xl">
            <img
              src={prompt.image_url}
              alt={prompt.title}
              className="w-full object-cover"
              style={{ maxHeight: 420 }}
            />
          </div>
        )}

        <div className="p-6">
          {/* category + free badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}20` }}>
              <Icon className="h-4.5 w-4.5" style={{ color, height: 18, width: 18 }} />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${color}18`, color }}>
              {prompt.category}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full ml-auto">
              FREE
            </span>
          </div>

          <h2 className="text-xl font-black text-foreground mb-4">{prompt.title}</h2>

          {/* prompt box */}
          <div className="relative rounded-xl border border-border/50 bg-secondary/40 p-4 mb-5">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">
              {prompt.prompt}
            </p>
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 gap-2"
            >
              {copied
                ? <><Check className="h-4 w-4 text-emerald-400" /> Copied!</>
                : <><Copy className="h-4 w-4" /> Copy Prompt</>}
            </Button>
            <Button
              className="flex-1 gap-2"
              style={{ background: color }}
              onClick={() => window.open(prompt.test_url || "https://chat.openai.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4" /> Try It Free
            </Button>
          </div>

          <div className="mt-5 pt-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground mb-2">Want 1,000+ more prompts like this?</p>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/register">
                Get Full Access <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Prompt Card ────────────────────────────────────────────── */
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
      className="group cursor-pointer relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/80 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* accent bar */}
      <div className="h-0.5 w-full" style={{ background: color }} />

      {/* image */}
      {prompt.image_url ? (
        <div className="relative overflow-hidden">
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-emerald-400/15 border border-emerald-400/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            FREE
          </span>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center" style={{ background: `${color}08` }}>
          <Icon style={{ color, height: 32, width: 32, opacity: 0.4 }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${color}20` }}>
            <Icon className="h-3.5 w-3.5" style={{ color }} />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}15`, color }}>
            {prompt.category}
          </span>
          {!prompt.image_url && (
            <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">FREE</span>
          )}
        </div>

        <h3 className="text-sm font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {prompt.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prompt.prompt}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs h-8 rounded-lg border border-border/50 hover:border-border bg-secondary/30 hover:bg-secondary/60 transition-all font-medium"
          >
            {copied
              ? <><Check className="h-3 w-3 text-emerald-400" />Copied!</>
              : <><Copy className="h-3 w-3" />Copy</>}
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

/* ── Main Page ──────────────────────────────────────────────── */
const Demo = () => {
  const { data: allPrompts = [], isLoading } = useDemoPrompts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<DemoPrompt | null>(null);

  const prompts = useMemo(
    () => allPrompts.filter(p => p.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [allPrompts]
  );

  const categories = useMemo(() => {
    const cats = Array.from(new Set(prompts.map(p => p.category)));
    return ["All", ...cats];
  }, [prompts]);

  const filtered = useMemo(
    () => activeCategory === "All" ? prompts : prompts.filter(p => p.category === activeCategory),
    [prompts, activeCategory]
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {selected && <DetailModal prompt={selected} onClose={() => setSelected(null)} />}

      {/* Hero */}
      <div className="pt-32 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-5">
          <Sparkles className="h-3 w-3" />
          {prompts.length} Free Prompts — No Account Needed
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Try Before You <span className="text-gradient-primary">Buy</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed mb-8">
          Copy these free prompts into ChatGPT, Claude, or any AI tool. See the quality yourself — then unlock 1,000+ more.
        </p>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => {
              const active = cat === activeCategory;
              const color = cat === "All" ? "#60a5fa" : accent(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={active
                    ? { background: `${color}20`, color, borderColor: `${color}50` }
                    : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }
                  }
                >
                  {cat === "All" ? <><Filter className="inline h-3 w-3 mr-1" />All</> : cat}
                  {cat !== "All" && (
                    <span className="ml-1.5 opacity-60">
                      {prompts.filter(p => p.category === cat).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p>No prompts available yet.</p>
            <Link to="/" className="text-primary hover:underline mt-2 inline-block">← Back to Home</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} onOpen={() => setSelected(prompt)} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-black mb-2">Ready for the Full Library?</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            900+ prompts, 600+ Claude Skills, 17,000+ image prompts, automation templates & more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/register">Get Full Access <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
};

export default Demo;
