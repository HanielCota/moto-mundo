"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, ChevronRight, X } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { normalizeSearchTerm } from "@/lib/products";
import { formatBRL } from "@/lib/format";

interface HeaderSearchProps {
  initialQuery?: string;
  className?: string;
}

export function HeaderSearch({ initialQuery = "", className }: HeaderSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim() !== "") {
      router.push(`/produtos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/produtos");
    }
  };

  // Live matching products (up to 3) when typing - memoized and accent-insensitive
  const liveResults = useMemo(() => {
    const trimmed = normalizeSearchTerm(query);
    if (trimmed.length < 2) return [];

    return PRODUCTS.filter((p) => {
      const nameMatch = normalizeSearchTerm(p.name).includes(trimmed);
      const descMatch = normalizeSearchTerm(p.description).includes(trimmed);
      return nameMatch || descMatch;
    }).slice(0, 3);
  }, [query]);

  const popularTerms = ["Capacete Pro Carbon", "Bota Trilha", "Escapamento", "Pneu Borracha"];

  return (
    <div ref={containerRef} className={className || "relative w-full max-w-lg"}>
      <form onSubmit={handleSearch} role="search" className="relative w-full">
        <div className="relative flex items-center w-full">
          <label htmlFor="header-search-input" className="sr-only">
            Buscar no Moto Mundo
          </label>
          <input
            id="header-search-input"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar capacetes, botas, escapamentos, guidões..."
            autoComplete="off"
            className="w-full h-10 pl-10 pr-20 rounded-lg bg-zinc-100/90 border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-14 text-zinc-400 hover:text-zinc-600 p-1"
              aria-label="Limpar campo de busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Executar busca"
            className="absolute right-1.5 h-7 px-2.5 rounded-md bg-zinc-900 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Smart Search Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150 divide-y divide-zinc-100">
          {/* Live Matching Products */}
          {liveResults.length > 0 && (
            <div className="p-3">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Produtos correspondentes
              </div>
              <div className="space-y-1">
                {liveResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                      <Image
                        src={product.images[0] || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-zinc-900 truncate group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </div>
                      <div className="text-xs font-semibold text-orange-600">
                        {formatBRL(product.price)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories Navigation */}
          <div className="p-3 bg-zinc-50/50">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-2">
              Categorias Populares
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-medium text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-all shadow-2xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Search Suggestions */}
          <div className="p-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 mb-1.5">
              Termos mais buscados
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {popularTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    router.push(`/produtos?q=${encodeURIComponent(term)}`);
                    setIsOpen(false);
                  }}
                  className="text-left text-xs text-zinc-600 hover:text-orange-600 hover:bg-orange-50/60 p-1.5 rounded transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3 h-3 text-zinc-400" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
