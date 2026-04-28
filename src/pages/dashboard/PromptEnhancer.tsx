import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { cn } from '@/lib/utils';

const TEMPLATES = {
  business: { label: 'Business', description: 'Sales, marketing, strategy' },
  content: { label: 'Content', description: 'Writing, social media, blogs' },
  code: { label: 'Code', description: 'Programming & technical tasks' },
  analysis: { label: 'Analysis', description: 'Research & data analysis' },
  creative: { label: 'Creative', description: 'Brainstorming & ideas' },
};

function enhancePrompt(raw: string, type: string): string {
  const lines = raw.trim();
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const roleMap: Record<string, string> = {
    business: 'You are a seasoned business strategist with 20+ years of experience across Fortune 500 companies and high-growth startups.',
    content: 'You are an expert content strategist and award-winning writer who has created viral content for major publications and brands.',
    code: 'You are a senior software engineer with expertise in clean architecture, performance optimization, and best practices across multiple languages.',
    analysis: 'You are a data analyst and research expert skilled at synthesizing complex information into clear, actionable insights.',
    creative: 'You are a creative director and innovation consultant known for generating breakthrough ideas and unconventional solutions.',
  };

  const contextMap: Record<string, string> = {
    business: 'Apply proven frameworks (SWOT, OKR, BCG Matrix) where relevant. Focus on ROI, scalability, and practical execution.',
    content: 'Prioritize clarity, engagement, and value delivery. Apply the AIDA framework and hook-driven structure.',
    code: 'Write production-ready code with proper error handling, clear naming, and inline comments where logic is non-obvious.',
    analysis: 'Structure your analysis with: summary -> data -> insights -> recommendations. Use evidence-based reasoning.',
    creative: 'Think divergently first (volume of ideas), then converge. Challenge assumptions and explore analogies from other domains.',
  };

  const formatMap: Record<string, string> = {
    business: 'Structure your response with clear headings. Include: Executive Summary, Key Recommendations, Action Steps, and KPIs to track.',
    content: 'Format for readability: use headers, bullet points, and short paragraphs. End with a clear call-to-action.',
    code: 'Provide the complete solution with code blocks. Include: approach explanation, the code, and usage example.',
    analysis: 'Present in this order: (1) Summary, (2) Findings, (3) Analysis, (4) Recommendations, (5) Next Steps.',
    creative: 'Generate at minimum 5 distinct ideas. For the top 2, elaborate with rationale, potential challenges, and execution steps.',
  };

  return `<Role>
${roleMap[type] ?? roleMap.business}
</Role>

<Context>
${contextMap[type] ?? contextMap.business}
Today's date: ${today}
</Context>

<Task>
${lines}
</Task>

<Constraints>
- Be specific and actionable, not generic
- Prioritize depth over breadth where relevant
- If you need clarification to give a better answer, ask before proceeding
- Acknowledge any assumptions you make
</Constraints>

<Output Format>
${formatMap[type] ?? formatMap.business}
</Output Format>`;
}

export default function PromptEnhancer() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('business');
  const [enhanced, setEnhanced] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setEnhanced(enhancePrompt(input, type));
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon={Wand2}
        title="Prompt Enhancer"
        description="Paste any basic prompt and get a professionally structured version with role, context, and format."
        iconColor="text-accent"
      />

      {/* Type selector */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground/80 mb-3 block">Prompt Category</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEMPLATES).map(([key, { label, description }]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              className={cn(
                'text-sm px-4 py-2 rounded-lg border transition-all text-left',
                type === key
                  ? 'bg-primary/15 text-primary border-primary/40 font-medium'
                  : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
              )}
            >
              <span>{label}</span>
              <span className="hidden sm:block text-xs opacity-70 mt-0.5">{description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-bold text-muted-foreground">1</span>
            Your original prompt
          </Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Write me a cold email to sell my SaaS product"
            rows={10}
            className="resize-none bg-secondary/50 border-border/60 focus-visible:ring-primary/40 font-mono text-sm"
          />
          <Button
            onClick={handleEnhance}
            disabled={!input.trim() || loading}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2"
          >
            {loading ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Enhancing...</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Enhance Prompt <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</span>
            Enhanced prompt
            {enhanced && (
              <span className="ml-auto text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Ready
              </span>
            )}
          </Label>
          <div className="relative">
            <Textarea
              value={enhanced}
              readOnly
              rows={10}
              placeholder="Your enhanced prompt will appear here..."
              className="resize-none bg-secondary/30 border-border/60 font-mono text-sm text-foreground/90 placeholder:text-muted-foreground/40"
            />
          </div>
          {enhanced && (
            <Button
              onClick={handleCopy}
              variant="outline"
              className={cn('w-full gap-2', copied ? 'text-green-400 border-green-400/40' : '')}
            >
              {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Enhanced Prompt</>}
            </Button>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 rounded-xl border border-border/50 bg-secondary/20">
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> How it works
        </h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>- <strong className="text-foreground">Role</strong> - Assigns expert persona to prime the model's knowledge</li>
          <li>- <strong className="text-foreground">Context</strong> - Provides domain-specific guidelines and frameworks</li>
          <li>- <strong className="text-foreground">Task</strong> - Your original request, preserved exactly</li>
          <li>- <strong className="text-foreground">Constraints</strong> - Quality guardrails to keep output precise</li>
          <li>- <strong className="text-foreground">Output Format</strong> - Structures the response for maximum clarity</li>
        </ul>
      </div>
    </div>
  );
}
