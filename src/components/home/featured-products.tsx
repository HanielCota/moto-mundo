import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight, Sparkles } from "lucide-react";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="py-12 md:py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <Sparkles className="w-4 h-4" />
              Seleção Premium
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Produtos em Destaque
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Os equipamentos mais recomendados por pilotos profissionais e oficinas especializadas.
            </p>
          </div>

          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Explorar todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
          >
            Ver todos os produtos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
