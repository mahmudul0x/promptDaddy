import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MessageSquare, Image, Video, GraduationCap, Zap, Bot, Cpu } from 'lucide-react';
import { usePrompts } from '@/hooks/useData';
import { useImagePrompts } from '@/hooks/useData';
import { useVideos, useGuides, useCustomGpts, useAutomationTemplates, useClaudeSkills } from '@/hooks/useData';
import { ContentCard } from '@/components/dashboard/ContentCard';
import { PromptModal } from '@/components/dashboard/PromptModal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Input } from '@/components/ui/input';
import type { SearchResult } from '@/data/types';

const TYPE_ICONS: Record<string, React.ElementType> = {
  prompt: MessageSquare,
  image_prompt: Image,
  video: Video,
  guide: GraduationCap,
  automation: Zap,
  claude_skill: Bot,
  custom_gpt: Cpu,
};

const TYPE_LABELS: Record<string, string> = {
  prompt: 'LLM Prompt',
  image_prompt: 'Image Prompt',
  video: 'Video',
  guide: 'Guide',
  automation: 'Automation',
  claude_skill: 'Claude Skill',
  custom_gpt: 'Custom GPT',
};

export default function AiSearch() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [activeType, setActiveType] = useState('all');
  const [selected, setSelected] = useState<SearchResult | null>(null);

  const { data: prompts = [] } = usePrompts();
  const { data: imagePrompts = [] } = useImagePrompts();
  const { data: videos = [] } = useVideos();
  const { data: guides = [] } = useGuides();
  const { data: customGpts = [] } = useCustomGpts();
  const { data: automations = [] } = useAutomationTemplates();
  const { data: skills = [] } = useClaudeSkills();

  useEffect(() => {
    const q = params.get('q');
    if (q) setQuery(q);
  }, [params]);

  const allItems = useMemo<SearchResult[]>(() => [
    ...prompts.map((p) => ({ id: p.id, type: 'prompt' as const, title: p.title, description: p.description, category: p.category, is_premium: p.is_premium })),
    ...imagePrompts.map((p) => ({ id: p.id, type: 'image_prompt' as const, title: p.title, description: p.description, category: p.category, is_premium: p.is_premium })),
    ...videos.map((v) => ({ id: v.id, type: 'video' as const, title: v.title, description: v.description, category: v.category, is_premium: v.is_premium })),
    ...guides.map((g) => ({ id: g.id, type: 'guide' as const, title: g.title, description: g.description, category: g.category, is_premium: g.is_premium })),
    ...customGpts.map((g) => ({ id: g.id, type: 'custom_gpt' as const, title: g.title, description: g.description, category: g.category, is_premium: g.is_premium })),
    ...automations.map((a) => ({ id: a.id, type: 'automation' as const, title: a.title, description: a.description, category: a.category, is_premium: a.is_premium })),
    ...skills.map((s) => ({ id: s.id, type: 'claude_skill' as const, title: s.title, description: s.description, category: s.category, is_premium: s.is_premium })),
  ], [prompts, imagePrompts, videos, guides, customGpts, automations, skills]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter((item) => {
      const matchesType = activeType === 'all' || item.type === activeType;
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [allItems, query, activeType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(query ? { q: query } : {});
  };

  const getContent = (item: SearchResult) => {
    if (item.type === 'prompt') return prompts.find((p) => p.id === item.id)?.content ?? '';
    if (item.type === 'image_prompt') return imagePrompts.find((p) => p.id === item.id)?.description ?? '';
    if (item.type === 'video') return videos.find((v) => v.id === item.id)?.description ?? '';
    if (item.type === 'guide') return guides.find((g) => g.id === item.id)?.content ?? '';
    if (item.type === 'custom_gpt') return customGpts.find((g) => g.id === item.id)?.instructions ?? '';
    if (item.type === 'automation') return automations.find((a) => a.id === item.id)?.description ?? '';
    if (item.type === 'claude_skill') return skills.find((s) => s.id === item.id)?.instructions ?? '';
    return '';
  };

  const TYPES = ['all', 'prompt', 'image_prompt', 'video', 'guide', 'automation', 'claude_skill', 'custom_gpt'];

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon={Search}
        title="AI Search"
        description="Search across 1,167+ prompts, tools, and resources instantly."
      />

      {/* Search box */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, automation, Claude skills, custom GPTs..."
            className="pl-12 h-14 text-base bg-secondary/50 border-border/60 focus-visible:ring-primary/40 rounded-xl"
            autoFocus
          />
        </div>
      </form>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
              activeType === t
                ? 'bg-primary/15 text-primary border-primary/40'
                : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
            }`}
          >
            {t !== 'all' && (() => { const Icon = TYPE_ICONS[t]; return <Icon className="h-3 w-3" />; })()}
            {t === 'all' ? 'All Types' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.trim() ? (
        results.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Found <strong className="text-foreground">{results.length}</strong> results for "{query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <ContentCard
                  key={item.id}
                  {...item}
                  badge={TYPE_LABELS[item.type]}
                  onClick={() => setSelected(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground text-sm">Try different keywords or change the type filter.</p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <Search className="h-14 w-14 text-primary/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-2">Search the entire library</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Type anything - prompt topics, automation use cases, tools, skills, or categories.
          </p>
        </div>
      )}

      {selected && (
        <PromptModal
          open
          onClose={() => setSelected(null)}
          id={selected.id}
          type={selected.type}
          title={selected.title}
          description={selected.description}
          category={selected.category}
          content={getContent(selected)}
          is_premium={selected.is_premium}
          extraBadge={TYPE_LABELS[selected.type]}
        />
      )}
    </div>
  );
}
