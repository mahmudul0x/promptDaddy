import { lazy, Suspense } from "react";
import { IntroSection } from "@/components/site/IntroSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const ServicesGrid       = lazy(() => import("@/components/site/ServicesGrid").then(m => ({ default: m.ServicesGrid })));
const UseCasesSection    = lazy(() => import("@/components/site/UseCasesSection").then(m => ({ default: m.UseCasesSection })));
const DemoPromptsSection = lazy(() => import("@/components/site/DemoPromptsSection").then(m => ({ default: m.DemoPromptsSection })));
const HowItWorks         = lazy(() => import("@/components/site/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Pricing            = lazy(() => import("@/components/site/Pricing").then(m => ({ default: m.Pricing })));
const FAQ                = lazy(() => import("@/components/site/FAQ").then(m => ({ default: m.FAQ })));
const Contact            = lazy(() => import("@/components/site/Contact").then(m => ({ default: m.Contact })));

function SectionSkeleton() {
  return <div className="py-20 animate-pulse" aria-hidden />;
}

/* Visually distinct divider between sections */
function SectionDivider({ color = "hsl(var(--primary))" }: { color?: string }) {
  return (
    <div className="relative h-px mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="h-px w-full" style={{
        background: `linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
        opacity: 0.25,
      }} />
      {/* center dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full border"
        style={{ borderColor: color, background: `${color}30`, opacity: 0.6 }} />
    </div>
  );
}

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <IntroSection />

      <SectionDivider color="#a78bfa" />
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesGrid />
      </Suspense>

      <SectionDivider color="#fb923c" />
      <Suspense fallback={<SectionSkeleton />}>
        <UseCasesSection />
      </Suspense>

      <SectionDivider color="#34d399" />
      <Suspense fallback={<SectionSkeleton />}>
        <DemoPromptsSection />
      </Suspense>

      <SectionDivider color="#60a5fa" />
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </Suspense>

      <SectionDivider color="#f472b6" />
      <Suspense fallback={<SectionSkeleton />}>
        <Pricing />
      </Suspense>

      <SectionDivider color="#fbbf24" />
      <Suspense fallback={<SectionSkeleton />}>
        <FAQ />
      </Suspense>

      <SectionDivider color="#22d3ee" />
      <Suspense fallback={<SectionSkeleton />}>
        <Contact />
      </Suspense>

      <SiteFooter />
    </main>
  );
};

export default Index;
