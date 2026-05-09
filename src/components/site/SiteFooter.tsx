import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const SiteFooter = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="relative border-t border-border/60 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-gradient-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-semibold">PromptLand</span>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium tracking-wide">{t('footer.tagline')}</p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#services" className="hover:text-foreground transition-colors">{t('nav.services')}</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</a>
          <a href="#faq" className="hover:text-foreground transition-colors">{t('nav.faq')}</a>
          <a href="#contact" className="hover:text-foreground transition-colors">{t('nav.contact')}</a>
          <Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
        </nav>
      </div>
    </footer>
  );
};
