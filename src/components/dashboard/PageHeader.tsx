import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count?: number;
  iconColor?: string;
}

export function PageHeader({ icon: Icon, title, description, count, iconColor = 'text-primary' }: PageHeaderProps) {
  return (
    <div className="flex items-start gap-3 mb-6 sm:mb-8">
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-secondary/60 border border-border/50 flex items-center justify-center shrink-0">
        <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{title}</h2>
          {count !== undefined && (
            <span className="text-xs font-mono bg-primary/15 text-primary px-2 py-0.5 rounded-full shrink-0">
              {count.toLocaleString()}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-muted-foreground text-xs sm:text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
