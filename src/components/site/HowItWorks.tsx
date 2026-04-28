import { Calendar, Layers, Cpu } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "Fresh Spells Forged",
    desc: "We track every model update, capability drop, and breakthrough technique. Your grimoire reflects what actually works right now — not six months ago.",
  },
  {
    icon: Layers,
    title: "New Grimoires Compiled",
    desc: "A significant new AI tool emerges? We build an entire library around it before the crowd catches on. First-mover advantage, served on a silver platter.",
  },
  {
    icon: Cpu,
    title: "Model Intel Updated",
    desc: "Which LLM casts the strongest spell for your specific task today? The answer lives on your dashboard — recalibrated as the AI landscape shifts.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">The ritual</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Fresh spells. Every week.</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            AI never sleeps, and neither does our content lab. New models surface? We've already cast them, documented the patterns, and pushed the spells to your vault.
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
                Ritual {i + 1}
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
