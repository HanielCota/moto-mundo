import { StoreCartGroup } from "@/types";
import { CartItemRow } from "./cart-item-row";
import { formatBRL } from "@/lib/format";
import { Store as StoreIcon, Truck } from "lucide-react";

interface CartStoreGroupProps {
  group: StoreCartGroup;
}

export function CartStoreGroup({ group }: CartStoreGroupProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
      {/* Store Header */}
      <div className="bg-zinc-50/90 px-5 py-3 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StoreIcon className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Loja:
          </span>
          <span className="text-sm font-bold text-zinc-900">
            {group.storeName}
          </span>
        </div>

        {/* Shipping badge per store */}
        <div className="flex items-center gap-2 text-xs">
          <Truck className="w-3.5 h-3.5 text-zinc-400" />
          {group.allFreeShipping ? (
            <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Frete Grátis nesta loja
            </span>
          ) : (
            <span className="text-zinc-600">
              Frete Econômico padrão:{" "}
              <strong className="text-zinc-900">{formatBRL(group.shippingCost)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="p-5 divide-y divide-zinc-100">
        {group.items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>

      {/* Store Subtotal Footer */}
      <div className="bg-zinc-50/50 px-5 py-3 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          Subtotal dos itens de <strong>{group.storeName}</strong>:
        </span>
        <span className="font-bold text-sm text-zinc-900">
          {formatBRL(group.subtotal)}
        </span>
      </div>
    </div>
  );
}
