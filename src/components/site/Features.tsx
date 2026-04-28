import { BookOpen, Video, Wand2, Workflow, Search, Sparkles } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Incantations Library",
    desc: "900+ hand-forged prompt spells for ChatGPT, Claude, Gemini, and beyond. Each one tested, refined, and ready to cast — updated every week as models evolve.",
  },
  {
    icon: Video,
    title: "Arcane Tutorials",
    desc: "Deep-dive written and video walkthroughs of advanced AI techniques, new tools, and dark-arts prompt engineering. Master what your competitors haven't discovered.",
  },
  {
    icon: Sparkles,
    title: "Claude Skill Scrolls",
    desc: "Pre-forged instruction sets that transform Claude into a domain specialist. Browse the grimoire by category and deploy to your workflow in one click.",
  },
  {
    icon: Workflow,
    title: "Automation Rituals",
    desc: "Pre-wired Zapier, Make, and n8n blueprints. Import, configure, and let the machines execute while you sleep.",
  },
  {
    icon: Search,
    title: "Semantic Oracle",
    desc: "Type what you want to achieve — the AI conjures the exact incantation, tutorial, or template you need. No browsing. No guessing.",
  },
  {
    icon: BookOpen,
    title: "Transmutation Engine",
    desc: "Feed in a rough prompt. Get back a precision-engineered incantation that extracts 10× more power from any model — for text and image generation alike.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">The Grimoire</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="text-gradient">Every spell you need, </span>
            <span className="text-gradient-primary">updated before you ask.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            AI moves fast. New models, new capabilities, new tricks your competitors are already wielding.
            Most people scramble to keep up. PromptLand members don't.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Inside: hand-crafted prompt incantations for every LLM, video tutorials, automation grimoires,
            Claude skill scrolls, and more — all battle-tested and ready to execute the moment you find them.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-2xl glass p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-card opacity-60" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground font-mono">
          + Custom GPT Blueprints, AI Model Intel & more hidden in the vault.
        </p>
      </div>
    </section>
  );
};
