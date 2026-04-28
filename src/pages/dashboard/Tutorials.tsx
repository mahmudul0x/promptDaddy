import { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  ExternalLink,
  FileText,
  Heart,
  LoaderCircle,
  Lock,
  Play,
  Radio,
  FlaskConical,
  X,
} from 'lucide-react';
import { useGuides, useTutorialResources, useVideos } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Guide, TutorialResourceItem, Video } from '@/data/types';
import { cn } from '@/lib/utils';

type ResourceKind = 'article' | 'guide' | 'video' | 'blog' | 'research' | 'news';
type ResourceSource = 'guide' | 'video' | 'tutorial_resource';

type TutorialResource = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  isPremium: boolean;
  isRecommended: boolean;
  createdAt: string;
  resourceKind: ResourceKind;
  resourceSource: ResourceSource;
  sourceLabel: string;
  ctaLabel: string;
  publisher?: string | null;
  videoUrl?: string | null;
  iframeUrl?: string | null;
  htmlContent?: string | null;
  externalHref?: string | null;
};

const EXCLUDED_TUTORIAL_VIDEO_TITLES = new Set([
  'Prompt Engineering Basics',
  'Primer Method',
  'Act As Method',
  'Break It Down Method',
  'Ask Questions Method',
]);

const KIND_STYLES: Record<ResourceKind, { label: string; cls: string }> = {
  article: { label: 'Article', cls: 'bg-emerald-500/15 text-emerald-400' },
  guide: { label: 'Guide', cls: 'bg-cyan-500/15 text-cyan-400' },
  video: { label: 'Video', cls: 'bg-violet-500/15 text-violet-400' },
  blog: { label: 'Blog', cls: 'bg-sky-500/15 text-sky-400' },
  research: { label: 'Research', cls: 'bg-amber-500/15 text-amber-400' },
  news: { label: 'News', cls: 'bg-rose-500/15 text-rose-400' },
};

function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
  } catch {
    return null;
  }
  return null;
}

function getYoutubeEmbedSrc(url: string): string {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getVideoThumbnail(url: string | null | undefined, fallback: string): string {
  const videoId = getYoutubeVideoId(url);
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return fallback;
}

function getGuideResource(item: Guide): TutorialResource {
  const iframeUrl = item.rich_content?.iframeUrl ?? null;
  const htmlContent = item.rich_content?.htmlContent ?? item.content ?? null;
  const hasVideo = Boolean(item.video_url);
  const resourceKind: ResourceKind = hasVideo ? 'video' : iframeUrl ? 'guide' : 'article';

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    thumbnailUrl: item.thumbnail_url,
    isPremium: item.is_premium,
    isRecommended: item.is_recommended,
    createdAt: item.created_at,
    resourceKind,
    resourceSource: 'guide',
    sourceLabel: hasVideo ? 'Walkthrough' : iframeUrl ? 'Deep Guide' : 'Reference',
    ctaLabel: hasVideo ? 'Watch walkthrough' : iframeUrl ? 'Open guide' : 'Read article',
    videoUrl: item.video_url,
    iframeUrl,
    htmlContent,
    externalHref: item.video_url || iframeUrl || null,
  };
}

function getVideoResource(item: Video): TutorialResource {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    thumbnailUrl: getVideoThumbnail(item.video_url, item.thumbnail_url),
    isPremium: item.is_premium,
    isRecommended: item.is_recommended,
    createdAt: item.created_at,
    resourceKind: 'video',
    resourceSource: 'video',
    sourceLabel: 'Video Lesson',
    ctaLabel: 'Watch lesson',
    videoUrl: item.video_url,
    iframeUrl: item.html_file_url,
    externalHref: item.video_url || item.html_file_url || null,
  };
}

function getExternalResource(item: TutorialResourceItem): TutorialResource {
  const sourceLabel =
    item.resource_type === 'research' ? item.publisher :
    item.resource_type === 'news' ? 'News Source' :
    'Reading Resource';

  const ctaLabel =
    item.resource_type === 'research' ? 'Open paper' :
    item.resource_type === 'news' ? 'Read updates' :
    'Open article';

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    thumbnailUrl: item.thumbnail_url,
    isPremium: item.is_premium,
    isRecommended: item.is_recommended,
    createdAt: item.created_at,
    resourceKind: item.resource_type,
    resourceSource: 'tutorial_resource',
    sourceLabel,
    ctaLabel,
    publisher: item.publisher,
    externalHref: item.url,
  };
}

