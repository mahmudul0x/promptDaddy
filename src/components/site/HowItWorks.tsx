import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserPlus, CreditCard, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    titleKey: "how.step1.title",
    descKey: "how.step1.desc",
    accent: "#60a5fa",
  },
  {
    icon: CreditCard,
    step: "02",
    titleKey: "how.step2.title",
    descKey: "how.step2.desc",
    accent: "#f59e0b",
  },
  {
    icon: Zap,
    step: "03",
    titleKey: "how.step3.title",
    descKey: "how.step3.desc",
    accent: "#4ade80",
  },
];

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-heading",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.65,
          scrollTrigger: { trigger: ".hiw-heading", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".hiw-step",
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: ".hiw-steps", start: "top 80%", once: true },
        }
      );

      // Animate connecting line progress on scroll
      gsap.fromTo(
        ".hiw-connector",
        { scaleY: 0 },
        {
          scaleY: 1, duration: 0.6, stagger: 0.15, ease: "none",
          scrollTrigger: { trigger: ".hiw-steps", start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="hiw-heading text-center mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">{t('how.title')}</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gradient">
            {t('how.subtitle')}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('how.description')}
          </p>
        </div>

        <div className="hiw-steps relative flex flex-col gap-0">
          {STEPS.map((s, i) => (
            <div key={s.step} className="hiw-step relative flex gap-6 items-start">
              {/* Left col — icon + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: `${s.accent}18`, border: `1.5px solid ${s.accent}40` }}
                >
                  <s.icon className="h-5 w-5" style={{ color: s.accent }} strokeWidth={2} />
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="hiw-connector mt-1 w-px flex-1 min-h-[3rem] origin-top"
                    style={{ background: `linear-gradient(to bottom, ${s.accent}50, transparent)` }}
                  />
                )}
              </div>

              {/* Right col — content */}
              <div className="pb-10">
                <span
                  className="text-[10px] font-mono font-bold tracking-widest"
                  style={{ color: s.accent }}
                >
                  STEP {s.step}
                </span>
                <h3 className="mt-1 text-base font-bold text-foreground">{t(s.titleKey)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
