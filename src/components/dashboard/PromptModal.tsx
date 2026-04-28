import { X, Heart, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from './CopyButton';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { ContentType } from '@/data/types';
import { cn } from '@/lib/utils';

interface PromptModalProps {
  open: boolean;
  onClose: () => void;
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  content: string;
  is_premium: boolean;
  thumbnail?: string;
  externalUrl?: string;
  extraBadge?: string;
}

export function PromptModal({
  open, onClose, id, type, title, description, category,
  content, is_premium, thumbnail, externalUrl, extraBadge,
}: PromptModalProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-border/60 bg-card shadow-elegant overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-border/50 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-semibold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                {category}
              </span>
              {extraBadge && (
                <span className="text-xs font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                  {extraBadge}
                </span>
              )}
              {is_premium && (
                <span className="flex items-center gap-1 text-xs font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  <Lock className="h-3 w-3" /> PRO
                </span>
              )}
            </div>
            <h2 className="font-bold text-lg text-foreground leading-snug">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto">
           {/* Thumbnail Image */}
           {thumbnail && (
             <div className="relative h-48 w-full overflow-hidden bg-secondary/40 border-b border-border/50">
               <img
                 src={thumbnail}
                 alt={title}
                 className="h-full w-full object-cover"
                 loading="lazy"
               />
             </div>
           )}

           {/* Text Content */}
           <div className="p-4 sm:p-6">
             {is_premium ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                 <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                   <Lock className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="font-semibold text-lg text-foreground mb-2">PRO Content</h3>
                 <p className="text-muted-foreground text-sm max-w-xs">
                   This content is available for Pro members. Upgrade to unlock all 1,167+ prompts, tools, and resources.
                 </p>
                 <Button className="mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90">
                   Upgrade to Pro
                 </Button>
               </div>
             ) : (
               <div
                 className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90
                   prose-p:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground
                   prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                 dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
               />
             )}
           </div>
         </div>

        {/* Footer */}
        {!is_premium && (
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border/50 shrink-0 bg-secondary/20">
            <CopyButton text={content} size="default" className="gap-2 text-sm px-4" />
            <div className="flex items-center gap-2">
              {externalUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5 text-xs text-muted-foreground">
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite({ id, type, title, description, category })}
                className={cn(
                  'gap-1.5 text-xs',
                  favorited ? 'text-red-400 hover:text-red-500' : 'text-muted-foreground hover:text-red-400'
                )}
              >
                <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
                {favorited ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
