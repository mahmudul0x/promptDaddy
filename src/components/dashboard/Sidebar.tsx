import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Image,
  Video, BookOpen, GraduationCap, Bot, Cpu, Heart, Newspaper, Star, BriefcaseBusiness,
  LogOut, Sparkles as BrandIcon, UserCircle, Crown, Package, Flame, Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';

const NAV = [
  {
    label: null,
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Home', end: true, pro: false },
    ],
  },
  {
    label: 'Create',
    items: [
      { to: '/dashboard/trending',          icon: Flame,           label: 'Trending Prompts', pro: true },
      { to: '/dashboard/prompts',           icon: MessageSquare,   label: 'Prompt Library',   pro: true },
      { to: '/dashboard/image-prompts',     icon: Image,           label: 'Image Prompts',    pro: true },
      { to: '/dashboard/ai-starter-kit',    icon: BriefcaseBusiness, label: 'AI Starter Kit', pro: true },
      { to: '/dashboard/claude-skill-bundle', icon: Package,       label: 'Claude Skills',    pro: true },
    ],
  },
  {
    label: 'Learning',
    items: [
      { to: '/dashboard/tutorials',    icon: Video,         label: 'Guided Tutorials', pro: true },
      { to: '/dashboard/videos',       icon: BookOpen,      label: 'Video Lessons',    pro: true },
      { to: '/dashboard/fundamentals', icon: GraduationCap, label: 'Core Concepts',    pro: true },
    ],
  },
  {
    label: 'Workflows',
    items: [
      { to: '/dashboard/claude-skills', icon: Bot, label: 'Claude Commands',  pro: true },
      { to: '/dashboard/custom-gpts',   icon: Cpu, label: 'GPT Collections',  pro: true },
    ],
  },
  {
    label: null,
    items: [
      { to: '/dashboard/favorites',  icon: Heart,     label: 'Saved Items', pro: false },
      { to: '/dashboard/ai-news',    icon: Newspaper, label: 'AI Updates',  pro: false },
      { to: '/dashboard/ai-models',  icon: Star,      label: 'Model Picks', pro: false },
    ],
  },
  {
    label: 'My Account',
    items: [
      { to: '/dashboard/profile', icon: UserCircle, label: 'Account Settings', pro: false },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout, subType, daysLeft, isPro } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <aside
      className="flex flex-col h-full w-[240px] shrink-0"
      style={{
        background: 'hsl(var(--sidebar-background))',
        borderRight: '1px solid hsl(var(--sidebar-border))',
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <BrandIcon className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} style={{ height: 18, width: 18 }} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[13px] leading-none text-foreground">PromptLand</p>
            <p className="text-[10px] mt-1 font-mono tracking-[0.15em] uppercase text-primary/80">Member Area</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border/40 shrink-0" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 no-scrollbar overflow-y-auto">
        {NAV.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-5' : ''}>
            {section.label && (
              <div className="flex items-center gap-2 px-3 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50 select-none">
                  {section.label}
                </span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label, end, pro }) => {
                const locked = pro && !isPro;
                return (
                  <li key={to}>
                    {locked ? (
                      /* Locked item — visually present but unclickable */
                      <div className="group relative flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium select-none cursor-not-allowed opacity-45">
                        <Icon className="shrink-0 text-muted-foreground/60" style={{ height: 15, width: 15 }} />
                        <span className="flex-1 leading-none text-muted-foreground">{label}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/25 px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                          <Lock style={{ height: 8, width: 8 }} />PRO
                        </span>
                      </div>
                    ) : (
                      <NavLink
                        to={to}
                        end={end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 select-none',
                            isActive
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
                            )}
                            <Icon
                              className={cn(
                                'shrink-0 transition-colors',
                                isActive ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground/80'
                              )}
                              style={{ height: 15, width: 15 }}
                            />
                            <span className="flex-1 leading-none">{label}</span>
                            {label === 'Saved Items' && favorites.length > 0 && (
                              <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full leading-none">
                                {favorites.length}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-border/40 shrink-0" />

      {/* User footer */}
      <div className="px-3 py-4 shrink-0">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.04] cursor-default"
          style={{ background: 'hsl(var(--muted))' }}
        >
          {/* Avatar */}
          <div
            className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground"
            style={{ background: 'var(--gradient-primary)' }}
          >
            {initial}
          </div>
          {/* Name / email */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-foreground truncate leading-none">{user?.name}</p>
            {subType === 'monthly' && daysLeft !== null ? (
              <p className={`text-[10px] truncate mt-1 leading-none font-medium ${daysLeft <= 5 ? 'text-red-400' : daysLeft <= 14 ? 'text-amber-400' : 'text-primary/70'}`}>
                <Crown style={{ height: 9, width: 9, display: 'inline', marginRight: 3 }} />
                {daysLeft}d left
              </p>
            ) : subType === 'lifetime' ? (
              <p className="text-[10px] text-amber-400/80 truncate mt-1 leading-none font-medium">
                <Crown style={{ height: 9, width: 9, display: 'inline', marginRight: 3 }} />
                Lifetime
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground/70 truncate mt-1 leading-none">{user?.email}</p>
            )}
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          >
            <LogOut style={{ height: 13, width: 13 }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
