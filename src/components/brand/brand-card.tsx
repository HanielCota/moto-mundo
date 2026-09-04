import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types";
import { ArrowRight, BadgeCheck, Globe, Package } from "lucide-react";
import { getProductsByBrandSync } from "@/lib/products";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const productCount = getProductsByBrandSync(brand.slug).length;
  const isOem = brand.kind === "oem";

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
      <div className="relative h-28 w-full bg-zinc-900 overflow-hidden">
        <Image
          src={brand.banner}
          alt={`Banner ${brand.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {brand.official ? (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-600/95 text-white px-2 py-0.5 rounded-full shadow-xs">
            <BadgeCheck className="size-3" />
            {isOem ? "Marca oficial" : "Marca homologada"}
          </span>
        ) : null}
      </div>

      <div className="p-5 pt-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="relative -mt-8 mb-3 flex items-end justify-between">
            <div className="relative size-16 rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden">
              <Image
                src={brand.logo}
                alt={`Logo ${brand.name}`}
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {isOem ? "Fábrica / OEM" : "Marca especialista"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-zinc-950 group-hover:text-orange-600 transition-colors">
            <Link href={`/marca/${brand.slug}`}>{brand.name}</Link>
          </h3>

          <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">
            {brand.description}
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Globe className="size-3.5 text-zinc-400" />
              {brand.origin}
            </span>
            <span className="flex items-center gap-1 font-medium text-zinc-700">
              <Package className="size-3.5 text-orange-600" />
              {productCount} {productCount === 1 ? "produto" : "produtos"}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3 flex flex-col gap-2">
          <Link
            href={`/marca/${brand.slug}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
          >
            Ver produtos da marca
            <ArrowRight className="size-3.5" />
          </Link>
          {(brand.instagram || brand.whatsapp) && (
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold">
              {brand.instagram ? (
                <a
                  href={brand.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-pink-600"
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
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-emerald-600"
                >
                  <WhatsAppIcon className="size-3.5 text-emerald-500" />
                  WhatsApp
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
