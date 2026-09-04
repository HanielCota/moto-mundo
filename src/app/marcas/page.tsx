import type { Metadata } from "next";
import { getAllBrands } from "@/lib/products";
import { BrandCard } from "@/components/brand/brand-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Marcas Oficiais",
  description:
    "Yamaha, Honda e marcas especialistas de motocross, trilha e enduro no Moto Mundo.",
};

export default async function MarcasPage() {
  const brands = await getAllBrands();
  const oemBrands = brands.filter((brand) => brand.kind === "oem");
  const specialistBrands = brands.filter((brand) => brand.kind === "specialist");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Marcas" }]} />

      <div className="mb-8 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
          <BadgeCheck className="size-4" />
          Catálogo de marcas
        </div>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
          Marcas oficiais e especialistas
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl mt-1">
          Yamaha e Honda entram como marcas — não como lojistas. Elas disponibilizam
          peças genuínas no site, junto das marcas generalistas de proteção, pneu e motor.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-black text-zinc-950 mb-4">Marcas de fábrica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {oemBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black text-zinc-950 mb-4">Marcas especialistas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialistBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
}
