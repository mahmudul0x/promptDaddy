import { useState, useMemo } from 'react';
import { GraduationCap, BookOpen, Lock, X, ExternalLink, Heart } from 'lucide-react';
import { useGuides } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';
import type { Guide } from '@/data/types';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  'Prompt Engineering': 'bg-amber-500/15 text-amber-400',
  'General':            'bg-blue-500/15 text-blue-400',
  'AI Fundamentals':    'bg-purple-500/15 text-purple-400',
  'Model Selection':    'bg-green-500/15 text-green-400',
  'Workflow':           'bg-cyan-500/15 text-cyan-400',
  'Best Practices':     'bg-orange-500/15 text-orange-400',
};

/* ─── Card ──────────────────────────────────────────────────────── */
function GuideCard({ item, onClick }: { item: Guide; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const hasImage = item.thumbnail_url?.startsWith('http');

  return (
    <div
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden shrink-0 bg-secondary/30">
        {hasImage ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-amber-500/10">
            <BookOpen className="h-10 w-10 text-orange-400/40" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Category badge on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm', CATEGORY_COLORS[item.category] ?? 'bg-muted/80 text-muted-foreground')}>
            {item.category}
          </span>
          {item.is_premium && (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Lock className="h-2.5 w-2.5" /> PRO
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="font-semibold text-[14px] text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-2.5 border-t border-border/30">
          <span className="text-[12px] font-medium text-primary/70 group-hover:text-primary transition-colors flex items-center gap-1">
            Read guide <BookOpen className="h-3 w-3" />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({ id: item.id, type: 'guide', title: item.title, description: item.description, category: item.category });
            }}
            className={cn('p-1.5 rounded-full transition-all', favorited ? 'text-red-400' : 'text-muted-foreground hover:text-red-400')}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────── */
function GuideModal({ item, onClose }: { item: Guide; onClose: () => void }) {
  const iframeUrl = item.rich_content?.iframeUrl;
  const htmlContent = item.rich_content?.htmlContent;
  const externalHref = iframeUrl || item.video_url || '';
  const bodyH = 'calc(90vh - 65px)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-4xl mx-4 rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh', background: 'hsl(var(--background))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', CATEGORY_COLORS[item.category] ?? 'bg-muted text-muted-foreground')}>
            {item.category}
          </span>
          <h2 className="text-sm font-semibold text-foreground flex-1 truncate">{item.title}</h2>
          {externalHref && (
            <a href={externalHref} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors shrink-0"
              onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        {iframeUrl ? (
          <iframe src={iframeUrl} className="w-full block border-0" style={{ height: bodyH }}
            allowFullScreen title={item.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation" />
        ) : htmlContent ? (
          <div className="overflow-y-auto custom-scroll p-6" style={{ maxHeight: bodyH }}>
            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed [&_img]:rounded-xl [&_img]:w-full [&_a]:text-primary [&_a]:underline"
              style={{ color: 'hsl(var(--foreground) / 0.85)' }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        ) : (
          <div className="overflow-y-auto custom-scroll p-6" style={{ maxHeight: bodyH }}>
            {item.thumbnail_url?.startsWith('http') && (
              <img src={item.thumbnail_url} alt={item.title} className="w-full max-h-64 object-cover rounded-xl mb-5" />
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Additional Core Concept Articles ───────────────────────────── */
// These are directly embedded in the component to ensure they always appear
const EXTRA_GUIDES: Guide[] = [
  {
    id: 'core-001',
    title: 'Understanding AI Model Capabilities: What Each Model Actually Does Best',
    description: 'A visual guide to understanding the unique strengths of different AI models — when to use GPT-4o vs Claude vs Gemini, and which tasks each excels at.',
    category: 'Model Selection',
    categories: ['Model Selection'],
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: true,
    video_url: null,
    created_at: '2026-01-10T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80" alt="AI Model Capabilities" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>Not all AI models are created equal. While they all "talk", each has a distinct personality and capability profile. Understanding these differences is crucial for getting the best results.</p>

        <h2>ModelPersonality Matrix</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:hsl(var(--muted)/0.5);">
              <th style="padding:10px;border:1px solid hsl(var(--border));text-align:left;">Model</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));text-align:left;">Best At</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));text-align:left;">Weakness</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:8px;border:1px solid hsl(var(--border));font-weight:600;">Claude (Anthropic)</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Long-form writing, reasoning, safety, 200K context</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Less coding than GPT-4o</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid hsl(var(--border));font-weight:600;">GPT-4o (OpenAI)</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Multimodal (image+text), coding, speed, ecosystem</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Context limit (128K)</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid hsl(var(--border));font-weight:600;">Gemini (Google)</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">1M context, Search integration, research</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Smaller context usage</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid hsl(var(--border));font-weight:600;">Llama (Meta)</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Open-source, customizable, free to run</td>
              <td style="padding:8px;border:1px solid hsl(var(--border));">Requires technical setup</td>
            </tr>
          </tbody>
        </table>

        <h2>Decision Flowchart</h2>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;line-height:1.8;">
          <strong style="color:hsl(var(--primary));">Need to write long content?</strong><br>
          → Yes → Choose <strong>Claude</strong><br><br>
          <strong style="color:hsl(var(--primary));">Need to analyze images + text?</strong><br>
          → Yes → Choose <strong>GPT-4o</strong><br><br>
          <strong style="color:hsl(var(--primary));">Need 1M+ context or Google search?</strong><br>
          → Yes → Choose <strong>Gemini</strong><br><br>
          <strong style="color:hsl(var(--primary));">Want to run locally / customize?</strong><br>
          → Yes → Choose <strong>Llama</strong>
        </div>

        <p><em>Pro tip: Keep this cheat sheet in your notes. When starting a new project, ask: "What's the hardest part of this task?" Then match that need to the model's specialty.</em></p>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-002',
    title: 'Context Windows Explained: Why 200K vs 128K vs 1M Tokens Matters',
    description: 'Learn what context window size means in practice, how to estimate your token usage, and why bigger isn\'t always better for every task.',
    category: 'AI Fundamentals',
    categories: ['AI Fundamentals'],
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-11T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80" alt="Context Window Explained" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>The <strong>context window</strong> is the AI's short-term memory — the amount of text it can "see" at once when generating a response. Think of it like a desk: the bigger the desk, the more documents you can spread out to reference simultaneously.</p>

        <h2>Token Numbers in Plain English</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:20px 0;">
          <div style="background:hsl(var(--secondary));padding:16px;border-radius:10px;border:1px solid hsl(var(--border));">
            <strong style="color:hsl(var(--primary));">4K tokens</strong><br>
            <span style="font-size:12px;color:hsl(var(--muted-foreground));">~3,000 words<br>One short essay</span>
          </div>
          <div style="background:hsl(var(--secondary));padding:16px;border-radius:10px;border:1px solid hsl(var(--border));">
            <strong style="color:hsl(var(--primary));">128K tokens</strong><br>
            <span style="font-size:12px;color:hsl(var(--muted-foreground));">~96,000 words<br>Full novel or codebase</span>
          </div>
          <div style="background:hsl(var(--secondary));padding:16px;border-radius:10px;border:1px solid hsl(var(--border));">
            <strong style="color:hsl(var(--primary));">200K tokens</strong><br>
            <span style="font-size:12px;color:hsl(var(--muted-foreground));">~150,000 words<br>Large technical doc</span>
          </div>
          <div style="background:hsl(var(--secondary));padding:16px;border-radius:10px;border:1px solid hsl(var(--border));">
            <strong style="color:hsl(var(--primary));">1M tokens</strong><br>
            <span style="font-size:12px;color:hsl(var(--muted-foreground));">~750,000 words<br>Multiple books</span>
          </div>
        </div>

        <h2>When Bigger Context Helps</h2>
        <ul style="margin:16px 0;padding-left:20px;">
          <li><strong>Document analysis</strong> – Upload full PDFs, codebases, legal contracts</li>
          <li><strong>Long conversations</strong> – Maintain context over 100+ messages</li>
          <li><strong>Book summarization</strong> – Process entire chapters at once</li>
          <li><strong>Code refactoring</strong> – Analyze whole project structure</li>
        </ul>

        <h2>When Smaller Context is Better</h2>
        <ul style="margin:16px 0;padding-left:20px;">
          <li><strong>Cost</strong> — Larger context = more tokens = higher cost</li>
          <li><strong>Speed</strong> — Smaller context processes faster</li>
          <li><strong>Focus</strong> — Less "noise" in the AI's attention</li>
          <li><strong>Simple tasks</strong> — Q&A, short writing don't need huge context</li>
        </ul>

        <div style="background:hsl(var(--primary)/0.08);border-left:3px solid hsl(var(--primary));padding:14px;margin:16px 0;border-radius:0 8px 8px 0;">
          <strong>Rule of thumb:</strong> Use the smallest context window that fits your task. For most prompts, 8K-32K is plenty. Reserve 200K+ for full document analysis.
        </div>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-003',
    title: 'Temperature & Top-P: The Creativity Controls Most People Ignore',
    description: 'Master the two parameters that control AI randomness vs determinism — and learn exact settings for factual, creative, and balanced output.',
    category: 'AI Fundamentals',
    categories: ['AI Fundamentals'],
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-12T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80" alt="Temperature and Top-P Parameters" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>Every AI model has two hidden dials that control how "creative" or "focused" it is: <strong>Temperature</strong> and <strong>Top-P</strong>. Understanding these lets you make the AI more predictable or more imaginative on demand.</p>

        <h2>Temperature: The Creativity Dial (0.0 – 1.0)</h2>
        <p>Temperature scales the probability distribution before the AI picks the next word:</p>
        <div style="background:hsl(var(--secondary));border:2px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;line-height:2;">
          <strong style="color:hsl(var(--primary));">Temperature 0.0 — Robotic but Consistent</strong><br>
          Always picks the most likely next word. Same prompt = same output every time. Perfect for code, data extraction, factual Q&A.<br><br>
          <strong style="color:hsl(var(--primary));">Temperature 0.5 — Balanced (Default)</strong><br>
          Good mix of predictability and variety. Works for most business writing, emails, summaries.<br><br>
          <strong style="color:hsl(var(--primary));">Temperature 0.8 — Creative & Surprising</strong><br>
          More random, unexpected word choices. Ideal for brainstorming, fiction, marketing copy, ideation.
        </div>

        <h2>Quick Reference Table</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:hsl(var(--muted)/0.5);">
              <th style="padding:10px;border:1px solid hsl(var(--border));">Use Case</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));">Temperature</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));">Why</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Code generation</td><td style="padding:8px;border:1px solid hsl(var(--border));font-family:monospace;">0.0–0.2</td><td style="padding:8px;border:1px solid hsl(var(--border));">Deterministic syntax matters</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Data extraction</td><td style="padding:8px;border:1px solid hsl(var(--border));font-family:monospace;">0.0–0.3</td><td style="padding:8px;border:1px solid hsl(var(--border));">Consistent formatting</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Business emails</td><td style="padding:8px;border:1px solid hsl(var(--border));font-family:monospace;">0.3–0.5</td><td style="padding:8px;border:1px solid hsl(var(--border));">Professional but not stale</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Blog posts</td><td style="padding:8px;border:1px solid hsl(var(--border));font-family:monospace;">0.5–0.7</td><td style="padding:8px;border:1px solid hsl(var(--border));">Engaging variety</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Creative writing</td><td style="padding:8px;border:1px solid hsl(var(--border));font-family:monospace;">0.7–0.9</td><td style="padding:8px;border:1px solid hsl(var(--border));">Surprising metaphors</td></tr>
          </tbody>
        </table>

        <h2>Top-P (Nucleus Sampling)</h2>
        <p>Top-P limits sampling to the smallest set of high-probability words whose cumulative probability exceeds P. Start with <code style="background:hsl(var(--secondary));padding:2px 6px;border-radius:4px;">Top-P = 0.9</code> for most tasks. Lower (0.5) = more focused. Higher (1.0) = maximum diversity.</p>

        <div style="background:hsl(var(--accent)/0.08);border:1px solid hsl(var(--accent)/0.2);border-radius:10px;padding:14px;margin-top:20px;">
          <strong>💡 Pro tip:</strong> For maximum control, set Temperature low (0.3) AND Top-P moderate (0.9). This gives you crisp output with just enough variety.
        </div>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-004',
    title: 'The Art of Few-Shot Prompting: Letting AI Learn from Examples',
    description: 'Discover how showing 2-3 examples in your prompt can dramatically improve accuracy, formatting, and style consistency — with real before/after demonstrations.',
    category: 'Prompt Engineering',
    categories: ['Prompt Engineering'],
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-13T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" alt="Few-Shot Prompting Examples" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>If you only learn one advanced prompting technique, make it <strong>few-shot prompting</strong>. It's the single biggest lever for improving output quality — and it's astonishingly simple: just show the AI 2-3 examples before asking your real question.</p>

        <h2>Zero-Shot vs Few-Shot: The Difference</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0;">
          <div style="background:hsl(var(--secondary));padding:16px;border-radius:10px;border:2px solid hsl(var(--border));">
            <strong style="color:hsl(var(--primary));">Zero-Shot (Before)</strong><br>
            "Classify this review as positive or negative: 'The food was okay but service was slow.'"
            <div style="margin-top:12px;padding:10px;background:hsl(var(--muted)/0.3);border-radius:6px;font-size:13px;">
              <em>Output: "Positive" (wrong — it's mixed/negative)</em>
            </div>
          </div>
          <div style="background:hsl(var(--accent)/0.08);padding:16px;border-radius:10px;border:2px solid hsl(var(--accent)/0.3);">
            <strong style="color:hsl(var(--accent));">Few-Shot (After)</strong><br>
            [Example 1] "Terrible experience" → Negative<br>
            [Example 2] "Love this place!" → Positive<br>
            "The food was okay but service was slow." → ?
            <div style="margin-top:12px;padding:10px;background:hsl(var(--accent)/0.15);border-radius:6px;font-size:13px;">
              <em>Output: "Mixed/Negative" (correct!)</em>
            </div>
          </div>
        </div>

        <h2>How to Structure Few-Shot Prompts</h2>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;line-height:2;">
          <strong style="display:block;margin-bottom:8px;">Step 1 — Define the task clearly</strong><br>
          "You are a sentiment classifier. Label each review as Positive, Negative, or Neutral."<br><br>
          <strong style="display:block;margin-bottom:8px;">Step 2 — Show 2-3 examples with labels</strong><br>
          "✅ Example 1: 'Best pizza ever!' → Positive<br>
           ✅ Example 2: 'Waited 30 minutes for cold food' → Negative"<br><br>
          <strong style="display:block;margin-bottom:8px;">Step 3 — Give the new input</strong><br>
          "Now classify this: '[user input]'"
        </div>

        <h2>Where Few-Shot Makes Biggest Impact</h2>
        <ul style="margin:16px 0;padding-left:20px;">
          <li><strong>Classification</strong> — Sentiment, topic labeling, intent detection</li>
          <li><strong>Formatting</strong> — Extracting structured data from unstructured text</li>
          <li><strong>Style matching</strong> — Writing in a specific tone or voice</li>
          <li><strong>Output templates</strong> — JSON, XML, markdown formatting</li>
        </ul>

        <div style="background:hsl(var(--warning)/0.08);border:1px solid hsl(var(--warning)/0.2);border-radius:10px;padding:14px;margin-top:20px;">
          <strong>⚠️ Warning:</strong> Don't use more than 3-5 examples. Too many examples cause the AI to pattern-match too narrowly and fail on edge cases.
        </div>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-005',
    title: 'Retrieval-Augmented Generation (RAG): AI That Reads Your Documents',
    description: 'Build AI systems that can answer questions from your own data — understanding the mechanics of RAG, vector databases, and how to implement it practically.',
    category: 'Workflow',
    categories: ['Workflow'],
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: true,
    video_url: null,
    created_at: '2026-01-14T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80" alt="RAG Architecture Diagram" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p><strong>Retrieval-Augmented Generation (RAG)</strong> is the technology that lets ChatGPT answer questions about your uploaded PDFs, and powers AI assistants that access company knowledge bases. It's what makes AI feel like it "knows" your specific data.</p>

        <h2>The 4-Step RAG Pipeline</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:20px 0;">
          <div style="background:hsl(var(--primary)/0.08);border:1px solid hsl(var(--primary)/0.2);padding:16px;border-radius:10px;">
            <strong style="color:hsl(var(--primary));">1. Index</strong><br>
            <span style="font-size:13px;">Split docs → create embeddings → store in vector DB</span>
          </div>
          <div style="background:hsl(var(--primary)/0.08);border:1px solid hsl(var(--primary)/0.2);padding:16px;border-radius:10px;">
            <strong style="color:hsl(var(--primary));">2. Retrieve</strong><br>
            <span style="font-size:13px;">User query → embedding → find similar document chunks</span>
          </div>
          <div style="background:hsl(var(--primary)/0.08);border:1px solid hsl(var(--primary)/0.2);padding:16px;border-radius:10px;">
            <strong style="color:hsl(var(--primary));">3. Augment</strong><br>
            <span style="font-size:13px;">Inject retrieved chunks into AI's context window</span>
          </div>
          <div style="background:hsl(var(--primary)/0.08);border:1px solid hsl(var(--primary)/0.2);padding:16px;border-radius:10px;">
            <strong style="color:hsl(var(--primary));">4. Generate</strong><br>
            <span style="font-size:13px;">AI responds using both training + retrieved context</span>
          </div>
        </div>

        <h2>Visual: How RAG Works</h2>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:12px;padding:20px;margin:20px 0;line-height:2;">
          <strong>Your Documents</strong> (PDF, Wiki, DB)<br>
          &darr; Chunking & Embedding<br>
          <span style="color:hsl(var(--primary));">● Vector Database</span> (storage)<br>
          <br>
          <strong>User Question:</strong> "What's our refund policy?"<br>
          &darr; Embed & Search<br>
          <span style="color:hsl(var(--success));">✓ Found: 3 relevant chunks</span><br>
          &darr; Inject into prompt<br>
          <em>"Based on our policy docs: [chunks]... Answer the question."</em><br>
          &darr;<br>
          <strong>AI Response:</strong> "Our refund policy is 30 days with receipt..."
        </div>

        <h2>RAG vs Fine-Tuning</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:hsl(var(--muted)/0.5);">
              <th style="padding:10px;border:1px solid hsl(var(--border));">Aspect</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));">RAG</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));">Fine-Tuning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Updates</td><td style="padding:8px;border:1px solid hsl(var(--border));">Instant (just add docs)</td><td style="padding:8px;border:1px solid hsl(var(--border));">Requires re-training</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Cost</td><td style="padding:8px;border:1px solid hsl(var(--border));">Low (API calls only)</td><td style="padding:8px;border:1px solid hsl(var(--border));">High (GPU training)</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Control</td><td style="padding:8px;border:1px solid hsl(var(--border));">You control source data</td><td style="padding:8px;border:1px solid hsl(var(--border));">Model learns patterns</td></tr>
          </tbody>
        </table>

        <p><strong>Bottom line:</strong> Use RAG for "AI that knows your data." Use fine-tuning for "AI that writes in your exact style."</p>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-006',
    title: 'Token Counting & Cost Management: Estimate Before You Prompt',
    description: 'Learn to calculate token usage, predict API costs, and optimize prompts for efficiency — so you never get surprised by a bill.',
    category: 'Best Practices',
    categories: ['Best Practices'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-15T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" alt="Token Counting and Cost Management" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>AI APIs charge per token (roughly 4 characters). Before you send a 10,000-word document, you should know the cost. This guide teaches you to estimate and control spending.</p>

        <h2>Quick Token Calculator</h2>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;">
          <table style="width:100%;">
            <tr><td style="padding:4px;">1 token ≈</td><td style="padding:4px;font-family:monospace;">¾ word</td></tr>
            <tr><td style="padding:4px;">1,000 tokens ≈</td><td style="padding:4px;font-family:monospace;">750 words</td></tr>
            <tr><td style="padding:4px;">100K tokens ≈</td><td style="padding:4px;font-family:monospace;">$0.50–$3.00 (varies by model)</td></tr>
          </table>
        </div>

        <h2>Cost Comparison (per 1M input tokens)</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:hsl(var(--muted)/0.5);">
              <th style="padding:10px;border:1px solid hsl(var(--border));">Model</th>
              <th style="padding:10px;border:1px solid hsl(var(--border));text-align:right;">Cost / 1M input</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Claude 3 Haiku</td><td style="padding:8px;border:1px solid hsl(var(--border));text-align:right;color:hsl(var(--success));">$0.25</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">GPT-4o-mini</td><td style="padding:8px;border:1px solid hsl(var(--border));text-align:right;color:hsl(var(--success));">$0.15</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">GPT-4o</td><td style="padding:8px;border:1px solid hsl(var(--border));text-align:right;color:hsl(var(--warning));">$5.00</td></tr>
            <tr><td style="padding:8px;border:1px solid hsl(var(--border));">Claude 3 Opus</td><td style="padding:8px;border:1px solid hsl(var(--border));text-align:right;color:hsl(var(--destructive));">$15.00</td></tr>
          </tbody>
        </table>

        <h2>Cost-Saving Strategies</h2>
        <ol style="margin:16px 0;padding-left:20px;">
          <li><strong>Trim context:</strong> Don't send full chat history if not needed</li>
          <li><strong>Use cheaper models:</strong> GPT-4o-mini for simple tasks, Haiku for summaries</li>
          <li><strong>Set max_tokens:</strong> Limit output length to avoid runaway generation</li>
          <li><strong>Cache results:</strong> Store repeated query answers locally</li>
        </ol>

        <div style="background:hsl(var(--destructive)/0.08);border:1px solid hsl(var(--destructive)/0.2);border-radius:10px;padding:14px;margin-top:20px;">
          <strong>⚠️ Real example:</strong> A 100K-word document analyzed with GPT-4o costs ~$7.50. Same with GPT-4o-mini costs ~$0.20. <em>Always check token counts before sending large payloads.</em>
        </div>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-007',
    title: 'Hallucination Prevention: How to Make AI Stick to Facts',
    description: 'Techniques to reduce AI making things up — including source grounding, confidence scoring, and verification patterns that keep outputs accurate.',
    category: 'Best Practices',
    categories: ['Best Practices'],
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-16T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80" alt="Preventing AI Hallucinations" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>AI models sometimes make things up — confidently stating false information as fact. This is called <strong>hallucination</strong>. While you can't eliminate it completely, you can reduce it dramatically with these techniques.</p>

        <h2>Why AI Hallucinates</h2>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;line-height:2;">
          AI models predict likely-sounding text, not truth. When they don't know something, they fill gaps with plausible fiction. The more creative the model (higher temperature), the more likely it is to invent.
        </div>

        <h2>3 Techniques to Reduce Hallucinations</h2>

        <h3 style="color:hsl(var(--primary));margin-top:20px;">1. Ground in Source Material</h3>
        <p>Provide the source data in the prompt. Don't ask "What's the capital of France?" Ask: "Based on this Wikipedia excerpt: '[text]', what is the capital of France?"</p>

        <h3 style="color:hsl(var(--primary));margin-top:16px;">2. Force Citations</h3>
        <p>Require the AI to quote directly from provided materials:</p>
        <div style="background:hsl(var(--secondary));border:1px solid hsl(var(--border));border-radius:8px;padding:14px;margin:12px 0;font-family:monospace;font-size:13px;line-height:1.8;">
          "If your answer isn't in the source above, say 'I cannot answer from the provided context.'<br>
          If it is in the source, include the exact quote."
        </div>

        <h3 style="color:hsl(var(--primary));margin-top:16px;">3. Lower Temperature</h3>
        <p>Set <code style="background:hsl(var(--secondary));padding:2px 6px;border-radius:4px;">temperature=0.1-0.3</code> for factual tasks. Less randomness = fewer inventions.</p>

        <div style="background:hsl(var(--success)/0.08);border:1px solid hsl(var(--success)/0.2);border-radius:10px;padding:14px;margin-top:20px;">
          <strong>✅ Validation pattern:</strong> After getting an AI answer, ask: "How do you know that?" Follow up: "Quote the source." If it can't quote, it likely hallucinated.
        </div>
      `,
      promptItems: [],
    },
  },
  {
    id: 'core-008',
    title: 'Prompt Iteration: How to Systematically Improve AI Outputs',
    description: 'A step-by-step framework for iterating on prompts — from baseline to expert-level output through testing, feedback, and refinement cycles.',
    category: 'Best Practices',
    categories: ['Best Practices'],
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    is_premium: false,
    is_free_accessible: true,
    is_recommended: false,
    video_url: null,
    created_at: '2026-01-17T10:00:00+00:00',
    content: '',
    rich_content: {
      iframeUrl: null,
      htmlContent: `
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" alt="Prompt Iteration Process" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:300px;object-fit:cover;">
        <p>Great prompts aren't written — they're <strong>iterated</strong>. The first version is rarely the best. Here's a systematic approach to refine prompts until they produce consistent, high-quality results.</p>

        <h2>The Iteration Loop</h2>
        <div style="display:flex;flex-direction:column;gap:12px;margin:20px 0;">
          <div style="display:flex;align-items:center;gap:12px;background:hsl(var(--secondary));padding:12px;border-radius:10px;">
            <strong style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:hsl(var(--primary));color:white;border-radius:50%;">1</strong>
            <div><strong>Write baseline</strong> — Start with a simple, clear prompt</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;background:hsl(var(--secondary));padding:12px;border-radius:10px;">
            <strong style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:hsl(var(--primary));color:white;border-radius:50%;">2</strong>
            <div><strong>Test 3×</strong> — Run it 3 times, note inconsistencies</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;background:hsl(var(--secondary));padding:12px;border-radius:10px;">
            <strong style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:hsl(var(--primary));color:white;border-radius:50%;">3</strong>
            <div><strong>Identify failure modes</strong> — What's missing? Wrong tone? Incomplete?</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;background:hsl(var(--secondary));padding:12px;border-radius:10px;">
            <strong style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:hsl(var(--primary));color:white;border-radius:50%;">4</strong>
            <div><strong>Refine one variable</strong> — Add context, adjust tone, change format</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;background:hsl(var(--secondary));padding:12px;border-radius:10px;">
            <strong style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:hsl(var(--primary));color:white;border-radius:50%;">5</strong>
            <div><strong>Repeat until consistent</strong></div>
          </div>
        </div>

        <h2>Example: Iterating a Blog Post Prompt</h2>
        <div style="background:hsl(var(--muted)/0.3);border:1px solid hsl(var(--border));border-radius:10px;padding:16px;margin:16px 0;">
          <strong style="color:hsl(var(--primary));">V1 (Weak):</strong> "Write a blog post about productivity."<br>
          <em>→ Output: Generic, vague, no structure</em><br><br>
          <strong style="color:hsl(var(--primary));">V2 (Better):</strong> "Write a 1000-word blog post about productivity for remote workers."<br>
          <em>→ Output: More focused, but still shallow</em><br><br>
          <strong style="color:hsl(var(--primary));">V3 (Strong):</strong> "You are a productivity coach. Write a 1000-word guide for remote workers covering: 1) Morning routines, 2) Deep work blocks, 3) Tool stack. Include 3 actionable tips per section. Tone: practical, no fluff."<br>
          <em>→ Output: Structured, specific, actionable</em>
        </div>

        <p><strong>Key insight:</strong> Each iteration should change only <em>one</em> variable (persona, length, format, tone). This isolates what's working.</p>
      `,
      promptItems: [],
    },
  },
];

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function Fundamentals() {
  const { user } = useAuth();
  const { data: guides = [], isLoading } = useGuides();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Guide | null>(null);

  // Combine API guides with embedded extra guides
  const allGuides = useMemo(() => {
    return [...guides, ...EXTRA_GUIDES];
  }, [guides]);

  const categories = useMemo(
    () => [...new Set(allGuides.map((g) => g.category).filter(Boolean))].sort(),
    [allGuides]
  );

  const filtered = useMemo(() => {
    let list = allGuides;
    if (category !== 'All') list = list.filter((g) => g.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((g) =>
        g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allGuides, search, category]);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon={GraduationCap}
        title="Fundamentals"
        description="Deep-dive guides on prompt engineering and AI fundamentals."
        count={allGuides.length}
        iconColor="text-orange-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search} onSearch={setSearch}
          categories={categories} activeCategory={category} onCategory={setCategory}
          placeholder="Search guides..." total={allGuides.length} filtered={filtered.length}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 rounded-xl bg-secondary/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No guides found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} item={guide} onClick={() => {
              trackView({ promptId: guide.id, promptTitle: guide.title, promptType: 'guide', category: guide.category, userId: user?.id });
              setSelected(guide);
            }} />
          ))}
        </div>
      )}

      {selected && <GuideModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