function getActionIcon(kind: ResourceKind) {
  if (kind === 'video') return Play;
  if (kind === 'guide') return BookOpen;
  if (kind === 'research') return FlaskConical;
  if (kind === 'news') return Radio;
  return FileText;
}

function getEmbedUrl(item: TutorialResource): string | null {
  if (item.resourceKind !== 'video' || !item.videoUrl) return null;
  if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')) {
    return getYoutubeEmbedSrc(item.videoUrl);
  }
  return item.videoUrl;
}

function HtmlContentViewer({ html, title, height }: { html: string; title: string; height: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([html], { type: 'text/html' });
    const objectUrl = URL.createObjectURL(blob);
    setBlobUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [html]);

  if (!blobUrl) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className="w-full block border-0"
      style={{ height }}
      title={title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}

function TutorialCard({ item, onClick }: { item: TutorialResource; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const badge = KIND_STYLES[item.resourceKind];
  const ActionIcon = getActionIcon(item.resourceKind);

  return (
    <div
      className="group flex flex-col rounded-xl border border-border/45 bg-card/55 overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden bg-secondary/40">
        {item.thumbnailUrl?.startsWith('http') || item.thumbnailUrl?.startsWith('/') ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/25" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
            {item.category}
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm', badge.cls)}>
            {badge.label}
          </span>
          {item.isPremium && (
            <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur-sm">
              <Lock className="h-2.5 w-2.5" />
              PRO
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm">
            <ActionIcon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-primary/80">{item.publisher || item.sourceLabel}</span>
          <span className="text-[11px] text-muted-foreground/60">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/30 pt-3">
          <span className="flex items-center gap-1 text-xs text-primary/75">
            <ActionIcon className="h-3 w-3" />
            {item.ctaLabel}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({
                id: item.id,
                type: item.resourceSource,
                title: item.title,
                description: item.description,
                category: item.category,
              });
            }}
            className={cn(
              'rounded-full p-1.5 transition-all',
              favorited ? 'text-red-400' : 'text-muted-foreground hover:text-red-400',
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentModal({ item, onClose }: { item: TutorialResource; onClose: () => void }) {
  const badge = KIND_STYLES[item.resourceKind];
  const bodyH = 'calc(90vh - 68px)';
  const embedUrl = getEmbedUrl(item);

  // Auto-redirect to external URL for blog, research, news
  useEffect(() => {
    if (item.resourceSource === 'tutorial_resource' && item.externalHref) {
      window.open(item.externalHref, '_blank', 'noopener,noreferrer');
      onClose();
    }
  }, [item, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 mx-4 w-full max-w-6xl overflow-hidden rounded-2xl border border-border/50 shadow-2xl"
        style={{ maxHeight: '90vh', background: 'hsl(var(--background))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-5 py-3.5" style={{ borderColor: 'hsl(var(--border))' }}>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', badge.cls)}>
            {badge.label}
          </span>
          <h2 className="flex-1 truncate text-sm font-semibold text-foreground">{item.title}</h2>
          {item.externalHref && (
            <a
              href={item.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {item.resourceKind === 'video' && embedUrl ? (
          <div className="bg-black" style={{ height: bodyH }}>
            <iframe
              src={embedUrl}
              className="h-full w-full border-0"
              allowFullScreen
              title={item.title}
              allow="autoplay; fullscreen; picture-in-picture"
            />
          </div>
        ) : item.iframeUrl ? (
          <iframe
            src={item.iframeUrl}
            className="w-full block border-0"
            style={{ height: bodyH }}
            allowFullScreen
            title={item.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
          />
        ) : item.resourceSource === 'tutorial_resource' ? (
          <div className="overflow-y-auto p-6 custom-scroll" style={{ maxHeight: bodyH }}>
            <div className="mx-auto max-w-3xl">
              {item.thumbnailUrl?.startsWith('http') || item.thumbnailUrl?.startsWith('/') ? (
                <img src={item.thumbnailUrl} alt={item.title} className="mb-5 max-h-80 w-full rounded-xl object-cover" />
              ) : null}

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', badge.cls)}>
                  {badge.label}
                </span>
                <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
                  {item.category}
                </span>
                {item.publisher ? (
                  <span className="rounded-full border border-border/40 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {item.publisher}
                  </span>
                ) : null}
              </div>

              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>

              <div className="mt-6 rounded-2xl border border-border/40 bg-card/45 p-5">
                <h4 className="text-sm font-semibold text-foreground">Resource Summary</h4>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  This resource is available on the original publisher's website. Some external sites block embedded
                  display inside apps, so we are showing the resource details here inside your dashboard and keeping the
                  source link available in the top-right corner.
                </p>
              </div>
            </div>
          </div>
        ) : item.htmlContent ? (
          <HtmlContentViewer html={item.htmlContent} title={item.title} height={bodyH} />
        ) : (
          <div className="overflow-y-auto p-6 custom-scroll" style={{ maxHeight: bodyH }}>
            {item.thumbnailUrl?.startsWith('http') || item.thumbnailUrl?.startsWith('/') ? (
              <img src={item.thumbnailUrl} alt={item.title} className="mb-5 max-h-72 w-full rounded-xl object-cover" />
            ) : null}
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tutorials() {
  const { data: guides = [], isLoading: guidesLoading } = useGuides();
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: tutorialResources = [], isLoading: resourcesLoading } = useTutorialResources();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeType, setActiveType] = useState('All Types');
  const [activeSort, setActiveSort] = useState('newest');
  const [selected, setSelected] = useState<TutorialResource | null>(null);

  const resources = useMemo(() => {
    const guideResources = guides.map(getGuideResource);
    const videoResources = videos
      .filter((item) => !EXCLUDED_TUTORIAL_VIDEO_TITLES.has(item.title))
      .map(getVideoResource);
    const externalResources = tutorialResources.map(getExternalResource);
    return [...guideResources, ...videoResources, ...externalResources].sort((a, b) => {
      if (a.isRecommended !== b.isRecommended) return Number(b.isRecommended) - Number(a.isRecommended);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [guides, videos, tutorialResources]);

  const categories = useMemo(
    () => [...new Set(resources.map((item) => item.category).filter(Boolean))].sort(),
    [resources],
  );

  const filtered = useMemo(() => {
    let list = resources;
    
    // Filter by category
    if (category !== 'All') list = list.filter((item) => item.category === category);
    
    // Filter by type
    if (activeType !== 'All Types') {
      const typeMap: Record<string, ResourceKind> = {
        'Article': 'article',
        'Guide': 'guide',
        'Video': 'video',
        'Blog': 'blog',
        'Research': 'research',
        'News': 'news',
      };
      const targetKind = typeMap[activeType];
      if (targetKind) list = list.filter((item) => item.resourceKind === targetKind);
    }
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q),
      );
    }
    
    // Sort
    if (activeSort === 'newest') {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeSort === 'oldest') {
      list = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (activeSort === 'recommended') {
      list = [...list].sort((a, b) => Number(b.isRecommended) - Number(a.isRecommended));
    }
    
    return list;
  }, [resources, search, category, activeType, activeSort]);

  const articleCount = resources.filter((item) => item.resourceKind === 'article').length;

  const isLoading = guidesLoading || videosLoading || resourcesLoading;

  const handleSelect = (item: TutorialResource) => {
    setSelected(item);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={BookMarked}
        title="Guided Tutorials"
        description="A curated learning hub with step-by-step guides, supporting articles, and tutorial videos across the AI workflows in your library."
        count={resources.length}
        iconColor="text-cyan-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={category}
          onCategory={setCategory}
          placeholder="Search guides, walkthroughs, and reference resources..."
          total={resources.length}
          filtered={filtered.length}
          activeType={activeType}
          onTypeChange={setActiveType}
          activeSort={activeSort}
          onSortChange={setActiveSort}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="font-semibold text-foreground">No tutorials found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try a different topic or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <TutorialCard key={`${item.resourceSource}-${item.id}`} item={item} onClick={() => handleSelect(item)} />
          ))}
        </div>
      )}

      {!isLoading && articleCount > 0 && (
        <div className="mt-8 rounded-2xl border border-border/40 bg-card/40 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-border/40 bg-secondary/50 p-2.5">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Reference Layer</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                This section now blends concept explainers, embedded guides, and video walkthroughs so learners can move from reading to watching without leaving the dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {selected && <ContentModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
