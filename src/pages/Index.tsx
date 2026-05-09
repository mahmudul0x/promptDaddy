import { IntroSection } from "@/components/site/IntroSection";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <IntroSection />
      <ServicesGrid />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Contact />
      <SiteFooter />
    </main>
  );
};

export default Index;
