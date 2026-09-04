"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { Product, Store } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { formatBRL, calculateInstallments } from "@/lib/format";
import { toast } from "sonner";

interface MobileStickyBuyProps {
  product: Product;
  store: Store;
}

export function MobileStickyBuy({ product, store }: MobileStickyBuyProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        storeId: product.storeId,
        storeName: store.name,
        unitPrice: product.price,
        stock: product.stock,
        freeShipping: product.freeShipping,
      },
      1
    );

    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const result = addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        storeId: product.storeId,
        storeName: store.name,
        unitPrice: product.price,
        stock: product.stock,
        freeShipping: product.freeShipping,
      },
      1
    );

    if (result.success) {
      toast.success(result.message, {
        description: `1x ${product.name} adicionado ao carrinho.`,
        action: {
          label: "Ver Carrinho",
          onClick: () => router.push("/carrinho"),
        },
      });
    } else {
      toast.error(result.message);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black text-zinc-950 leading-tight truncate">
              {formatBRL(product.price)}
            </div>
            <div className="text-[10px] text-zinc-500 truncate">
              ou {calculateInstallments(product.price).formatted}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 active:scale-95 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="min-h-[44px] px-4 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
