"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartTotals } from "@/types";
import { formatBRL, calculateInstallments } from "@/lib/format";
import { ArrowRight, ShieldCheck, ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  totals: CartTotals;
  isEmpty: boolean;
}

export function CartSummary({ totals, isEmpty }: CartSummaryProps) {
  const router = useRouter();
  const installments = calculateInstallments(totals.total);

  const handleCheckout = () => {
    if (isEmpty || totals.itemsCount === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-5 sticky top-28">
      <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider border-b border-zinc-200 pb-3">
        Resumo do Pedido
      </h2>

      <div className="space-y-3 text-xs text-zinc-600">
        <div className="flex justify-between items-center">
          <span>
            Subtotal ({totals.itemsCount} {totals.itemsCount === 1 ? "item" : "itens"}):
          </span>
          <span className="font-semibold text-zinc-900 text-sm">
            {formatBRL(totals.subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Frete estimado (lojas):</span>
          <span className="font-semibold text-zinc-900 text-sm">
            {totals.shippingTotal === 0 ? (
              <strong className="text-emerald-700">Grátis</strong>
            ) : (
              formatBRL(totals.shippingTotal)
            )}
          </span>
        </div>

        {totals.discountTotal > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span>Descontos:</span>
            <span className="font-semibold">
              -{formatBRL(totals.discountTotal)}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-zinc-950">Total:</span>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-zinc-950 block">
              {formatBRL(totals.total)}
            </span>
            {totals.total > 0 && (
              <span className="text-[11px] text-zinc-500 font-medium">
                ou até {installments.count}x de {formatBRL(installments.value)} sem juros
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isEmpty || totals.itemsCount === 0}
          className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
            isEmpty || totals.itemsCount === 0
              ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Finalizar Compra
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href="/produtos"
          className="w-full h-10 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center justify-center transition-colors"
        >
          Continuar comprando
        </Link>
      </div>

      {/* Trust reassurance */}
      <div className="pt-4 border-t border-zinc-100 flex items-center gap-3 text-zinc-500 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Ambiente seguro com criptografia e garantia de entrega.</span>
      </div>
    </div>
  );
}
