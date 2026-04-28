import { Search, Wand2, Image as ImageIcon, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Search,
    title: "AI Search",
    desc: "Describe what you want to achieve. Instantly surface the exact prompt, tutorial, or template you need — across all 1,000+ resources.",
  },
  {
    icon: Wand2,
    title: "Prompt Enhancer",
    desc: "Paste any rough prompt and get a precision-engineered version back — structured to produce significantly better output from any LLM.",
  },
  {
    icon: ImageIcon,
    title: "Image Prompt Builder",
    desc: "Describe a concept and get a structured prompt engineered for gallery-quality results from DALL·E 3, Midjourney, or Flux.",
  },
  {
    icon: Sparkles,
    title: "Claude Skills",
    desc: "Pre-built instruction sets that turn Claude into a specialist for any domain. One slash command to activate. Ready to use immediately.",
  },
];

export const ToolsSection = () => {
  return (
    <section id="tools" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Built-in tools</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="text-gradient">Sharper prompts. </span>
              <span className="text-gradient-primary">Better results.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every tool inside PromptLand has one purpose: help you get more out of AI faster. Search smarter, enhance prompts instantly, and deploy specialist AI skills in seconds.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <a href="#pricing">
                See everything included
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-accent opacity-20 blur-3xl rounded-full" aria-hidden="true" />
            <div className="relative grid sm:grid-cols-2 gap-4">
              {tools.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                    <Icon className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transmuter demo */}
        <div className="mt-16 glass rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {`// prompt_enhancer.live`}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-secondary/60 border border-border p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                input: rough prompt
              </div>
              <p className="text-sm text-foreground/60 font-mono">{">"} write a blog post about AI...</p>
            </div>
            <div className="rounded-xl bg-secondary/60 border border-primary/30 p-5 shadow-glow">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
                output: enhanced ✦
              </div>
              <p className="text-sm text-muted-foreground font-mono">{">"} precision-engineered version ready...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
