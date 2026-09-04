import Image from "next/image";
import { Store } from "@/types";
import { RatingStars } from "@/components/shared/rating-stars";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";
import {
  MapPin,
  Calendar,
  CheckCircle,
  Package,
  Star,
  Truck,
} from "lucide-react";

interface StoreFrontProps {
  store: Store;
  productCount: number;
  soldCount: number;
}

export function StoreFront({ store, productCount, soldCount }: StoreFrontProps) {
  return (
    <div>
      <div className="relative h-44 sm:h-56 lg:h-72 w-full bg-zinc-950 overflow-hidden">
        <Image
          src={store.banner}
          alt={`Banner ${store.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {store.pickupAvailable ? (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-sm">
            <CheckCircle className="size-3.5" />
            Retirada no local
          </span>
        ) : null}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-14 sm:-mt-16 bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <div className="relative size-20 sm:size-24 rounded-2xl border-4 border-white shadow-md bg-zinc-100 overflow-hidden shrink-0 -mt-12 sm:-mt-14">
              <Image
                src={store.logo}
                alt={`Logo ${store.name}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                  {store.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle className="size-3" />
                  Loja verificada
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
                <RatingStars
                  rating={store.rating}
                  ratingCount={store.ratingCount}
                  size="sm"
                />
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5 text-zinc-400" />
                  {store.address ? `${store.address} — ` : ""}
                  {store.neighborhood ? `${store.neighborhood}, ` : ""}
                  {store.city}/{store.state}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5 text-zinc-400" />
                  {store.activeYears} anos de atividade
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-3xl">
                {store.description}
              </p>

              {store.specialties && store.specialties.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {store.specialties.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              {store.whatsapp ? (
                <a
                  href={store.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp da loja
                </a>
              ) : null}
              {store.instagram ? (
                <a
                  href={store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 hover:border-pink-300 hover:text-pink-600"
                >
                  <InstagramIcon className="size-4 text-pink-500" />
                  Instagram
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat
              icon={Package}
              label="Produtos"
              value={String(productCount)}
            />
            <Stat
              icon={Star}
              label="Avaliações"
              value={store.rating.toFixed(1)}
              hint={`${store.ratingCount} notas`}
            />
            <Stat
              icon={Truck}
              label="Pedidos"
              value={soldCount.toLocaleString("pt-BR")}
              hint="unidades vendidas"
            />
            <Stat
              icon={MapPin}
              label="Origem"
              value={`${store.city}/${store.state}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-3 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        <Icon className="size-3.5 text-orange-600" />
        {label}
      </div>
      <p className="mt-1 text-sm font-black text-zinc-950 truncate">{value}</p>
      {hint ? <p className="text-[11px] text-zinc-400">{hint}</p> : null}
    </div>
  );
}
