import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { FavoriteItem, ContentType } from '@/data/types';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, 'savedAt'>) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const storageKey = user ? `apm_favorites_${user.id}` : null;

  useEffect(() => {
    if (storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [storageKey]);

  const persist = (items: FavoriteItem[]) => {
    setFavorites(items);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const addFavorite = (item: Omit<FavoriteItem, 'savedAt'>) => {
    persist([...favorites, { ...item, savedAt: new Date().toISOString() }]);
  };

  const removeFavorite = (id: string) => {
    persist(favorites.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (item: Omit<FavoriteItem, 'savedAt'>) => {
    if (isFavorite(item.id)) removeFavorite(item.id);
    else addFavorite(item);
  };

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
