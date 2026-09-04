"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/stores/cart-store";

const emptySubscribe = () => () => {};

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotals = useCartStore((state) => state.getTotals);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return {
    items: isHydrated ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotals,
    getItemCount,
    itemCount: isHydrated ? items.reduce((sum, item) => sum + item.quantity, 0) : 0,
    isHydrated,
  };
}
