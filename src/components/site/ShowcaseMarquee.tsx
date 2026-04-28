const items = [
  { tag: "Image", title: "Product Photo Styles", desc: "Professional product photography prompts covering hero shots, flat lays, lifestyle context, and e-commerce-ready studio setups.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/3c1e01f1-c490-4d31-99b7-fa5f9f64d2b4/1771333947706-a537eeca.png" },
  { tag: "Tutorial", title: "Claude Skills: What They Are And How To Create Them", desc: "Claude Skills are like giving Claude a specialized toolkit for your specific needs — create a 'Skill' once and Claude uses it whenever relevant.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/prompt-thumbnails/1771344294621-13u5vfhdez5e.png" },
  { tag: "Prompt", title: "ChatGPT Agent Instagram Content Researcher", desc: "Give ChatGPT access to your Instagram account and allow it to find competitors, analyze high-performing content, and come up with ideas.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/3c1e01f1-c490-4d31-99b7-fa5f9f64d2b4/1771333947706-a537eeca.png" },
  { tag: "Prompt", title: "Gmail Email Drafter", desc: "Have ChatGPT or Google Gemini scan your inbox, send you a series of brief questions, then draft responses to each unread email.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/941d095f-3d6e-4c99-a243-53b9e1dcc8a8/1771338629129-7dc48379.png" },
  { tag: "Prompt", title: "Generating Images with Consistent Branding", desc: "Create a master prompt for use with an AI image generator such as Nano Banana, to create consistent image branding.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/16ad06b9-dd1b-4589-a103-0fe8060a0af1/1771341270018-ef2b3df2.png" },
  { tag: "Image", title: "Food & Beverage Photography", desc: "Mouth-watering food and drink prompts featuring steam, pours, cross-sections, and styled table spreads.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/941d095f-3d6e-4c99-a243-53b9e1dcc8a8/1771338629129-7dc48379.png" },
  { tag: "Image", title: "Social Media & Marketing Graphics", desc: "Ready-to-use social media background and marketing graphic prompts optimized for Instagram, Pinterest, LinkedIn, and more.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/16ad06b9-dd1b-4589-a103-0fe8060a0af1/1771341270018-ef2b3df2.png" },
  { tag: "Image", title: "Natural UGC Images", desc: "Generate raw, unpolished phone-quality photos that look like real people took them at home with smudged lenses and bad lighting.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/267e0528-3cf2-485c-a049-d41f1a843903/1771333575670-42077c89.png" },
  { tag: "Tutorial", title: "Mastering NotebookLM", desc: "Google's NotebookLM might be one of the most under appreciated AI tools out there. Let's take a look at what it can really do for you.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/editor-content/gallery-images/267e0528-3cf2-485c-a049-d41f1a843903/1771333575670-42077c89.png" },
  { tag: "Guide", title: "Chain of Thought & Other Advanced Reasoning Techniques", desc: "Explore how advanced techniques like Chain-of-Thought prompting enable AI to break down complex problems step by step.", img: "https://uwcjoexhodkdkqdmlpns.supabase.co/storage/v1/object/public/prompt-thumbnails/1771344294621-13u5vfhdez5e.png" },
];

const tagColor = (tag: string) =>
  tag === "Tutorial" ? "text-accent border-accent/30 bg-accent/10"
    : tag === "Image" ? "text-primary border-primary/30 bg-primary/10"
    : tag === "Guide" ? "text-foreground border-border bg-secondary"
    : "text-primary-glow border-primary/30 bg-primary/5";

export const ShowcaseMarquee = () => {
  const loop = [...items, ...items];
  return (
    <section aria-label="Featured library content" className="relative py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex w-max animate-marquee gap-5 px-4">
        {loop.map((it, i) => (
          <article
            key={i}
            className="w-[320px] shrink-0 rounded-2xl glass overflow-hidden hover:border-primary/40 transition-[transform,border-color] duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-secondary/40">
              <img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono uppercase tracking-widest border rounded-full px-2.5 py-1 ${tagColor(it.tag)}`}>{it.tag}</span>
                <span className="text-[10px] font-mono text-muted-foreground">12 min</span>
              </div>
              <h3 className="text-base font-semibold leading-snug mb-2 line-clamp-2">{it.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
