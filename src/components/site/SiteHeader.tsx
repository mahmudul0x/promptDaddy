import { useState, useEffect } from 'react';
import { Sparkles, LogIn, LayoutDashboard, Globe, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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

const NAV_LINKS = [
  { href: '/',            labelKey: 'nav.home'      },
  { href: '/#services',   labelKey: 'nav.services'  },
  { href: '/use-cases',   labelKey: 'nav.usecases'  },
  { href: '/#pricing',    labelKey: 'nav.pricing'   },
  { href: '/#faq',        labelKey: 'nav.faq'       },
  { href: '/demo',        labelKey: 'nav.demo'      },
];

export const SiteHeader = () => {
  const { isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname + location.hash);
  }, [location]);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          padding: 6px 2px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          border-radius: 9999px;
          background: hsl(var(--primary));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link:hover::after,
        .nav-link.active::after { transform: scaleX(1); }
        .nav-link.active { color: hsl(var(--primary)); }
        .nav-link:hover { color: hsl(var(--foreground)); }

        .header-pill {
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .header-pill.scrolled {
          box-shadow: 0 8px 32px -8px hsl(var(--foreground) / 0.12), 0 0 0 1px hsl(var(--border) / 0.6);
        }
        .logo-glow {
          box-shadow: 0 0 16px hsl(var(--primary) / 0.45);
          transition: box-shadow 0.3s;
        }
        .logo-glow:hover { box-shadow: 0 0 28px hsl(var(--primary) / 0.65); }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: slideDown 0.2s ease; }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
          <div className={`header-pill glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between ${scrolled ? 'scrolled' : ''}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="logo-glow relative inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-black tracking-tight text-foreground text-[15px]">
                Prompt<span className="text-primary">Land</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              {NAV_LINKS.map(({ href, labelKey }) => {
                const isActive = activeLink === href || activeLink === href.replace('/#', '#');
                return (
                  <a
                    key={href}
                    href={href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveLink(href)}
                  >
                    {t(labelKey)}
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Language */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline text-base leading-none">
                    {LANGUAGES.find(l => l.code === language)?.flag}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-36 py-1.5 rounded-xl bg-card border border-border/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2.5 hover:bg-secondary/50 transition-colors rounded-lg mx-auto ${
                        language === lang.code ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth buttons */}
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
                  <Button asChild variant="hero" size="sm" className="hidden sm:flex">
                    <Link to="/register">{t('nav.getStarted')}</Link>
                  </Button>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="mobile-menu md:hidden mt-2 glass rounded-2xl px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {t(labelKey)}
                </a>
              ))}
              <div className="border-t border-border/30 mt-2 pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Button asChild variant="hero" size="sm">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                      {t('nav.dashboard')}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        <LogIn className="h-3.5 w-3.5 mr-1.5" />
                        {t('nav.signIn')}
                      </Link>
                    </Button>
                    <Button asChild variant="hero" size="sm">
                      <Link to="/register" onClick={() => setMobileOpen(false)}>{t('nav.getStarted')}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
