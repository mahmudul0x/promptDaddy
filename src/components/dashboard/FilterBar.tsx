import { Search, X, ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  categories: string[];
  activeCategory: string;
  onCategory: (c: string) => void;
  placeholder?: string;
  total?: number;
  filtered?: number;
  activeType?: string;
  onTypeChange?: (type: string) => void;
  typeOptions?: string[];
  activeSort?: string;
  onSortChange?: (sort: string) => void;
  filterButton?: ReactNode;
}

const ALL_CATEGORIES = [
  'All',
  'AI Automation', 'AI Coding', 'AI News', 'AI Research', 'AI Voice',
  'Business Strategy', 'ChatGPT Workflows', 'Creative & Design',
  'Gemini Workflows', 'General', 'Marketing', 'Productivity',
  'Prompt Engineering', 'SEO', 'Video Generation',
];

const DEFAULT_TYPE_OPTIONS = ['All Types', 'Article', 'Guide', 'Video', 'Blog', 'Research', 'News'];

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Newest' },
  { value: 'oldest',  label: 'Oldest' },
  { value: 'popular', label: 'Popular' },
  { value: 'views',   label: 'Views' },
];

const BTN = 'flex items-center gap-1.5 h-9 px-3 rounded-xl border text-[12px] font-medium transition-all duration-200 shrink-0 whitespace-nowrap bg-white/[0.03] border-border/35 text-foreground hover:bg-white/[0.05] hover:border-border/50';

export function FilterBar({
  search, onSearch, categories, activeCategory, onCategory,
  placeholder = 'Search...', total, filtered,
  activeType = 'All Types', onTypeChange, typeOptions,
  activeSort = 'newest', onSortChange,
  filterButton,
}: FilterBarProps) {
  const shown = filtered ?? total ?? 0;

  const predefined = ALL_CATEGORIES.filter(c => c === 'All' || categories.includes(c));
  const dynamic    = categories.filter(c => !ALL_CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b));
  const displayCats = [...predefined, ...dynamic];
  const displayTypes = typeOptions ?? DEFAULT_TYPE_OPTIONS;
  const currentSort = SORT_OPTIONS.find(o => o.value === activeSort)?.label ?? 'Newest';

  return (
    <div className="flex flex-col gap-2">

      {/* ── Row 1: search ──────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group/search">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within/search:text-primary/60 text-muted-foreground/40"
            style={{ width: 14, height: 14 }}
          />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full h-10 rounded-xl pl-9 pr-9 text-[13px] outline-none transition-all duration-200',
              'bg-white/[0.03] border border-border/35 text-foreground placeholder:text-muted-foreground/35',
              'focus:bg-white/[0.05] focus:border-primary/35 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.07)]',
            )}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        {/* Result counter — only on md+ */}
        {total !== undefined && (
          <div className="hidden md:flex items-center gap-1 shrink-0 font-mono">
            <span className="text-[11px] tabular-nums text-primary/80">{shown.toLocaleString()}</span>
            <span className="text-[11px] text-muted-foreground/30">/</span>
            <span className="text-[11px] tabular-nums text-muted-foreground/40">{total.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* ── Row 2: filters (horizontally scrollable on mobile) ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">

        {/* Category */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={BTN}>
              <span className="hidden sm:inline text-muted-foreground/50 text-[11px] font-normal">Cat:</span>
              <span className="max-w-[90px] truncate">{activeCategory}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card border-border/50 shadow-xl">
            <div className="max-h-72 overflow-y-auto no-scrollbar">
              {displayCats.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => onCategory(cat)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer text-[13px] py-2 px-3 rounded-md',
                    activeCategory === cat
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                  )}
                >
                  {cat}
                  {activeCategory === cat && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type filter */}
        {onTypeChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={BTN}>
                <span className="max-w-[80px] truncate">{activeType}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-card border-border/50 shadow-xl">
              {displayTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => onTypeChange(type)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer text-[13px] py-2 px-3',
                    activeType === type
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                  )}
                >
                  {type}
                  {activeType === type && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sort */}
        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={BTN}>
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="hidden sm:inline">{currentSort}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-card border-border/50 shadow-xl">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer text-[13px] py-2 px-3',
                    activeSort === opt.value
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                  )}
                >
                  {opt.label}
                  {activeSort === opt.value && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Extra filter slot */}
        {filterButton}

        {/* Result counter on mobile */}
        {total !== undefined && (
          <div className="md:hidden flex items-center gap-1 ml-auto shrink-0 font-mono">
            <span className="text-[11px] tabular-nums text-primary/80">{shown.toLocaleString()}</span>
            <span className="text-[11px] text-muted-foreground/30">/</span>
            <span className="text-[11px] tabular-nums text-muted-foreground/40">{total.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
