import { Link, useParams } from "react-router-dom";
import {
  ArrowRight, Check, ArrowLeft, AlertCircle, Lightbulb,
  Quote, Zap, Star, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { USE_CASES } from "@/components/site/UseCasesSection";

/* ── All Use Cases listing page ─────────────────────────── */
export function UseCasesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-7xl">

          {/* Hero */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Who is this for?</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Built for every kind of{" "}
              <span className="text-gradient-primary">creator</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pick your role and see exactly which tools, prompts, and workflows inside PromptLand will work best for you.
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map(({ slug, icon: Icon, color, title, tagline, desc, benefits }) => (
              <Link
                key={slug}
                to={`/use-cases/${slug}`}
                className="group relative rounded-2xl border border-border/40 bg-card/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-border/70 hover:shadow-xl"
              >
                <div className="h-[2px] w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${color}10 0%, transparent 65%)` }} />

                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon className="h-6 w-6" style={{ color }} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {benefits.length} tools
                    </span>
                  </div>

                  <h2 className="text-base font-black text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h2>
                  <p className="text-xs font-bold mb-3" style={{ color }}>{tagline}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{desc}</p>

                  <ul className="space-y-1.5 mb-4">
                    {benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 shrink-0" style={{ color }} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                    See full guide <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-black mb-2">Ready to get started?</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              One membership unlocks everything for every use case listed here.
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
      </div>

      <SiteFooter />
    </main>
  );
}

/* ── Single Use Case detail page ────────────────────────── */
export function UseCaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const useCase = USE_CASES.find(u => u.slug === slug);

  if (!useCase) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="pt-40 text-center">
          <p className="text-muted-foreground mb-4">Use case not found.</p>
          <Button asChild variant="outline">
            <Link to="/use-cases"><ArrowLeft className="h-4 w-4 mr-2" />Back to Use Cases</Link>
          </Button>
        </div>
        <SiteFooter />
      </main>
    );
  }

  const { icon: Icon, color, title, tagline, desc, benefits, pain, howHelps, results, testimonial, tools } = useCase;
  const related = USE_CASES.filter(u => u.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${color}14, transparent)` }} />

        {/* breadcrumb */}
        <div className="mx-auto max-w-5xl mb-8">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/use-cases" className="hover:text-foreground transition-colors">Use Cases</Link>
            <ChevronRight className="h-3 w-3" />
            <span style={{ color }}>{title}</span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-5"
                style={{ borderColor: `${color}40`, background: `${color}12`, color }}>
                <Icon className="h-3.5 w-3.5" />
                Use Case Guide
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-4">
                PromptLand for<br />
                <span style={{ color }}>{title}s</span>
              </h1>

              <p className="text-lg font-semibold text-muted-foreground mb-3">{tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">{desc}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="gap-2 text-white shadow-lg"
                  style={{ background: color, boxShadow: `0 8px 24px ${color}40` }}>
                  <Link to="/register">
                    Get Access — ৳199/mo <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/demo">Try Free Prompts</Link>
                </Button>
              </div>

              {/* social proof micro-line */}
              <div className="mt-5 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {["#a78bfa","#60a5fa","#34d399","#f472b6","#fbbf24"].map((c, i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-background"
                      style={{ background: `${c}60` }} />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-xs text-muted-foreground">Trusted by 2,000+ creators</span>
              </div>
            </div>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {results.map(({ metric, label }, i) => (
                <div key={i} className="rounded-2xl border p-5 text-center"
                  style={{ borderColor: `${color}25`, background: `${color}07` }}>
                  <div className="text-3xl font-black mb-1" style={{ color }}>{metric}</div>
                  <div className="text-xs text-muted-foreground leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 pb-24 space-y-16">

        {/* Pain point — the problem we solve */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground mb-2">Sound familiar?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{pain}</p>
            </div>
          </div>
        </div>

        {/* How it helps — 4 cards */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}20` }}>
              <Lightbulb className="h-4 w-4" style={{ color }} />
            </div>
            <h2 className="text-2xl font-black">How PromptLand solves it</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {howHelps.map(({ title: ht, body }, i) => (
              <div key={i} className="relative rounded-2xl border p-6 overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200"
                style={{ borderColor: `${color}20`, background: `${color}05` }}>
                {/* number watermark */}
                <div className="absolute top-3 right-4 text-5xl font-black opacity-[0.06]"
                  style={{ color }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${color}20` }}>
                  <Check className="h-4 w-4" style={{ color }} />
                </div>
                <h3 className="text-sm font-black text-foreground mb-2">{ht}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ borderColor: `${color}25` }}>
          <div className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: `${color}20`, background: `${color}09` }}>
            <Zap className="h-4 w-4" style={{ color }} />
            <h2 className="text-base font-black">What's inside for {title}s</h2>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: `${color}06`, border: `1px solid ${color}15` }}>
                <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${color}22` }}>
                  <Check className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span className="text-sm text-foreground/85 leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools you can use with */}
        <div>
          <h2 className="text-lg font-black mb-4">Works with your existing tools</h2>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{ borderColor: `${color}35`, background: `${color}10`, color }}>
                {tool}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Every prompt works with any AI tool. Just copy, paste, and get results.
          </p>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-2xl font-black mb-8 text-center">Get started in 3 steps</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Sign up", desc: "Create your account and choose a plan. Instant access after payment — no waiting." },
              { step: "02", title: "Find your prompts", desc: `Browse the library filtered for ${title} workflows. Use the search to find exactly what you need.` },
              { step: "03", title: "Copy & get results", desc: "Drop any prompt into ChatGPT, Claude, or your AI of choice. Results in seconds." },
            ].map(({ step, title: t, desc }) => (
              <div key={step} className="relative rounded-2xl border border-border/40 bg-card/60 p-6">
                <div className="text-4xl font-black mb-4 leading-none" style={{ color, opacity: 0.18 }}>{step}</div>
                <h3 className="text-sm font-black text-foreground mb-2">{t}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                {step !== "03" && (
                  <ArrowRight className="absolute top-6 -right-3 h-5 w-5 text-border hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="rounded-2xl border p-8 relative overflow-hidden"
          style={{ borderColor: `${color}25`, background: `${color}06` }}>
          <Quote className="absolute top-5 right-6 h-12 w-12 opacity-[0.08]" style={{ color }} />
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 text-lg font-black"
              style={{ background: `${color}25`, color }}>
              {testimonial.name[0]}
            </div>
            <div>
              <p className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="text-xs font-black text-foreground">{testimonial.name}</div>
                <div className="text-[11px] text-muted-foreground">{testimonial.role}</div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA */}
        <div className="rounded-2xl border p-10 text-center"
          style={{ borderColor: `${color}30`, background: `${color}07` }}>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-5"
            style={{ background: `${color}22`, border: `2px solid ${color}35` }}>
            <Icon className="h-7 w-7" style={{ color }} />
          </div>
          <h2 className="text-3xl font-black mb-2">Start as a {title} today</h2>
          <p className="text-muted-foreground text-sm mb-2 max-w-sm mx-auto">
            One membership. Everything you need. Cancel anytime.
          </p>
          <p className="text-xs text-muted-foreground mb-7">
            bKash · Nagad · Card accepted — Instant access after payment
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2 text-white shadow-lg"
              style={{ background: color, boxShadow: `0 8px 24px ${color}40` }}>
              <Link to="/register">Get Full Access — ৳199/mo <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Related use cases */}
        <div>
          <h2 className="text-lg font-black mb-5">Explore other use cases</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(({ slug: s, icon: RIcon, color: rc, title: rt, tagline: rtag, desc: rdesc }) => (
              <Link key={s} to={`/use-cases/${s}`}
                className="group rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-border/70 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${rc}, transparent)` }} />
                <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${rc}18`, border: `1px solid ${rc}30` }}>
                  <RIcon className="h-4 w-4" style={{ color: rc }} />
                </div>
                <div className="text-sm font-black text-foreground group-hover:text-primary transition-colors mb-0.5">{rt}</div>
                <div className="text-[11px] font-semibold mb-2" style={{ color: rc }}>{rtag}</div>
                <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{rdesc}</div>
                <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold" style={{ color: rc }}>
                  See guide <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
