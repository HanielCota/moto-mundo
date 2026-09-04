import Image from "next/image";
import Link from "next/link";
import { Store } from "@/types";
import { RatingStars } from "@/components/shared/rating-stars";
import { MapPin, Calendar, Store as StoreIcon, ArrowRight, CheckCircle } from "lucide-react";
import { getProductsByStoreSync } from "@/lib/products";

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const storeProducts = getProductsByStoreSync(store.id);

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
      {/* Banner */}
      <div className="relative h-28 w-full bg-zinc-900 overflow-hidden">
        <Image
          src={store.banner}
          alt={`Banner ${store.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {store.pickupAvailable && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
            <CheckCircle className="w-3 h-3" />
            Retirada no local
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pt-0 flex-1 flex flex-col justify-between">
        <div>
          {/* Logo overlapping banner */}
          <div className="relative -mt-8 mb-3 flex items-end justify-between">
            <div className="relative w-16 h-16 rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden">
              <Image
                src={store.logo}
                alt={`Logo ${store.name}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <RatingStars
              rating={store.rating}
              ratingCount={store.ratingCount}
              size="sm"
            />
          </div>

          <h3 className="text-lg font-bold text-zinc-950 group-hover:text-orange-600 transition-colors">
            <Link href={`/loja/${store.slug}`}>{store.name}</Link>
          </h3>

          <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">
            {store.description}
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {store.city}/{store.state}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {store.activeYears} anos de atividade
            </span>
            <span className="flex items-center gap-1 font-medium text-zinc-700">
              <StoreIcon className="w-3.5 h-3.5 text-orange-600" />
              {storeProducts.length} produtos
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3">
          <Link
            href={`/loja/${store.slug}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
          >
            Visitar loja
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
