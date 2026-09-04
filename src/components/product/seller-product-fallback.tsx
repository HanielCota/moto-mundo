"use client";

import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { getStoreByIdSync, getCategoryByIdSync } from "@/lib/products";
import { ProductDetail } from "@/components/product/product-detail";
import Link from "next/link";

export function SellerProductFallback({ slug }: { slug: string }) {
  const { products, isHydrated } = useSellerCatalog();
  const product = products.find((item) => item.slug === slug);

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-zinc-500">
        Carregando produto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-zinc-950">Produto não encontrado</h1>
        <Link href="/produtos" className="inline-flex mt-4 text-sm font-bold text-orange-600">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const store = getStoreByIdSync(product.storeId);
  const category = getCategoryByIdSync(product.categoryId);

  if (!store) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-zinc-950">Loja não encontrada</h1>
      </div>
    );
  }

  return <ProductDetail product={product} store={store} category={category} />;
}
