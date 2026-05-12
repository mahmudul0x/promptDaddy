import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { registerServiceWorker, requestNotificationPermission, showAdminNotification } from '@/lib/pushNotify';
import {
  CheckCircle, XCircle, Clock, Users, CreditCard, TrendingUp,
  RefreshCw, LogOut, Sparkles, Search, Trash2, ShieldCheck,
  ShieldOff, AlertTriangle, X, Download, Filter,
  LayoutDashboard, Bell, Calendar, Crown, Timer,
  Activity, UserPlus, ChevronRight, Zap, Package,
  Copy, Mail, ChevronLeft, BarChart2,
  Flame, Plus, Tag, Upload, ImageIcon, FileText, Pencil,
  Shield, UserX, Menu, X as XIcon
} from 'lucide-react';

const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL as string;
const SUPABASE_URL   = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function callEdgeFn(name: string, body: object) {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error(`Edge fn ${name} error:`, e);
  }
}
const CLOUDINARY_CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD as string;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET as string;

interface TrendingPrompt {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  prompt: string;
  created_at: string;
}
interface TrendingCat {
  id: string;
  name: string;
}

interface PaymentRequest {
  id: string;
  user_name: string;
  user_email: string;
  plan: string;
  amount: number;
  method: string;
  transaction_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
interface Profile {
  id: string;
  email: string;
  name: string;
  is_pro: boolean;
  created_at: string;
}
interface AdminEntry {
  id: string;
  email: string;
  added_by: string;
  created_at: string;
}
type SubStatus = 'lifetime' | 'monthly-active' | 'monthly-expiring' | 'monthly-expired' | 'free';

const DEMO_CATEGORIES = ['Email', 'Content', 'Image', 'GPT Image', 'Claude Skill', 'Social', 'Video', 'Automation'];
interface DemoPromptRow {
  id: number;
  title: string;
  prompt: string;
  category: string;
  image_url: string | null;
  test_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
interface DemoFormState {
  title: string;
  prompt: string;
  category: string;
  image_url: string;
  test_url: string;
  sort_order: number;
  is_active: boolean;
}

const PAY_STATUS = {
  pending:  { label: 'Pending',  dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  approved: { label: 'Approved', dot: 'bg-green-400',  text: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/20'  },
  rejected: { label: 'Rejected', dot: 'bg-red-400',    text: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/20'    },
};

// ── Helpers ──────────────────────────────────────────────────

function getDaysLeft(email: string, reqs: PaymentRequest[]): number | null {
  const hasLifetime = reqs.some(r => r.user_email === email && r.status === 'approved' && r.plan === 'lifetime');
  if (hasLifetime) return null;
  const monthly = reqs
    .filter(r => r.user_email === email && r.status === 'approved' && r.plan === 'monthly')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (!monthly.length) return null;
  const exp = new Date(monthly[0].created_at);
  exp.setDate(exp.getDate() + 30);
  return Math.ceil((exp.getTime() - Date.now()) / 86400000);
}

function getSubStatus(user: Profile, reqs: PaymentRequest[]): SubStatus {
  if (!user.is_pro) return 'free';
  const hasLifetime = reqs.some(r => r.user_email === user.email && r.status === 'approved' && r.plan === 'lifetime');
  if (hasLifetime) return 'lifetime';
  const days = getDaysLeft(user.email, reqs);
  if (days === null) return 'free';
  if (days <= 0) return 'monthly-expired';
  if (days <= 7) return 'monthly-expiring';
  return 'monthly-active';
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { dateStyle: 'medium' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('en-BD', { timeStyle: 'short' });
}
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Sub-components ───────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-elegant">
        <div className="flex gap-4 mb-5">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Confirm Delete</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub, badge }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string; badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 p-5 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: color }} />
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
          <Icon style={{ height: 18, width: 18, color }} />
        </div>
        {badge && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">{badge}</span>
        )}
      </div>
      <div className="text-2xl font-black text-foreground tabular-nums leading-none">{value}</div>
      <div className="text-xs font-medium text-muted-foreground mt-1.5">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</div>}
    </div>
  );
}

