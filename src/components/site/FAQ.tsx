import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I make a payment?",
    a: "You can pay using bKash or Nagad. Choose your preferred plan in the Pricing section, send the payment to our number, then submit the transaction ID in the form. Your account is usually activated within 10 minutes after verification.",
  },
  {
    q: "How long does the monthly plan stay active?",
    a: "The monthly plan stays active for 30 days from the date of payment. After that, access expires automatically unless you renew.",
  },
  {
    q: "Should I choose Monthly or Lifetime?",
    a: "If you want to try the platform first, the monthly plan is a good starting point. If you plan to keep using the library and tools long term, the lifetime plan gives much better value.",
  },
  {
    q: "How long does activation take after payment?",
    a: "Most accounts are activated within 10 minutes. During busy hours it can take a little longer, but if it goes beyond that you can contact us directly.",
  },
  {
    q: "Do I need ChatGPT Plus or Claude Pro to use this platform?",
    a: "No. Most prompts and resources can still help you even if you use free versions of AI tools. Paid AI plans can unlock more advanced results, but they are not required.",
  },
  {
    q: "Do lifetime members get future updates?",
    a: "Yes. Lifetime members get access to future prompt updates, new resources, and new additions without paying again.",
  },
  {
    q: "What is included inside the platform?",
    a: "You get access to expert LLM prompts, image prompts, Claude skills, AI search, prompt enhancers, tutorials, videos, AI news, automation templates, and model recommendations.",
  },
  {
    q: "Where should I contact you if I face a problem?",
    a: "Use the contact form below or email us directly at mahmudulabin@gmail.com. We usually reply within 1 to 2 hours.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground text-sm">
            Find quick answers about payment, access, activation, and what is included in your membership.
          </p>
        </div>
        <Accordion type="single" collapsible className="glass rounded-2xl px-2 sm:px-4">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium hover:text-primary px-2 sm:px-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-2 sm:px-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
