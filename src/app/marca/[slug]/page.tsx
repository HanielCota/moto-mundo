import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getAllBrands,
  getBrandBySlug,
  getProductsByBrand,
} from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BadgeCheck, Globe, Package } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Marca não encontrada" };
  }

  return {
    title: `${brand.name} | Marca Oficial`,
    description: brand.description,
    openGraph: {
      title: `${brand.name} | Moto Mundo`,
      description: brand.description,
      images: [{ url: brand.banner }],
      locale: "pt_BR",
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(brand.slug);
  const isOem = brand.kind === "oem";

  return (
    <div className="min-h-screen bg-sand pb-16">
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-zinc-950 overflow-hidden">
        <Image
          src={brand.banner}
          alt={`Banner ${brand.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative size-20 sm:size-24 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden shrink-0">
                <Image
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {brand.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="size-3" />
                    {isOem ? "Marca oficial de fábrica" : "Marca homologada"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Globe className="size-3.5 text-zinc-400" />
                    {brand.origin}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="size-3.5 text-zinc-400" />
                    {products.length} {products.length === 1 ? "produto" : "produtos"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {brand.instagram ? (
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:border-pink-300 hover:text-pink-600"
                >
                  <InstagramIcon className="size-3.5 text-pink-500" />
                  Instagram
                </a>
              ) : null}
              {brand.whatsapp ? (
                <a
                  href={brand.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  <WhatsAppIcon className="size-3.5 text-emerald-500" />
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-6 text-sm text-zinc-600 leading-relaxed max-w-4xl pt-4 border-t border-zinc-100">
            {brand.description}
          </p>

          {isOem ? (
            <p className="mt-3 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
              {brand.name} não é lojista no marketplace. É a marca oficial: peças genuínas
              e itens que a fábrica disponibiliza no Moto Mundo.
            </p>
          ) : null}
        </div>

        <div className="mt-4">
          <Breadcrumbs
            items={[
              { label: "Marcas", href: "/marcas" },
              { label: brand.name },
            ]}
          />
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Produtos {brand.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Vendidos por lojas parceiras homologadas
              </p>
            </div>
            <Link
              href={`/produtos?marca=${brand.slug}`}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Filtrar no catálogo
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-zinc-200">
              <p className="text-zinc-500 text-sm">
                O catálogo oficial desta marca ainda está sendo publicado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
