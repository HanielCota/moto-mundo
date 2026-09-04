"use client";

import Link from "next/link";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { formatBRL } from "@/lib/format";
import { Package, Plus, Warehouse } from "lucide-react";

export default function PainelPage() {
  const { products, isHydrated } = useSellerCatalog();
  const outOfStock = products.filter((item) => item.stock <= 0).length;
  const totalValue = products.reduce(
    (sum, item) => sum + item.price * item.stock,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Produtos
          </p>
          <p className="text-2xl font-black text-zinc-950 mt-1">
            {isHydrated ? products.length : "—"}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Sem estoque
          </p>
          <p className="text-2xl font-black text-zinc-950 mt-1">
            {isHydrated ? outOfStock : "—"}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-zinc-200 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Valor em estoque
          </p>
          <p className="text-2xl font-black text-zinc-950 mt-1">
            {isHydrated ? formatBRL(totalValue) : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-lg font-black text-zinc-950">Como cadastrar</h2>
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">1</span>
            <p className="font-bold text-zinc-950 mt-1">Dados do item</p>
            <p className="text-xs text-zinc-500 mt-1">
              Nome, marca, categoria e a loja física que está vendendo.
            </p>
          </li>
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">2</span>
            <p className="font-bold text-zinc-950 mt-1">Preço e estoque</p>
            <p className="text-xs text-zinc-500 mt-1">
              Valor de venda, promoção, quantidade no balcão e frete.
            </p>
          </li>
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">3</span>
            <p className="font-bold text-zinc-950 mt-1">Foto e medidas</p>
            <p className="text-xs text-zinc-500 mt-1">
              Fotos, tamanhos, cores e ficha técnica. Publica na vitrine.
            </p>
          </li>
        </ol>
        <Link
          href="/painel/produtos/novo"
          className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold"
        >
          <Plus className="size-4" />
          Cadastrar produto
        </Link>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Package className="size-4 text-orange-600" />
        Os produtos cadastrados aqui aparecem no catálogo e na página da loja.
        <Warehouse className="size-4 ml-2 text-zinc-400" />
      </div>
    </div>
  );
}
