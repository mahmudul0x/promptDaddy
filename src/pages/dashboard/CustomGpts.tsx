import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, ExternalLink, Lock, X, Heart } from 'lucide-react';
import { useCustomGpts } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';
import type { CustomGpt } from '@/data/types';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  'Business Strategy': 'bg-yellow-500/15 text-yellow-400',
  'SEO & Content':     'bg-orange-500/15 text-orange-400',
  'General':           'bg-blue-500/15 text-blue-400',
  'Finance':           'bg-emerald-500/15 text-emerald-400',
  'Marketing':         'bg-purple-500/15 text-purple-400',
};

function extractChatGptLink(html: string | null): string | null {
  if (!html) return null;
  return html.match(/href="(https:\/\/chatgpt\.com\/g\/[^"]+)"/)?.[1] ?? null;
}

/* ─── Card ──────────────────────────────────────────────────────── */
function GptCard({ item, onClick }: { item: CustomGpt; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);

  return (
    <div
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 p-5 cursor-pointer hover:border-primary/30 hover:bg-card/90 hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center">
          <Cpu className="h-6 w-6 text-pink-400" />
        </div>
        <div className="flex items-center gap-1.5">
          {item.is_premium && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
              <Lock className="h-2.5 w-2.5" /> PRO
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({ id: item.id, type: 'custom_gpt', title: item.title, description: item.description, category: item.category });
            }}
            className={cn('p-1.5 rounded-full transition-all', favorited ? 'text-red-400' : 'text-muted-foreground hover:text-red-400')}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', CATEGORY_COLORS[item.category] ?? 'bg-muted text-muted-foreground')}>
          {item.category}
        </span>
        <h3 className="font-semibold text-base text-foreground mt-2 group-hover:text-primary transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────── */
function GptModal({ item, onClose }: { item: CustomGpt; onClose: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const gptLink = extractChatGptLink(item.instructions);
  const bodyH = 'calc(90vh - 130px)';

  const hasHtmlInstructions = item.instructions?.includes('<');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh', background: 'hsl(var(--background))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', CATEGORY_COLORS[item.category] ?? 'bg-muted text-muted-foreground')}>
                {item.category}
              </span>
              {item.is_premium && (
                <span className="flex items-center gap-1 text-[10px] font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                  <Lock className="h-2.5 w-2.5" /> PRO
                </span>
              )}
            </div>
            <h2 className="font-bold text-base text-foreground leading-snug">{item.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scroll p-6" style={{ maxHeight: bodyH }}>
          {hasHtmlInstructions ? (
            <div
              className="prose prose-sm max-w-none text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-foreground/80"
              dangerouslySetInnerHTML={{ __html: item.instructions }}
            />
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
              {item.instructions}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t shrink-0"
          style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--muted) / 0.3)' }}>
          {gptLink ? (
            <a href={gptLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
              <ExternalLink className="h-3.5 w-3.5" /> Open in ChatGPT
            </a>
          ) : <span />}
          <button
            onClick={() => toggleFavorite({ id: item.id, type: 'custom_gpt', title: item.title, description: item.description, category: item.category })}
            className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all',
              favorited ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400 hover:bg-red-400/10'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
            {favorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function CustomGpts() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useCustomGpts();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<CustomGpt | null>(null);

  useEffect(() => {
    const id = (location.state as { openId?: string })?.openId;
    if (!id || !items.length) return;
    const found = items.find(i => i.id === id);
    if (found) setSelected(found);
  }, [location.state, items]);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    let list = items;
    if (category !== 'All') list = list.filter((i) => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.search_keywords?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, category]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Cpu} title="Custom GPTs"
        description="Ready-made ChatGPT configurations for specialized tasks."
        count={items.length} iconColor="text-pink-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search} onSearch={setSearch}
          categories={categories} activeCategory={category} onCategory={setCategory}
          placeholder="Search custom GPTs..." total={items.length} filtered={filtered.length}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 rounded-xl bg-secondary/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Cpu className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No GPTs found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <GptCard key={item.id} item={item} onClick={() => {
              trackView({ promptId: item.id, promptTitle: item.title, promptType: 'custom_gpt', category: item.category, userId: user?.id });
              setSelected(item);
            }} />
          ))}
        </div>
      )}

      {selected && <GptModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
