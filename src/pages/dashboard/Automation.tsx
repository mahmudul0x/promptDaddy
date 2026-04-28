import { useState, useMemo } from 'react';
import { Zap, Lock, Eye, X, ExternalLink, Heart } from 'lucide-react';
import { useAutomationTemplates } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';
import type { AutomationTemplate } from '@/data/types';
import { cn } from '@/lib/utils';

/* ─── Platform config ───────────────────────────────────────────── */
const PLATFORM: Record<string, { badge: string; bg: string; dot: string }> = {
  n8n:    { badge: 'bg-orange-500/15 text-orange-400', bg: 'from-orange-500/20 to-orange-700/10', dot: '#f97316' },
  make:   { badge: 'bg-purple-500/15 text-purple-400', bg: 'from-purple-500/20 to-purple-700/10', dot: '#a855f7' },
  zapier: { badge: 'bg-yellow-500/15 text-yellow-400', bg: 'from-yellow-500/20 to-yellow-700/10', dot: '#eab308' },
};

function platformCfg(p: string) {
  return PLATFORM[p?.toLowerCase()] ?? { badge: 'bg-muted text-muted-foreground', bg: 'from-secondary/60 to-secondary/20', dot: '#6b7280' };
}

/* Convert vimeo share URL → embed URL */
function vimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  if (!m) return null;
  const hash = url.match(/\/(\w+)\?share=/)?.[1];
  return `https://player.vimeo.com/video/${m[1]}${hash ? `?h=${hash}` : ''}`;
}

/* ─── Card ──────────────────────────────────────────────────────── */
function AutomationCard({ item, onClick }: { item: AutomationTemplate; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const cfg = platformCfg(item.platform);
  const label = item.platform?.toUpperCase() ?? 'AUTOMATION';

  return (
    <div className="group flex flex-col rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200">
      {/* Thumbnail — platform gradient fallback (images don't exist in /public/images) */}
      <div
        className={cn('h-36 relative overflow-hidden flex items-center justify-center bg-gradient-to-br', cfg.bg)}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex flex-col items-center gap-2 select-none">
          <Zap style={{ height: 32, width: 32, color: cfg.dot, opacity: 0.6 }} />
          <span className="text-[11px] font-bold tracking-widest uppercase font-mono" style={{ color: cfg.dot, opacity: 0.7 }}>{label}</span>
        </div>
        {item.is_premium && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Lock className="h-2.5 w-2.5 text-primary" />
            <span className="text-[10px] font-semibold text-primary">PRO</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', cfg.badge)}>
            {item.platform ?? 'Automation'}
          </span>
          <span className="text-[10px] text-muted-foreground">{item.category}</span>
        </div>
        <h3
          className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer"
          onClick={onClick}
        >
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">{item.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
          <button
            onClick={onClick}
            className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary transition-colors"
          >
            <Eye className="h-3 w-3" /> View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({ id: item.id, type: 'automation', title: item.title, description: item.description, category: item.category });
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
function AutomationModal({ item, onClose }: { item: AutomationTemplate; onClose: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const cfg = platformCfg(item.platform);

  const embedSrc = item.video_url ? vimeoEmbed(item.video_url) : null;
  const hasVideo = !!embedSrc;
  const hasHtml  = !!item.video_text;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl mx-4 rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh', background: 'hsl(var(--background))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', cfg.badge)}>
                {item.platform?.toUpperCase()}
              </span>
              <span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                {item.category}
              </span>
              {item.is_premium && (
                <span className="flex items-center gap-1 text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  <Lock className="h-3 w-3" /> PRO
                </span>
              )}
            </div>
            <h2 className="font-bold text-base text-foreground leading-snug">{item.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scroll" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {hasVideo ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={embedSrc!}
                className="w-full h-full border-0"
                allowFullScreen
                title={item.title}
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
          ) : hasHtml ? (
            <div className="p-6">
              <div
                className="prose prose-sm max-w-none text-sm leading-relaxed"
                style={{ color: 'hsl(var(--foreground) / 0.85)' }}
                dangerouslySetInnerHTML={{ __html: item.video_text! }}
              />
            </div>
          ) : (
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t shrink-0" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--muted) / 0.3)' }}>
            {item.video_url && (
              <a
                href={item.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> Open on Vimeo
              </a>
            )}
            {!item.video_url && <span />}
            <button
              onClick={() => toggleFavorite({ id: item.id, type: 'automation', title: item.title, description: item.description, category: item.category })}
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
export default function Automation() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useAutomationTemplates();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<AutomationTemplate | null>(null);

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
        i.platform?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, category]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Zap}
        title="Automation"
        description="Ready-to-use n8n, Make, and Zapier automation templates with video walkthroughs."
        count={items.length}
        iconColor="text-yellow-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={category}
          onCategory={setCategory}
          placeholder="Search automation templates..."
          total={items.length}
          filtered={filtered.length}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No templates found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <AutomationCard key={item.id} item={item} onClick={() => {
              trackView({ promptId: item.id, promptTitle: item.title, promptType: 'automation', category: item.category, userId: user?.id });
              setSelected(item);
            }} />
          ))}
        </div>
      )}

      {selected && <AutomationModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
