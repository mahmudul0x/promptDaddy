import { Sparkles, LogIn, LayoutDashboard, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export const SiteHeader = () => {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-bold tracking-tight text-foreground">PromptLand</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">{t('nav.services')}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t('nav.pricing')}</a>
            <a href="#faq" className="hover:text-foreground transition-colors">{t('nav.faq')}</a>
            <a href="#contact" className="hover:text-foreground transition-colors">{t('nav.contact')}</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === language)?.flag}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-36 py-1 rounded-xl bg-card border border-border/40 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-secondary/50 transition-colors ${
                      language === lang.code ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <Button asChild variant="hero" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  {t('nav.dashboard')}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground gap-1.5">
                  <Link to="/login">
                    <LogIn className="h-3.5 w-3.5" />
                    {t('nav.signIn')}
                  </Link>
                </Button>
                <Button asChild variant="hero" size="sm">
                  <Link to="/register">{t('nav.getStarted')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
