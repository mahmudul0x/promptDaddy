import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const SiteFooter = () => {
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
        <p className="text-sm text-muted-foreground font-medium tracking-wide">PROMPT BETTER. CREATE FASTER. GROW MORE.</p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </nav>
      </div>
    </footer>
  );
};
