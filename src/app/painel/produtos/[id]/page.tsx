"use client";

import { use } from "react";
import Link from "next/link";
import { ProductForm } from "@/components/painel/product-form";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";

export default function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, isHydrated } = useSellerCatalog();
  const product = products.find((item) => item.id === id);

  if (!isHydrated) {
    return (
      <p className="text-sm text-zinc-500">Carregando produto...</p>
    );
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        <p className="font-bold text-zinc-950">Produto não encontrado</p>
        <Link
          href="/painel/produtos"
          className="inline-flex mt-4 text-sm font-bold text-orange-600"
        >
          Voltar à lista
        </Link>
      </div>
    );
  }

  return <ProductForm product={product} />;
}
