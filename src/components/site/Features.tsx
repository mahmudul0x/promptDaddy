import { MessageSquare, Video, Wand2, Workflow, Search, Sparkles, Bot, Image, BriefcaseBusiness, TrendingUp } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Prompt Library",
    desc: "1,000+ expert prompts for ChatGPT, Claude, and Gemini — organised by category, tested for real results, and updated every week as AI models evolve.",
    accent: "#60a5fa",
  },
  {
    icon: Bot,
    title: "Claude Skills",
    desc: "Pre-built instruction sets that turn Claude into a specialist — data analyst, copywriter, SEO strategist, and 100+ more. Activate with one slash command.",
    accent: "#a78bfa",
  },
  {
    icon: Image,
    title: "Image Prompts",
    desc: "500+ prompts engineered for Midjourney, DALL·E 3, and Flux. Product photography, UGC photos, social graphics — copy, paste, generate.",
    accent: "#f472b6",
  },
  {
    icon: BriefcaseBusiness,
    title: "AI Starter Kit",
    desc: "450 prompts and 20 Claude Skills built specifically for solopreneurs — structured by business function so you know exactly what to use and when.",
    accent: "#f59e0b",
  },
  {
    icon: TrendingUp,
    title: "Trending Prompts",
    desc: "A live-updated leaderboard of the highest-performing prompts this week — ranked by real usage from our entire member community.",
    accent: "#f97316",
  },
  {
    icon: Workflow,
    title: "Automation Templates",
    desc: "Ready-to-import n8n, Zapier, and Make blueprints. Connect your tools, set the workflow, and let the automation run while you focus on what matters.",
    accent: "#4ade80",
  },
  {
    icon: Search,
    title: "AI Search",
    desc: "Describe what you want to achieve and instantly surface the exact prompt, tutorial, or template you need — across all 1,000+ resources.",
    accent: "#22d3ee",
  },
  {
    icon: Wand2,
    title: "Prompt Enhancer",
    desc: "Paste any rough prompt and get a precision-engineered version back — structured for maximum output quality from any LLM or image model.",
    accent: "#c084fc",
  },
  {
    icon: Video,
    title: "Tutorials & Videos",
    desc: "In-depth written guides and video walkthroughs covering advanced AI techniques, new tools, and practical workflows — explained clearly and updated regularly.",
    accent: "#fb923c",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <span className="h-px w-6 bg-primary/50 inline-block" />
            Everything included
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            One membership.{" "}
            <span
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Everything you need.
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            AI moves fast. New models, new capabilities, new workflows your competitors are already using.
            PromptLand members always stay ahead — with tools and content updated every single week.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border/40 bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${accent}08 0%, transparent 60%)` }}
              />
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground/60 font-mono">
          + Custom GPTs · AI Model Recommendations · AI News Feed · and more
        </p>
      </div>
    </section>
  );
};
