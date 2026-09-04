"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import { formatBRL } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { BadgeFreeShipping } from "@/components/shared/badge-free-shipping";
import { QuantitySelector } from "@/components/shared/quantity-selector";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const itemTotal = item.unitPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-zinc-100 last:border-0">
      {/* Thumbnail + Details */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/produto/${item.slug}`}
            className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-orange-600 transition-colors line-clamp-2"
          >
            {item.name}
          </Link>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500 font-medium">
              {formatBRL(item.unitPrice)} un.
            </span>
            {item.freeShipping && <BadgeFreeShipping size="sm" />}
          </div>
        </div>
      </div>

      {/* Quantity & Item Subtotal & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
        {/* Quantity Controls (clamped 1..stock) */}
        <QuantitySelector
          value={item.quantity}
          min={1}
          max={item.stock}
          onChange={(qty) => updateQuantity(item.productId, qty)}
          size="sm"
          ariaLabel={`Quantidade de ${item.name}`}
        />

        {/* Item Total */}
        <div className="text-right min-w-[90px]">
          <span className="text-sm font-bold text-zinc-950 block">
            {formatBRL(itemTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          aria-label={`Remover ${item.name} do carrinho`}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
