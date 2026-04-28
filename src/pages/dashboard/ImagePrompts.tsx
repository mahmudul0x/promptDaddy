import { useState, useMemo, useCallback } from 'react';
import {
  Image, Lock, Layers, X, Copy, Check,
  Heart, ChevronLeft, ChevronRight, ZoomIn, SlidersHorizontal,
} from 'lucide-react';
import { useImagePrompts } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { trackView } from '@/lib/trackView';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { ImagePrompt, GalleryPrompt } from '@/data/types';
import { cn } from '@/lib/utils';

/* ─── helpers ──────────────────────────────────────────────────── */

function useCopy(text: string, ms = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), ms);
  };
  return { copied, copy };
}

function CopyBtn({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy(text);
  return (
    <button
      onClick={copy}
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all',
        copied
          ? 'bg-green-500/20 text-green-400'
          : 'bg-white/10 hover:bg-white/20 text-white/90',
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ─── Gallery Modal ─────────────────────────────────────────────── */

function GalleryModal({
  item,
  onClose,
}: {
  item: ImagePrompt;
  onClose: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const validPrompts = (item.gallery_prompts ?? []).filter(
    (g) => g.generated_image_url && g.generation_status === 'completed',
  );

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i == null ? 0 : Math.max(0, i - 1)));
  const next = () => setLightbox((i) => (i == null ? 0 : Math.min(validPrompts.length - 1, i + 1)));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Modal */}
        <div
          className="relative z-10 w-full max-w-5xl flex flex-col rounded-2xl overflow-hidden"
          style={{
            maxHeight: 'calc(100vh - 48px)',
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start gap-4 px-6 py-5 border-b border-border/40 shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" />
                  {validPrompts.length} images
                </span>
                {item.is_premium && (
                  <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> PRO
                  </span>
                )}
              </div>
              <h2 className="font-bold text-lg text-foreground leading-tight">{item.title}</h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleFavorite({ id: item.id, type: 'image_prompt', title: item.title, description: item.description, category: item.category })}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isFavorite(item.id) ? 'text-red-400 bg-red-400/10' : 'text-muted-foreground hover:text-red-400 hover:bg-red-400/10',
                )}
              >
                <Heart className={cn('h-4 w-4', isFavorite(item.id) && 'fill-current')} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image grid */}
          <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-5">
            {item.is_premium ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">PRO Gallery</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Upgrade to Pro to unlock all {validPrompts.length} images and their copyable prompts.
                </p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                {validPrompts.map((gp, idx) => (
                  <GalleryItem
                    key={idx}
                    gp={gp}
                    idx={idx}
                    onZoom={() => openLightbox(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={lightbox === 0}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-3xl w-full mx-16 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={validPrompts[lightbox].generated_image_url}
              alt=""
              className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="w-full max-w-xl bg-black/60 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <p className="text-sm text-white/80 flex-1 leading-relaxed">
                {validPrompts[lightbox].prompt}
              </p>
              <CopyBtn text={validPrompts[lightbox].prompt} className="shrink-0 self-start" />
            </div>
            <span className="text-xs text-white/40 font-mono">
              {lightbox + 1} / {validPrompts.length}
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={lightbox === validPrompts.length - 1}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}

function GalleryItem({
  gp,
  idx,
  onZoom,
}: {
  gp: GalleryPrompt;
  idx: number;
  onZoom: () => void;
}) {
  const { copied, copy } = useCopy(gp.prompt);
  const [imgError, setImgError] = useState(false);
  const handleError = useCallback(() => setImgError(true), []);

  if (imgError) {
    return (
      <div className="break-inside-avoid relative group rounded-xl overflow-hidden bg-secondary/30 mb-3 h-36 flex flex-col items-center justify-center gap-2">
        <Image className="h-6 w-6 text-muted-foreground/25" />
        <span className="text-[10px] text-muted-foreground/40">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="break-inside-avoid relative group rounded-xl overflow-hidden bg-secondary/30 mb-3">
      <img
        src={gp.generated_image_url}
        alt={gp.prompt ? gp.prompt.slice(0, 60) : 'Gallery image'}
        loading="lazy"
        className="w-full h-auto block"
        onError={handleError}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-3 gap-2">
        <p className="text-[11px] text-white/85 leading-relaxed line-clamp-4">{gp.prompt}</p>
        <div className="flex items-center gap-2">
          <CopyBtn text={gp.prompt} />
          <button
            onClick={onZoom}
            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-all"
          >
            <ZoomIn className="h-3 w-3" />
            Expand
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Single-prompt Modal ───────────────────────────────────────── */

function PromptTextModal({
  item,
  onClose,
}: {
  item: ImagePrompt;
  onClose: () => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { copied, copy } = useCopy(item.prompt_text ?? item.description);
  const isRealThumb = item.thumbnail_url?.startsWith('http');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: 'calc(100vh - 48px)',
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnail header */}
        {isRealThumb && (
          <div className="w-full h-44 overflow-hidden bg-secondary/30">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const wrapper = e.currentTarget.parentElement as HTMLElement;
                if (wrapper) wrapper.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6 flex flex-col gap-4 flex-1 overflow-y-auto custom-scroll">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                {item.is_premium && (
                  <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" /> PRO
                  </span>
                )}
              </div>
              <h2 className="font-bold text-base text-foreground">{item.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toggleFavorite({ id: item.id, type: 'image_prompt', title: item.title, description: item.description, category: item.category })}
                className={cn('p-1.5 rounded-lg transition-colors', isFavorite(item.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400')}
              >
                <Heart className={cn('h-4 w-4', isFavorite(item.id) && 'fill-current')} />
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {item.is_premium ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Lock className="h-8 w-8 text-primary/50 mb-3" />
              <p className="text-sm text-muted-foreground">Upgrade to Pro to access this prompt.</p>
            </div>
          ) : item.prompt_text ? (
            <>
              <div
                className="text-sm text-foreground/85 leading-relaxed rounded-xl p-4 font-mono"
                style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
              >
                {item.prompt_text}
              </div>
              <button
                onClick={copy}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  copied
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25',
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied to clipboard!' : 'Copy Prompt'}
              </button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No prompt text available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────────── */

function ImageCard({ item, onClick }: { item: ImagePrompt; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isGallery = item.content_mode === 'image_gallery' && item.gallery_prompts && item.gallery_prompts.length > 0;
  const isRealThumb = item.thumbnail_url?.startsWith('http');
  const validCount = isGallery
    ? (item.gallery_prompts ?? []).filter((g) => g.generated_image_url && g.generation_status === 'completed').length
    : 0;

  /* mini preview images (first 4 gallery images beside the thumb) */
  const previews = isGallery
    ? (item.gallery_prompts ?? [])
        .filter((g) => g.generated_image_url && g.generation_status === 'completed')
        .slice(1, 5)
    : [];

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 2px 12px hsl(var(--shadow-card, 230 50% 2% / 0.4))',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.3)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = 'hsl(var(--border))')
      }
    >
      {/* ── Thumbnail ─────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-secondary/30" style={{ aspectRatio: isGallery ? '16/9' : '3/2' }}>
        {isRealThumb ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Image className="h-8 w-8 text-muted-foreground/20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {item.is_premium && (
            <span className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-primary px-2 py-0.5 rounded-full">
              <Lock className="h-2.5 w-2.5" /> PRO
            </span>
          )}
          {item.is_featured && !item.is_premium && (
            <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
        {isGallery && validCount > 0 && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white/80 px-2 py-0.5 rounded-full">
            <Layers className="h-2.5 w-2.5" />
            {validCount}
          </span>
        )}
      </div>

      {/* ── Mini strip for gallery items ──────────────────── */}
      {isGallery && previews.length > 0 && (
        <div className="flex gap-1 px-2.5 pt-2.5">
          {previews.map((gp, i) => (
            <div
              key={i}
              className="flex-1 rounded-lg overflow-hidden bg-secondary/40"
              style={{ aspectRatio: '1/1' }}
            >
              <img
                src={gp.generated_image_url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => { (e.currentTarget.closest('div') as HTMLElement).style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold bg-violet-500/15 text-violet-400 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          {isGallery && (
            <span className="text-[10px] text-muted-foreground/60">Gallery</span>
          )}
        </div>

        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {!isGallery && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-[10px] text-muted-foreground/50">
            {isGallery ? `${validCount} prompts` : 'Single prompt'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({ id: item.id, type: 'image_prompt', title: item.title, description: item.description, category: item.category });
            }}
            className={cn(
              'p-1 rounded-md transition-colors',
              isFavorite(item.id) ? 'text-red-400' : 'text-muted-foreground/40 hover:text-red-400',
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', isFavorite(item.id) && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

type AccessFilter = 'All' | 'Free' | 'Premium';
type SortOption = 'newest' | 'oldest' | 'popular' | 'views';
const ACCESS_OPTIONS: AccessFilter[] = ['All', 'Free', 'Premium'];

export default function ImagePrompts() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useImagePrompts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'gallery' | 'prompt'>('all');
  const [access, setAccess] = useState<AccessFilter>('All');
  const [sort, setSort] = useState<SortOption>('newest');
  const [featured, setFeatured] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [selected, setSelected] = useState<ImagePrompt | null>(null);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    let list = items;
    if (category !== 'All') list = list.filter((i) => i.category === category);
    if (typeFilter === 'gallery') list = list.filter((i) => i.content_mode === 'image_gallery');
    if (typeFilter === 'prompt') list = list.filter((i) => i.content_mode !== 'image_gallery');
    if (access === 'Free') list = list.filter((i) => !i.is_premium);
    if (access === 'Premium') list = list.filter((i) => i.is_premium);
    if (featured) list = list.filter((i) => i.is_featured);
    if (recommended) list = list.filter((i) => i.is_recommended);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.search_keywords?.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === 'oldest') sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sort === 'popular') sorted.sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0));
    else if (sort === 'views') sorted.sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0));
    return sorted;
  }, [items, search, category, typeFilter, access, featured, recommended, sort]);

  const galleryCount = items.filter((i) => i.content_mode === 'image_gallery').length;
  const promptCount = items.filter((i) => i.content_mode !== 'image_gallery').length;
  const activeFilterCount = (access !== 'All' ? 1 : 0) + (featured ? 1 : 0) + (recommended ? 1 : 0);

  const isGallerySelected =
    selected?.content_mode === 'image_gallery' &&
    selected.gallery_prompts &&
    selected.gallery_prompts.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Image}
        title="Image Prompts"
        description="Gallery packs and individual prompts for Midjourney, DALL·E, GPT Image, Flux and more."
        count={items.length}
        iconColor="text-violet-400"
      />

      {/* Type tabs */}
      <div className="flex items-center gap-2 mb-5">
        {([
          { key: 'all', label: `All (${items.length})` },
          { key: 'gallery', label: `Gallery Packs (${galleryCount})` },
          { key: 'prompt', label: `Single Prompts (${promptCount})` },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key)}
            className={cn(
              'text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-all',
              typeFilter === key
                ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                : 'text-muted-foreground border-border/40 hover:text-foreground hover:border-border/70',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={category}
          onCategory={setCategory}
          placeholder="Search image prompts..."
          total={items.length}
          filtered={filtered.length}
          activeSort={sort}
          onSortChange={(s) => setSort(s as SortOption)}
          filterButton={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-2 h-10 px-4 rounded-xl border text-[13px] font-medium transition-all duration-200 shrink-0',
                    activeFilterCount > 0
                      ? 'bg-violet-500/10 border-violet-500/35 text-violet-400'
                      : 'bg-white/[0.03] border-border/35 text-foreground hover:bg-white/[0.05] hover:border-border/50',
                  )}
                >
                  <SlidersHorizontal style={{ width: 14, height: 14 }} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-violet-500 text-white text-[10px] font-bold leading-none">
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
                          ? 'bg-violet-500/15 border-violet-500/40 text-violet-400'
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
          }
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-secondary/20 animate-pulse" style={{ aspectRatio: '3/4' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <Image className="h-12 w-12 text-muted-foreground/20" />
          <h3 className="font-semibold text-foreground">No image prompts found</h3>
          <p className="text-sm text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ImageCard key={item.id} item={item} onClick={() => {
              trackView({ promptId: item.id, promptTitle: item.title, promptType: 'image_prompt', category: item.category, userId: user?.id });
              setSelected(item);
            }} />
          ))}
        </div>
      )}

      {/* Modals */}
      {selected && isGallerySelected && (
        <GalleryModal item={selected} onClose={() => setSelected(null)} />
      )}
      {selected && !isGallerySelected && (
        <PromptTextModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
