import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">Terms of Service</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert mt-10 space-y-8 text-foreground/90">
            <section>
              <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                By accessing or using our website and services, you agree to be bound by these Terms of Service.
                If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">2. Use of the Service</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                You agree to use our platform only for lawful purposes and in accordance with these terms. You are
                responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">3. Subscriptions & Billing</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Paid subscriptions renew automatically until canceled. You may cancel at any time from your account
                settings; cancellation takes effect at the end of the current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                All content, prompts, tutorials, and materials provided through the service remain the property of
                their respective owners and are protected by applicable intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">5. Disclaimer & Limitation of Liability</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                The service is provided "as is" without warranties of any kind. We are not liable for any indirect,
                incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">6. Changes to These Terms</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. Continued use of the service after changes constitutes
                acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">7. Contact</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact our support team.
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

export default Terms;
