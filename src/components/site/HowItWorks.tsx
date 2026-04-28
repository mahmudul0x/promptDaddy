import { Calendar, Layers, Cpu } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "New prompts every week",
    desc: "We track every model update, capability release, and workflow breakthrough. Your library reflects what actually works right now — not what worked six months ago.",
  },
  {
    icon: Layers,
    title: "New tools covered fast",
    desc: "When a significant new AI tool or model drops, we build a dedicated resource set around it before the crowd catches on. Stay ahead without doing the research yourself.",
  },
  {
    icon: Cpu,
    title: "Model recommendations updated",
    desc: "Which LLM performs best for your specific task this week? The answer is on your dashboard — updated as the AI landscape shifts so you always use the right tool.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Always up to date</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Fresh content. Every week.</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            AI moves fast — new models, new techniques, new tools your competitors are already using. PromptLand members always have the latest resources, updated every single week.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative glass rounded-2xl p-7 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow animate-pulse-glow">
                <s.icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </div>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
