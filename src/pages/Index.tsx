import { lazy, Suspense } from "react";
import { IntroSection } from "@/components/site/IntroSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

// Below-fold sections: lazy-loaded so they don't block initial paint
const ServicesGrid      = lazy(() => import("@/components/site/ServicesGrid").then(m => ({ default: m.ServicesGrid })));
const DemoPromptsSection = lazy(() => import("@/components/site/DemoPromptsSection").then(m => ({ default: m.DemoPromptsSection })));
const HowItWorks        = lazy(() => import("@/components/site/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Pricing           = lazy(() => import("@/components/site/Pricing").then(m => ({ default: m.Pricing })));
const FAQ               = lazy(() => import("@/components/site/FAQ").then(m => ({ default: m.FAQ })));
const Contact           = lazy(() => import("@/components/site/Contact").then(m => ({ default: m.Contact })));

// Minimal skeleton shown while a section loads
function SectionSkeleton() {
  return <div className="py-20 animate-pulse" aria-hidden />;
}

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <IntroSection />

      <Suspense fallback={<SectionSkeleton />}>
        <ServicesGrid />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <DemoPromptsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Pricing />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Contact />
      </Suspense>

      <SiteFooter />
    </main>
  );
};

export default Index;
