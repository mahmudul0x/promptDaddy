import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

const PERKS = [
  '901 expert LLM prompts',
  '147 image prompts & gallery',
  '51 Claude Skills & slash commands',
  'AI search across all content',
  'Prompt & image enhancer tools',
];

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.ok) {
      navigate('/#pricing');
    } else {
      const msg = result.error ?? '';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('email rate')) {
        setError('Too many attempts for this email. Please wait a few minutes and try again.');
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(msg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SiteHeader />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — perks */}
        <div className="hidden lg:flex flex-col gap-6">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-bold text-xl text-foreground">PromptLand</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Everything you need to <span className="text-gradient-primary">master AI.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of professionals using PromptLand to move faster and work smarter.
            </p>
          </div>
          <ul className="space-y-3 mt-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div>
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="font-bold text-xl text-foreground">PromptLand</span>
            </Link>
          </div>

          <div className="glass rounded-2xl p-8 shadow-elegant border border-border/50">
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm mb-6">Free to start. No credit card required.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="bg-secondary/50 border-border/60 focus-visible:ring-primary/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11 font-semibold gap-2 mt-2"
              >
                {loading ? 'Creating account...' : (
                  <>Get Started Free <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mt-5 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-[11px] text-muted-foreground">or sign up with</span>
              </div>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary hover:border-border transition-all text-sm font-medium"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
