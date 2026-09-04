"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters, FilterState } from "@/components/product/product-filters";
import {
  searchProductsSync,
  getCategoryBySlugSync,
  getStoreBySlugSync,
  getBrandBySlugSync,
} from "@/lib/products";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { CATEGORIES } from "@/data/categories";
import { SlidersHorizontal, PackageX, Sparkles, X, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { products: sellerProducts } = useSellerCatalog();

  // Parse filters from URL
  const filters: FilterState = useMemo(() => {
    return {
      q: searchParams.get("q") || "",
      categoria: searchParams.get("categoria") || "",
      loja: searchParams.get("loja") || "",
      marca: searchParams.get("marca") || "",
      tamanho: searchParams.get("tamanho") || "",
      departamento: searchParams.get("departamento") || "",
      cor: searchParams.get("cor") || "",
      precoMin: searchParams.get("precoMin") || "",
      precoMax: searchParams.get("precoMax") || "",
      disponivel: searchParams.get("disponivel") === "true",
      ordem: searchParams.get("ordem") || "relevantes",
    };
  }, [searchParams]);

  // Execute filtering
  const filteredProducts = useMemo(() => {
    return searchProductsSync(
      {
        q: filters.q,
        categoria: filters.categoria,
        loja: filters.loja,
        marca: filters.marca,
        tamanho: filters.tamanho,
        departamento: filters.departamento,
        cor: filters.cor,
        precoMin: filters.precoMin,
        precoMax: filters.precoMax,
        disponivel: filters.disponivel,
        ordem: filters.ordem,
      },
      sellerProducts
    );
  }, [filters, sellerProducts]);

  // Synchronize state with URL
  const updateUrl = (updated: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updated).forEach(([key, val]) => {
      if (val === undefined || val === "" || val === false) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `/produtos?${queryString}` : "/produtos", { scroll: false });
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.push("/produtos", { scroll: false });
    });
  };

  const activeCategory = filters.categoria ? getCategoryBySlugSync(filters.categoria) : null;
  const activeStore = filters.loja ? getStoreBySlugSync(filters.loja) : null;
  const activeBrand = filters.marca ? getBrandBySlugSync(filters.marca) : null;
  const hasActiveFilters = Boolean(
    filters.q ||
    filters.categoria ||
    filters.loja ||
    filters.marca ||
    filters.tamanho ||
    filters.departamento ||
    filters.cor ||
    filters.precoMin ||
    filters.precoMax ||
    filters.disponivel
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar: Search feedback & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {isPending ? (
              "Atualizando resultados..."
            ) : (
              <>
                Mostrando{" "}
                <span className="font-semibold text-zinc-900">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
                {filters.q && (
                  <span>
                    {" "}
                    para &quot;<strong className="text-zinc-900">{filters.q}</strong>&quot;
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Sheet Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-xs">
                <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                <span>Filtros</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-orange-600" />
                )}
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-xs p-6 overflow-y-auto bg-white">
                <SheetHeader className="pb-4 mb-4 border-b border-zinc-200">
                  <SheetTitle className="text-base font-bold text-zinc-950">
                    Filtros de Busca
                  </SheetTitle>
                </SheetHeader>
                <ProductFilters
                  filters={filters}
                  onFilterChange={updateUrl}
                  onReset={handleResetFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="ordem-select" className="text-xs font-medium text-zinc-600 hidden sm:inline">
              Ordenar por:
            </label>
            <select
              id="ordem-select"
              value={filters.ordem}
              onChange={(e) => updateUrl({ ordem: e.target.value })}
              className="h-10 px-3 pr-8 rounded-lg bg-white border border-zinc-300 text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            >
              <option value="relevantes">Mais Relevantes</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
              <option value="mais-vendidos">Mais Vendidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-4 -mt-2">
        <button
          type="button"
          onClick={() => updateUrl({ categoria: "" })}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer",
            !filters.categoria
              ? "bg-zinc-950 text-white shadow-xs"
              : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
          )}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => {
          const isSelected = filters.categoria === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateUrl({ categoria: isSelected ? "" : cat.slug })}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer",
                isSelected
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
            Filtros ativos:
          </span>

          {filters.q && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              Busca: &ldquo;{filters.q}&rdquo;
              <button
                type="button"
                onClick={() => updateUrl({ q: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-800">
              Categoria: {activeCategory.name}
              <button
                type="button"
                onClick={() => updateUrl({ categoria: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de categoria"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeBrand && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-900">
              Marca: {activeBrand.name}
              <button
                type="button"
                onClick={() => updateUrl({ marca: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de marca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.departamento && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 capitalize">
              Depto: {filters.departamento}
              <button
                type="button"
                onClick={() => updateUrl({ departamento: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de departamento"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.tamanho && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              Tam: {filters.tamanho}
              <button
                type="button"
                onClick={() => updateUrl({ tamanho: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de tamanho"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.cor && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              Cor: {filters.cor}
              <button
                type="button"
                onClick={() => updateUrl({ cor: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de cor"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {activeStore && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              Loja: {activeStore.name}
              <button
                type="button"
                onClick={() => updateUrl({ loja: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de loja"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {(filters.precoMin || filters.precoMax) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
              Preço: R$ {filters.precoMin || "0"} - R$ {filters.precoMax || "∞"}
              <button
                type="button"
                onClick={() => updateUrl({ precoMin: "", precoMax: "" })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de preço"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.disponivel && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              Em estoque
              <button
                type="button"
                onClick={() => updateUrl({ disponivel: false })}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remover filtro de estoque"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Limpar todos
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
            <ProductFilters
              filters={filters}
              onFilterChange={updateUrl}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Product Grid or Empty State */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-zinc-200 shadow-xs my-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">
                Nenhum produto encontrado
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mb-6 leading-relaxed">
                Não encontramos produtos para os filtros selecionados. Experimente buscar termos comuns ou limpar os filtros para ver todo o catálogo.
              </p>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="text-xs text-zinc-400">Sugestões de marcas:</span>
                {["Yamaha", "Honda", "Alpinestars", "Motul", "Pirelli", "Bell"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => updateUrl({ q: term, categoria: "", loja: "", marca: "", tamanho: "", departamento: "", cor: "", precoMin: "", precoMax: "" })}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>


              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-orange-600 text-white font-semibold text-xs tracking-wide transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
