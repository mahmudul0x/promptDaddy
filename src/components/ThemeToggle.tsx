import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200',
        'text-muted-foreground hover:text-foreground',
        'border border-transparent hover:border-border/50',
        'hover:bg-white/[0.06]',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
        )}
        style={{ width: 15, height: 15 }}
      />
      <Moon
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        )}
        style={{ width: 15, height: 15 }}
      />
    </button>
  );
}
