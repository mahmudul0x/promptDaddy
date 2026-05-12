import { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Zap, Infinity, X, Copy, CheckCheck, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function notifyAdmin(body: object) {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/notify-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('notify-admin error:', e);
  }
}

const OWNER_NUMBER = import.meta.env.VITE_OWNER_PHONE as string;

const METHODS = [
  { id: "bkash", label: "bKash", color: "#E2136E", bg: "#E2136E15", border: "#E2136E40" },
  { id: "nagad", label: "Nagad", color: "#F7941D", bg: "#F7941D15", border: "#F7941D40" },
] as const;

type MethodId = typeof METHODS[number]["id"];
type Step = "method" | "form" | "done";

const features = [
  "19,000+ Trending Prompts",
  "900+ Prompt Library",
  "17,000+ Image Prompts",
  "500+ AI Starter Kit",
  "50+ Claude Skills",
  "1,200+ Grok Imagine",
  "2,300+ Seedance Prompts",
  "13,900+ Nano Banana",
  "300+ GPT Image",
  "20+ Automation Templates",
  "15 Custom GPT Blueprints",
  "Tutorials & Fundamentals",
  "AI News Feed",
  "AI Model Recommendations",
  "Weekly Updates",
];

type PlanKey = "monthly" | "lifetime";
type Plan = { label: string; price: number };
const PLANS: Record<PlanKey, Plan> = {
  monthly:  { label: "Monthly",  price: 199 },
  lifetime: { label: "Lifetime", price: 999 },
};

