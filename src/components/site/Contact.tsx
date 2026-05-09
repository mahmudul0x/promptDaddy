import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import { CheckCircle, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-inner",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.65,
          scrollTrigger: { trigger: ".contact-inner", start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase
      .from("contact_messages")
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    setLoading(false);
    if (err) {
      setError("Failed to send message. Please try again or email us directly.");
    } else {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-20 sm:py-28 border-t border-border/30">
      <div className="contact-inner mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Contact</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="text-gradient-primary">Talk to</span>
              <span className="text-gradient"> us</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Have a payment issue, account question, or general inquiry? Send us a message and we will get back to you as quickly as possible.
            </p>

            <div className="mt-8 space-y-4">
              <div className="glass rounded-2xl border border-border/50 p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Support</p>
                  <a href="mailto:mahmudulabin@gmail.com" className="text-sm text-primary hover:underline break-all">
                    mahmudulabin@gmail.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Best for payment confirmation, activation issues, and account support.</p>
                </div>
              </div>

              <div className="glass rounded-2xl border border-border/50 p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Typical Response Time</p>
                  <p className="text-sm text-muted-foreground">Usually within 1 to 2 hours</p>
                  <p className="text-xs text-muted-foreground mt-1">Urgent payment-related questions are usually handled faster.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-6 sm:p-7">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Message sent successfully</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thanks for reaching out. We will reply to your message as soon as possible.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-sm font-medium text-foreground/80">Full name</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-sm font-medium text-foreground/80">Email address</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-sm font-medium text-foreground/80">Message</Label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need help with..."
                    required
                    rows={5}
                    className="w-full rounded-md border border-border/60 bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 font-semibold gap-2"
                >
                  {loading ? "Sending..." : (
                    <>
                      <Send className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
