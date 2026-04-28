import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');
  const [validSession, setValidSession] = useState(false);

  // Supabase puts the recovery token in the URL hash and fires
  // an onAuthStateChange event with event === 'PASSWORD_RECOVERY'
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setValidSession(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message || 'Failed to reset password. Try again.'); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-bold text-xl text-foreground">PromptLand</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 shadow-elegant border border-border/50">
          {done ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Password updated!</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Your password has been reset successfully. Redirecting to sign in…
              </p>
              <Link to="/login" className="text-sm text-primary hover:underline font-medium">
                Go to sign in
              </Link>
            </div>
          ) : !validSession ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 mb-5">
                <KeyRound className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Invalid or expired link</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This reset link is invalid or has already been used. Please request a new one.
              </p>
              <Link to="/forgot-password"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/login"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
              </div>
              <p className="text-sm text-muted-foreground mb-6 ml-10">
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pw" className="text-sm font-medium text-foreground/80">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      autoFocus
                      className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40 pr-10"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pw" className="text-sm font-medium text-foreground/80">
                    Confirm password
                  </Label>
                  <Input
                    id="confirm-pw"
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 font-semibold"
                >
                  {loading ? 'Updating…' : 'Update password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
