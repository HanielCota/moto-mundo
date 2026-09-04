"use client";

import { useMemo, useState } from "react";
import { Category, Product, Store } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { StoreProcess } from "@/components/store/store-process";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { MapPin, Package, RotateCcw, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

type StoreTab = "produtos" | "sobre" | "processo";

interface StoreCatalogProps {
  store: Store;
  products: Product[];
  categories: Category[];
}

export function StoreCatalog({ store, products, categories }: StoreCatalogProps) {
  const [tab, setTab] = useState<StoreTab>("produtos");
  const [categorySlug, setCategorySlug] = useState("");
  const { products: sellerProducts } = useSellerCatalog();

  const catalog = useMemo(() => {
    const extras = sellerProducts.filter((item) => item.storeId === store.id);
    const seen = new Set(products.map((item) => item.id));
    return [...products, ...extras.filter((item) => !seen.has(item.id))];
  }, [products, sellerProducts, store.id]);

  const visibleProducts = useMemo(() => {
    if (!categorySlug) return catalog;
    const category = categories.find((item) => item.slug === categorySlug);
    if (!category) return catalog;
    return catalog.filter((product) => product.categoryId === category.id);
  }, [catalog, categories, categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        {(
          [
            { id: "produtos", label: "Estoque da loja" },
            { id: "processo", label: "Como funciona" },
            { id: "sobre", label: "A loja física" },
          ] as const
        ).map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "h-10 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer",
                isActive
                  ? "bg-zinc-950 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "produtos" ? (
        <div className="flex flex-col gap-6">
          {categories.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategorySlug("")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer",
                  !categorySlug
                    ? "bg-zinc-950 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                Todos
              </button>
              {categories.map((category) => {
                const isSelected = categorySlug === category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setCategorySlug(isSelected ? "" : category.slug)
                    }
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer",
                      isSelected
                        ? "bg-orange-600 text-white"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    )}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                Estoque de {store.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1
                  ? "item neste balcão"
                  : "itens neste balcão"}
                {" · "}sai da loja em {store.city}/{store.state}
              </p>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-zinc-200">
              <Package className="size-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-800">
                Nenhum produto nesta categoria
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Esta loja ainda não cadastrou itens nesse departamento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : tab === "processo" ? (
        <div className="flex flex-col gap-6">
          <StoreProcess />
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="text-sm font-bold text-orange-950">
              Na prática, com {store.name}
            </p>
            <p className="text-sm text-orange-900/80 mt-1.5 leading-relaxed">
              O piloto escolhe um item desta página, paga no Moto Mundo e a{" "}
              {store.name} separa no estoque de {store.city}/{store.state}.
              {store.pickupAvailable
                ? " Se estiver na cidade, retira no balcão. Se não, a loja despacha."
                : " A loja despacha para o endereço do pedido."}{" "}
              Dúvida de medida ou peça? WhatsApp direto com a loja.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <h2 className="text-lg font-black text-zinc-950 tracking-tight">
              A loja física
            </h2>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              {store.description}
            </p>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              {store.name} é uma loja de verdade, com {store.activeYears} anos
              de balcão. No Moto Mundo ela não vira “marketplace anônimo”: o
              pedido continua sendo da loja, com o estoque, o WhatsApp e a
              retirada dela.
            </p>
          </article>

          <div className="flex flex-col gap-4">
            <article className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                <MapPin className="size-3.5 text-orange-600" />
                Endereço
              </div>
              <p className="text-sm font-bold text-zinc-950">
                {store.address ? (
                  <>
                    {store.address}
                    <br />
                  </>
                ) : null}
                {store.neighborhood ? `${store.neighborhood} — ` : ""}
                {store.city}/{store.state}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {store.pickupAvailable
                  ? "Retirada no balcão depois do pagamento no site."
                  : "Esta loja envia para todo o Brasil. Sem retirada local."}
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                <Truck className="size-3.5 text-orange-600" />
                Envios
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {store.shippingPolicy}
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                <RotateCcw className="size-3.5 text-orange-600" />
                Trocas
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {store.returnPolicy}
              </p>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
