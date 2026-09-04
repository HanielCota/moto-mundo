"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { formatBRL } from "@/lib/format";
import { getStoreByIdSync, getCategoryByIdSync } from "@/lib/products";
import {
  formatStoreAddress,
  locateProduct,
  STOCK_PLACE_LABEL,
} from "@/lib/seller-dashboard";
import { Pencil, Plus, Trash2, Package, MapPin } from "lucide-react";

export function ProductList() {
  const { products, isHydrated, removeProduct } = useSellerCatalog();

  if (!isHydrated) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
        Carregando produtos...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
        <Package className="size-8 text-zinc-300 mx-auto mb-3" />
        <h2 className="text-lg font-black text-zinc-950">Nenhum produto cadastrado</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-5">
          Sobe o primeiro item do balcão: nome, preço, estoque e foto.
        </p>
        <Link
          href="/painel/produtos/novo"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold"
        >
          <Plus className="size-4" />
          Cadastrar produto
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          <strong className="text-zinc-950">{products.length}</strong>{" "}
          {products.length === 1 ? "produto" : "produtos"} no painel
        </p>
        <Link
          href="/painel/produtos/novo"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-zinc-950 text-white text-xs font-bold"
        >
          <Plus className="size-3.5" />
          Novo
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <ul className="divide-y divide-zinc-100">
          {products.map((product) => {
            const store = getStoreByIdSync(product.storeId);
            const category = getCategoryByIdSync(product.categoryId);
            const location = locateProduct(product);
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 p-3 sm:p-4"
              >
                <div className="relative size-14 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-950 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {store?.name} · {category?.name} · {product.brand}
                  </p>
                  {store ? (
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                      <MapPin className="size-3 shrink-0 text-zinc-400" />
                      {STOCK_PLACE_LABEL[location.place]} · {formatStoreAddress(store)}
                    </p>
                  ) : null}
                  <p className="text-xs font-bold text-orange-600 mt-0.5">
                    {formatBRL(product.price)} · {product.stock} un.
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/painel/produtos/${product.id}`}
                    className="size-9 rounded-lg border border-zinc-200 inline-flex items-center justify-center text-zinc-600 hover:text-orange-600"
                    aria-label="Editar"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      removeProduct(product.id);
                      toast.success("Produto removido do painel.");
                    }}
                    className="size-9 rounded-lg border border-zinc-200 inline-flex items-center justify-center text-zinc-600 hover:text-rose-600 cursor-pointer"
                    aria-label="Excluir"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
