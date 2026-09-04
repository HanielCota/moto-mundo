"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { itemCount, isHydrated } = useCart();

  return (
    <Link
      href="/carrinho"
      className={cn(
        "relative p-2.5 rounded-lg text-zinc-700 hover:text-orange-600 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500",
        className
      )}
      aria-label={`Carrinho de compras, ${isHydrated ? itemCount : 0} itens`}
    >
      <ShoppingCart className="w-6 h-6" />
      {isHydrated && itemCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-orange-600 text-white text-xs font-bold ring-2 ring-white animate-in zoom-in-50">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
