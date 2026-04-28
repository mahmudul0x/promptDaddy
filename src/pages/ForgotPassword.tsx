import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-bold text-xl text-foreground">PromptLand</span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 shadow-elegant border border-border/50">
          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <Mail className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mb-1">
                We sent a reset link to
              </p>
              <p className="text-sm font-semibold text-foreground mb-5">{email}</p>
              <p className="text-xs text-muted-foreground mb-6">
                Didn't receive it? Check your spam/junk folder. The link expires in 1 hour.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => { setSent(false); setEmail(''); }}
                >
                  Try a different email
                </Button>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to="/login"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
              </div>
              <p className="text-sm text-muted-foreground mb-6 ml-10">
                Enter your account email and we'll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-foreground/80">
                    Email address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
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
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 font-semibold gap-2"
                >
                  {loading ? 'Sending...' : (
                    <>Send reset link <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Remember it?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
