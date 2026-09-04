"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { STORES } from "@/data/stores";
import { BRANDS } from "@/data/brands";
import { MAIN_COLORS } from "@/data/colors";
import { RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  q: string;
  categoria: string;
  loja: string;
  marca: string;
  tamanho: string;
  departamento: string;
  cor: string;
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

const AVAILABLE_SIZES = ["P", "M", "G", "GG", "38", "39", "40", "41", "42", "43", "44", "1L"];

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
}: ProductFiltersProps) {
  const [prevPrecoMin, setPrevPrecoMin] = useState(filters.precoMin);
  const [prevPrecoMax, setPrevPrecoMax] = useState(filters.precoMax);
  const [minPriceInput, setMinPriceInput] = useState(filters.precoMin);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.precoMax);

  // Adjust state during render when props change (idiomatic React without useEffect)
  if (filters.precoMin !== prevPrecoMin || filters.precoMax !== prevPrecoMax) {
    setPrevPrecoMin(filters.precoMin);
    setPrevPrecoMax(filters.precoMax);
    setMinPriceInput(filters.precoMin || "");
    setMaxPriceInput(filters.precoMax || "");
  }

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMin = minPriceInput ? String(Math.max(0, Number(minPriceInput))) : "";
    const cleanMax = maxPriceInput ? String(Math.max(0, Number(maxPriceInput))) : "";
    onFilterChange({
      precoMin: cleanMin,
      precoMax: cleanMax,
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
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Limpar tudo
        </button>
      </div>

      {/* Marcas (Brands) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Marcas
          </h4>
          {filters.marca && (
            <button
              type="button"
              onClick={() => onFilterChange({ marca: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ marca: "" })}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              !filters.marca
                ? "bg-zinc-900 text-white font-semibold"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Todas as marcas
          </button>
          {BRANDS.map((b) => {
            const isSelected = filters.marca === b.slug || filters.marca === b.name.toLowerCase();
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onFilterChange({ marca: isSelected ? "" : b.slug })}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <span>{b.name}</span>
                {isSelected && <Check className="w-3 h-3 text-orange-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Departamento (Masculino / Feminino) */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Departamento
          </h4>
          {filters.departamento && (
            <button
              type="button"
              onClick={() => onFilterChange({ departamento: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 rounded-lg">
          {[
            { label: "Todos", value: "" },
            { label: "Masculino", value: "masculino" },
            { label: "Feminino", value: "feminino" },
          ].map((item) => {
            const isSelected = filters.departamento === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onFilterChange({ departamento: item.value })}
                className={cn(
                  "py-1.5 text-center text-xs font-semibold rounded-md transition-all cursor-pointer",
                  isSelected
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tamanhos (M, G, 40, 39, etc.) */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Tamanhos
          </h4>
          {filters.tamanho && (
            <button
              type="button"
              onClick={() => onFilterChange({ tamanho: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.tamanho.toLowerCase() === size.toLowerCase();
            return (
              <button
                key={size}
                type="button"
                onClick={() => onFilterChange({ tamanho: isSelected ? "" : size })}
                className={cn(
                  "h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border cursor-pointer",
                  isSelected
                    ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cores (As 7 principais) */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Cores
          </h4>
          {filters.cor && (
            <button
              type="button"
              onClick={() => onFilterChange({ cor: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MAIN_COLORS.map((c) => {
            const isSelected =
              filters.cor.toLowerCase() === c.slug ||
              filters.cor.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onFilterChange({ cor: isSelected ? "" : c.name })}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-xs font-semibold"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                <span
                  className={cn(
                    "w-3.5 h-3.5 rounded-full shrink-0",
                    c.border && "border border-zinc-300"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="truncate">{c.name}</span>
                {isSelected && <Check className="w-3 h-3 text-orange-400 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2.5 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Categorias
          </h4>
          {filters.categoria && (
            <button
              type="button"
              onClick={() => onFilterChange({ categoria: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ categoria: "" })}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">
            Lojas Parceiras
          </h4>
          {filters.loja && (
            <button
              type="button"
              onClick={() => onFilterChange({ loja: "" })}
              className="text-[11px] text-orange-600 hover:underline font-medium cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange({ loja: "" })}
            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
            className="w-full h-8 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Aplicar preço
          </button>
        </form>
      </div>

      {/* Availability Filter */}
      <div className="pt-4 border-t border-zinc-200">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-700 font-medium select-none">
          <input
            type="checkbox"
            checked={filters.disponivel}
            onChange={(e) => onFilterChange({ disponivel: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
          />
          <span>Somente produtos em estoque</span>
        </label>
      </div>
    </aside>
  );
}
