import { Sparkles, LogIn, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export const SiteHeader = () => {
  const { isAuthenticated } = useAuth();

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
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#tools" className="hover:text-foreground transition-colors">Tools</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild variant="hero" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground gap-1.5">
                  <Link to="/login">
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="hero" size="sm">
                  <Link to="/register">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
