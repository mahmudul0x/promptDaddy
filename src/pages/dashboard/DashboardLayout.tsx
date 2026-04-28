import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { X, Lock, ArrowRight, Sparkles, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

// Preload Claude Skills card images so they're cached before the user navigates there
const CLAUDE_SKILL_IMAGES = [
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=60',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=60',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=60',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60',
  'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=400&q=60',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=60',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=60',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=60',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
  'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=60',
  'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=60',
];

function UpgradeWall({ name, email, expired }: { name: string; email: string; expired: boolean }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const [msg, setMsg] = useState('');

  const checkStatus = async () => {
    setChecking(true);
    setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setChecking(false); return; }
    const { data } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single();
    setChecking(false);
    if (data?.is_pro) {
      window.location.href = '/dashboard';
    } else {
      setMsg('Not activated yet. Our team is reviewing your payment — please check back shortly.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-5"
        style={{ background: 'hsl(var(--background)/0.95)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-bold text-sm text-foreground">PromptLand</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${expired ? 'bg-red-500/10 border border-red-500/20' : 'bg-primary/10 border border-primary/20'}`}>
            {expired ? <AlertCircle className="h-7 w-7 text-red-400" /> : <Lock className="h-7 w-7 text-primary" />}
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">
            {expired ? `Subscription Expired, ${name}` : `Hey ${name}, activate your account`}
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            {expired ? (
              <>Your monthly subscription has expired.<br />Renew via bKash or Nagad — access restored as soon as your payment is verified.</>
            ) : (
              <>You're registered but haven't purchased a plan yet.<br />Buy a plan via bKash or Nagad — your account will be unlocked once your payment is verified.</>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/#pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              <Sparkles className="h-4 w-4" />
              View Plans
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={checkStatus}
              disabled={checking}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Check Status'}
            </button>
          </div>
          {msg && <p className="mt-4 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2">{msg}</p>}
          <p className="mt-5 text-[11px] text-muted-foreground/40">
            Already paid? Click "Check Status" to refresh your access.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExpiryBanner({ daysLeft }: { daysLeft: number }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const urgent = daysLeft <= 5;
  return (
    <div className={`flex items-center gap-3 px-5 py-2.5 text-sm shrink-0 ${urgent ? 'bg-red-500/10 border-b border-red-500/20' : 'bg-amber-500/10 border-b border-amber-500/20'}`}>
      <Clock className={`h-4 w-4 shrink-0 ${urgent ? 'text-red-400' : 'text-amber-400'}`} />
      <span className={urgent ? 'text-red-300' : 'text-amber-300'}>
        {urgent
          ? <><strong>Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left</strong> - your subscription expires soon. Renew now to keep access.</>
          : <><strong>{daysLeft} days left</strong> on your monthly subscription. Renew via bKash or Nagad to avoid interruption.</>
        }
      </span>
      <Link
        to="/#pricing"
        className={`ml-auto shrink-0 text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${urgent ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'}`}
      >
        Renew Now
      </Link>
      <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Routes that require an active Pro subscription
const PRO_ROUTES = new Set([
  '/dashboard/trending',
  '/dashboard/prompts',
  '/dashboard/image-prompts',
  '/dashboard/ai-starter-kit',
  '/dashboard/claude-skill-bundle',
  '/dashboard/tutorials',
  '/dashboard/videos',
  '/dashboard/fundamentals',
  '/dashboard/claude-skills',
  '/dashboard/custom-gpts',
]);

export default function DashboardLayout() {
  const { isAuthenticated, isPro, isExpired, daysLeft, subType, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  // Prefetch heavy JSON files in background so pages load instantly on first click
  useEffect(() => {
    if (!isPro) return;
    queryClient.prefetchQuery({ queryKey: ['prompts'],       queryFn: () => fetchJson('/data/prompts.json'),       staleTime: Infinity });
    queryClient.prefetchQuery({ queryKey: ['image_prompts'], queryFn: () => fetchJson('/data/image_prompts.json'), staleTime: Infinity });
    CLAUDE_SKILL_IMAGES.forEach((href) => {
      if (document.head.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [isPro, queryClient]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!isAuthenticated) return null;

  // Never-purchased users → show full upgrade wall (not in dashboard yet)
  if (!isPro && !isExpired) return <UpgradeWall name={user?.name?.split(' ')[0] ?? 'there'} email={user?.email ?? ''} expired={false} />;

  // Expired users trying to visit a pro-locked route → silently redirect to dashboard home
  if (!isPro && PRO_ROUTES.has(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar - collapsible */}
      <div
        className="hidden lg:block shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: sidebarCollapsed ? 0 : 240 }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute left-[240px] top-4 z-10 p-1.5 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
          sidebarCollapsed={sidebarCollapsed}
        />
        {subType === 'monthly' && daysLeft !== null && daysLeft <= 14 && !isExpired && (
          <ExpiryBanner daysLeft={daysLeft} />
        )}
        {isExpired && (
          <div className="flex items-center gap-3 px-5 py-2.5 shrink-0 bg-red-500/10 border-b border-red-500/20">
            <Lock className="h-4 w-4 shrink-0 text-red-400" />
            <span className="text-red-300 text-sm flex-1">
              <strong>Subscription expired.</strong> Pro content is locked. Renew to restore full access.
            </span>
            <Link
              to="/#pricing"
              className="shrink-0 text-xs font-semibold px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors whitespace-nowrap"
            >
              Renew Now →
            </Link>
          </div>
        )}
        <main className="flex-1 overflow-y-auto custom-scroll">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
