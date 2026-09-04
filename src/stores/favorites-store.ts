import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => boolean;
  isFavorited: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (productId: string) => {
        const { favoriteIds } = get();
        const exists = favoriteIds.includes(productId);

        if (exists) {
          set({
            favoriteIds: favoriteIds.filter((id) => id !== productId),
          });
          return false;
        } else {
          set({
            favoriteIds: [...favoriteIds, productId],
          });
          return true;
        }
      },

      isFavorited: (productId: string) => {
        return get().favoriteIds.includes(productId);
      },

      removeFavorite: (productId: string) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        }));
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: "moto-mundo-favorites-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
