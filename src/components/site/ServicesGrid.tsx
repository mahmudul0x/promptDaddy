import {
  MessageSquare, Bot, Image, BriefcaseBusiness,
  Workflow, Search, Wand2, Video, ArrowRight,
  Sparkles, Banana, Film,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICES = [
  {
    icon: MessageSquare,
    titleKey: "llm.title",
    descKey: "llm.desc",
    tag: "900+ prompts",
    accent: "#60a5fa",
    badge: "Most Popular",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Image,
    titleKey: "image.title",
    descKey: "image.desc",
    tag: "146+ prompts",
    accent: "#a78bfa",
    img: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Wand2,
    titleKey: "gptimage.title",
    descKey: "gptimage.desc",
    tag: "298+ prompts",
    accent: "#8b5cf6",
    img: "https://images.unsplash.com/photo-1681400693765-a78e1a487025?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Sparkles,
    titleKey: "grok.title",
    descKey: "grok.desc",
    tag: "1,200+ prompts",
    accent: "#06b6d4",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Banana,
    titleKey: "nano.title",
    descKey: "nano.desc",
    tag: "13,900+ prompts",
    accent: "#eab308",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Film,
    titleKey: "seedance.title",
    descKey: "seedance.desc",
    tag: "2,300+ prompts",
    accent: "#f97316",
    img: "https://images.unsplash.com/photo-1536240478700-b869ad10e2c8?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Bot,
    titleKey: "claude.title",
    descKey: "claude.desc",
    tag: "50+ skills",
    accent: "#22d3ee",
    img: "https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Video,
    titleKey: "videos.title",
    descKey: "videos.desc",
    tag: "32+ videos",
    accent: "#ec4899",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: BriefcaseBusiness,
    titleKey: "starter.title",
    descKey: "starter.desc",
    tag: "500+ items",
    accent: "#fb923c",
    badge: "Beginner Friendly",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format&fit=crop",
  },
];

export const ServicesGrid = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="sg-heading text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-primary/50 inline-block" />
            {t('services.heading')}
            <span className="h-px w-5 bg-primary/50 inline-block" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('services.subheading')}
          </h2>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            {t('services.description')}
          </p>
        </div>

        {/* Grid */}
        <div className="sg-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, titleKey, descKey, tag, accent, badge, img }) => (
            <div
              key={titleKey}
              className="sg-card group relative rounded-2xl border border-border/40 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-border/70 hover:shadow-xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={img}
                  alt={t(titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, ${accent}22 0%, rgba(0,0,0,0.55) 100%)` }}
                />
                {/* accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

                {/* icon + badge row */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md"
                    style={{ background: `${accent}30`, border: `1px solid ${accent}50` }}
                  >
                    <Icon className="h-4.5 w-4.5" style={{ color: accent, height: 18, width: 18 }} strokeWidth={2} />
                  </div>
                  {badge && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md"
                      style={{ background: `${accent}30`, color: "#fff", border: `1px solid ${accent}50` }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {t(titleKey)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t(descKey)}</p>

                {/* Tag + arrow */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}30` }}
                  >
                    {tag}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top, ${accent}08 0%, transparent 70%)` }}
              />
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
            {t('cta.getAccess')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Or{" "}
            <a href="#pricing" className="text-primary hover:underline">
              {t('cta.seePlans')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
