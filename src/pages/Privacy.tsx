import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert mt-10 space-y-8 text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We respect your privacy and are committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, and safeguard information when you visit or use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We may collect information you provide directly (such as your name, email address, and billing
                details) and information collected automatically (such as device data, IP address, and usage analytics).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Your information is used to provide and improve our services, process payments, communicate with you
                about updates, and ensure the security of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">4. Sharing of Information</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We do not sell your personal data. We may share information with trusted service providers who help
                operate our platform, or when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">5. Your Rights</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You may request access, correction, or deletion of your personal data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">6. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For any questions about this Privacy Policy, please reach out via our support channel.
              </p>
            </section>

            <p className="pt-4">
              <Link to="/" className="text-primary hover:underline">← Back to home</Link>
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Privacy;
