"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { STORES } from "@/data/stores";
import { RotateCcw } from "lucide-react";

export interface FilterState {
  q: string;
  categoria: string;
  loja: string;
  precoMin: string;
  precoMax: string;
  disponivel: boolean;
  ordem: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
}: ProductFiltersProps) {
  const [minPriceInput, setMinPriceInput] = useState(filters.precoMin);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.precoMax);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      precoMin: minPriceInput,
      precoMax: maxPriceInput,
    });
  };

  return (
    <aside className="space-y-6 text-sm">
      {/* Header with clear filters */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <span className="font-bold text-zinc-950 uppercase tracking-wider text-xs">
          Filtros
        </span>
        <button
          type="button"
          onClick={() => {
            setMinPriceInput("");
            setMaxPriceInput("");
            onReset();
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          <RotateCcw className="w-3 h-3" />
          Limpar tudo
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
          Categorias
        </h4>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ categoria: "" })}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !filters.categoria
                ? "bg-zinc-900 text-white font-semibold"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Todas as categorias
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ categoria: cat.slug })}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filters.categoria === cat.slug
                  ? "bg-zinc-900 text-white font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lojas Parceiras */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
          Lojas Parceiras
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ loja: "" })}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !filters.loja
                ? "bg-zinc-900 text-white font-semibold"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Todas as lojas
          </button>
          {STORES.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => onFilterChange({ loja: store.slug })}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filters.loja === store.slug
                  ? "bg-zinc-900 text-white font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
          Faixa de Preço (R$)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
              min="0"
            />
            <span className="text-zinc-400 text-xs">—</span>
            <input
              type="number"
              placeholder="Máx"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full h-8 px-2.5 rounded-md bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
              min="0"
            />
          </div>
          <button
            type="submit"
            className="w-full h-8 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
          >
            Aplicar preço
          </button>
        </form>
      </div>

      {/* Availability Filter */}
      <div className="pt-4 border-t border-zinc-200">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-700 font-medium">
          <input
            type="checkbox"
            checked={filters.disponivel}
            onChange={(e) => onFilterChange({ disponivel: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
          />
          <span>Somente produtos em estoque</span>
        </label>
      </div>
    </aside>
  );
}