function DaysLeftPill({ days, isLifetime }: { days: number | null; isLifetime: boolean }) {
  if (isLifetime) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 whitespace-nowrap">
      <Crown className="h-2.5 w-2.5" /> Lifetime
    </span>
  );
  if (days === null) return <span className="text-[10px] text-muted-foreground">—</span>;
  if (days <= 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">Expired</span>
  );
  const cls = days <= 3
    ? 'bg-red-400/10 border-red-400/20 text-red-400'
    : days <= 7 ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
    : 'bg-green-400/10 border-green-400/20 text-green-400';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${cls} whitespace-nowrap`}>
      <Timer className="h-2.5 w-2.5" /> {days}d left
    </span>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const s = PAY_STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-lg border ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
    </span>
  );
}

function Paginator({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);
  const btn   = 'h-7 w-7 rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-all';
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground">{start}–{end} of {total}</span>
      <div className="flex items-center gap-0.5">
        <button className={btn} disabled={page <= 1}     onClick={() => onChange(1)}         title="First">«</button>
        <button className={btn} disabled={page <= 1}     onClick={() => onChange(page - 1)}  title="Prev"><ChevronLeft className="h-3.5 w-3.5" /></button>
        <span className="px-2.5 py-1 text-[10px] font-bold text-foreground bg-primary/10 rounded-lg border border-primary/20">{page} / {pages}</span>
        <button className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)}  title="Next"><ChevronRight className="h-3.5 w-3.5" /></button>
        <button className={btn} disabled={page >= pages} onClick={() => onChange(pages)}     title="Last">»</button>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} title={`Copy ${text}`}
      className="p-1 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all shrink-0">
      {copied ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const ITEMS_PER_PAGE = 15;

// ── Main ─────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── ALL hooks declared unconditionally at the top ──
  const [adminList, setAdminList]         = useState<AdminEntry[]>([]);
  const [adminListLoaded, setAdminListLoaded] = useState(false);
  const [tab, setTab]                     = useState<'overview' | 'payments' | 'users' | 'subscriptions' | 'trending' | 'admins' | 'demo-prompts'>('overview');
  const [requests, setRequests]           = useState<PaymentRequest[]>([]);
  const [users, setUsers]                 = useState<Profile[]>([]);
  const [fetching, setFetching]           = useState(true);
  const [actionId, setActionId]           = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Profile | null>(null);
  const [confirmApproveAll, setConfirmApproveAll] = useState(false);
  const [searchPay, setSearchPay]         = useState('');
  const [searchUser, setSearchUser]       = useState('');
  const [searchSub, setSearchSub]         = useState('');
  const [filterStatus, setFilterStatus]   = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [pagePay,  setPagePay]            = useState(1);
  const [pageUser, setPageUser]           = useState(1);
  const [pageSub,  setPageSub]            = useState(1);
  const [sortPay, setSortPay]             = useState<'newest' | 'oldest' | 'amount'>('newest');
  const [autoRefresh, setAutoRefresh]     = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminSaving, setAdminSaving]     = useState(false);
  const [adminMsg, setAdminMsg]           = useState<{ ok: boolean; text: string } | null>(null);
  const [editReq, setEditReq]             = useState<PaymentRequest | null>(null);
  const [trendingPrompts, setTrendingPrompts]     = useState<TrendingPrompt[]>([]);
  const [trendingCats, setTrendingCats]           = useState<TrendingCat[]>([]);
  const [trendingLoading, setTrendingLoading]     = useState(false);
  const [newCatName, setNewCatName]               = useState('');
  const [catSaving, setCatSaving]                 = useState(false);
  const [tpForm, setTpForm] = useState({ title: '', category: '', image_url: '', prompt: '' });
  const [tpImgUploading, setTpImgUploading]       = useState(false);
  const [tpImgPreview, setTpImgPreview]           = useState('');
  const [tpSaving, setTpSaving]                   = useState(false);
  const [tpMsg, setTpMsg]                         = useState<{ ok: boolean; text: string } | null>(null);
  const [tpDeleteId, setTpDeleteId]               = useState<string | null>(null);
  const [tpEditId, setTpEditId]                   = useState<string | null>(null);
  const [tpConfirmDeleteId, setTpConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);
  const [confirmRemoveAdmin, setConfirmRemoveAdmin] = useState<AdminEntry | null>(null);
  const [sidebarOpen, setSidebarOpen]             = useState(true);
  const [supabaseReady, setSupabaseReady]         = useState(false);
  // Demo Prompts tab state
  const [demoPrompts, setDemoPrompts]             = useState<DemoPromptRow[]>([]);
  const [demoLoading, setDemoLoading]             = useState(false);
  const [demoOpen, setDemoOpen]                   = useState(false);
  const [demoEditing, setDemoEditing]             = useState<DemoPromptRow | null>(null);
  const [demoSaving, setDemoSaving]               = useState(false);
  const [demoImgUploading, setDemoImgUploading]   = useState(false);
  const [demoForm, setDemoForm]                   = useState<DemoFormState>({
    title: '', prompt: '', category: 'Email', image_url: '', test_url: 'https://chat.openai.com', sort_order: 1, is_active: true,
  });

  // Compute isAdmin after all hooks
  const isAdmin = useMemo(() => 
    adminList.some(a => a.email === user?.email) || user?.email === ADMIN_EMAIL,
    [adminList, user]
  );

  /* ── Fetch functions ── */
  const fetchAdminList = useCallback(async () => {
    try {
      const { data } = await supabase.from('admin_emails').select('*').order('created_at', { ascending: true });
      setAdminList((data as AdminEntry[]) ?? []);
    } catch (error) {
      console.error('Failed to fetch admin list:', error);
      setAdminList([]);
    } finally {
      setAdminListLoaded(true);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    if (!isAdmin) return;
    setFetching(true);
    try {
      const [{ data: pays }, { data: profs }] = await Promise.all([
        supabase.from('payment_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);
      setRequests((pays as PaymentRequest[]) ?? []);
      setUsers((profs as Profile[]) ?? []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setFetching(false);
    }
  }, [isAdmin]);

  const fetchTrending = useCallback(async () => {
    setTrendingLoading(true);
    try {
      const [{ data: prompts }, { data: cats }] = await Promise.all([
        supabase.from('trending_prompts').select('*').order('created_at', { ascending: false }),
        supabase.from('trending_prompt_categories').select('*').order('name'),
      ]);
      setTrendingPrompts(prompts ?? []);
      setTrendingCats(cats ?? []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  /* ── Effects ── */
  // Initial admin list fetch
  useEffect(() => {
    fetchAdminList();
  }, [fetchAdminList]);

  // Auth check redirect
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login?redirect=/admin');
    }
  }, [user, loading, navigate]);

  // Redirect non-admins after admin list loads from DB
  useEffect(() => {
    if (adminListLoaded && !loading && !isAdmin) {
      navigate('/');
    }
  }, [adminListLoaded, loading, isAdmin, navigate]);

  // Initial data fetch
  useEffect(() => {
    if (!loading && isAdmin) {
      fetchAll();
    }
  }, [loading, isAdmin, fetchAll]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && isAdmin) {
      refreshRef.current = setInterval(fetchAll, 30000);
    }
    return () => {
      if (refreshRef.current) {
        clearInterval(refreshRef.current);
        refreshRef.current = null;
      }
    };
  }, [autoRefresh, isAdmin, fetchAll]);

  // Real-time subscription with error handling and retry
  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const setupRealtime = () => {
      try {
        if (realtimeChannelRef.current) {
          supabase.removeChannel(realtimeChannelRef.current);
        }

        const channel = supabase
          .channel('admin-new-payments')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'payment_requests',
          }, (payload) => {
            if (!mounted) return;
            const r = payload.new as PaymentRequest;
            try {
              showAdminNotification(
                '💰 New Payment Request',
                `${r.user_name} submitted a ${r.plan} payment (৳${r.amount} via ${r.method})`,
                '/admin'
              );
              setRequests(prev => [r, ...prev]);
            } catch (error) {
              console.error('Notification error:', error);
            }
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setSupabaseReady(true);
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              console.warn('Realtime connection issue, retrying in 5s...');
              if (mounted) {
                retryTimeout = setTimeout(setupRealtime, 5000);
              }
            }
          });

        realtimeChannelRef.current = channel;
      } catch (error) {
        console.error('Failed to setup realtime:', error);
        if (mounted) {
          retryTimeout = setTimeout(setupRealtime, 5000);
        }
      }
    };

    // Delay setup to avoid race conditions
    const initTimeout = setTimeout(() => {
      if (mounted) {
        setupRealtime();
      }
    }, 1000);

    // Register service worker
    try {
      registerServiceWorker();
      requestNotificationPermission();
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      clearTimeout(retryTimeout);
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [isAdmin]);

  // Fetch trending when tab changes
  useEffect(() => {
    if (tab === 'trending' && isAdmin) {
      fetchTrending();
    }
    if (tab === 'demo-prompts' && isAdmin) {
      fetchDemoPrompts();
    }
  }, [tab, isAdmin, fetchTrending, fetchDemoPrompts]);

  // Reset pagination when filters change
  useEffect(() => { setPagePay(1); }, [searchPay, filterStatus, sortPay]);
  useEffect(() => { setPageUser(1); }, [searchUser]);
  useEffect(() => { setPageSub(1); }, [searchSub]);

  /* ── Actions ── */
  const approve = async (req: PaymentRequest) => {
    setActionId(req.id);
    try {
      const { error } = await supabase.rpc('approve_user_payment', { user_email: req.user_email });
      if (error) throw error;
      await supabase.from('payment_requests').update({ status: 'approved' }).eq('id', req.id);
      setRequests(p => p.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
      setUsers(p => p.map(u => u.email === req.user_email ? { ...u, is_pro: true } : u));
      callEdgeFn('notify-user-approved', {
        user_name: req.user_name,
        user_email: req.user_email,
        plan: req.plan,
        action: 'approved',
      });
    } catch (error) {
      console.error('Approve error:', error);
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id: string) => {
    setActionId(id);
    try {
      await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', id);
      const req = requests.find(r => r.id === id);
      setRequests(p => p.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      if (req) {
        callEdgeFn('notify-user-approved', {
          user_name: req.user_name,
          user_email: req.user_email,
          plan: req.plan,
          action: 'rejected',
        });
      }
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setActionId(null);
    }
  };

  const togglePro = async (u: Profile) => {
    setActionId(u.id);
    try {
      await supabase.from('profiles').update({ is_pro: !u.is_pro }).eq('id', u.id);
      setUsers(p => p.map(x => x.id === u.id ? { ...x, is_pro: !x.is_pro } : x));
    } catch (error) {
      console.error('Toggle pro error:', error);
    } finally {
      setActionId(null);
    }
  };

  const deleteUser = async (u: Profile) => {
    setActionId(u.id);
    setConfirmDelete(null);
    try {
      await supabase.rpc('delete_user_account', { target_user_id: u.id });
      setUsers(p => p.filter(x => x.id !== u.id));
      setRequests(p => p.filter(r => r.user_email !== u.email));
    } catch (error) {
      console.error('Delete user error:', error);
    } finally {
      setActionId(null);
    }
  };

  const extendSubscription = async (u: Profile) => {
    setActionId(u.id);
    try {
      const { error } = await supabase.rpc('extend_user_subscription', { p_user_email: u.email });
      if (error) throw error;
      await fetchAll();
    } catch (error) {
      console.error('Extend subscription error:', error);
    } finally {
      setActionId(null);
    }
  };

  const bulkApprove = async () => {
    setConfirmApproveAll(false);
    for (const req of requests.filter(r => r.status === 'pending')) {
      await approve(req);
    }
  };

  /* ── Admin management ── */
  const addAdmin = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (adminList.some(a => a.email === email)) {
      setAdminMsg({ ok: false, text: 'This email is already an admin.' });
      return;
    }
    setAdminSaving(true);
    try {
      const { error } = await supabase.from('admin_emails').insert({ email, added_by: user?.email ?? 'unknown' });
      if (error) throw error;
      setNewAdminEmail('');
      await fetchAdminList();
      setAdminMsg({ ok: true, text: `${email} is now an admin.` });
    } catch (error) {
      setAdminMsg({ ok: false, text: 'Failed to add admin.' });
    } finally {
      setAdminSaving(false);
      setTimeout(() => setAdminMsg(null), 4000);
    }
  };

  const removeAdmin = async (entry: AdminEntry) => {
    if (entry.email === user?.email) {
      setAdminMsg({ ok: false, text: "You can't remove yourself." });
      return;
    }
    try {
      await supabase.from('admin_emails').delete().eq('id', entry.id);
      await fetchAdminList();
      setAdminMsg({ ok: true, text: `${entry.email} removed from admins.` });
    } catch (error) {
      console.error('Remove admin error:', error);
    }
    setTimeout(() => setAdminMsg(null), 4000);
  };

  /* ── Payment request edit ── */
  const saveEditReq = async (req: PaymentRequest, newStatus: 'approved' | 'rejected' | 'pending') => {
    setActionId(req.id);
    const oldStatus = req.status;

    try {
      if (newStatus === 'approved' && oldStatus !== 'approved') {
        const { error } = await supabase.rpc('approve_user_payment', { user_email: req.user_email });
        if (error) throw error;
        setUsers(p => p.map(u => u.email === req.user_email ? { ...u, is_pro: true } : u));
      } else if (newStatus !== 'approved' && oldStatus === 'approved') {
        const otherApproved = requests.filter(r => r.id !== req.id && r.user_email === req.user_email && r.status === 'approved');
        if (otherApproved.length === 0) {
          await supabase.from('profiles').update({ is_pro: false }).eq('email', req.user_email);
          setUsers(p => p.map(u => u.email === req.user_email ? { ...u, is_pro: false } : u));
        }
      }

      await supabase.from('payment_requests').update({ status: newStatus }).eq('id', req.id);
      setRequests(p => p.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
      setEditReq(null);

      if (newStatus === 'approved' || newStatus === 'rejected') {
        callEdgeFn('notify-user-approved', {
          user_name: req.user_name,
          user_email: req.user_email,
          plan: req.plan,
          action: newStatus,
        });
      }
    } catch (error) {
      console.error('Edit request error:', error);
    } finally {
      setActionId(null);
    }
  };

  // ── Trending helpers ──
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST', body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message ?? 'Cloudinary upload failed');
    return data.secure_url as string;
  };

  const handleTpImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTpImgUploading(true);
    setTpMsg(null);
    try {
      const url = await uploadToCloudinary(file);
      setTpForm(f => ({ ...f, image_url: url }));
      setTpImgPreview(url);
    } catch (err) {
      setTpMsg({ ok: false, text: (err as Error).message });
    } finally {
      setTpImgUploading(false);
    }
  };

  const handleTpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpForm.title.trim() || !tpForm.category || !tpForm.prompt.trim()) {
      setTpMsg({ ok: false, text: 'Title, category and prompt are required.' });
      return;
    }
    setTpSaving(true);
    setTpMsg(null);
    const payload = {
      title: tpForm.title.trim(),
      category: tpForm.category,
      image_url: tpForm.image_url || null,
      prompt: tpForm.prompt.trim(),
    };
    try {
      if (tpEditId) {
        const { error } = await supabase.from('trending_prompts').update(payload).eq('id', tpEditId);
        if (error) throw error;
        setTpMsg({ ok: true, text: 'Prompt updated successfully!' });
        setTpEditId(null);
      } else {
        const { error } = await supabase.from('trending_prompts').insert(payload);
        if (error) throw error;
        setTpMsg({ ok: true, text: 'Trending prompt published!' });
      }
      setTpForm({ title: '', category: '', image_url: '', prompt: '' });
      setTpImgPreview('');
      fetchTrending();
    } catch (error: any) {
      setTpMsg({ ok: false, text: error.message });
    } finally {
      setTpSaving(false);
    }
  };

  const startEditTp = (tp: TrendingPrompt) => {
    setTpEditId(tp.id);
    setTpForm({ title: tp.title, category: tp.category, image_url: tp.image_url ?? '', prompt: tp.prompt });
    setTpImgPreview(tp.image_url ?? '');
    setTpMsg(null);
  };

  const cancelEditTp = () => {
    setTpEditId(null);
    setTpForm({ title: '', category: '', image_url: '', prompt: '' });
    setTpImgPreview('');
    setTpMsg(null);
  };

  // ── Demo Prompts handlers ─────────────────────────────────
  const fetchDemoPrompts = useCallback(async () => {
    setDemoLoading(true);
    try {
      const { data, error } = await supabase.from('demo_prompts').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      setDemoPrompts((data || []) as DemoPromptRow[]);
    } catch (e) {
      console.error('fetchDemoPrompts error:', e);
    } finally {
      setDemoLoading(false);
    }
  }, []);

  const openDemoForm = (row?: DemoPromptRow) => {
    if (row) {
      setDemoEditing(row);
      setDemoForm({ title: row.title, prompt: row.prompt, category: row.category, image_url: row.image_url || '', test_url: row.test_url, sort_order: row.sort_order, is_active: row.is_active });
    } else {
      setDemoEditing(null);
      setDemoForm({ title: '', prompt: '', category: 'Email', image_url: '', test_url: 'https://chat.openai.com', sort_order: (demoPrompts.length || 0) + 1, is_active: true });
    }
    setDemoOpen(true);
  };

  const handleDemoImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDemoImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Upload failed');
      setDemoForm(f => ({ ...f, image_url: json.secure_url }));
    } catch (err) {
      console.error('Demo img upload error:', err);
    } finally {
      setDemoImgUploading(false);
    }
  };

  const saveDemoPrompt = async () => {
    if (!demoForm.title || !demoForm.prompt) return;
    setDemoSaving(true);
    try {
      if (demoEditing) {
        await supabase.from('demo_prompts').update({ ...demoForm, image_url: demoForm.image_url || null, updated_at: new Date().toISOString() }).eq('id', demoEditing.id);
      } else {
        await supabase.from('demo_prompts').insert({ ...demoForm, image_url: demoForm.image_url || null });
      }
      setDemoOpen(false);
      fetchDemoPrompts();
    } catch (err) {
      console.error('saveDemoPrompt error:', err);
    } finally {
      setDemoSaving(false);
    }
  };

  const deleteDemoPrompt = async (id: number) => {
    if (!confirm('Delete this demo prompt?')) return;
    try {
      await supabase.from('demo_prompts').delete().eq('id', id);
      setDemoPrompts(p => p.filter(x => x.id !== id));
    } catch (err) {
      console.error('deleteDemoPrompt error:', err);
    }
  };
  // ─────────────────────────────────────────────────────────────

  const deleteTrendingPrompt = async (id: string) => {
    setTpDeleteId(id);
    try {
      await supabase.from('trending_prompts').delete().eq('id', id);
      setTrendingPrompts(p => p.filter(x => x.id !== id));
    } catch (error) {
      console.error('Delete trending prompt error:', error);
    } finally {
      setTpDeleteId(null);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSaving(true);
    try {
      const { data, error } = await supabase.from('trending_prompt_categories')
        .insert({ name: newCatName.trim() }).select().single();
      if (error) throw error;
      if (data) {
        setTrendingCats(c => [...c, data as TrendingCat].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCatName('');
      }
    } catch (error) {
      console.error('Add category error:', error);
    } finally {
      setCatSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await supabase.from('trending_prompt_categories').delete().eq('id', id);
      setTrendingCats(c => c.filter(x => x.id !== id));
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Plan', 'Amount', 'Method', 'TrxID', 'Status', 'Date'],
      ...requests.map(r => [r.user_name, r.user_email, r.plan, r.amount, r.method, r.transaction_id, r.status, new Date(r.created_at).toLocaleString()])];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const exportUsersCSV = () => {
    const rows = [['Name', 'Email', 'Status', 'Subscription', 'Joined'],
      ...users.map(u => {
        const st = getSubStatus(u, requests);
        return [u.name, u.email, u.is_pro ? 'Pro' : 'Free', st, fmtDate(u.created_at)];
      })];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  /* ── Derived data ── */
  const pendingReqs = useMemo(() => requests.filter(r => r.status === 'pending'), [requests]);

  const revenue = useMemo(() =>
    requests.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0),
    [requests]
  );

  const monthlyRev = useMemo(() =>
    requests.filter(r => r.status === 'approved' && r.plan === 'monthly').reduce((s, r) => s + r.amount, 0),
    [requests]
  );

  const lifetimeRev = useMemo(() =>
    requests.filter(r => r.status === 'approved' && r.plan === 'lifetime').reduce((s, r) => s + r.amount, 0),
    [requests]
  );

  const proCount = useMemo(() => users.filter(u => u.is_pro).length, [users]);

  const expiringSoon = useMemo(() =>
    users.filter(u => {
      const days = getDaysLeft(u.email, requests);
      return u.is_pro && days !== null && days >= 0 && days <= 7;
    }),
    [users, requests]
  );

  const todaySignups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return users.filter(u => new Date(u.created_at) >= today).length;
  }, [users]);

  const weekRevenue = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return requests
      .filter(r => r.status === 'approved' && new Date(r.created_at) >= weekAgo)
      .reduce((s, r) => s + r.amount, 0);
  }, [requests]);

  const activityItems = useMemo(() => {
    type Item = { key: string; type: 'payment' | 'signup'; name: string; email: string; detail: string; status?: string; created_at: string };
    const items: Item[] = [
      ...requests.slice(0, 20).map(r => ({
        key: `p-${r.id}`, type: 'payment' as const, name: r.user_name, email: r.user_email,
        detail: `৳${r.amount} ${r.plan} via ${r.method?.toUpperCase()}`,
        status: r.status, created_at: r.created_at,
      })),
      ...users.slice(0, 20).map(u => ({
        key: `u-${u.id}`, type: 'signup' as const, name: u.name, email: u.email,
        detail: 'Joined PromptLand', created_at: u.created_at,
      })),
    ];
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12);
  }, [requests, users]);

  const filteredPays = useMemo(() => {
    let list = requests
      .filter(r => filterStatus === 'all' || r.status === filterStatus)
      .filter(r => !searchPay || r.user_name.toLowerCase().includes(searchPay.toLowerCase()) ||
        r.user_email.toLowerCase().includes(searchPay.toLowerCase()) || r.transaction_id.includes(searchPay));
    if (sortPay === 'oldest') list = [...list].reverse();
    if (sortPay === 'amount') list = [...list].sort((a, b) => b.amount - a.amount);
    return list;
  }, [requests, filterStatus, searchPay, sortPay]);

  const filteredUsers = useMemo(() =>
    users.filter(u => !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())),
    [users, searchUser]
  );

  type SubType = 'monthly' | 'lifetime' | 'manual';
  interface ProUser extends Profile { subType: SubType; daysLeft: number | null; latestMonthlyAt: string | null }

  const allProUsers = useMemo((): ProUser[] =>
    users
      .filter(u => u.is_pro)
      .map(u => {
        const hasLifetime = requests.some(r => r.user_email === u.email && r.status === 'approved' && r.plan === 'lifetime');
        if (hasLifetime) return { ...u, subType: 'lifetime' as SubType, daysLeft: null, latestMonthlyAt: null };
        const latestMonthly = requests
          .filter(r => r.user_email === u.email && r.status === 'approved' && r.plan === 'monthly')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        if (!latestMonthly) return { ...u, subType: 'manual' as SubType, daysLeft: null, latestMonthlyAt: null };
        const exp = new Date(latestMonthly.created_at);
        exp.setDate(exp.getDate() + 30);
        const daysLeft = Math.ceil((exp.getTime() - Date.now()) / 86400000);
        return { ...u, subType: 'monthly' as SubType, daysLeft, latestMonthlyAt: latestMonthly.created_at };
      })
      .sort((a, b) => {
        const order = (x: ProUser) => x.subType === 'lifetime' ? 99 : x.subType === 'manual' ? 50 : (x.daysLeft ?? 999);
        return order(a) - order(b);
      }),
    [users, requests]
  );

  const filteredSubs = useMemo(() =>
    allProUsers.filter(u => !searchSub || u.name.toLowerCase().includes(searchSub.toLowerCase()) ||
      u.email.toLowerCase().includes(searchSub.toLowerCase())),
    [allProUsers, searchSub]
  );

  // Paginated slices
  const pagedPays  = filteredPays.slice((pagePay  - 1) * ITEMS_PER_PAGE, pagePay  * ITEMS_PER_PAGE);
  const pagedUsers = filteredUsers.slice((pageUser - 1) * ITEMS_PER_PAGE, pageUser * ITEMS_PER_PAGE);
  const pagedSubs  = filteredSubs.slice((pageSub  - 1) * ITEMS_PER_PAGE, pageSub  * ITEMS_PER_PAGE);

  // Last 7-day revenue chart data
  const last7Days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const rev = requests
        .filter(r => r.status === 'approved' && new Date(r.created_at) >= d && new Date(r.created_at) < next)
        .reduce((s, r) => s + r.amount, 0);
      const sups = users.filter(u => new Date(u.created_at) >= d && new Date(u.created_at) < next).length;
      return { label: d.toLocaleDateString('en-BD', { weekday: 'short' }), rev, sups };
    }),
    [requests, users]
  );
  const maxRev = Math.max(...last7Days.map(d => d.rev), 1);

  /* ── Derived constants (must be before early returns) ── */
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: LayoutDashboard, badge: undefined as number | undefined },
    { id: 'payments',      label: 'Payments',      icon: CreditCard,      badge: pendingReqs.length || undefined as number | undefined },
    { id: 'users',         label: 'Users',          icon: Users,           badge: undefined as number | undefined },
    { id: 'subscriptions', label: 'Subscriptions',  icon: Crown,           badge: expiringSoon.length || undefined as number | undefined },
    { id: 'trending',      label: 'Trending',       icon: Flame,           badge: undefined as number | undefined },
    { id: 'admins',        label: 'Admins',         icon: Shield,          badge: undefined as number | undefined },
    { id: 'demo-prompts',  label: 'Demo Prompts',   icon: Sparkles,        badge: undefined as number | undefined },
  ] as const;

  /* ── Render ── */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (adminList.length > 0 && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ── Dialogs ── */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Permanently delete "${confirmDelete.name}" (${confirmDelete.email})? All their data will be removed.`}
          onConfirm={() => deleteUser(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmApproveAll && (
        <ConfirmDialog
          message={`Approve all ${pendingReqs.length} pending payment request${pendingReqs.length !== 1 ? 's' : ''}? This will grant Pro access to each user.`}
          onConfirm={bulkApprove}
          onCancel={() => setConfirmApproveAll(false)}
        />
      )}

      {tpConfirmDeleteId && (
        <ConfirmDialog
          message="Permanently delete this trending prompt? Users will no longer see it."
          onConfirm={() => { deleteTrendingPrompt(tpConfirmDeleteId); setTpConfirmDeleteId(null); }}
          onCancel={() => setTpConfirmDeleteId(null)}
        />
      )}

      {confirmDeleteCatId && (
        <ConfirmDialog
          message="Delete this category? Any trending prompts using it will lose their category."
          onConfirm={() => { deleteCategory(confirmDeleteCatId); setConfirmDeleteCatId(null); }}
          onCancel={() => setConfirmDeleteCatId(null)}
        />
      )}

      {confirmRemoveAdmin && (
        <ConfirmDialog
          message={`Remove admin access for "${confirmRemoveAdmin.email}"? They will lose all admin privileges immediately.`}
          onConfirm={() => { removeAdmin(confirmRemoveAdmin); setConfirmRemoveAdmin(null); }}
          onCancel={() => setConfirmRemoveAdmin(null)}
        />
      )}

      {/* ── Payment Edit Modal ── */}
      {editReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-elegant">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-foreground">Edit Payment Request</p>
                <p className="text-xs text-muted-foreground mt-0.5">{editReq.user_name} · {editReq.user_email}</p>
              </div>
              <button onClick={() => setEditReq(null)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: 'Plan', value: editReq.plan },
                { label: 'Amount', value: `৳${editReq.amount}` },
                { label: 'Method', value: editReq.method?.toUpperCase() },
                { label: 'Txn ID', value: editReq.transaction_id },
              ].map(({ label, value }) => (
                <div key={label} className="bg-secondary/50 rounded-xl px-3 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-xs font-semibold text-foreground font-mono truncate">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Current status: <span className="capitalize text-foreground">{editReq.status}</span>
            </p>
            <p className="text-xs text-muted-foreground mb-4">Change status — a notification email will be sent to the user.</p>

            <div className="flex flex-col gap-2">
              {editReq.status !== 'approved' && (
                <button disabled={actionId === editReq.id} onClick={() => saveEditReq(editReq, 'approved')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20 transition-all disabled:opacity-50">
                  <CheckCircle className="h-4 w-4" /> Approve &amp; Grant Pro Access
                </button>
              )}
              {editReq.status !== 'rejected' && (
                <button disabled={actionId === editReq.id} onClick={() => saveEditReq(editReq, 'rejected')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20 transition-all disabled:opacity-50">
                  <XCircle className="h-4 w-4" /> Reject &amp; Revoke Access
                </button>
              )}
              {editReq.status !== 'pending' && (
                <button disabled={actionId === editReq.id} onClick={() => saveEditReq(editReq, 'pending')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all disabled:opacity-50">
                  <Clock className="h-4 w-4" /> Set Back to Pending
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">PromptLand</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            {sidebarOpen ? <XIcon className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => t.url ? window.location.href = t.url : setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id 
                  ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-violet-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <t.icon className={`h-5 w-5 ${tab === t.id ? 'text-violet-400' : ''}`} />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{t.label}</span>
                  {t.badge !== undefined && (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {t.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300`}>
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">{tabs.find(t => t.id === tab)?.label || 'Dashboard'}</h1>
          </div>
          <div className="flex items-center gap-2">
            {pendingReqs.length > 0 && (
              <button onClick={() => setTab('payments')}
                className="relative flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center">
                  {pendingReqs.length}
                </span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-400/10 border border-green-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              <span className="text-[10px] font-semibold text-green-400">
                {supabaseReady ? 'Live' : 'Connecting...'}
              </span>
            </div>
            <button
              onClick={() => setAutoRefresh(r => !r)}
              title={autoRefresh ? 'Auto-refresh ON (30s)' : 'Auto-refresh OFF — click to enable'}
              className={`p-1.5 rounded-lg transition-all ${autoRefresh ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              <RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`}
                onClick={(e) => { e.stopPropagation(); fetchAll(); }} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Greeting row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div>
              <h1 className="text-xl font-black text-foreground">{greeting}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {pendingReqs.length > 0 && (
              <button onClick={() => setTab('payments')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-all">
                <AlertTriangle className="h-3.5 w-3.5" />
                {pendingReqs.length} payment{pendingReqs.length > 1 ? 's' : ''} need approval
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* ══ OVERVIEW ══ */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Users"
                  value={users.length}
                  icon={Users}
                  color="#60a5fa"
                  sub={todaySignups > 0 ? `+${todaySignups} joined today` : 'No signups today'}
                />
                <StatCard
                  label="Total Revenue"
                  value={`৳${revenue.toLocaleString()}`}
                  icon={TrendingUp}
                  color="#a78bfa"
                  sub={weekRevenue > 0 ? `৳${weekRevenue.toLocaleString()} this week` : 'No revenue this week'}
                />
                <StatCard
                  label="Pending Requests"
                  value={pendingReqs.length}
                  icon={Clock}
                  color="#facc15"
                  sub="awaiting approval"
                  badge={pendingReqs.length > 0 ? 'Action needed' : undefined}
                />
                <StatCard
                  label="Pro Members"
                  value={proCount}
                  icon={ShieldCheck}
                  color="#4ade80"
                  sub={`${users.length - proCount} free · ${expiringSoon.length} expiring`}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-400/10 border border-blue-400/20">
                      <CreditCard style={{ height: 14, width: 14, color: '#60a5fa' }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">Monthly Plans</span>
                  </div>
                  <div className="text-2xl font-black text-foreground">৳{monthlyRev.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {requests.filter(r => r.status === 'approved' && r.plan === 'monthly').length} total subscriptions
                  </div>
                  <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400 transition-all"
                      style={{ width: revenue > 0 ? `${(monthlyRev / revenue) * 100}%` : '0%' }} />
                  </div>
                  <div className="text-[9px] text-muted-foreground/50 mt-1.5">
                    {revenue > 0 ? Math.round((monthlyRev / revenue) * 100) : 0}% of total revenue
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-purple-400/10 border border-purple-400/20">
                      <Crown style={{ height: 14, width: 14, color: '#c084fc' }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">Lifetime Plans</span>
                  </div>
                  <div className="text-2xl font-black text-foreground">৳{lifetimeRev.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Set(requests.filter(r => r.status === 'approved' && r.plan === 'lifetime').map(r => r.user_email)).size} lifetime members
                  </div>
                  <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-400 transition-all"
                      style={{ width: revenue > 0 ? `${(lifetimeRev / revenue) * 100}%` : '0%' }} />
                  </div>
                  <div className="text-[9px] text-muted-foreground/50 mt-1.5">
                    {revenue > 0 ? Math.round((lifetimeRev / revenue) * 100) : 0}% of total revenue
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-yellow-400/10 border border-yellow-400/20">
                      <Bell style={{ height: 14, width: 14, color: '#facc15' }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">Alerts</span>
                  </div>
                  {pendingReqs.length === 0 && expiringSoon.length === 0 ? (
                    <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> All clear — nothing needs attention
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingReqs.length > 0 && (
                        <button onClick={() => setTab('payments')}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-yellow-400/5 border border-yellow-400/15 hover:bg-yellow-400/10 transition-all text-left">
                          <span className="text-[10px] font-semibold text-yellow-400">{pendingReqs.length} pending payments</span>
                          <ChevronRight className="h-3 w-3 text-yellow-400/60" />
                        </button>
                      )}
                      {expiringSoon.length > 0 && (
                        <button onClick={() => setTab('subscriptions')}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-400/5 border border-orange-400/15 hover:bg-orange-400/10 transition-all text-left">
                          <span className="text-[10px] font-semibold text-orange-400">{expiringSoon.length} expiring within 7 days</span>
                          <ChevronRight className="h-3 w-3 text-orange-400/60" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-border/30 space-y-1.5">
                    {[
                      ['Rejected payments', requests.filter(r => r.status === 'rejected').length],
                      ['Free users', users.length - proCount],
                      ['Monthly subscribers', allProUsers.filter(u => u.subType === 'monthly').length],
                    ].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Last 7 Days</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">Revenue (৳) · Signups</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {last7Days.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex flex-col justify-end" style={{ height: 56 }}>
                        <div className="w-full rounded-t-md transition-all"
                          style={{ height: `${Math.max((d.rev / maxRev) * 100, d.rev > 0 ? 8 : 2)}%`, background: 'var(--gradient-primary)', opacity: 0.75 }} />
                      </div>
                      <div className="text-center">
                        {d.sups > 0 && <div className="text-[8px] font-bold text-green-400">+{d.sups}</div>}
                        <div className="text-[8px] text-muted-foreground/50">{d.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border/20 flex justify-between text-[9px] text-muted-foreground/40">
                  <span>₹0</span>
                  <span>৳{maxRev.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 mt-4">
                <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">Recent Activity</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{activityItems.length} events</span>
                  </div>
                  {activityItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Activity className="h-8 w-8 text-muted-foreground/20 mb-2" />
                      <p className="text-xs text-muted-foreground">No activity yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/20">
                      {activityItems.map(item => (
                        <div key={item.key} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/10 transition-colors">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            item.type === 'payment' ? 'bg-primary/10 border border-primary/20' : 'bg-green-400/10 border border-green-400/20'
                          }`}>
                            {item.type === 'payment'
                              ? <CreditCard className="h-3.5 w-3.5 text-primary" />
                              : <UserPlus className="h-3.5 w-3.5 text-green-400" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                          </div>
                          <div className="text-right shrink-0 space-y-0.5">
                            <p className="text-[10px] text-muted-foreground/60">{timeAgo(item.created_at)}</p>
                            {item.status && <StatusBadge status={item.status as 'pending' | 'approved' | 'rejected'} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-bold text-foreground">Pending Payments</span>
                    </div>
                    {pendingReqs.length > 1 && (
                      <button onClick={() => setConfirmApproveAll(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all">
                        <CheckCircle className="h-3 w-3" /> Approve All ({pendingReqs.length})
                      </button>
                    )}
                  </div>
                  {pendingReqs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-8 w-8 text-green-400/30 mb-2" />
                      <p className="text-xs text-muted-foreground">No pending requests</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/20">
                      {pendingReqs.slice(0, 7).map(req => (
                        <div key={req.id} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/10 transition-colors">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-foreground shrink-0"
                            style={{ background: 'var(--gradient-primary)' }}>
                            {req.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{req.user_name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{req.user_email}</p>
                          </div>
                          <div className="text-right shrink-0 mr-1">
                            <p className="text-xs font-bold text-foreground">৳{req.amount}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{req.method}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button disabled={actionId === req.id} onClick={() => approve(req)}
                              className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all disabled:opacity-50">
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                            <button disabled={actionId === req.id} onClick={() => reject(req.id)}
                              className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-50">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══ PAYMENTS ══ */}
          {tab === 'payments' && (
            <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-border/40">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                  <input value={searchPay} onChange={e => setSearchPay(e.target.value)} placeholder="Search name, email, TrxID…"
                    className="w-full pl-8 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors" />
                  {searchPay && <button onClick={() => setSearchPay('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize transition-all ${filterStatus === f ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground border border-border/40 hover:text-foreground hover:border-border'}`}>
                      {f}{f !== 'all' ? ` (${requests.filter(r => r.status === f).length})` : ''}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <select value={sortPay} onChange={e => setSortPay(e.target.value as typeof sortPay)}
                    className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-primary/40 cursor-pointer">
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="amount">Highest amount</option>
                  </select>
                  {pendingReqs.length > 0 && (
                    <button onClick={() => setConfirmApproveAll(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-all whitespace-nowrap">
                      <Zap className="h-3.5 w-3.5" /> Approve All ({pendingReqs.length})
                    </button>
                  )}
                  <button onClick={exportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all">
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                </div>
              </div>

              {fetching ? (
                <div className="flex items-center justify-center py-16"><div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
              ) : filteredPays.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CreditCard className="h-8 w-8 text-muted-foreground/20 mb-2" />
                  <p className="text-sm text-muted-foreground">No payment requests found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/30">
                        {['User', 'Plan', 'Amount', 'Method', 'Transaction ID', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {pagedPays.map(req => {
                        const isActing = actionId === req.id;
                        return (
                          <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-foreground shrink-0"
                                  style={{ background: 'var(--gradient-primary)' }}>
                                  {req.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground whitespace-nowrap">{req.user_name}</p>
                                  <p className="text-muted-foreground text-[10px]">{req.user_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="capitalize font-medium text-foreground">{req.plan}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-foreground">৳{req.amount}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold px-2 py-0.5 rounded-md text-[10px]" style={{
                                background: req.method === 'bkash' ? '#E2136E15' : req.method === 'admin' ? '#6366f115' : '#F7941D15',
                                color: req.method === 'bkash' ? '#E2136E' : req.method === 'admin' ? '#818cf8' : '#F7941D',
                              }}>
                                {req.method?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-muted-foreground text-[10px] bg-secondary px-1.5 py-0.5 rounded">{req.transaction_id}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {fmtDate(req.created_at)}
                              <div className="text-[9px] text-muted-foreground/50">{fmtTime(req.created_at)}</div>
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {req.status === 'pending' && (
                                  <>
                                    <button disabled={isActing} onClick={() => approve(req)}
                                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all disabled:opacity-50 whitespace-nowrap">
                                      <CheckCircle className="h-3 w-3" /> Approve
                                    </button>
                                    <button disabled={isActing} onClick={() => reject(req.id)}
                                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-50 whitespace-nowrap">
                                      <XCircle className="h-3 w-3" /> Reject
                                    </button>
                                  </>
                                )}
                                <button onClick={() => setEditReq(req)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/40 transition-all whitespace-nowrap">
                                  <Pencil className="h-3 w-3" /> Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between flex-wrap gap-3">
                    <span className="text-[10px] text-muted-foreground">Approved revenue: <strong className="text-foreground">৳{revenue.toLocaleString()}</strong></span>
                    <Paginator page={pagePay} total={filteredPays.length} perPage={ITEMS_PER_PAGE} onChange={setPagePay} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ USERS ══ */}
          {tab === 'users' && (
            <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                  <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search users…"
                    className="w-full pl-8 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors" />
                  {searchUser && <button onClick={() => setSearchUser('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
                </div>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{filteredUsers.length} users · {proCount} pro</span>
                  <button onClick={exportUsersCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all">
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                </div>
              </div>
              {fetching ? (
                <div className="flex items-center justify-center py-16"><div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/30">
                        {['User', 'Email', 'Subscription', 'Days Left', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {pagedUsers.map(u => {
                        const isActing  = actionId === u.id;
                        const isAdminUser = adminList.some(a => a.email === u.email) || u.email === ADMIN_EMAIL;
                        const subSt    = getSubStatus(u, requests);
                        const daysLeft = getDaysLeft(u.email, requests);
                        const subStyle = {
                          lifetime:         'bg-purple-400/10 border-purple-400/20 text-purple-400',
                          'monthly-active':  'bg-green-400/10  border-green-400/20  text-green-400',
                          'monthly-expiring':'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
                          'monthly-expired': 'bg-red-400/10    border-red-400/20    text-red-400',
                          free:             'bg-secondary      border-border/40     text-muted-foreground',
                        }[subSt];
                        const subDot = {
                          lifetime: 'bg-purple-400', 'monthly-active': 'bg-green-400',
                          'monthly-expiring': 'bg-yellow-400', 'monthly-expired': 'bg-red-400', free: 'bg-muted-foreground',
                        }[subSt];
                        const subLabel = {
                          lifetime: 'Lifetime', 'monthly-active': 'Monthly', 'monthly-expiring': 'Expiring',
                          'monthly-expired': 'Expired', free: 'Free',
                        }[subSt];
                        return (
                          <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-primary-foreground shrink-0"
                                  style={{ background: 'var(--gradient-primary)' }}>
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-foreground">{u.name}</span>
                                    {isAdminUser && <span className="text-[8px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">Admin</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground text-xs">{u.email}</span>
                                <CopyBtn text={u.email} />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-lg border ${subStyle}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${subDot}`} />
                                {subLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <DaysLeftPill days={daysLeft} isLifetime={subSt === 'lifetime'} />
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(u.created_at)}</td>
                            <td className="px-4 py-3">
                              {!isAdminUser && (
                                <div className="flex items-center gap-1.5">
                                  <button disabled={isActing} onClick={() => togglePro(u)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-50 whitespace-nowrap ${
                                      u.is_pro ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                    }`}>
                                    {u.is_pro ? <><ShieldOff className="h-3 w-3" />Revoke</> : <><ShieldCheck className="h-3 w-3" />Grant Pro</>}
                                  </button>
                                  <button disabled={isActing} onClick={() => setConfirmDelete(u)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50">
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between flex-wrap gap-3">
                    <span className="text-[10px] text-muted-foreground">{filteredUsers.length} total · {proCount} pro · {users.length - proCount} free</span>
                    <Paginator page={pageUser} total={filteredUsers.length} perPage={ITEMS_PER_PAGE} onChange={setPageUser} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ SUBSCRIPTIONS ══ */}
          {tab === 'subscriptions' && (
            <div className="space-y-4">
              {expiringSoon.length > 0 && (
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-yellow-400">
                      {expiringSoon.length} subscription{expiringSoon.length > 1 ? 's' : ''} expiring within 7 days
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {expiringSoon.map(u => u.name).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                    <input value={searchSub} onChange={e => setSearchSub(e.target.value)} placeholder="Search subscribers…"
                      className="w-full pl-8 pr-7 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors" />
                    {searchSub && <button onClick={() => setSearchSub('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {filteredSubs.length} members · {expiringSoon.length} expiring
                  </span>
                </div>

                {fetching ? (
                  <div className="flex items-center justify-center py-16"><div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
                ) : filteredSubs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="h-8 w-8 text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground">No monthly subscribers</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">Lifetime members don't appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/40 bg-secondary/30">
                          {['Subscriber', 'Email', 'Started', 'Expires', 'Days Left', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {pagedSubs.map(u => {
                          const isActing   = actionId === u.id;
                          const expiryDate = u.latestMonthlyAt
                            ? (() => { const d = new Date(u.latestMonthlyAt!); d.setDate(d.getDate() + 30); return d; })()
                            : null;
                          const rowBg = u.subType === 'monthly' && u.daysLeft !== null && u.daysLeft <= 3 ? 'bg-red-400/[0.03]'
                            : u.subType === 'monthly' && u.daysLeft !== null && u.daysLeft <= 7 ? 'bg-yellow-400/[0.03]' : '';
                          return (
                            <tr key={u.id} className={`hover:bg-secondary/20 transition-colors ${rowBg}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-primary-foreground shrink-0"
                                    style={{ background: 'var(--gradient-primary)' }}>
                                    {u.name?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground">{u.name}</span>
                                    {u.subType === 'manual' && (
                                      <span className="ml-2 text-[8px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">Manual</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground text-xs">{u.email}</span>
                                  <CopyBtn text={u.email} />
                                  {u.subType === 'monthly' && u.daysLeft !== null && u.daysLeft <= 7 && (
                                    <a href={`mailto:${u.email}?subject=Renew your PromptLand subscription&body=Hi ${u.name}, your subscription expires in ${u.daysLeft} day(s). Please renew your subscription.`}
                                      title="Send renewal reminder"
                                      className="p-1 rounded text-orange-400/60 hover:text-orange-400 transition-all">
                                      <Mail className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                {u.latestMonthlyAt ? fmtDate(u.latestMonthlyAt) : '—'}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                {expiryDate ? fmtDate(expiryDate.toISOString()) : u.subType === 'lifetime' ? 'Never' : '—'}
                              </td>
                              <td className="px-4 py-3">
                                <DaysLeftPill days={u.daysLeft} isLifetime={u.subType === 'lifetime'} />
                              </td>
                              <td className="px-4 py-3">
                                {u.subType !== 'lifetime' && (
                                  <button disabled={isActing} onClick={() => extendSubscription(u)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all disabled:opacity-50 whitespace-nowrap">
                                    {isActing
                                      ? <><RefreshCw className="h-3 w-3 animate-spin" />Extending…</>
                                      : <><Calendar className="h-3 w-3" />+30 days</>
                                    }
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between flex-wrap gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        {filteredSubs.length} total · {allProUsers.filter(u => u.subType === 'monthly').length} monthly · {allProUsers.filter(u => u.subType === 'lifetime').length} lifetime · {expiringSoon.length} expiring
                      </span>
                      <Paginator page={pageSub} total={filteredSubs.length} perPage={ITEMS_PER_PAGE} onChange={setPageSub} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ TRENDING ══ */}
          {tab === 'trending' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-foreground flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" /> Trending Prompts
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {trendingPrompts.length} published · {trendingCats.length} categories
                  </p>
                </div>
                <button onClick={fetchTrending} disabled={trendingLoading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${trendingLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl border bg-card/60 overflow-hidden transition-colors ${tpEditId ? 'border-orange-400/40' : 'border-border/50'}`}>
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
                    {tpEditId ? <Pencil className="h-4 w-4 text-orange-400" /> : <FileText className="h-4 w-4 text-primary" />}
                    <span className="text-sm font-bold text-foreground">
                      {tpEditId ? 'Edit Trending Prompt' : 'Post Trending Prompt'}
                    </span>
                    {tpEditId && (
                      <button type="button" onClick={cancelEditTp}
                        className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-border/50 text-muted-foreground hover:text-foreground transition-all">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleTpSubmit} className="p-5 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title *</label>
                      <input
                        value={tpForm.title}
                        onChange={e => setTpForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Write a viral tweet thread about AI"
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category *</label>
                      <select
                        value={tpForm.category}
                        onChange={e => setTpForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-primary/40 cursor-pointer transition-colors"
                      >
                        <option value="">Select category…</option>
                        {trendingCats.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Image (optional)</label>
                      <div className="flex items-center gap-3">
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-all ${tpImgUploading ? 'opacity-50 cursor-not-allowed border-border/30' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
                          <Upload className="h-3.5 w-3.5" />
                          {tpImgUploading ? 'Uploading…' : 'Upload image'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleTpImageUpload} disabled={tpImgUploading} />
                        </label>
                        {tpImgPreview && (
                          <div className="relative h-14 w-20 rounded-lg overflow-hidden border border-border/50 shrink-0 group">
                            <img src={tpImgPreview} alt="" className="h-full w-full object-cover" />
                            <button type="button"
                              onClick={() => { setTpImgPreview(''); setTpForm(f => ({ ...f, image_url: '' })); }}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Prompt *</label>
                      <textarea
                        value={tpForm.prompt}
                        onChange={e => setTpForm(f => ({ ...f, prompt: e.target.value }))}
                        placeholder="Write your prompt here…"
                        rows={5}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 resize-none transition-colors"
                      />
                    </div>

                    {tpMsg && (
                      <p className={`text-xs font-medium ${tpMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{tpMsg.text}</p>
                    )}

                    <button type="submit" disabled={tpSaving || tpImgUploading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-primary-foreground transition-all disabled:opacity-50"
                      style={{ background: tpEditId ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'var(--gradient-primary)' }}>
                      {tpSaving
                        ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> {tpEditId ? 'Updating…' : 'Publishing…'}</>
                        : tpEditId
                          ? <><Pencil className="h-3.5 w-3.5" /> Update Prompt</>
                          : <><Plus className="h-3.5 w-3.5" /> Publish Prompt</>
                      }
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden self-start">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Categories</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{trendingCats.length} total</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <form onSubmit={addCategory} className="flex items-center gap-2">
                      <input
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        placeholder="New category name…"
                        className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors"
                      />
                      <button type="submit" disabled={catSaving || !newCatName.trim()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-foreground disabled:opacity-50 transition-all"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {catSaving ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Add
                      </button>
                    </form>
                    {trendingCats.length === 0 ? (
                      <p className="text-xs text-muted-foreground/50 text-center py-4">No categories yet. Add one above.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {trendingCats.map(c => (
                          <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50 border border-border/30">
                            <span className="text-xs font-medium text-foreground">{c.name}</span>
                            <button onClick={() => setConfirmDeleteCatId(c.id)}
                              className="p-1 rounded text-muted-foreground/40 hover:text-red-400 transition-colors">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-bold text-foreground">Published Prompts</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{trendingPrompts.length} total</span>
                </div>
                {trendingLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : trendingPrompts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Flame className="h-8 w-8 text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground">No trending prompts yet.</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">Use the form above to publish your first one.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {trendingPrompts.map(tp => (
                      <div key={tp.id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${tpEditId === tp.id ? 'bg-orange-400/5 border-l-2 border-orange-400' : 'hover:bg-secondary/10'}`}>
                        {tp.image_url ? (
                          <img src={tp.image_url} alt="" className="h-14 w-20 rounded-lg object-cover shrink-0 border border-border/30" />
                        ) : (
                          <div className="h-14 w-20 rounded-lg bg-secondary/60 border border-border/30 flex items-center justify-center shrink-0">
                            <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-400 border border-orange-400/20">
                              {tp.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50">{fmtDate(tp.created_at)}</span>
                            {tpEditId === tp.id && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-400/15 text-orange-400 border border-orange-400/20">Editing</span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-foreground">{tp.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{tp.prompt}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEditTp(tp)}
                            disabled={tpDeleteId === tp.id}
                            title="Edit"
                            className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${tpEditId === tp.id ? 'bg-orange-400/15 text-orange-400' : 'text-muted-foreground/40 hover:text-orange-400 hover:bg-orange-400/10'}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTpConfirmDeleteId(tp.id)}
                            disabled={tpDeleteId === tp.id}
                            title="Delete"
                            className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50">
                            {tpDeleteId === tp.id
                              ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ADMINS ══ */}
          {tab === 'admins' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h2 className="text-base font-black text-foreground">Admin Access</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Anyone in this list can log in and access the admin dashboard.
                </p>
              </div>

              {adminMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium border ${
                  adminMsg.ok
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {adminMsg.ok ? <CheckCircle className="h-3.5 w-3.5 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                  {adminMsg.text}
                </div>
              )}

              <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
                <p className="text-xs font-bold text-foreground mb-3">Add New Admin</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                    <input
                      value={newAdminEmail}
                      onChange={e => setNewAdminEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addAdmin()}
                      placeholder="email@example.com"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <button
                    onClick={addAdmin}
                    disabled={adminSaving || !newAdminEmail.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {adminSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                    Add Admin
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-2">
                  The user must already have an account. They'll get admin access on their next login.
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">Current Admins</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{adminList.length} total</span>
                </div>
                {adminList.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">No admins found.</div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {adminList.map(entry => {
                      const isSelf = entry.email === user?.email;
                      const isOwner = entry.email === ADMIN_EMAIL;
                      return (
                        <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/10 transition-colors">
                          <div className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-primary-foreground shrink-0"
                            style={{ background: 'var(--gradient-primary)' }}>
                            {entry.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-foreground truncate">{entry.email}</span>
                              {isSelf && <span className="text-[8px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">You</span>}
                              {isOwner && <span className="text-[8px] font-bold uppercase tracking-wider bg-yellow-400/15 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-400/20">Owner</span>}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Added by {entry.added_by} · {fmtDate(entry.created_at)}</p>
                          </div>
                          {!isSelf && (
                            <button
                              onClick={() => setConfirmRemoveAdmin(entry)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all whitespace-nowrap"
                            >
                              <UserX className="h-3 w-3" /> Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ══ DEMO PROMPTS ══ */}
          {tab === 'demo-prompts' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400" /> Demo Prompts
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Free prompts shown on homepage and /demo page — {demoPrompts.filter(p => p.is_active).length} active
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchDemoPrompts} disabled={demoLoading}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50">
                    <RefreshCw className={`h-4 w-4 ${demoLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={() => openDemoForm()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Add Prompt
                  </button>
                </div>
              </div>

              {demoLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-6 w-6 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                </div>
              ) : demoPrompts.length === 0 ? (
                <div className="rounded-2xl border border-border/50 bg-card/60 py-16 text-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No demo prompts yet.</p>
                  <button onClick={() => openDemoForm()} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25 transition-all">
                    Add First Prompt
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="border-b border-border/40 bg-secondary/30">
                      <tr>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Image</th>
                        <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {demoPrompts.map((row) => (
                        <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground font-mono">{row.sort_order}</td>
                          <td className="px-4 py-3 font-semibold text-foreground max-w-[200px] truncate">{row.title}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold">{row.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            {row.image_url
                              ? <img src={row.image_url} alt="" className="h-9 w-9 rounded-lg object-cover border border-border/40" />
                              : <span className="text-muted-foreground/40">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-muted text-muted-foreground border-border/30'}`}>
                              {row.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => window.open(row.test_url, '_blank')} title="Test URL"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => openDemoForm(row)} title="Edit"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => deleteDemoPrompt(row.id)} title="Delete"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add/Edit Dialog */}
              {demoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
                  <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-elegant max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-sm font-bold text-foreground">{demoEditing ? 'Edit Demo Prompt' : 'Add Demo Prompt'}</p>
                      <button onClick={() => setDemoOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title *</label>
                        <input value={demoForm.title} onChange={e => setDemoForm(f => ({ ...f, title: e.target.value }))} placeholder="Write Professional Email"
                          className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/40 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
                        <select value={demoForm.category} onChange={e => setDemoForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-violet-400/40 transition-colors">
                          {DEMO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Prompt *</label>
                        <textarea value={demoForm.prompt} onChange={e => setDemoForm(f => ({ ...f, prompt: e.target.value }))} rows={4} placeholder="Write your prompt here..."
                          className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/40 transition-colors resize-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Image (Optional)</label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 text-xs text-muted-foreground cursor-pointer hover:bg-secondary transition-colors">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {demoImgUploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" accept="image/*" onChange={handleDemoImgUpload} className="hidden" disabled={demoImgUploading} />
                          </label>
                          {demoForm.image_url && <img src={demoForm.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-border/40" />}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Test URL</label>
                        <input value={demoForm.test_url} onChange={e => setDemoForm(f => ({ ...f, test_url: e.target.value }))} placeholder="https://chat.openai.com"
                          className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/40 transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Sort Order</label>
                          <input type="number" value={demoForm.sort_order} onChange={e => setDemoForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 1 }))}
                            className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border/50 text-xs text-foreground outline-none focus:border-violet-400/40 transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input type="checkbox" id="demoActive" checked={demoForm.is_active} onChange={e => setDemoForm(f => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4 accent-violet-500" />
                          <label htmlFor="demoActive" className="text-xs font-medium text-foreground cursor-pointer">Active</label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setDemoOpen(false)} className="px-4 py-2 rounded-xl text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                        <button onClick={saveDemoPrompt} disabled={demoSaving || !demoForm.title || !demoForm.prompt}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20 transition-all disabled:opacity-50">
                          {demoSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                          {demoEditing ? 'Update' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}