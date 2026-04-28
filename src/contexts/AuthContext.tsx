import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string;
  name: string;
  is_pro: boolean;
}

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isPro: boolean;
  isExpired: boolean;
  daysLeft: number | null;
  subType: 'monthly' | 'lifetime' | 'manual' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toProfile(user: User, name?: string, is_pro = false): Profile {
  return {
    id: user.id,
    email: user.email ?? '',
    name: name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'User',
    is_pro,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<Profile | null>(null);
  const [session, setSession]   = useState<Session | null>(null);
  const [loading, setLoading]   = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [subType, setSubType]   = useState<'monthly' | 'lifetime' | 'manual' | null>(null);

  async function fetchProfile(sbUser: User) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, is_pro')
      .eq('id', sbUser.id)
      .single();

    // Account was deleted by admin — force sign out
    if (!profile) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsExpired(false);
      setDaysLeft(null);
      setSubType(null);
      return;
    }

    let isPro = profile?.is_pro ?? false;
    let expired = false;
    let computedDaysLeft: number | null = null;
    let computedSubType: 'monthly' | 'lifetime' | 'manual' | null = null;

    if (isPro) {
      const { data: payments } = await supabase
        .from('payment_requests')
        .select('plan, created_at')
        .eq('user_email', sbUser.email ?? '')
        .eq('status', 'approved');

      const hasLifetime = payments?.some(p => p.plan === 'lifetime') ?? false;

      if (hasLifetime) {
        computedSubType = 'lifetime';
      } else if (payments && payments.length > 0) {
        const latestMonthly = payments
          .filter(p => p.plan === 'monthly')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        if (latestMonthly) {
          computedSubType = 'monthly';
          const expiry = new Date(latestMonthly.created_at);
          expiry.setDate(expiry.getDate() + 30);
          if (expiry < new Date()) {
            await supabase.from('profiles').update({ is_pro: false }).eq('id', sbUser.id);
            isPro = false;
            expired = true;
            computedSubType = null;
          } else {
            const msLeft = expiry.getTime() - Date.now();
            computedDaysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
          }
        } else {
          // has payments but none monthly — shouldn't normally happen, treat as manual
          computedSubType = 'manual';
        }
      } else {
        // pro but no payment records — manually activated by admin
        computedSubType = 'manual';
      }
    }

    setIsExpired(expired);
    setDaysLeft(computedDaysLeft);
    setSubType(computedSubType);
    setUser(toProfile(sbUser, profile?.name, isPro));
  }

  const refreshProfile = async () => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (sbUser) await fetchProfile(sbUser);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) fetchProfile(s.user);
      else { setUser(null); setIsExpired(false); setDaysLeft(null); setSubType(null); }
    });

    // Re-check expiry once every 24 hours so a tab left open still gets blocked
    const dailyTimer = setInterval(async () => {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) fetchProfile(sbUser);
    }, 24 * 60 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(dailyTimer);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { ok: false, error: error.message };
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email, name, is_pro: false });
    }
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsExpired(false);
    setDaysLeft(null);
    setSubType(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!session,
      isPro: user?.is_pro ?? false,
      isExpired,
      daysLeft,
      subType,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
