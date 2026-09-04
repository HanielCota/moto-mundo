"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Flame, Sparkles, Trophy, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsShowcaseProps {
  deals: Product[];
  featured: Product[];
  allProducts: Product[];
}

type TabType = "deals" | "featured" | "bestsellers" | "freeshipping";

export function ProductsShowcase({
  deals,
  featured,
  allProducts,
}: ProductsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabType>("deals");

  const bestsellers = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 8);
  }, [allProducts]);

  const freeShippingProducts = useMemo(() => {
    return allProducts.filter((p) => p.freeShipping && p.stock > 0).slice(0, 8);
  }, [allProducts]);

  const activeProducts = useMemo(() => {
    switch (activeTab) {
      case "deals":
        return deals.slice(0, 8);
      case "featured":
        return featured.slice(0, 8);
      case "bestsellers":
        return bestsellers;
      case "freeshipping":
        return freeShippingProducts;
      default:
        return featured.slice(0, 8);
    }
  }, [activeTab, deals, featured, bestsellers, freeShippingProducts]);

  const tabs = [
    {
      id: "deals" as TabType,
      label: "Ofertas da Semana",
      icon: Flame,
      badge: `${deals.length}`,
    },
    {
      id: "featured" as TabType,
      label: "Destaques",
      icon: Sparkles,
    },
    {
      id: "bestsellers" as TabType,
      label: "Mais Vendidos",
      icon: Trophy,
    },
    {
      id: "freeshipping" as TabType,
      label: "Frete Grátis",
      icon: Truck,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Clean Single-Line Filter */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mb-8 pb-5 border-b border-zinc-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[11px] font-bold tracking-wider uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              Catálogo Especializado
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
              Equipamentos & Peças em Destaque
            </h2>
            <p className="text-sm text-zinc-500 mt-1.5 max-w-xl leading-relaxed">
              Peças de motor, suspensão, pneus e proteções com envio direto das lojas oficiais.
            </p>
          </div>

          {/* Clean Segmented Tab Filter - Single line, never wraps */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100/90 rounded-xl border border-zinc-200/80 overflow-x-auto scrollbar-none flex-nowrap shrink-0 shadow-xs max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer select-none",
                    isActive
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-white/70"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      isActive ? "text-orange-400" : "text-zinc-400"
                    )}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none",
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 text-orange-700"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Explorer Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/70">
          <p className="text-xs text-zinc-500">
            Mostrando {activeProducts.length} itens selecionados de alta performance.
          </p>

          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-orange-600 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-xs group"
          >
            <span>Ver catálogo completo ({allProducts.length} produtos)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
