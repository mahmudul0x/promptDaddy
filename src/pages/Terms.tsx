import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FileText, ChevronRight } from "lucide-react";

const SECTIONS = [
  "Agreement to Terms",
  "Eligibility",
  "Accounts & Registration",
  "Subscriptions & Billing",
  "Payment Process (bKash / Nagad)",
  "Refund Policy",
  "Acceptable Use",
  "Intellectual Property",
  "Disclaimer of Warranties",
  "Limitation of Liability",
  "Termination",
  "Changes to Terms",
  "Governing Law",
  "Contact Us",
];

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 pt-28 pb-24">
        {/* Hero */}
        <div className="border-b border-border/40 pb-10 mb-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-primary">Legal</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: <strong className="text-foreground">April 29, 2026</strong>
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
              Please read these Terms carefully before using PromptLand. By accessing or using our platform
              you agree to be bound by these Terms.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex gap-12">
          {/* TOC — desktop sticky sidebar */}
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-28">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s, i) => (
                  <a
                    key={s}
                    href={`#section-${i + 1}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-0.5"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    {s}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0 space-y-10">

            <Section id="section-1" title="1. Agreement to Terms">
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you and
                <strong> PromptLand</strong> ("we", "us", or "our") governing your access to and use of
                our website, platform, and all associated services (collectively, the "Service").
              </p>
              <p className="mt-3">
                By creating an account, subscribing to a plan, or otherwise using the Service, you confirm
                that you have read, understood, and agree to these Terms. If you do not agree, you must not
                use the Service.
              </p>
            </Section>

            <Section id="section-2" title="2. Eligibility">
              <p>
                You must be at least <strong>13 years of age</strong> to use the Service. By using PromptLand,
                you represent that you meet this requirement. If you are using the Service on behalf of an
                organisation, you represent that you have authority to bind that organisation to these Terms.
              </p>
            </Section>

            <Section id="section-3" title="3. Accounts & Registration">
              <ul>
                <li>You may register with a valid email address and password, or sign in with your Google account.</li>
                <li>You are responsible for keeping your credentials confidential and for all activity that occurs under your account.</li>
                <li>You must provide accurate, current, and complete information during registration.</li>
                <li>You may not share your account with others or allow multiple people to access the Service through a single account.</li>
                <li>Notify us immediately at <a href="mailto:mahmudulabin@gmail.com">mahmudulabin@gmail.com</a> if you suspect unauthorised access to your account.</li>
              </ul>
            </Section>

            <Section id="section-4" title="4. Subscriptions & Billing">
              <p>PromptLand offers the following subscription plans:</p>
              <ul>
                <li><strong>Free</strong> — limited access to selected content, no payment required.</li>
                <li><strong>Monthly Pro</strong> — full access to all premium content for 30 days from the date of payment approval.</li>
                <li><strong>Lifetime Pro</strong> — permanent full access with a single one-time payment.</li>
              </ul>
              <p className="mt-3">
                Subscriptions are activated manually after our team verifies your payment. Monthly subscriptions
                expire 30 days from the date of approval. They do <strong>not</strong> auto-renew — you must
                submit a new payment request to continue access.
              </p>
              <p className="mt-3">
                Prices are listed in Bangladeshi Taka (৳) and are subject to change. Price changes will be
                communicated before they take effect.
              </p>
            </Section>

            <Section id="section-5" title="5. Payment Process (bKash / Nagad)">
              <p>
                PromptLand processes payments manually via <strong>bKash</strong> and <strong>Nagad</strong>
                mobile banking. To subscribe:
              </p>
              <ul>
                <li>Send the subscription fee to our designated bKash or Nagad number shown on the pricing page.</li>
                <li>Submit your payment details (name, email, transaction ID or sender number) through the payment form on the site.</li>
                <li>Our team will verify the transaction and activate your account as quickly as possible.</li>
              </ul>
              <p className="mt-3">
                You are responsible for ensuring you send the correct amount to the correct number. We are not
                responsible for payments sent to incorrect numbers or for amounts that do not match the listed
                plan price.
              </p>
              <p className="mt-3">
                Fraudulent payment submissions (fake transaction IDs, incorrect amounts, or using another
                person's transaction) will result in immediate account termination and may be reported to
                relevant authorities.
              </p>
            </Section>

            <Section id="section-6" title="6. Refund Policy">
              <p>
                Due to the digital and immediately accessible nature of our content, <strong>all sales are
                final</strong>. We do not offer refunds on subscription payments once access has been activated.
              </p>
              <p className="mt-3">
                Exceptions may be considered at our sole discretion in cases where:
              </p>
              <ul>
                <li>Your account was never activated despite a confirmed payment.</li>
                <li>A verified duplicate payment was made for the same subscription period.</li>
                <li>A technical error on our end prevented you from accessing the Service.</li>
              </ul>
              <p className="mt-3">
                To request an exception, email <a href="mailto:mahmudulabin@gmail.com">mahmudulabin@gmail.com</a> within
                7 days of payment with your transaction ID and a description of the issue.
              </p>
            </Section>

            <Section id="section-7" title="7. Acceptable Use">
              <p>You agree not to:</p>
              <ul>
                <li>Copy, reproduce, redistribute, or resell any PromptLand content without written permission.</li>
                <li>Use automated tools, scrapers, or bots to extract content from the platform.</li>
                <li>Share your account credentials with others to grant unauthorised access.</li>
                <li>Attempt to bypass access controls or reverse-engineer any part of the Service.</li>
                <li>Upload, post, or transmit any content that is unlawful, harmful, abusive, or violates the rights of others.</li>
                <li>Use the Service in any way that could damage, disable, or impair the platform or its servers.</li>
              </ul>
              <p className="mt-3">
                Violation of these rules may result in immediate suspension or permanent termination of your
                account without refund.
              </p>
            </Section>

            <Section id="section-8" title="8. Intellectual Property">
              <p>
                All content on PromptLand — including but not limited to prompts, tutorials, guides, Claude
                Skills, automation templates, Custom GPT configurations, images, and written text — is the
                property of PromptLand or its content licensors and is protected by applicable copyright and
                intellectual property laws.
              </p>
              <p className="mt-3">
                Your subscription grants you a <strong>personal, non-exclusive, non-transferable licence</strong> to
                access and use the content for your own personal or commercial projects. You may not sublicense,
                sell, or distribute the content as a standalone product.
              </p>
              <p className="mt-3">
                You retain all rights to content you create using our prompts or tools.
              </p>
            </Section>

            <Section id="section-9" title="9. Disclaimer of Warranties">
              <p>
                The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without
                warranties of any kind, either express or implied, including but not limited to implied warranties
                of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="mt-3">
                We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or
                other harmful components. AI-generated content and prompts may produce inaccurate or unexpected
                results — always review outputs before use in critical applications.
              </p>
            </Section>

            <Section id="section-10" title="10. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, PromptLand shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages — including loss of profits, data,
                goodwill, or business interruption — arising from your use of or inability to use the Service,
                even if we have been advised of the possibility of such damages.
              </p>
              <p className="mt-3">
                Our total liability to you for any claim arising from use of the Service shall not exceed the
                amount you paid to us in the 30 days preceding the claim.
              </p>
            </Section>

            <Section id="section-11" title="11. Termination">
              <p>
                We may suspend or terminate your account at any time, with or without notice, if we believe
                you have violated these Terms or engaged in fraudulent or harmful behaviour.
              </p>
              <p className="mt-3">
                You may terminate your account at any time by emailing us at{" "}
                <a href="mailto:mahmudulabin@gmail.com">mahmudulabin@gmail.com</a>. Upon termination, your
                right to access the Service ceases immediately. No refunds are issued for unused subscription time.
              </p>
            </Section>

            <Section id="section-12" title="12. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. When we make material changes, we will
                update the "Last updated" date and notify active subscribers via email. Your continued use of
                the Service after the effective date of any changes constitutes your acceptance of the new Terms.
              </p>
            </Section>

            <Section id="section-13" title="13. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of{" "}
                <strong>Bangladesh</strong>. Any disputes arising from these Terms or your use of the Service
                shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
              </p>
            </Section>

            <Section id="section-14" title="14. Contact Us">
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <div className="mt-4 rounded-xl border border-border/50 bg-card/50 p-5 space-y-1.5 text-sm">
                <p><strong className="text-foreground">PromptLand</strong></p>
                <p className="text-muted-foreground">Bangladesh</p>
                <p>
                  <a href="mailto:mahmudulabin@gmail.com" className="text-primary hover:underline">
                    mahmudulabin@gmail.com
                  </a>
                </p>
              </div>
            </Section>

            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <Link to="/" className="text-sm text-primary hover:underline">
                ← Back to home
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy →
              </Link>
            </div>

          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-bold text-foreground mb-3 pb-2 border-b border-border/40">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-2 [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:space-y-1.5 [&_li]:list-disc [&_li]:text-muted-foreground [&_strong]:text-foreground/90 [&_a]:text-primary [&_a]:hover:underline">
        {children}
      </div>
    </section>
  );
}

export default Terms;
