"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceTag } from "@/components/shared/price-tag";
import { BadgeFreeShipping } from "@/components/shared/badge-free-shipping";
import { StockStatus } from "@/components/shared/stock-status";
import { FavoriteButton } from "@/components/product/favorite-button";
import { getStoreByIdSync, getCategoryByIdSync } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const store = getStoreByIdSync(product.storeId);
  const category = getCategoryByIdSync(product.categoryId);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const result = addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "/placeholder.jpg",
      storeId: product.storeId,
      storeName: store?.name || "Loja Parceira",
      unitPrice: product.price,
      stock: product.stock,
      freeShipping: product.freeShipping,
    });

    if (result.success) {
      toast.success(result.message, {
        description: `${product.name} foi adicionado à sua sacola.`,
        action: {
          label: "Ver Carrinho",
          onClick: () => {
            router.push("/carrinho");
          },
        },
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between bg-white rounded-xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-md transition-all overflow-hidden",
        isOutOfStock && "opacity-90",
        className
      )}
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
          <Link href={`/produto/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
            {product.freeShipping && <BadgeFreeShipping />}
            {isOutOfStock && <StockStatus stock={0} />}
          </div>

          {/* Favorite Button */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <FavoriteButton productId={product.id} productName={product.name} size="sm" />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex flex-col gap-2">
          {/* Category & Store */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            {category && (
              <Link
                href={`/produtos?categoria=${category.slug}`}
                className="hover:text-zinc-800 transition-colors uppercase font-semibold text-[10px] tracking-wider"
              >
                {category.name}
              </Link>
            )}
            {store && (
              <Link
                href={`/loja/${store.slug}`}
                className="hover:text-orange-600 font-medium truncate max-w-[130px] transition-colors"
                title={store.name}
              >
                {store.name}
              </Link>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
            <Link href={`/produto/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Ratings */}
          <div className="mt-0.5">
            <RatingStars
              rating={product.rating}
              ratingCount={product.ratingCount}
              size="sm"
            />
          </div>

          {/* Shipping status line */}
          <div className="text-xs">
            {product.freeShipping ? (
              <span className="text-emerald-700 font-medium">Frete grátis</span>
            ) : (
              <span className="text-zinc-500">Frete a calcular</span>
            )}
          </div>

          {/* Price & Installments */}
          <div className="pt-1">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1",
            isOutOfStock
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
              : "bg-zinc-900 hover:bg-orange-600 text-white shadow-xs active:scale-[0.98]"
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? "Indisponível" : "Adicionar ao carrinho"}
        </button>
      </div>
    </article>
  );
}
