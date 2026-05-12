import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Video, Play, ExternalLink, Lock, FileText, X, Heart, LoaderCircle } from 'lucide-react';
import { useVideos } from '@/hooks/useData';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Video as VideoType } from '@/data/types';
import { cn } from '@/lib/utils';

type ContentKind = 'youtube' | 'html_file' | 'vimeo' | 'iframe' | 'text';

function getContentKind(item: VideoType): ContentKind {
  if (item.video_url?.includes('youtube.com/watch') || item.video_url?.includes('youtu.be/')) return 'youtube';
  if (item.html_file_url) return 'html_file';
  if (!item.video_url) return 'text';
  if (item.video_url.includes('vimeo.com')) return 'vimeo';
  return 'iframe';
}

function getVimeoSrc(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/);
  const hash = url.match(/vimeo\.com\/\d+\/(\w+)/)?.[1];
  return `https://player.vimeo.com/video/${m![1]}${hash ? `?h=${hash}` : ''}`;
}

function getYoutubeEmbedSrc(url: string): string {
  const watchMatch = url.match(/[?&]v=([\w-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

function getYoutubeVideoId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([\w-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

function getYoutubeThumbnail(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function HtmlFileViewer({ url, title, height }: { url: string; title: string; height: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl = '';
    setLoading(true); setError(false);
    fetch(url)
      .then((r) => r.text())
      .then((html) => {
        const blob = new Blob([html], { type: 'text/html' });
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6" style={{ height }}>
        <p className="text-sm text-muted-foreground">Could not load content.</p>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
        </a>
      </div>
    );
  }
  return (
    <iframe src={blobUrl!} className="w-full block border-0" style={{ height }} title={title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
  );
}

function VideoCard({ item, onClick }: { item: VideoType; onClick: () => void }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const kind = getContentKind(item);
  const ActionIcon = kind === 'text' || kind === 'html_file' ? FileText : Play;
  const cardThumbnail = kind === 'youtube' && item.video_url
    ? getYoutubeThumbnail(item.video_url) ?? item.thumbnail_url
    : item.thumbnail_url;

  return (
    <div
      className="group flex flex-col rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full h-40 bg-secondary/40 overflow-hidden">
        {cardThumbnail?.startsWith('http') ? (
          <img src={cardThumbnail} alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        {item.is_premium && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Lock className="h-2.5 w-2.5 text-primary" />
            <span className="text-[10px] font-semibold text-primary">PRO</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <ActionIcon className="h-5 w-5 text-white" style={{ marginLeft: kind === 'vimeo' ? 2 : 0 }} />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-semibold bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full self-start">
          {item.category}
        </span>
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-3 flex-1 leading-relaxed">{item.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
          <span className="text-xs text-primary/70 flex items-center gap-1">
            <ActionIcon className="h-3 w-3" />
            {kind === 'youtube' ? 'Watch on YouTube' : kind === 'vimeo' ? 'Watch' : kind === 'iframe' ? 'Open' : 'Read'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite({ id: item.id, type: 'video', title: item.title, description: item.description, category: item.category });
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

function ContentModal({ item, onClose }: { item: VideoType; onClose: () => void }) {
  const kind = getContentKind(item);
  const externalHref = item.video_url || item.html_file_url || '';
  const bodyH = 'calc(90vh - 65px)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-5xl mx-4 rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh', background: 'hsl(var(--background))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
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

        {kind === 'youtube' ? (
          <div className="bg-black" style={{ height: bodyH }}>
            <iframe
              src={getYoutubeEmbedSrc(item.video_url!)}
              className="w-full h-full border-0"
              allowFullScreen
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        ) : kind === 'text' ? (
          <div className="overflow-y-auto custom-scroll p-6" style={{ maxHeight: bodyH }}>
            {item.thumbnail_url?.startsWith('http') && (
              <img src={item.thumbnail_url} alt={item.title} className="w-full max-h-72 object-cover rounded-xl mb-5" />
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ) : kind === 'html_file' ? (
          <HtmlFileViewer url={item.html_file_url!} title={item.title} height={bodyH} />
        ) : kind === 'vimeo' ? (
          <div className="bg-black" style={{ height: bodyH }}>
            <iframe src={getVimeoSrc(item.video_url!)}
              className="w-full h-full border-0" allowFullScreen title={item.title}
              allow="autoplay; fullscreen; picture-in-picture" />
          </div>
        ) : (
          <iframe src={item.video_url!} className="w-full block border-0" style={{ height: bodyH }}
            allowFullScreen title={item.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation" />
        )}
      </div>
    </div>
  );
}

export default function Videos() {
  const { data: items = [], isLoading } = useVideos();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('newest');
  const [selected, setSelected] = useState<VideoType | null>(null);

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
    
    // Filter by category
    if (category !== 'All') list = list.filter((i) => i.category === category);
    
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
      );
    }
    
    // Sort
    if (activeSort === 'newest') {
      list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (activeSort === 'oldest') {
      list = [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (activeSort === 'recommended') {
      list = [...list].sort((a, b) => Number(b.is_recommended) - Number(a.is_recommended));
    }
    
    return list;
  }, [items, search, category, activeSort]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Video} title="Videos"
        description="In-depth video tutorials and guides on using AI tools effectively."
        count={items.length} iconColor="text-green-400"
      />

      <div className="mb-6">
        <FilterBar
          search={search} onSearch={setSearch}
          categories={categories} activeCategory={category} onCategory={setCategory}
          placeholder="Search videos..." total={items.length} filtered={filtered.length}
          activeSort={activeSort} onSortChange={setActiveSort}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 rounded-xl bg-secondary/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Video className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground">No videos found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <VideoCard key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
        </div>
      )}

      {selected && <ContentModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
