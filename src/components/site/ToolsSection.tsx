import { Search, Wand2, Image as ImageIcon, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Search,
    title: "Semantic Oracle",
    desc: "Describe what you want to achieve. The AI conjures the exact incantation, tutorial, or template from the vault — instantly.",
  },
  {
    icon: Wand2,
    title: "Incantation Transmuter",
    desc: "Paste in any rough prompt. Our engine rewrites it with advanced prompting alchemy to extract 10× more power from any LLM.",
  },
  {
    icon: ImageIcon,
    title: "Visual Spellcaster",
    desc: "Describe a scene or concept. Receive a structured prompt engineered to produce gallery-quality images from DALL·E, Midjourney, or Flux.",
  },
  {
    icon: Sparkles,
    title: "Skill Scroll Deployer",
    desc: "Pre-forged instruction sets that summon Claude's full specialist potential for any domain. Drop in. Activate. Execute.",
  },
];

export const ToolsSection = () => {
  return (
    <section id="tools" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Arcane Instruments</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="text-gradient">Sharper tools. </span>
              <span className="text-gradient-primary">Deadlier spells.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every instrument in your forge has one purpose: make your prompts more powerful and your workflow faster. Built by practitioners, for practitioners.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <a href="#pricing">
                See the full arsenal
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
            {`// incantation_transmuter.live`}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-secondary/60 border border-border p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                input: raw_prompt
              </div>
              <p className="text-sm text-foreground/60 font-mono">{">"} type your prompt here...</p>
            </div>
            <div className="rounded-xl bg-secondary/60 border border-primary/30 p-5 shadow-glow">
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
                output: transmuted ✦
              </div>
              <p className="text-sm text-muted-foreground font-mono">{">"} engineered incantation awaits...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
