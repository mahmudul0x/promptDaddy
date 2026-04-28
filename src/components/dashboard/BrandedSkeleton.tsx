import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-secondary/40 animate-pulse',
        className,
      )}
    />
  );
}

export function PromptCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/30 bg-card/50">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="space-y-1.5 w-full flex flex-col items-center">
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-2.5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function PageSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  );
}
