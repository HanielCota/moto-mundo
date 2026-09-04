"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeFreeShipping } from "@/components/shared/badge-free-shipping";
import { StockStatus } from "@/components/shared/stock-status";
import { FavoriteButton } from "@/components/product/favorite-button";

interface ProductGalleryProps {
  productId?: string;
  images: string[];
  productName: string;
  freeShipping: boolean;
  stock: number;
}

export function ProductGallery({
  productId,
  images,
  productName,
  freeShipping,
  stock,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0] || "/placeholder.jpg";

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails (desktop vertical, mobile horizontal) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-zinc-100 ${
                selectedIndex === idx
                  ? "border-orange-600 shadow-xs scale-105"
                  : "border-zinc-200 hover:border-zinc-400 opacity-80"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative aspect-square flex-1 w-full bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Badges overlay */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {freeShipping && <BadgeFreeShipping size="default" />}
          {stock <= 0 && <StockStatus stock={0} />}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <FavoriteButton productId={productId} productName={productName} size="md" />
        </div>
      </div>
    </div>
  );
}
