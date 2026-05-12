import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, Home, PanelLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlobalSearch } from '@/components/dashboard/GlobalSearch';
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
  const location = useLocation();
  const { user } = useAuth();

  const isHome = location.pathname === '/dashboard';
  const isArticleDetail = location.pathname.startsWith('/dashboard/ai-news/') && location.pathname !== '/dashboard/ai-news';
  const currentPage = CRUMBS[location.pathname] ?? (isArticleDetail ? 'Article' : 'Dashboard');
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

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

      {/* Global search */}
      <GlobalSearch />

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