/* ── Google Icon ─────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Auth Gate Modal ─────────────────────────────────────── */
function AuthGateModal({
  planKey, onClose, onSuccess,
}: {
  planKey: PlanKey;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { register, login, loginWithGoogle } = useAuth();
  const plan = PLANS[planKey];

  const [mode, setMode]       = useState<"register" | "login">("register");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const result = mode === "register"
      ? await register(name, email, password)
      : await login(email, password);
    setLoading(false);
    if (!result.ok) {
      const msg = result.error ?? "";
      if (msg.toLowerCase().includes("rate limit"))
        setError("Too many attempts. Please wait a few minutes.");
      else if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already been registered"))
        setError("Email already registered. Sign in instead.");
      else
        setError(msg || (mode === "register" ? "Registration failed." : "Invalid email or password."));
      return;
    }
    onSuccess();
  };

  const handleGoogle = async () => {
    // Store plan so we can auto-open after OAuth redirect
    localStorage.setItem("pending_plan", planKey);
    await loginWithGoogle();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-elegant overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary leading-none">
              {mode === "register" ? "Create Account" : "Welcome Back"}
            </p>
            <h3 className="text-sm font-bold text-foreground mt-0.5">
              {mode === "register" ? "Sign up to get" : "Sign in to get"}{" "}
              <span className="text-primary">{plan.label} — ৳{plan.price}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-3">
          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary hover:border-border transition-all text-sm font-medium"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-card text-[11px] text-muted-foreground">or with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {mode === "register" && (
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors"
              />
            )}
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors"
            />
            <div className="relative">
              <input
                required
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Password (min. 6 chars)" : "Password"}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors"
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold mt-1 transition-all disabled:opacity-60"
              style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
            >
              {loading ? "Please wait…" : mode === "register" ? "Create Account & Continue" : "Sign In & Continue"}
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-muted-foreground pt-1">
            {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(m => m === "register" ? "login" : "register"); setError(""); }}
              className="text-primary hover:underline font-medium"
            >
              {mode === "register" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Modal ───────────────────────────────────────── */
function PaymentModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const { isPro, refreshProfile } = useAuth();
  const [step,   setStep]   = useState<Step>("method");
  const [method, setMethod] = useState<MethodId | null>(null);
  const [copied, setCopied] = useState(false);
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [sender, setSender] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [pollCount, setPollCount] = useState(0);

  // Poll every 5s (max 60 attempts = 5 min) after payment submitted
  // Cleanup runs on unmount so closing modal stops polling
  useEffect(() => {
    if (step !== "done") return;
    if (pollCount >= 60) return;
    const timer = setTimeout(async () => {
      await refreshProfile();
      setPollCount(c => c + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [step, pollCount, refreshProfile]);

  useEffect(() => {
    if (isPro && step === "done") {
      window.location.href = "/dashboard";
    }
  }, [isPro, step]);

  const selectedMethod = METHODS.find(m => m.id === method);

  const copyNumber = () => {
    navigator.clipboard.writeText(OWNER_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const payload = {
      user_name: name,
      user_email: email,
      plan: plan.label.toLowerCase(),
      amount: plan.price,
      method,
      transaction_id: sender,
      status: "pending",
    };
    const { error } = await supabase.from("payment_requests").insert(payload);
    if (error) { setSubmitError("Failed to submit. Please try again."); return; }
    setStep("done");
    // Notify admin via email + push (fire-and-forget)
    notifyAdmin(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-elegant overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            {step === "form" && (
              <button onClick={() => setStep("method")}
                className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-primary leading-none">
                {step === "method" ? "Select Payment" : step === "form" ? `Pay via ${selectedMethod?.label}` : "Payment Submitted"}
              </p>
              <h3 className="text-sm font-bold text-foreground mt-0.5">{plan.label} — ৳{plan.price}</h3>
            </div>
          </div>
          <button onClick={onClose}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {step === "method" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground mb-1">Choose your payment method:</p>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); setStep("form"); }}
                  className="flex items-center justify-between w-full px-5 py-4 rounded-xl border font-bold text-base transition-all hover:scale-[1.02] active:scale-100"
                  style={{ color: m.color, background: m.bg, borderColor: m.border }}>
                  <span className="text-xl font-black tracking-tight">{m.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {step === "form" && selectedMethod && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Send <strong className="text-foreground">৳{plan.price}</strong> to this {selectedMethod.label} number:
                </p>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{ background: selectedMethod.bg, borderColor: selectedMethod.border }}>
                  <span className="flex-1 text-xl font-black tracking-widest" style={{ color: selectedMethod.color }}>
                    {OWNER_NUMBER}
                  </span>
                  <button type="button" onClick={copyNumber}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: selectedMethod.color, background: `${selectedMethod.color}20` }}>
                    {copied ? <><CheckCheck className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
              </div>
              <div className="h-px bg-border/40" />
              <p className="text-xs text-muted-foreground">After sending, fill in your details:</p>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email (for account activation)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors" />
              <input required value={sender} onChange={e => setSender(e.target.value)} placeholder="Transaction ID or sender number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors" />
              {submitError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{submitError}</p>
              )}
              <button type="submit"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold mt-1 transition-all"
                style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}>
                Submit Payment <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <p className="text-center text-[10.5px] text-muted-foreground/40">
                Access unlocked instantly once payment is verified
              </p>
            </form>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="h-7 w-7 text-yellow-400" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-1">Payment Under Review</h4>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-medium text-yellow-400">Pending approval</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Your payment details have been submitted. Our team verifies payments and activates accounts as fast as possible — you'll get access very soon.
              </p>
              <div className="rounded-xl bg-secondary/50 border border-border/50 px-4 py-3 text-left mb-4 space-y-1.5">
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Plan</span><strong className="text-foreground">{plan.label}</strong>
                </p>
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Amount</span><strong className="text-foreground">৳{plan.price}</strong>
                </p>
                <p className="text-xs text-muted-foreground flex justify-between">
                  <span>Status</span><strong className="text-yellow-400">Awaiting verification</strong>
                </p>
              </div>
              {pollCount < 60 && (
                <div className="flex items-center justify-center gap-2 mb-3 text-xs text-muted-foreground/60">
                  <div className="h-3 w-3 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                  Auto-checking for approval…
                </div>
              )}
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">
                Close & wait for email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Pricing Section ─────────────────────────────────────── */
export const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [activePlan,   setActivePlan]   = useState<PlanKey | null>(null);
  const [authGatePlan, setAuthGatePlan] = useState<PlanKey | null>(null);

  // After Google OAuth redirect, auto-open the pending plan modal
  useEffect(() => {
    if (isAuthenticated) {
      const pending = localStorage.getItem("pending_plan") as PlanKey | null;
      if (pending && (pending === "monthly" || pending === "lifetime")) {
        localStorage.removeItem("pending_plan");
        setActivePlan(pending);
      }
    }
  }, [isAuthenticated]);

  const handlePlanClick = (plan: PlanKey) => {
    if (isAuthenticated) {
      setActivePlan(plan);
    } else {
      setAuthGatePlan(plan);
    }
  };

  return (
    <section id="pricing" className="relative py-20 sm:py-28 border-t border-border/30">
      <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-60" />

      {/* Auth gate — shown when user is not logged in */}
      {authGatePlan && (
        <AuthGateModal
          planKey={authGatePlan}
          onClose={() => setAuthGatePlan(null)}
          onSuccess={() => {
            setAuthGatePlan(null);
            setActivePlan(authGatePlan);
          }}
        />
      )}

      {/* Payment modal — shown when user is logged in */}
      {activePlan && (
        <PaymentModal plan={PLANS[activePlan]} onClose={() => setActivePlan(null)} />
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="pricing-heading text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">{t('pricing.title')}</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gradient">{t('pricing.subtitle')}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t('pricing.choose')}
          </p>
        </div>

        {/* Cards */}
        <div className="pricing-cards grid sm:grid-cols-2 gap-5 items-stretch">

          {/* Monthly */}
          <div className="pricing-card rounded-2xl border border-border/60 bg-card/60 p-7 flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1 mb-4">
                <Zap className="h-2.5 w-2.5" /> Monthly
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-black text-foreground">৳199</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">~$1.75 USD · Billed monthly</p>
            </div>
            <ul className="flex flex-col gap-2.5 flex-1">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12.5px] text-foreground/80">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2.5} />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick("monthly")}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold border border-border/80 text-foreground hover:border-primary/50 hover:text-primary transition-all"
            >
              Get Monthly Access <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Lifetime */}
          <div className="pricing-card relative rounded-2xl p-px overflow-visible" style={{ background: "var(--gradient-primary)" }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-glow whitespace-nowrap"
                style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}>
                Best Value
              </span>
            </div>
            <div className="rounded-2xl bg-card p-7 flex flex-col gap-6 h-full">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/40 bg-primary/10 rounded-full px-2.5 py-1 mb-4">
                  <Infinity className="h-2.5 w-2.5" /> Lifetime
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-gradient-primary">৳999</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">~$8.70 USD · Pay once, own forever</p>
                <p className="text-xs text-primary font-semibold mt-1">
                  Save ৳{(199 * 12 - 999).toLocaleString()} vs 1 year monthly
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[12.5px] text-foreground/80">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2.5} />{f}
                  </li>
                ))}
                <li className="flex items-center gap-2.5 text-[12.5px] font-semibold text-primary">
                  <Infinity className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  All future updates — forever
                </li>
              </ul>
              <button
                onClick={() => handlePlanClick("lifetime")}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-glow"
                style={{ background: "var(--gradient-primary)", color: "hsl(var(--primary-foreground))" }}
              >
                Get Lifetime Access — ৳999 <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Payment note */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold border" style={{ color: "#E2136E", background: "#E2136E12", borderColor: "#E2136E30" }}>bKash</span>
            <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold border" style={{ color: "#F7941D", background: "#F7941D12", borderColor: "#F7941D30" }}>Nagad</span>
          </div>
          <p className="text-[11px] text-muted-foreground/40">Secure manual payment · Access unlocked after verification</p>
        </div>

      </div>
    </section>
  );
};
