import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Menu, X, ChevronRight, Home, PanelLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/search': 'AI Search',
  '/dashboard/prompts': 'LLM Prompts',
  '/dashboard/prompt-enhancer': 'Prompt Enhancer',
  '/dashboard/image-prompts': 'Image Prompts',
  '/dashboard/image-enhancer': 'Image Enhancer',
  '/dashboard/ai-starter-kit': 'AI Starter Kit',
  '/dashboard/tutorials': 'Tutorials',
  '/dashboard/videos': 'Videos',
  '/dashboard/fundamentals': 'Fundamentals',
  '/dashboard/automation': 'Automation',
  '/dashboard/claude-skills': 'Claude Skills',
  '/dashboard/custom-gpts': 'Custom GPTs',
  '/dashboard/favorites': 'Favorites',
  '/dashboard/ai-news': 'AI News Feed',
  '/dashboard/ai-models': 'AI Model Recommendations',
  '/dashboard/profile': 'Profile & Settings',
};

interface TopBarProps {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export function TopBar({ onMenuClick, onSidebarToggle, sidebarCollapsed }: TopBarProps) {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isHome = location.pathname === '/dashboard';
  const isArticleDetail = location.pathname.startsWith('/dashboard/ai-news/') && location.pathname !== '/dashboard/ai-news';
  const currentPage = CRUMBS[location.pathname] ?? (isArticleDetail ? 'Article' : 'Dashboard');
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header
      className="h-[58px] flex items-center gap-3 px-4 shrink-0"
      style={{
        background: 'hsl(var(--background) / 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsl(var(--border))',
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 -ml-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu style={{ height: 18, width: 18 }} />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        onClick={onSidebarToggle}
        title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        className={cn(
          'hidden lg:flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200',
          'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]',
          'border border-transparent hover:border-border/40',
        )}
      >
        <PanelLeft style={{ height: 16, width: 16 }} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-muted-foreground select-none">
        <Home style={{ height: 12, width: 12 }} className="opacity-60" />
        {isHome && <span className="text-foreground font-medium ml-0.5">Dashboard</span>}
        {!isHome && !isArticleDetail && (
          <>
            <ChevronRight style={{ height: 11, width: 11 }} className="opacity-40" />
            <span className="text-foreground font-medium">{currentPage}</span>
          </>
        )}
        {isArticleDetail && (
          <>
            <ChevronRight style={{ height: 11, width: 11 }} className="opacity-40" />
            <Link to="/dashboard/ai-news" className="hover:text-foreground transition-colors">AI News Feed</Link>
            <ChevronRight style={{ height: 11, width: 11 }} className="opacity-40" />
            <span className="text-foreground font-medium">Article</span>
          </>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-sm mx-auto">
        <div
          className="relative flex items-center h-8 rounded-lg transition-all duration-200"
          style={{
            background: focused ? 'hsl(var(--muted))' : 'hsl(var(--secondary))',
            border: `1px solid ${focused ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border))'}`,
            boxShadow: focused ? '0 0 0 3px hsl(var(--primary) / 0.08)' : 'none',
          }}
        >
          <Search
            className="absolute left-2.5 text-muted-foreground/50 pointer-events-none"
            style={{ height: 13, width: 13 }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search everything..."
            className="w-full bg-transparent pl-8 pr-16 text-[12.5px] text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X style={{ height: 12, width: 12 }} />
            </button>
          ) : (
            <div className="absolute right-2 flex items-center gap-0.5 pointer-events-none">
              <kbd className="text-[9px] text-muted-foreground/40 font-mono bg-white/[0.04] border border-border/40 rounded px-1 py-0.5 leading-none">
                K
              </kbd>
            </div>
          )}
        </div>
      </form>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        {/* Status dot */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
          <span className="text-[11px] text-muted-foreground/60">Active</span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-border/50" />

        {/* Theme toggle */}
        <ThemeToggle />

        <div className="h-4 w-px bg-border/50" />

        {/* User chip */}
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {initial}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[12px] font-medium text-foreground leading-none">{user?.name?.split(' ')[0]}</span>
            <span className="text-[9px] text-primary/70 font-mono uppercase tracking-wider leading-none mt-0.5">Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
}
