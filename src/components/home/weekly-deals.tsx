import Link from "next/link";
import { getWeeklyDeals } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { Flame, ArrowRight } from "lucide-react";

export async function WeeklyDeals() {
  const deals = await getWeeklyDeals(6);

  return (
    <section className="py-12 md:py-16 bg-sand border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-white" />
              Tempo Limitado
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Ofertas da Semana
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Descontos imperdíveis com estoque reduzido das nossas lojas parceiras.
            </p>
          </div>

          <Link
            href="/produtos?ordem=menor-preco"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Ver todas as ofertas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
