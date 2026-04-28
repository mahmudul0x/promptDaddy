import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { ShowcaseMarquee } from "@/components/site/ShowcaseMarquee";
import { FeaturesShowcase } from "@/components/site/FeaturesShowcase";
import { Features } from "@/components/site/Features";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Testimonials } from "@/components/site/Testimonials";
import { ToolsSection } from "@/components/site/ToolsSection";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <ShowcaseMarquee />
      <FeaturesShowcase />
      <Features />
      <HowItWorks />
      <ToolsSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <SiteFooter />
    </main>
  );
};

export default Index;
