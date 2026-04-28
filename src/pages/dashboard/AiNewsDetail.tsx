import { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Clock, ExternalLink, MessageCircle,
  LoaderCircle, AlertCircle,
} from 'lucide-react';
import type { DevToArticle } from './AiNews';

interface DevToArticleDetail extends DevToArticle {
  body_html: string;
}

// Parse in a detached <template> so <style>/<script> nodes are never applied to the document.
function sanitizeHtml(html: string): string {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('style, script').forEach(n => n.remove());
  const wrap = document.createElement('div');
  wrap.appendChild(tpl.content);
  return wrap.innerHTML;
}

export default function AiNewsDetail() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const preview = location.state?.article as DevToArticle | undefined;

  const { data: article, isLoading, isError } = useQuery<DevToArticleDetail>({
    queryKey: ['ai_news_article', articleId],
    queryFn: async () => {
      const res = await fetch(`https://dev.to/api/articles/${articleId}`);
      if (!res.ok) throw new Error('Failed to fetch article');
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  const data = article ?? (preview as unknown as DevToArticleDetail | undefined);
  const image = data?.cover_image || data?.social_image;
  // dev.to list API returns tag_list as string[], detail API returns it as a comma-separated string
  const tags = data
    ? Array.isArray(data.tag_list)
      ? data.tag_list
      : (data.tag_list as unknown as string).split(',').map(t => t.trim()).filter(Boolean)
    : [];
  const safeBody = useMemo(
    () => (article?.body_html ? sanitizeHtml(article.body_html) : null),
    [article?.body_html],
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to AI News
        </button>
        {data?.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-primary hover:underline font-medium"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open on dev.to
          </a>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && !data && (
        <div className="space-y-4">
          <div className="h-56 rounded-2xl bg-secondary/30 animate-pulse" />
          <div className="h-8 w-3/4 rounded-lg bg-secondary/30 animate-pulse" />
          <div className="h-4 w-1/2 rounded-lg bg-secondary/30 animate-pulse" />
          <div className="space-y-2 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-secondary/30 animate-pulse" style={{ width: `${75 + Math.random() * 25}%` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && !data && (
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Failed to load article</h3>
          <p className="text-sm text-muted-foreground mb-4">Check your connection and try again.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Article */}
      {data && (
        <article>
          {/* Cover image */}
          {image && (
            <div className="relative w-full overflow-hidden rounded-2xl mb-6" style={{ maxHeight: 340 }}>
              <img
                src={image}
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="text-[11px] font-semibold bg-primary/10 text-primary/80 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-5">
            {data.title}
          </h1>

          {/* Meta bar */}
          <div className="flex items-center gap-4 flex-wrap pb-5 mb-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-2.5">
              <img
                src={data.user.profile_image}
                alt={data.user.name}
                className="h-9 w-9 rounded-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-none">{data.user.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                  {new Date(data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {data.reading_time_minutes} min read
              </span>
              <span className="flex items-center gap-1">
                <span className="text-red-400">♥</span>
                {data.positive_reactions_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {data.comments_count}
              </span>
            </div>

            <div className="ml-auto">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                dev.to
              </span>
            </div>
          </div>

          {/* Body — full article HTML or description fallback */}
          {isLoading && !article ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircle className="h-5 w-5 text-primary animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading article content…</span>
            </div>
          ) : safeBody ? (
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
          )}

          {/* Footer CTA */}
          <div className="mt-10 pt-6 border-t flex items-center justify-between flex-wrap gap-4" style={{ borderColor: 'hsl(var(--border))' }}>
            <div>
              <p className="text-xs text-muted-foreground">Originally published on dev.to</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">by {data.user.name}</p>
            </div>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Read Original on dev.to
            </a>
          </div>
        </article>
      )}
    </div>
  );
}
