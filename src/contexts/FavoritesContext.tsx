import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { FavoriteItem, ContentType } from '@/data/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

// localStorage key per user (kept as fast local cache)
const lsKey = (uid: string) => `apm_favorites_${uid}`;

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load favorites — try Supabase first, fall back to localStorage
  useEffect(() => {
    if (!user) { setFavorites([]); setLoaded(false); return; }

    const fromLS = (): FavoriteItem[] => {
      try { return JSON.parse(localStorage.getItem(lsKey(user.id)) ?? '[]'); }
      catch { return []; }
    };

    const load = async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id, item_type, title, description, category, saved_at')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error || !data) {
        // Supabase failed — use localStorage cache
        setFavorites(fromLS());
      } else if (data.length === 0) {
        // First time — migrate any localStorage data to Supabase
        const cached = fromLS();
        if (cached.length > 0) {
          const rows = cached.map(f => ({
            user_id: user.id,
            item_id: f.id,
            item_type: f.type,
            title: f.title,
            description: f.description,
            category: f.category,
            saved_at: f.savedAt,
          }));
          await supabase.from('user_favorites').insert(rows);
        }
        setFavorites(cached);
      } else {
        const items: FavoriteItem[] = data.map(r => ({
          id: r.item_id,
          type: r.item_type as ContentType,
          title: r.title,
          description: r.description,
          category: r.category,
          savedAt: r.saved_at,
        }));
        setFavorites(items);
        // Keep localStorage in sync as cache
        localStorage.setItem(lsKey(user.id), JSON.stringify(items));
      }
      setLoaded(true);
    };

    load();
  }, [user?.id]);

  const syncLS = useCallback((items: FavoriteItem[]) => {
    if (user) localStorage.setItem(lsKey(user.id), JSON.stringify(items));
  }, [user?.id]);

  const addFavorite = useCallback(async (item: Omit<FavoriteItem, 'savedAt'>) => {
    if (!user) return;
    const savedAt = new Date().toISOString();
    const newItem: FavoriteItem = { ...item, savedAt };
    const next = [newItem, ...favorites];
    setFavorites(next);
    syncLS(next);
    await supabase.from('user_favorites').insert({
      user_id: user.id,
      item_id: item.id,
      item_type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      saved_at: savedAt,
    });
  }, [user, favorites, syncLS]);

  const removeFavorite = useCallback(async (id: string) => {
    if (!user) return;
    const next = favorites.filter(f => f.id !== id);
    setFavorites(next);
    syncLS(next);
    await supabase.from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', id);
  }, [user, favorites, syncLS]);

  const isFavorite = useCallback((id: string) =>
    favorites.some(f => f.id === id), [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    if (isFavorite(item.id)) removeFavorite(item.id);
    else addFavorite(item);
  }, [isFavorite, addFavorite, removeFavorite]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider');
  return ctx;
}
