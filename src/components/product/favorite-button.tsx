"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

interface FavoriteButtonProps {
  productId?: string;
  productName?: string;
  size?: "sm" | "md";
  className?: string;
}

const emptySubscribe = () => () => {};

export function FavoriteButton({
  productId,
  productName = "Produto",
  size = "md",
  className,
}: FavoriteButtonProps) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isFavoritedInStore = useFavoritesStore((state) =>
    productId ? state.favoriteIds.includes(productId) : false
  );
  const toggleStoreFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const isFavorited = isHydrated && isFavoritedInStore;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      toast.info(`${productName} adicionado aos favoritos.`);
      return;
    }

    const nowFavorited = toggleStoreFavorite(productId);

    if (nowFavorited) {
      toast.success(`${productName} salvo nos favoritos!`, {
        description: "Item sincronizado na sua lista de desejos salva.",
      });
    } else {
      toast.info(`${productName} removido dos favoritos.`);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={isFavorited ? `Remover ${productName} dos favoritos` : `Adicionar ${productName} aos favoritos`}
      aria-pressed={isFavorited}
      className={cn(
        "rounded-full p-2 bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-rose-600 hover:bg-white shadow-xs transition-all border border-zinc-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500 active:scale-90",
        isFavorited && "text-rose-600 bg-white border-rose-200 shadow-rose-100",
        size === "sm" ? "p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center" : "p-2 min-w-[38px] min-h-[38px] flex items-center justify-center",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          isFavorited && "fill-rose-500 text-rose-500"
        )}
      />
    </button>
  );
}
