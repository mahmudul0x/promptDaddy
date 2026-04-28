import {
  Heart, Lock, Star,
  Terminal, TrendingUp, Megaphone, PenLine, Search,
  Briefcase, Target, BarChart2, Mail, Share2, Zap, Bot,
  Code2, Layers, Brain, Globe, Users, BookOpen, Cpu, Video,
  GraduationCap, type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyButton } from './CopyButton';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { ContentType } from '@/data/types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
  is_featured?: boolean;
  copyText?: string;
  thumbnail?: string;
  onClick?: () => void;
  badge?: string;
  badgeColor?: string;
}

type Visual = { from: string; to: string; icon: LucideIcon };

interface ComputedStyles {
  outer: { background: string };
  radial: { background: string };
  grid: { backgroundImage: string; backgroundSize: string };
  ghost: { position: 'absolute'; width: number; height: number; color: string; opacity: number };
  pill: { background: string; boxShadow: string };
  Icon: LucideIcon;
}

function buildStyles(v: Visual): ComputedStyles {
  return {
    outer: { background: `linear-gradient(135deg, ${v.from}14 0%, ${v.to}28 100%)` },
    radial: { background: `radial-gradient(ellipse at 30% 50%, ${v.from}20 0%, transparent 65%)` },
    grid:  { backgroundImage: `linear-gradient(${v.from}16 1px, transparent 1px), linear-gradient(90deg, ${v.from}16 1px, transparent 1px)`, backgroundSize: '22px 22px' },
    ghost: { position: 'absolute', width: 80, height: 80, color: v.from, opacity: 0.05 },
    pill:  { background: `linear-gradient(135deg, ${v.from}, ${v.to})`, boxShadow: `0 4px 20px ${v.from}55` },
    Icon:  v.icon,
  };
}

// All gradient strings computed once at module load — zero work per render
const RAW_CAT: Record<string, Visual> = {
  General:             { from: '#3b82f6', to: '#6366f1', icon: Terminal },
  Sales:               { from: '#10b981', to: '#059669', icon: TrendingUp },
  Marketing:           { from: '#8b5cf6', to: '#7c3aed', icon: Megaphone },
  'Content Creation':  { from: '#ec4899', to: '#db2777', icon: PenLine },
  SEO:                 { from: '#f97316', to: '#ea580c', icon: Search },
  Business:            { from: '#eab308', to: '#ca8a04', icon: Briefcase },
  'Business Strategy': { from: '#f59e0b', to: '#d97706', icon: Target },
  Finance:             { from: '#14b8a6', to: '#0d9488', icon: BarChart2 },
  'Email Marketing':   { from: '#ef4444', to: '#dc2626', icon: Mail },
  'Social Media':      { from: '#0ea5e9', to: '#0284c7', icon: Share2 },
  Productivity:        { from: '#06b6d4', to: '#0891b2', icon: Zap },
  Automation:          { from: '#facc15', to: '#eab308', icon: Bot },
  'Prompt Engineering':{ from: '#f59e0b', to: '#d97706', icon: Code2 },
  Image:               { from: '#a78bfa', to: '#7c3aed', icon: Layers },
  Education:           { from: '#34d399', to: '#059669', icon: BookOpen },
  Technology:          { from: '#60a5fa', to: '#3b82f6', icon: Cpu },
  AI:                  { from: '#818cf8', to: '#6366f1', icon: Brain },
  Web:                 { from: '#38bdf8', to: '#0ea5e9', icon: Globe },
  Community:           { from: '#fb923c', to: '#f97316', icon: Users },
  Writing:             { from: '#e879f9', to: '#d946ef', icon: PenLine },
  Coding:              { from: '#4ade80', to: '#22c55e', icon: Code2 },
  Research:            { from: '#60a5fa', to: '#3b82f6', icon: Brain },
  Analysis:            { from: '#34d399', to: '#10b981', icon: BarChart2 },
  Video:               { from: '#4ade80', to: '#22c55e', icon: Video },
  'Customer Service':  { from: '#fb923c', to: '#f97316', icon: Users },
  HR:                  { from: '#a78bfa', to: '#7c3aed', icon: Users },
  Legal:               { from: '#94a3b8', to: '#64748b', icon: Briefcase },
  Healthcare:          { from: '#34d399', to: '#10b981', icon: Brain },
  'Real Estate':       { from: '#fbbf24', to: '#f59e0b', icon: Globe },
};

