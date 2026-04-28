import { useState, useMemo } from 'react';
import { Bot, Terminal, X, Heart, Zap, Lock, Copy, Check } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';
import type { ClaudeSkill } from '@/data/types';
import { cn } from '@/lib/utils';

// ─── Category config ─────────────────────────────────────────────────────────

const CAT: Record<string, { badge: string; glow: string; bar: string; dot: string }> = {
  'Development':  { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', glow: 'group-hover:shadow-[0_0_24px_hsl(142_70%_50%/0.18)]', bar: '#10b981', dot: '#10b981' },
  'Content':      { badge: 'bg-purple-500/15 text-purple-400 border-purple-500/20',    glow: 'group-hover:shadow-[0_0_24px_hsl(270_70%_60%/0.18)]', bar: '#a855f7', dot: '#a855f7' },
  'Business':     { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',          glow: 'group-hover:shadow-[0_0_24px_hsl(217_90%_60%/0.18)]', bar: '#3b82f6', dot: '#3b82f6' },
  'Analytics':    { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',       glow: 'group-hover:shadow-[0_0_24px_hsl(43_96%_56%/0.18)]',  bar: '#f59e0b', dot: '#f59e0b' },
  'Communication':{ badge: 'bg-pink-500/15 text-pink-400 border-pink-500/20',          glow: 'group-hover:shadow-[0_0_24px_hsl(330_80%_60%/0.18)]', bar: '#ec4899', dot: '#ec4899' },
  'Productivity': { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',          glow: 'group-hover:shadow-[0_0_24px_hsl(188_90%_50%/0.18)]', bar: '#06b6d4', dot: '#06b6d4' },
  'Marketing':    { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/20',    glow: 'group-hover:shadow-[0_0_24px_hsl(25_95%_55%/0.18)]',  bar: '#f97316', dot: '#f97316' },
  'Research':     { badge: 'bg-violet-500/15 text-violet-400 border-violet-500/20',    glow: 'group-hover:shadow-[0_0_24px_hsl(258_90%_65%/0.18)]', bar: '#8b5cf6', dot: '#8b5cf6' },
};

// ─── Skills data ──────────────────────────────────────────────────────────────

const SKILLS: ClaudeSkill[] = [
  {
    id: 'cs-001',
    title: 'Code Explainer',
    description: 'Paste any code and get a clear, plain-English breakdown — logic, patterns, potential issues, and improvement suggestions.',
    category: 'Development',
    tags: ['code', 'learning', 'review'],
    image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=60',
    instructions: `/explain-code

Paste the code block you want explained. Claude will break it down section by section — explaining the logic, identifying patterns, flagging any potential bugs, and suggesting cleaner alternatives where relevant.

Works with: JavaScript, Python, TypeScript, Go, Rust, SQL, and more.`,
    skill_url: null,
    is_premium: false,
    is_featured: true,
    created_at: '2026-01-01T00:00:00+00:00',
  },
  {
    id: 'cs-002',
    title: 'Bug Debugger',
    description: 'Describe your bug or paste the error. Claude traces the root cause, explains why it happens, and gives you a working fix.',
    category: 'Development',
    tags: ['debugging', 'errors', 'fix'],
    image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=60',
    instructions: `/debug-bug

Share the error message, stack trace, and the code block where the issue occurs. Claude will:
• Identify the root cause
• Explain why the error is happening
• Provide a corrected version of the code
• Suggest how to prevent the same issue in future`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-02T00:00:00+00:00',
  },
  {
    id: 'cs-003',
    title: 'SOP Builder',
    description: 'Turn any process into a clean Standard Operating Procedure — numbered steps, responsibilities, tools, and success criteria.',
    category: 'Productivity',
    tags: ['sop', 'process', 'workflow'],
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=60',
    instructions: `/build-sop

Describe the process you want to document. Include who does it, how often, and the key tools involved. Claude will output a complete SOP with:
• Purpose and scope
• Step-by-step numbered instructions
• Responsible party for each step
• Common mistakes to avoid
• Success/completion criteria`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-03T00:00:00+00:00',
  },
  {
    id: 'cs-004',
    title: 'Meeting Summarizer',
    description: 'Paste any meeting transcript and get a crisp summary with key decisions, action items, owners, and open questions.',
    category: 'Productivity',
    tags: ['meetings', 'summary', 'notes'],
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60',
    instructions: `/summarize-meeting

Paste the raw meeting transcript or notes. Claude produces:
• Executive summary (3-4 sentences)
• Key decisions made
• Action items with assigned owners and deadlines
• Unresolved questions for follow-up
• Optional: shareable Slack-ready version`,
    skill_url: null,
    is_premium: false,
    is_featured: true,
    created_at: '2026-01-04T00:00:00+00:00',
  },
  {
    id: 'cs-005',
    title: 'LinkedIn Post Writer',
    description: 'Write scroll-stopping LinkedIn posts with a proven hook formula, structured body, and CTA — tailored to your voice.',
    category: 'Content',
    tags: ['linkedin', 'social', 'copywriting'],
    image_url: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=400&q=60',
    instructions: `/linkedin-post

Tell Claude your topic, the key insight or story, and your target audience. Specify your preferred tone (professional, personal, bold). Claude writes a post with:
• A pattern-interrupting hook (first 2 lines)
• Structured body with spacing for readability
• Concrete takeaways or a story arc
• A strong CTA to drive comments or shares`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-05T00:00:00+00:00',
  },
  {
    id: 'cs-006',
    title: 'Content Repurposer',
    description: 'Feed one piece of content and get it transformed into 6 formats — LinkedIn, Twitter thread, email, blog, summary, and TikTok script.',
    category: 'Content',
    tags: ['repurpose', 'multi-format', 'social'],
    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=60',
    instructions: `/repurpose-content

Paste your original content (article, video transcript, podcast notes). Claude repurposes it into:
1. LinkedIn post (200 words, professional)
2. Twitter/X thread (5-7 tweets)
3. Email newsletter snippet (150 words)
4. Short-form blog intro (300 words)
5. TikTok/Reels script (60-second spoken word)
6. Instagram caption with hashtags`,
    skill_url: null,
    is_premium: false,
    is_featured: true,
    created_at: '2026-01-06T00:00:00+00:00',
  },
  {
    id: 'cs-007',
    title: 'SEO Content Optimizer',
    description: 'Optimize any piece of content for search — keyword placement, meta tags, readability score, heading structure, and internal link suggestions.',
    category: 'Marketing',
    tags: ['seo', 'keywords', 'ranking'],
    image_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=60',
    instructions: `/seo-optimize

Paste your content and your target keyword(s). Claude analyzes and returns:
• Keyword density and placement review
• Optimized title tag and meta description
• Improved heading structure (H1/H2/H3)
• Readability improvements (Flesch score)
• 3-5 internal link anchor suggestions
• LSI keyword recommendations`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-07T00:00:00+00:00',
  },
  {
    id: 'cs-008',
    title: 'Sales Pitch Builder',
    description: 'Build a persuasive sales pitch for any product or service using the PAS framework — tailored to your audience and their core pain points.',
    category: 'Business',
    tags: ['sales', 'pitch', 'conversion'],
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=60',
    instructions: `/sales-pitch

Describe your product/service, your target customer, their top 2-3 pain points, and your biggest differentiator. Claude builds a pitch using PAS (Problem-Agitate-Solution):
• Opening hook that hits the pain point
• Agitation: why the problem costs them
• Solution: your product/service as the answer
• Social proof placeholder
• Strong closing CTA

Output formats: spoken pitch, email version, or slide outline.`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-08T00:00:00+00:00',
  },
  {
    id: 'cs-009',
    title: 'Contract Reviewer',
    description: 'Paste any contract and get a plain-English summary of key terms, red flags, one-sided clauses, and what to negotiate before signing.',
    category: 'Business',
    tags: ['legal', 'contracts', 'risk'],
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=60',
    instructions: `/review-contract

Paste the contract text. Claude provides a non-legal review covering:
• Plain-English summary of key terms
• Red flag clauses (liability, IP ownership, termination)
• One-sided or unusual provisions
• Missing standard protections
• 3-5 points to negotiate before signing

Note: This is not legal advice. Always consult a qualified attorney for binding decisions.`,
    skill_url: null,
    is_premium: false,
    is_featured: true,
    created_at: '2026-01-09T00:00:00+00:00',
  },
  {
    id: 'cs-010',
    title: 'Competitor Analyzer',
    description: 'Input a competitor name and Claude researches their positioning, messaging, pricing signals, weaknesses, and your differentiation opportunities.',
    category: 'Analytics',
    tags: ['competitors', 'research', 'strategy'],
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
    instructions: `/competitor-analysis

Share the competitor name, your industry, and your product/service. Claude delivers:
• Positioning and messaging breakdown
• Likely pricing tier (based on signals)
• Identified strengths and weaknesses
• Customer pain points they're not addressing
• 3 differentiation angles you can exploit
• Suggested competitive response strategy`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-10T00:00:00+00:00',
  },
  {
    id: 'cs-011',
    title: 'Email Sequence Crafter',
    description: 'Build high-converting email sequences for any goal — onboarding, nurture, re-engagement, or sales — with subject lines included.',
    category: 'Communication',
    tags: ['email', 'sequence', 'nurture'],
    image_url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&q=60',
    instructions: `/email-sequence

Describe the sequence goal (onboarding / nurture / sales / re-engagement), your audience, number of emails, and the outcome you want. Claude writes each email with:
• Subject line + preview text
• Personalized opening
• Core message (value, story, or offer)
• One clear CTA per email
• Timing recommendation between sends`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-11T00:00:00+00:00',
  },
  {
    id: 'cs-012',
    title: 'Research Synthesizer',
    description: 'Paste multiple sources, articles, or notes and Claude synthesizes them into a coherent insight report with themes, gaps, and conclusions.',
    category: 'Research',
    tags: ['research', 'synthesis', 'insights'],
    image_url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=60',
    instructions: `/research-synthesis

Paste 2-10 sources, articles, or raw notes on a topic. Claude synthesizes them into:
• Core themes and patterns across sources
• Key facts and data points
• Conflicting viewpoints and how to reconcile them
• Gaps in current knowledge
• Actionable conclusions and recommendations
• Suggested citations format`,
    skill_url: null,
    is_premium: false,
    is_featured: false,
    created_at: '2026-01-12T00:00:00+00:00',
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

function SkillModal({ skill, onClose }: { skill: ClaudeSkill; onClose: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const favorited = isFavorite(skill.id);
  const cfg = CAT[skill.category] ?? CAT['Business'];
  const commandLine = skill.instructions?.split('\n')[0] ?? '';

  const handleCopy = () => {
    navigator.clipboard.writeText(skill.instructions ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-border/60 bg-card overflow-hidden shadow-elegant"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image strip */}
        {skill.image_url && (
          <div className="relative h-32 sm:h-40 w-full shrink-0 overflow-hidden">
            <img
              src={skill.image_url}
              alt={skill.title}
              loading="eager"
              decoding="async"
              style={{ opacity: 0, transition: 'opacity 0.3s' }}
              onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm', cfg.badge)}>
                  {skill.category}
                </span>
                <h2 className="font-bold text-xl text-white mt-1.5 leading-tight">{skill.title}</h2>
              </div>
              {skill.is_featured && (
                <span className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                  <Zap className="h-2.5 w-2.5 fill-current" /> Featured
                </span>
              )}
            </div>
            <button onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-colors">
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}

        {/* Description */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
        </div>

        {/* Command block */}
        <div className="px-6 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Terminal style={{ width: 12, height: 12, color: cfg.dot }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.dot }}>Command</span>
          </div>
          <div className="relative rounded-xl bg-secondary/60 border border-border/40 p-4 font-mono text-[12px] text-foreground leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-48 custom-scroll">
            {skill.instructions}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check style={{ width: 13, height: 13, color: '#10b981' }} /> : <Copy style={{ width: 13, height: 13 }} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-secondary/10 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {skill.tags?.slice(0, 4).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">#{tag}</span>
            ))}
          </div>
          <button
            onClick={() => toggleFavorite({ id: skill.id, type: 'claude_skill', title: skill.title, description: skill.description, category: skill.category })}
            className={cn('flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all',
              favorited ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400 hover:bg-red-400/10')}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
            {favorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function SkillCard({ skill, onClick }: { skill: ClaudeSkill; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(skill.id);
  const cfg = CAT[skill.category] ?? CAT['Business'];
  const commandLine = skill.instructions?.split('\n')[0] ?? '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border/40 bg-card/60 overflow-hidden cursor-pointer',
        'transition-all duration-300 hover:-translate-y-1 hover:border-border/70',
        cfg.glow,
      )}
    >
      {/* Colored top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: cfg.bar }} />

      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden shrink-0">
        {skill.image_url ? (
          <img
            src={skill.image_url}
            alt={skill.title}
            loading="eager"
            decoding="async"
            style={{ opacity: 0, transition: 'opacity 0.3s, transform 0.5s' }}
            onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
            className="h-full w-full object-cover group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-secondary/40 flex items-center justify-center">
            <Bot className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Command badge — floating on image bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/80 rounded-lg px-2.5 py-1.5 border border-white/10">
            <Terminal style={{ width: 10, height: 10, color: cfg.dot }} />
            <span className="font-mono text-[11px] font-bold text-white">{commandLine}</span>
          </div>
          {skill.is_featured && (
            <span className="flex items-center gap-0.5 bg-primary/90 text-primary-foreground text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
              <Zap style={{ width: 9, height: 9 }} className="fill-current" /> Hot
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Category + premium */}
        <div className="flex items-center gap-2">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.badge)}>
            {skill.category}
          </span>
          {skill.is_premium && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
              <Lock style={{ width: 8, height: 8 }} /> PRO
            </span>
          )}
        </div>

        <h3 className="font-bold text-[13.5px] text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {skill.title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {skill.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/25 mt-auto">
          <div className="flex gap-1 flex-wrap">
            {skill.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/70 text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              toggleFavorite({ id: skill.id, type: 'claude_skill', title: skill.title, description: skill.description, category: skill.category });
            }}
            className={cn('p-1.5 rounded-full transition-all shrink-0', favorited ? 'text-red-400' : 'text-muted-foreground/50 hover:text-red-400')}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClaudeSkills() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<ClaudeSkill | null>(null);

  const categories = useMemo(
    () => [...new Set(SKILLS.map(s => s.category))].sort(),
    []
  );

  const filtered = useMemo(() => {
    let list = category === 'All' ? SKILLS : SKILLS.filter(s => s.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Bot}
        title="Claude Commands"
        description="12 professional slash commands for Claude Code and Claude Desktop — copy, run, and automate your most repeated tasks."
        count={SKILLS.length}
        iconColor="text-cyan-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={category}
          onCategory={setCategory}
          placeholder="Search commands by name, category, or tag..."
          total={SKILLS.length}
          filtered={filtered.length}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Bot className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No commands found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} onClick={() => {
                trackView({ promptId: skill.id, promptTitle: skill.title, promptType: 'claude_skill', category: skill.category, userId: user?.id });
                setSelected(skill);
              }} />
          ))}
        </div>
      )}

      {selected && <SkillModal skill={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
