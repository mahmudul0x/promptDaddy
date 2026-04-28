import { useState, useMemo, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { MessageSquare, SlidersHorizontal } from 'lucide-react';
import { usePrompts } from '@/hooks/useData';
import { ContentCard } from '@/components/dashboard/ContentCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PromptModal } from '@/components/dashboard/PromptModal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Prompt } from '@/data/types';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';

type AccessFilter = 'All' | 'Free' | 'Premium';
type SortOption = 'newest' | 'oldest' | 'popular' | 'views';

const ACCESS_OPTIONS: AccessFilter[] = ['All', 'Free', 'Premium'];

export default function LlmPrompts() {
  const { user } = useAuth();
  const { data: prompts = [], isLoading } = usePrompts();
  
  console.log('[LlmPrompts] prompts length:', prompts?.length, 'isLoading:', isLoading);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [access, setAccess] = useState<AccessFilter>('All');
  const [sort, setSort] = useState<SortOption>('newest');
  const [featured, setFeatured] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [displayCount, setDisplayCount] = useState(48);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Defer heavy filter recomputation so typing never blocks the UI
  const deferredSearch = useDeferredValue(search);
  const deferredCategory = useDeferredValue(category);
  const deferredAccess = useDeferredValue(access);
  const deferredFeatured = useDeferredValue(featured);
  const deferredRecommended = useDeferredValue(recommended);
  const deferredSort = useDeferredValue(sort);

  const categories = useMemo(() => {
    const cats = [...new Set(prompts.map((p) => p.category).filter(Boolean))].sort();
    return cats;
  }, [prompts]);

  const filtered = useMemo(() => {
    let items = prompts;
    if (deferredCategory !== 'All') items = items.filter((p) => p.category === deferredCategory);
    if (deferredAccess === 'Free') items = items.filter((p) => !p.is_premium);
    if (deferredAccess === 'Premium') items = items.filter((p) => p.is_premium);
    if (deferredFeatured) items = items.filter((p) => p.is_featured);
    if (deferredRecommended) items = items.filter((p) => p.is_recommended);
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.search_keywords?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    const sorted = [...items];
    if (deferredSort === 'newest') sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (deferredSort === 'oldest') sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (deferredSort === 'popular') sorted.sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0));
    else if (deferredSort === 'views') sorted.sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0));
    return sorted;
  }, [prompts, deferredSearch, deferredCategory, deferredAccess, deferredFeatured, deferredRecommended, deferredSort]);

  // Reset visible count on user input (use real values, not deferred, for instant reset)
  useEffect(() => { setDisplayCount(48); }, [search, category, access, featured, recommended, sort]);

  // Grow visible count as user scrolls toward the sentinel
  const loadMore = useCallback(() => setDisplayCount((c) => c + 48), []);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { rootMargin: '600px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, displayCount]);

  const visible = filtered.slice(0, displayCount);
  const activeFilterCount = (access !== 'All' ? 1 : 0) + (featured ? 1 : 0) + (recommended ? 1 : 0);

  const filterDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 h-10 px-4 rounded-xl border text-[13px] font-medium transition-all duration-200 shrink-0',
            activeFilterCount > 0
              ? 'bg-primary/10 border-primary/35 text-primary'
              : 'bg-white/[0.03] border-border/35 text-foreground hover:bg-white/[0.05] hover:border-border/50',
          )}
        >
          <SlidersHorizontal style={{ width: 14, height: 14 }} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2 bg-card border-border/50 shadow-xl">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-2 py-1.5">
          Access
        </DropdownMenuLabel>
        <div className="flex gap-1.5 px-2 pb-2">
          {ACCESS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setAccess(opt)}
              className={cn(
                'flex-1 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150',
                access === opt
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'bg-white/[0.03] border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50',
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-2 py-1.5">
          Status
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={featured}
          onCheckedChange={setFeatured}
          onSelect={(e) => e.preventDefault()}
          className="text-[13px] cursor-pointer rounded-md"
        >
          ★ Featured
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={recommended}
          onCheckedChange={setRecommended}
          onSelect={(e) => e.preventDefault()}
          className="text-[13px] cursor-pointer rounded-md"
        >
          ✓ Recommended
        </DropdownMenuCheckboxItem>

        {activeFilterCount > 0 && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <button
              onClick={() => { setAccess('All'); setFeatured(false); setRecommended(false); }}
              className="w-full text-[12px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/8 py-1.5 px-2 rounded-md transition-colors text-left"
            >
              Clear all filters
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={MessageSquare}
        title="LLM Prompts"
        description="Expert prompts for ChatGPT, Claude, Gemini and more."
        count={prompts.length}
        iconColor="text-blue-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={category}
          onCategory={setCategory}
          placeholder="Search 901 prompts..."
          total={prompts.length}
          filtered={filtered.length}
          activeSort={sort}
          onSortChange={(s) => setSort(s as SortOption)}
          filterButton={filterDropdown}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No prompts found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visible.map((prompt) => (
              <ContentCard
                key={prompt.id}
                id={prompt.id}
                type="prompt"
                title={prompt.title}
                description={prompt.description}
                category={prompt.category}
                is_premium={prompt.is_premium}
                is_featured={prompt.is_featured}
                copyText={prompt.content}
                thumbnail={prompt.thumbnail_url}
                onClick={() => {
                  trackView({ promptId: prompt.id, promptTitle: prompt.title, promptType: 'llm_prompt', category: prompt.category, userId: user?.id });
                  setSelected(prompt);
                }}
              />
            ))}
          </div>
          {displayCount < filtered.length && (
            <div ref={sentinelRef} className="flex flex-col items-center gap-3 py-8">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <button
                onClick={loadMore}
                className="text-[13px] font-medium text-primary hover:underline"
              >
                Load more ({filtered.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <PromptModal
          open
          onClose={() => setSelected(null)}
          id={selected.id}
          type="prompt"
          title={selected.title}
          description={selected.description}
          category={selected.category}
          content={selected.content}
          is_premium={selected.is_premium}
        />
      )}
    </div>
  );
}
