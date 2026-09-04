import Link from "next/link";
import { getAllBrands } from "@/lib/products";
import { BrandCard } from "@/components/brand/brand-card";
import { ArrowRight, BadgeCheck } from "lucide-react";

export async function BrandsShowcase() {
  const brands = await getAllBrands();
  const oemBrands = brands.filter((brand) => brand.kind === "oem");
  const specialistBrands = brands.filter((brand) => brand.kind === "specialist");

  return (
    <section className="py-12 md:py-16 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <BadgeCheck className="size-4" />
              Marcas no marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Yamaha, Honda e marcas especialistas
            </h2>
            <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
              Yamaha e Honda entram como marcas oficiais — não como lojistas. O catálogo
              próprio delas e das marcas generalistas fica disponível no site.
            </p>
          </div>

          <Link
            href="/marcas"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Ver todas as marcas ({brands.length})
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {oemBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialistBrands.slice(0, 3).map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
