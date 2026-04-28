import { useState } from 'react';
import { Heart, Trash2, MessageSquare, Image, Video, GraduationCap, Zap, Bot, Cpu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { ContentType, FavoriteItem } from '@/data/types';
import { cn } from '@/lib/utils';

const TYPE_META: Record<ContentType, { icon: React.ElementType; color: string; bg: string; label: string; to: string }> = {
  prompt: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'LLM Prompt', to: '/dashboard/prompts' },
  image_prompt: { icon: Image, color: 'text-violet-400', bg: 'bg-violet-400/10', label: 'Image Prompt', to: '/dashboard/image-prompts' },
  video: { icon: Video, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Video', to: '/dashboard/videos' },
  guide: { icon: GraduationCap, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Guide', to: '/dashboard/fundamentals' },
  automation: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Automation', to: '/dashboard/automation' },
  claude_skill: { icon: Bot, color: 'text-cyan-400', bg: 'bg-cyan-400/10', label: 'Claude Skill', to: '/dashboard/claude-skills' },
  custom_gpt: { icon: Cpu, color: 'text-pink-400', bg: 'bg-pink-400/10', label: 'Custom GPT', to: '/dashboard/custom-gpts' },
};

function FavoriteCard({ item }: { item: FavoriteItem }) {
  const { removeFavorite } = useFavorites();
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const savedDate = new Date(item.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/60 hover:border-primary/30 hover:bg-card/90 transition-all">
      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', meta.bg)}>
        <Icon className={cn('h-5 w-5', meta.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', meta.bg, meta.color)}>
            {meta.label}
          </span>
          <span className="text-[10px] text-muted-foreground/60">{savedDate}</span>
        </div>
        <h3 className="font-semibold text-sm text-foreground line-clamp-1">{item.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link
          to={meta.to}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Go to section"
        >
          <Search className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={() => removeFavorite(item.id)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Remove from favorites"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const FILTER_TYPES: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'prompt', label: 'Prompts' },
  { key: 'image_prompt', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'guide', label: 'Guides' },
  { key: 'automation', label: 'Automation' },
  { key: 'claude_skill', label: 'Claude Skills' },
  { key: 'custom_gpt', label: 'Custom GPTs' },
];

export default function Favorites() {
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? favorites
    : favorites.filter((f) => f.type === filter);

  const sorted = [...filtered].sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Heart}
        title="Favorites"
        description="All your saved prompts, tools, and resources in one place."
        count={favorites.length}
        iconColor="text-red-400"
      />

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Click the heart icon on any prompt, video, or tool to save it here.
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard/prompts">Browse Prompts</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTER_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border transition-all',
                  filter === key
                    ? 'bg-primary/15 text-primary border-primary/40'
                    : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
                )}
              >
                {label}
                {key === 'all' && <span className="ml-1.5 opacity-60">{favorites.length}</span>}
                {key !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    {favorites.filter((f) => f.type === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No {filter} favorites yet.</p>
          ) : (
            <div className="space-y-2">
              {sorted.map((item) => (
                <FavoriteCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
