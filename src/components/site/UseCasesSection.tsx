import { ArrowRight, Pen, TrendingUp, Code2, Video, ShoppingBag, Building2, GraduationCap, Megaphone, Briefcase, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const USE_CASES = [
  {
    slug: "content-creator",
    icon: Pen,
    color: "#a78bfa",
    title: "Content Creator",
    tagline: "Go viral. Every time.",
    desc: "Generate scroll-stopping captions, video scripts, and blog posts in minutes. Never stare at a blank page again.",
    benefits: [
      "YouTube & TikTok script templates",
      "Caption generators for Instagram & X",
      "Blog post outlines & full drafts",
      "Repurpose one idea into 10 formats",
    ],
    pain: "You spend hours staring at a blank screen, miss posting schedules, and watch your engagement drop while competitors post daily. Creating original content every single day feels impossible.",
    howHelps: [
      { title: "Never run out of ideas", body: "Our topic generators create 30 days of content in one session. Just enter your niche and get a full calendar — with angles, hooks, and formats already planned." },
      { title: "Scripts that actually convert", body: "Hook-optimized video scripts for YouTube and TikTok. Every script follows proven viral structures — strong open, value delivery, clear CTA." },
      { title: "Repurpose in seconds", body: "Turn one blog post into 10 tweets, 3 Instagram carousels, a newsletter, and a YouTube script. One idea. Maximum reach." },
      { title: "Consistent brand voice", body: "Claude Skills that learn your tone. Once set up, every piece of content sounds like you — not a generic AI." },
    ],
    results: [
      { metric: "3×", label: "more content per week" },
      { metric: "60%", label: "faster writing speed" },
      { metric: "10×", label: "idea formats from one topic" },
      { metric: "0", label: "blank-page moments" },
    ],
    testimonial: {
      quote: "I went from posting twice a week to posting daily across 3 platforms — without burning out. The script templates alone are worth the price.",
      name: "Content Creator",
      role: "100K+ YouTube subscribers",
    },
    tools: ["ChatGPT", "Claude", "Notion", "Instagram", "TikTok", "YouTube"],
  },
  {
    slug: "marketer",
    icon: TrendingUp,
    color: "#60a5fa",
    title: "Digital Marketer",
    tagline: "10x your campaign output.",
    desc: "Cold emails that get 40%+ open rates, ad copy that converts, and SEO content that ranks — all prompt-ready.",
    benefits: [
      "Cold email sequences with high open rates",
      "Facebook & Google ad copy templates",
      "SEO blog prompts with keyword focus",
      "Social media campaign planners",
    ],
    pain: "You write dozens of ad variations that flop, cold emails that get ignored, and blog posts that never rank. Every campaign feels like a gamble — and your budget keeps shrinking.",
    howHelps: [
      { title: "Cold emails that actually get replies", body: "Subject line formulas proven at 40%+ open rates. Personalization hooks, value-first openers, and low-pressure CTAs that make prospects respond." },
      { title: "Ad copy for every platform", body: "Facebook, Google, LinkedIn, TikTok — structured ad prompts for every placement. Headline, primary text, description, CTA all in one shot." },
      { title: "SEO content that ranks", body: "Keyword-focused blog prompts with proper structure: H1, H2s, internal linking cues, LSI terms, and meta description baked in." },
      { title: "Campaign planning in minutes", body: "Full campaign briefs — target audience, messaging angles, channel mix, content calendar — generated from a single product description." },
    ],
    results: [
      { metric: "40%+", label: "cold email open rates" },
      { metric: "5×", label: "ad variations per hour" },
      { metric: "3×", label: "faster content production" },
      { metric: "Top 10", label: "SEO ranking improvement" },
    ],
    testimonial: {
      quote: "Our agency output tripled. We're writing better copy in a fraction of the time — and our clients are seeing real results.",
      name: "Digital Marketing Manager",
      role: "E-commerce brand, 7-figure revenue",
    },
    tools: ["ChatGPT", "Claude", "Google Ads", "Facebook Ads", "Mailchimp", "Ahrefs"],
  },
  {
    slug: "developer",
    icon: Code2,
    color: "#34d399",
    title: "Developer",
    tagline: "Ship faster with AI.",
    desc: "Turn Claude into your personal senior engineer. Debug code, write docs, generate boilerplate, and build faster.",
    benefits: [
      "Claude Skills for code review & refactor",
      "API documentation generators",
      "Bug-fix and explain-this-code prompts",
      "Architecture planning templates",
    ],
    pain: "You waste hours writing boilerplate, debugging cryptic errors, and writing documentation nobody reads. Stack Overflow answers are outdated. ChatGPT gives generic code that doesn't fit your codebase.",
    howHelps: [
      { title: "Claude Skills that know your stack", body: "Pre-built Claude Skills for React, Node, Python, SQL, and more. Drop them in and Claude understands your codebase conventions, not just generic patterns." },
      { title: "Debug in one prompt", body: "Paste your error + stack trace and get a precise fix with explanation. No more 30-minute Stack Overflow rabbit holes." },
      { title: "Docs that write themselves", body: "API documentation, README files, code comments — prompts that generate professional docs from your function signatures and descriptions." },
      { title: "Architecture decisions made easy", body: "Planning a new feature or system? Prompts that walk you through trade-offs, patterns, and tech choices — like a senior eng code review, on demand." },
    ],
    results: [
      { metric: "2×", label: "faster feature shipping" },
      { metric: "80%", label: "less time debugging" },
      { metric: "10min", label: "to generate full docs" },
      { metric: "0", label: "boilerplate written by hand" },
    ],
    testimonial: {
      quote: "The Claude Skills are insane. I set up one for my project and it understands my whole codebase. It's like having a senior dev available 24/7.",
      name: "Full-stack Developer",
      role: "SaaS startup founder",
    },
    tools: ["Claude", "VS Code", "GitHub Copilot", "ChatGPT", "Cursor", "Postman"],
  },
  {
    slug: "video-creator",
    icon: Video,
    color: "#f472b6",
    title: "Video Creator",
    tagline: "AI video prompts that impress.",
    desc: "Access 2,300+ Seedance video prompts and Grok image prompts to build stunning AI-generated video content.",
    benefits: [
      "2,300+ Seedance video generation prompts",
      "1,200+ Grok Imagine prompts",
      "13,900+ NanoBanana image prompts",
      "Scene composition & cinematography tips",
    ],
    pain: "AI video tools are powerful but the prompts make or break the output. Bad prompts = blurry, generic, off-brand videos. You spend more time fixing AI outputs than creating.",
    howHelps: [
      { title: "2,300+ Seedance prompts that actually work", body: "Every prompt is tested for Seedance's model. Cinematic shots, motion styles, lighting setups, transitions — all pre-engineered for stunning output." },
      { title: "Image-to-video ready", body: "1,200+ Grok Imagine prompts to generate source images, then seamlessly animate them with Seedance prompts. Full pipeline covered." },
      { title: "Massive image library for thumbnails", body: "13,900+ NanoBanana prompts for ultra-high-quality static images — perfect for YouTube thumbnails, social banners, and brand visuals." },
      { title: "Cinematography built-in", body: "Camera angles, depth of field, color grading, mood — prompts that include professional cinematography cues so your AI videos look shot on a real camera." },
    ],
    results: [
      { metric: "2,300+", label: "Seedance video prompts" },
      { metric: "13,900+", label: "image generation prompts" },
      { metric: "10×", label: "faster video production" },
      { metric: "100%", label: "tested & working prompts" },
    ],
    testimonial: {
      quote: "I've been making AI videos for 6 months. The quality jump after using these prompts is unreal. My client videos look like they cost 10x more to produce.",
      name: "AI Video Producer",
      role: "Freelance creative agency",
    },
    tools: ["Seedance", "Grok", "NanoBanana", "Kling AI", "Runway", "GPT-4o"],
  },
  {
    slug: "ecommerce-seller",
    icon: ShoppingBag,
    color: "#fbbf24",
    title: "E-commerce Seller",
    tagline: "Sell more with better copy.",
    desc: "Write product descriptions, launch email campaigns, and create ad creative that drives real sales.",
    benefits: [
      "Product description generators",
      "Launch email sequence templates",
      "UGC-style image prompt library",
      "Review response & customer care scripts",
    ],
    pain: "Your product descriptions are flat and forgettable. Your email campaigns get ignored. You're spending money on ads but the copy doesn't convert. Writing for 100+ SKUs manually is a nightmare.",
    howHelps: [
      { title: "Product descriptions that sell", body: "Features → benefits conversion prompts. Each description addresses the customer's desire, removes objections, and ends with a clear reason to buy now." },
      { title: "Launch emails that get opened", body: "Full launch sequences: teaser, launch day, social proof, last chance. Subject lines, preview text, and body copy — all done in one prompt session." },
      { title: "UGC-style content without the influencer", body: "Prompts for generating authentic-looking user-generated content images. Real people, real settings, your product — without the expensive photoshoot." },
      { title: "Customer service that builds loyalty", body: "Review response templates, complaint handling scripts, and follow-up sequences. Turn every customer interaction into a retention opportunity." },
    ],
    results: [
      { metric: "3×", label: "conversion rate improvement" },
      { metric: "100+", label: "product descriptions per hour" },
      { metric: "45%", label: "email open rate average" },
      { metric: "50%", label: "less time on customer service" },
    ],
    testimonial: {
      quote: "I wrote product descriptions for 200 SKUs in one afternoon. Sales went up 40% in the first month after updating our store copy.",
      name: "Shopify Store Owner",
      role: "Fashion & lifestyle brand",
    },
    tools: ["Shopify", "ChatGPT", "Klaviyo", "Canva", "Claude", "GPT-4o Image"],
  },
  {
    slug: "agency",
    icon: Building2,
    color: "#fb923c",
    title: "Agency Owner",
    tagline: "Deliver more. Hire less.",
    desc: "Automate client deliverables with n8n & Make templates, Claude Skills, and ready-made content workflows.",
    benefits: [
      "20+ automation templates (n8n / Make)",
      "Client report & proposal generators",
      "White-label content creation prompts",
      "Team onboarding AI workflows",
    ],
    pain: "Client deliverables take forever. You're hiring more people to do work that could be automated. Proposals take days. Reporting takes hours every week. Your margins are shrinking.",
    howHelps: [
      { title: "20+ ready-to-deploy automations", body: "n8n and Make (Integromat) templates for lead gen, content scheduling, client reporting, email follow-ups, and more. Import, configure, and run." },
      { title: "Proposals in 20 minutes", body: "Client proposal prompts that generate full project scopes, pricing rationale, timelines, and case study sections. Professional, persuasive, fast." },
      { title: "White-label everything", body: "All content prompts are designed to produce brand-neutral output. Apply your client's voice, industry, and positioning without starting from scratch." },
      { title: "Onboard and scale your team", body: "Claude Skill bundles that bring junior team members up to agency quality instantly. Consistent output, fewer revisions, happier clients." },
    ],
    results: [
      { metric: "20+", label: "automation templates included" },
      { metric: "5×", label: "client capacity without new hires" },
      { metric: "20min", label: "to write a full proposal" },
      { metric: "70%", label: "reduction in revision rounds" },
    ],
    testimonial: {
      quote: "We scaled from 8 to 30 clients without hiring anyone new. The automation templates and Claude Skills changed how our whole agency operates.",
      name: "Agency Founder",
      role: "Digital marketing agency, 30+ clients",
    },
    tools: ["n8n", "Make", "Claude", "ChatGPT", "Notion", "Slack", "Zapier"],
  },
  {
    slug: "solopreneur",
    icon: Briefcase,
    color: "#22d3ee",
    title: "Solopreneur",
    tagline: "One person. Full team output.",
    desc: "The AI Starter Kit is built for you — 500+ prompts and 20 Claude Skills structured for solo business owners.",
    benefits: [
      "500+ item AI Starter Kit",
      "Daily workflow automation prompts",
      "Personal brand content system",
      "Productivity & planning templates",
    ],
    pain: "You're doing everything alone — marketing, ops, client work, content, admin. There aren't enough hours in the day. You feel like you need a team but can't afford one yet.",
    howHelps: [
      { title: "Your 500-prompt business toolkit", body: "The AI Starter Kit covers every function of a solo business: sales, marketing, ops, customer service, content, and planning. One kit, every need." },
      { title: "Daily workflows that run themselves", body: "Morning planning prompts, weekly review templates, client check-in sequences, invoice follow-up scripts — your entire business cadence, systematized." },
      { title: "Build your personal brand on autopilot", body: "Content pillars, posting schedules, LinkedIn + Instagram systems, and newsletter templates designed for founders who want to grow their audience without a content team." },
      { title: "Think clearer with AI planning", body: "Strategic planning prompts — goal setting, priority ranking, obstacle mapping, quarterly review frameworks. Think like a CEO, not just an operator." },
    ],
    results: [
      { metric: "500+", label: "prompts in the starter kit" },
      { metric: "20", label: "Claude Skills included" },
      { metric: "3hrs", label: "saved per day on average" },
      { metric: "1 person", label: "doing the work of 5" },
    ],
    testimonial: {
      quote: "As a solopreneur, I was drowning. Now I have systems for everything. I'm doing more in 5 hours than I used to do in a full week.",
      name: "Solopreneur",
      role: "Consulting & coaching business",
    },
    tools: ["Claude", "ChatGPT", "Notion", "Canva", "LinkedIn", "Substack"],
  },
  {
    slug: "student",
    icon: GraduationCap,
    color: "#e879f9",
    title: "Student & Researcher",
    tagline: "Learn smarter. Work faster.",
    desc: "Summarize papers, write essays, study complex topics, and use AI fundamentals training to level up fast.",
    benefits: [
      "Research summarization prompts",
      "Essay & assignment writing frameworks",
      "AI Fundamentals video course",
      "Study guide & flashcard generators",
    ],
    pain: "Research takes forever. Essays are painful to structure. Complex topics are hard to grasp quickly. And you're falling behind in AI skills while your peers are pulling ahead.",
    howHelps: [
      { title: "Summarize any paper in 2 minutes", body: "Academic paper summarization prompts that extract key findings, methodology, limitations, and implications. Understand a 40-page paper in minutes, not hours." },
      { title: "Essays that actually flow", body: "Structured essay frameworks: argument mapping, thesis development, counterargument handling, and citation integration. From outline to draft in one session." },
      { title: "AI Fundamentals course included", body: "Not just prompts — a full video course on how AI works, how to use it effectively, and how to build AI into your study and career workflow." },
      { title: "Turn anything into a study guide", body: "Paste any topic, textbook chapter, or lecture notes and get flashcards, Q&A sets, concept maps, and practice questions instantly." },
    ],
    results: [
      { metric: "2min", label: "to summarize any research paper" },
      { metric: "70%", label: "less time on essay drafts" },
      { metric: "10×", label: "faster study material creation" },
      { metric: "Free", label: "AI Fundamentals course included" },
    ],
    testimonial: {
      quote: "I finished my dissertation research phase in 2 weeks instead of 2 months. The research prompts are incredibly precise and save me hours every day.",
      name: "Graduate Student",
      role: "PhD Candidate, Computer Science",
    },
    tools: ["ChatGPT", "Claude", "Notion", "Google Scholar", "Zotero", "Anki"],
  },
  {
    slug: "social-media-manager",
    icon: Megaphone,
    color: "#f97316",
    title: "Social Media Manager",
    tagline: "Never run out of content.",
    desc: "Plan months of content in hours. Trending prompts, engagement hooks, and platform-specific copy at your fingertips.",
    benefits: [
      "Monthly content calendar templates",
      "Platform-specific caption packs",
      "Trending topic content frameworks",
      "Hashtag strategy & analytics prompts",
    ],
    pain: "You're managing multiple clients across 5 platforms and running on empty. Content calendars take your whole Monday. Last-minute requests break your workflow. Engagement is inconsistent.",
    howHelps: [
      { title: "Full month planned in one afternoon", body: "Monthly content calendar prompts that generate topics, content types, posting times, and caption angles for every platform your clients are on." },
      { title: "Captions for every platform's algorithm", body: "Instagram hooks, LinkedIn thought-leadership posts, TikTok scripts, X threads — each prompt is engineered for how that platform's algorithm actually works." },
      { title: "Stay ahead of trends", body: "Trending topic frameworks that let you jump on any trend in minutes. Angle finder, relevance checker, and brand-safe spin prompts so you're always timely." },
      { title: "Hashtag strategy that actually grows reach", body: "Hashtag research prompts, niche vs broad mix formulas, and engagement analysis templates. Stop guessing — start growing." },
    ],
    results: [
      { metric: "1 afternoon", label: "for a full month of content" },
      { metric: "6×", label: "more clients manageable per person" },
      { metric: "40%", label: "engagement rate increase" },
      { metric: "10min", label: "to create a viral post" },
    ],
    testimonial: {
      quote: "I manage 12 clients solo now. Before PromptLand I could barely handle 4. The content calendar system completely changed my business model.",
      name: "Social Media Manager",
      role: "Freelance, 12 brand clients",
    },
    tools: ["ChatGPT", "Claude", "Buffer", "Later", "Canva", "Instagram", "LinkedIn"],
  },
  {
    slug: "global-creator",
    icon: Globe,
    color: "#4ade80",
    title: "Global Creator",
    tagline: "Create in any language.",
    desc: "PromptLand supports 6 languages. Create, market, and grow your audience — no matter where you are in the world.",
    benefits: [
      "Multilingual prompt support",
      "Localized content templates",
      "Cross-cultural marketing frameworks",
      "Translation & adaptation prompts",
    ],
    pain: "You're creating content in your language but struggling to reach a global audience. Translations feel robotic. Cultural nuances get lost. Western-centric prompts don't fit your market.",
    howHelps: [
      { title: "Native-quality content in 6 languages", body: "Prompts written and tested in English, Bengali, Hindi, Spanish, French, and Arabic. Not machine-translated — genuinely localized for each language's idioms and style." },
      { title: "Culturally-aware marketing", body: "Cross-cultural marketing frameworks that understand your audience's values, communication style, and buying psychology. Stop copying Western tactics that don't land." },
      { title: "Expand without losing your voice", body: "Localization prompts that adapt your existing content to new markets while preserving your brand voice and message. Reach 10× more people with the same content." },
      { title: "Global platform guidance", body: "Platform-specific guidance for non-Western markets: YouTube Bangla, Hindi creators, Spanish-speaking TikTok, Arabic Instagram. Strategies built for your actual audience." },
    ],
    results: [
      { metric: "6", label: "languages fully supported" },
      { metric: "10×", label: "audience reach potential" },
      { metric: "100%", label: "culturally-tested prompts" },
      { metric: "1 click", label: "to adapt content for new markets" },
    ],
    testimonial: {
      quote: "As a Bangladeshi creator, I always felt these tools weren't built for me. PromptLand is different — the Bangla prompts are actually good.",
      name: "Content Creator",
      role: "300K+ Bangla YouTube subscribers",
    },
    tools: ["ChatGPT", "Claude", "YouTube", "Facebook", "Instagram", "TikTok"],
  },
];

export function UseCasesSection() {
  return (
    <section id="usecases" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-primary/50 inline-block" />
            Who is this for?
            <span className="h-px w-5 bg-primary/50 inline-block" />
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Built for every kind of{" "}
            <span className="text-gradient-primary">creator</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            Whether you're a freelancer, developer, or agency — PromptLand has a dedicated toolkit for your exact workflow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {USE_CASES.slice(0, 8).map(({ slug, icon: Icon, color, title, tagline, desc }) => (
            <Link
              key={slug}
              to={`/use-cases/${slug}`}
              className="group relative rounded-2xl border border-border/40 bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border/70 hover:shadow-xl overflow-hidden"
            >
              {/* top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${color}10 0%, transparent 65%)` }} />

              <div className="relative">
                {/* Icon */}
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon className="h-5 w-5" style={{ color }} strokeWidth={2} />
                </div>

                <h3 className="text-sm font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-[11px] font-semibold mb-2" style={{ color }}>
                  {tagline}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>

                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold" style={{ color }}>
                  Learn more
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/use-cases">
              View All Use Cases <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
