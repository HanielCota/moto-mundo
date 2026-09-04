"use client";

import { useCart } from "@/hooks/use-cart";
import { groupCartByStore, calculateCartTotals } from "@/lib/cart";
import { CartEmpty } from "@/components/cart/cart-empty";
import { CartStoreGroup } from "@/components/cart/cart-store-group";
import { CartSummary } from "@/components/cart/cart-summary";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, isHydrated, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 rounded w-48" />
          <div className="h-64 bg-zinc-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={[{ label: "Carrinho de Compras" }]} />
        <CartEmpty />
      </div>
    );
  }

  const storeGroups = groupCartByStore(items);
  const totals = calculateCartTotals(items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Carrinho de Compras" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-orange-600" />
            Carrinho de Compras
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Seus itens estão agrupados por loja para cálculo transparente de frete e envio.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-rose-600 self-start sm:self-auto transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Limpar carrinho
        </button>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Store Groups (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {storeGroups.map((group) => (
            <CartStoreGroup key={group.storeId} group={group} />
          ))}
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <CartSummary totals={totals} isEmpty={items.length === 0} />
        </div>
      </div>
    </div>
  );
}