const RAW_TYPE: Record<ContentType, Visual> = {
  prompt:       { from: '#60a5fa', to: '#6366f1', icon: Terminal },
  image_prompt: { from: '#a78bfa', to: '#7c3aed', icon: Layers },
  video:        { from: '#4ade80', to: '#22c55e', icon: Video },
  guide:        { from: '#fb923c', to: '#f97316', icon: GraduationCap },
  custom_gpt:   { from: '#f472b6', to: '#ec4899', icon: Cpu },
  automation:   { from: '#facc15', to: '#eab308', icon: Zap },
  claude_skill: { from: '#22d3ee', to: '#06b6d4', icon: Bot },
};

const FALLBACK_STYLES = buildStyles({ from: '#6366f1', to: '#4f46e5', icon: Brain });
const CAT_STYLES: Record<string, ComputedStyles> = Object.fromEntries(Object.entries(RAW_CAT).map(([k, v]) => [k, buildStyles(v)]));
const TYPE_STYLES: Record<string, ComputedStyles> = Object.fromEntries(Object.entries(RAW_TYPE).map(([k, v]) => [k, buildStyles(v)]));

function getStyles(category: string, type: ContentType): ComputedStyles {
  return CAT_STYLES[category] ?? TYPE_STYLES[type] ?? FALLBACK_STYLES;
}

const CATEGORY_COLORS: Record<string, string> = {
  General:             'bg-blue-500/15 text-blue-400',
  Sales:               'bg-green-500/15 text-green-400',
  Marketing:           'bg-purple-500/15 text-purple-400',
  'Content Creation':  'bg-pink-500/15 text-pink-400',
  SEO:                 'bg-orange-500/15 text-orange-400',
  Business:            'bg-yellow-500/15 text-yellow-400',
  'Business Strategy': 'bg-yellow-500/15 text-yellow-400',
  Finance:             'bg-emerald-500/15 text-emerald-400',
  'Email Marketing':   'bg-red-500/15 text-red-400',
  'Social Media':      'bg-sky-500/15 text-sky-400',
  Productivity:        'bg-teal-500/15 text-teal-400',
  Automation:          'bg-cyan-500/15 text-cyan-400',
  'Prompt Engineering':'bg-amber-500/15 text-amber-400',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-violet-500/15 text-violet-400';
}

function CardVisual({ category, type, thumbnail }: { category: string; type: ContentType; thumbnail?: string }) {
  if (thumbnail?.startsWith('http')) {
    return (
      <div className="w-full h-28 overflow-hidden bg-secondary/40">
        <img
          src={thumbnail}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const p = (e.currentTarget as HTMLImageElement).parentElement;
            if (p) p.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // All style objects are pre-computed at module load — no string work at render time
  const s = getStyles(category, type);
  const { Icon } = s;

  return (
    <div className="w-full h-28 relative flex items-center justify-center overflow-hidden" style={s.outer}>
      <div className="absolute inset-0" style={s.radial} />
      <div className="absolute inset-0" style={s.grid} />
      <Icon style={s.ghost} />
      <div className="relative flex items-center justify-center h-11 w-11 rounded-xl transition-transform duration-300 group-hover:scale-110" style={s.pill}>
        <Icon style={{ width: 20, height: 20, color: '#fff' }} />
      </div>
    </div>
  );
}

export function ContentCard({
  id, type, title, description, category, is_premium,
  is_featured, copyText, thumbnail, onClick, badge,
}: ContentCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  return (
    <div
      onClick={onClick}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 240px' }}
      className={cn(
        'group relative flex flex-col rounded-xl border border-border/40 bg-card/60 overflow-hidden',
        'hover:border-primary/30 hover:bg-card/90 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.08)] transition-all duration-200',
        onClick && 'cursor-pointer',
      )}
    >
      {/* Visual header */}
      <div className="relative shrink-0">
        <CardVisual category={category} type={type} thumbnail={thumbnail} />
        {/* Badges over visual */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {is_premium && (
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-primary px-2 py-0.5 rounded-full leading-none">
              <Lock style={{ width: 9, height: 9 }} /> PRO
            </span>
          )}
          {is_featured && !is_premium && (
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-accent px-2 py-0.5 rounded-full leading-none">
              <Star style={{ width: 9, height: 9 }} /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3.5 flex-1">
        <span className={cn('self-start text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none', getCategoryColor(category))}>
          {badge ?? category}
        </span>
        <h3 className="font-semibold text-[13px] text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3.5 pb-3 border-t border-white/[0.04] pt-2.5">
        {copyText ? <CopyButton text={copyText} /> : <span />}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({ id, type, title, description, category });
          }}
          className={cn(
            'h-7 w-7 p-0 rounded-full transition-all',
            favorited ? 'text-red-400 hover:text-red-500' : 'text-muted-foreground hover:text-red-400',
          )}
        >
          <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
        </Button>
      </div>
    </div>
  );
}
