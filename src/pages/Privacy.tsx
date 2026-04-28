import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Shield, ChevronRight } from "lucide-react";

const SECTIONS = [
  "Introduction",
  "Information We Collect",
  "How We Use Your Information",
  "Data Storage & Security",
  "Cookies & Tracking",
  "Third-Party Services",
  "Your Rights",
  "Children's Privacy",
  "Changes to This Policy",
  "Contact Us",
];

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 pt-28 pb-24">
        {/* Hero */}
        <div className="border-b border-border/40 pb-10 mb-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-primary">Legal</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: <strong className="text-foreground">April 29, 2026</strong>
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
              PromptLand is committed to protecting your personal data. This policy explains what we collect,
              why we collect it, and how you can control it.
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

            <Section id="section-1" title="1. Introduction">
              <p>
                Welcome to <strong>PromptLand</strong> ("we", "us", or "our"). We operate the website and
                platform available at our domain (the "Service"). This Privacy Policy governs how we handle
                your personal information when you use the Service, and your choices regarding that information.
              </p>
              <p className="mt-3">
                By using PromptLand, you agree to the collection and use of information in accordance with
                this policy. If you do not agree, please discontinue use of the Service.
              </p>
            </Section>

            <Section id="section-2" title="2. Information We Collect">
              <p className="font-semibold text-foreground">Information you provide directly:</p>
              <ul>
                <li><strong>Account data</strong> — name and email address when you register or sign in with Google.</li>
                <li><strong>Payment data</strong> — your name, email, bKash/Nagad sender number, and transaction ID when you submit a payment request. We do not store full mobile banking credentials.</li>
                <li><strong>Communications</strong> — any messages you send us via email or contact forms.</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">Information collected automatically:</p>
              <ul>
                <li><strong>Usage data</strong> — pages viewed, prompts opened, features used, and session duration.</li>
                <li><strong>Device & browser data</strong> — IP address, browser type, operating system, and referring URL.</li>
                <li><strong>Cookies</strong> — session tokens and authentication state managed by Supabase.</li>
              </ul>
            </Section>

            <Section id="section-3" title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account and authenticate you.</li>
                <li>Process and verify your subscription payment requests (bKash / Nagad).</li>
                <li>Activate or deactivate your Pro subscription based on payment status.</li>
                <li>Send transactional emails — payment confirmation, subscription expiry reminders, and password reset links.</li>
                <li>Analyse how users interact with the platform to improve content and features.</li>
                <li>Investigate fraud, enforce our Terms of Service, and comply with legal obligations.</li>
              </ul>
              <p className="mt-3">
                We do <strong>not</strong> use your data for targeted advertising or sell it to third parties.
              </p>
            </Section>

            <Section id="section-4" title="4. Data Storage & Security">
              <p>
                Your data is stored on <strong>Supabase</strong> infrastructure, which uses AES-256 encryption
                at rest and TLS in transit. Authentication is handled by Supabase Auth with industry-standard
                JWT tokens.
              </p>
              <p className="mt-3">
                Uploaded images (prompt thumbnails) are stored on <strong>Cloudinary</strong> servers.
                Transactional emails are delivered via <strong>Brevo (formerly Sendinblue)</strong>.
              </p>
              <p className="mt-3">
                While we implement reasonable security measures, no system is 100% secure. We encourage you
                to use a strong, unique password and to log out of shared devices.
              </p>
            </Section>

            <Section id="section-5" title="5. Cookies & Tracking">
              <p>
                We use essential cookies required for authentication and session management. We do not use
                third-party advertising or tracking cookies.
              </p>
              <p className="mt-3">
                We use <strong>Supabase</strong> to track anonymous usage metrics (prompt views, category
                popularity) to improve content. This data is not linked to personally identifiable information
                unless you are logged in.
              </p>
              <p className="mt-3">
                You can disable cookies in your browser settings, but this will prevent you from logging in
                to the Service.
              </p>
            </Section>

            <Section id="section-6" title="6. Third-Party Services">
              <p>We rely on the following third-party services to operate PromptLand:</p>
              <ul>
                <li><strong>Supabase</strong> — database, authentication, and edge functions (EU/US hosted).</li>
                <li><strong>Cloudinary</strong> — image storage and delivery (US hosted).</li>
                <li><strong>Brevo</strong> — transactional email delivery (EU hosted).</li>
                <li><strong>Google OAuth</strong> — optional social sign-in via your Google account.</li>
              </ul>
              <p className="mt-3">
                Each service has its own privacy policy. We encourage you to review them if you have concerns
                about data processing outside Bangladesh.
              </p>
            </Section>

            <Section id="section-7" title="7. Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
                <li><strong>Correction</strong> — update inaccurate or incomplete information via your profile settings.</li>
                <li><strong>Deletion</strong> — request that we delete your account and associated data by emailing us.</li>
                <li><strong>Portability</strong> — request an export of your data in a machine-readable format.</li>
                <li><strong>Objection</strong> — object to processing of your data for analytics purposes.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:mahmudulabin@gmail.com" className="text-primary hover:underline">
                  mahmudulabin@gmail.com
                </a>
                . We will respond within 7 business days.
              </p>
            </Section>

            <Section id="section-8" title="8. Children's Privacy">
              <p>
                PromptLand is not directed to children under the age of 13. We do not knowingly collect
                personal information from children. If you believe a child has provided us with personal
                data, please contact us and we will promptly delete it.
              </p>
            </Section>

            <Section id="section-9" title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the
                "Last updated" date at the top of this page. For material changes, we will notify you
                via email or a prominent notice on the platform. Continued use of the Service after
                changes constitutes acceptance of the revised policy.
              </p>
            </Section>

            <Section id="section-10" title="10. Contact Us">
              <p>
                If you have questions about this Privacy Policy or how we handle your data, please contact:
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
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service →
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
      <div className="text-muted-foreground leading-relaxed space-y-2 [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:space-y-1.5 [&_li]:list-disc [&_li]:text-muted-foreground [&_strong]:text-foreground/90 [&_a]:text-primary">
        {children}
      </div>
    </section>
  );
}

export default Privacy;
