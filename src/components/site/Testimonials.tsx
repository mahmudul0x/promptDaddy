import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const reviews = [
  {
    handle: "Rafi Islam",
    role: "Freelance Content Creator",
    quote: "PromptLand has completely changed how I write for my clients. The LLM prompt library alone saved me hours every single week. Best 199 BDT I've ever spent.",
  },
  {
    handle: "Nusrat Jahan",
    role: "Digital Marketing Manager",
    quote: "I was skeptical at first, but the results speak for themselves. My ad copy quality went through the roof. The image prompt collection is incredible too.",
  },
  {
    handle: "Tanvir Ahmed",
    role: "Software Engineer",
    quote: "The Claude Skills section is next level. I use these slash commands daily in my workflow. Honestly can't imagine working without them anymore.",
  },
  {
    handle: "Sumaiya Akter",
    role: "Graphic Designer",
    quote: "The image prompts and gallery gave me a whole new creative direction. My Midjourney outputs have never looked better. Totally worth the lifetime plan.",
  },
  {
    handle: "Mahmudul Hasan",
    role: "Entrepreneur",
    quote: "I run a small business and use AI tools daily. PromptLand helped me get 10x more out of ChatGPT. The prompt enhancer tool is genuinely magic.",
  },
  {
    handle: "Farhan Kabir",
    role: "YouTube Creator",
    quote: "Script writing, thumbnail ideas, and video descriptions are all covered by the prompts here. My channel growth has been insane since I started using this.",
  },
  {
    handle: "Tasnim Hossain",
    role: "Student & AI Enthusiast",
    quote: "As a student on a budget, the monthly plan is a no-brainer. The AI search feature helped me understand complex topics in minutes. Super impressed.",
  },
  {
    handle: "Imtiaz Chowdhury",
    role: "SEO Specialist",
    quote: "The prompt library for SEO content is unmatched. I've tried many AI resources but nothing comes close to the depth and quality here.",
  },
  {
    handle: "Anika Rahman",
    role: "Virtual Assistant",
    quote: "I use these prompts for my clients every single day. The activation was within 5 minutes of payment, fast and hassle-free. Highly recommend.",
  },
];

export const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-mono uppercase tracking-widest text-primary">Real Users</p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">What our </span>
            <span className="text-gradient-primary">members are saying</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Thousands of professionals across Bangladesh use PromptLand every day to work smarter.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all ${selectedIndex === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/40"}`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {reviews.map((r, i) => (
              <div key={i} className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_50%] xl:flex-[0_0_33.333%]">
                <figure className="glass h-full rounded-2xl p-6 hover:border-primary/40 transition-colors">
                  <Quote className="mb-3 h-5 w-5 text-primary/70" />
                  <blockquote className="text-foreground/90 leading-relaxed">"{r.quote}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                      {r.handle.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium leading-none text-foreground">{r.handle}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{r.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
