import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getStoreBySlug,
  getProductsByStore,
  getAllCategories,
  getAllStores,
} from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { RatingStars } from "@/components/shared/rating-stars";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  MapPin,
  Calendar,
  Truck,
  RotateCcw,
  CheckCircle,
  Tag,
} from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stores = await getAllStores();
  return stores.map((store) => ({
    slug: store.slug,
  }));
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return {
      title: "Loja não encontrada",
    };
  }

  return {
    title: `${store.name} | Loja Oficial Moto Mundo`,
    description: store.description,
    openGraph: {
      title: `${store.name} | Moto Mundo`,
      description: store.description,
      images: [{ url: store.banner }],
      locale: "pt_BR",
    },
  };
}

export default async function StoreProfilePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const [storeProducts, allCategories] = await Promise.all([
    getProductsByStore(store.id),
    getAllCategories(),
  ]);

  // Determine unique categories sold by this store
  const categoryIds = Array.from(new Set(storeProducts.map((p) => p.categoryId)));
  const soldCategories = allCategories.filter((c) => categoryIds.includes(c.id));

  return (
    <div className="min-h-screen bg-sand pb-16">
      {/* Store Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full bg-zinc-950 overflow-hidden">
        <Image
          src={store.banner}
          alt={`Banner ${store.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
      </div>

      {/* Main Store Header Profile Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden shrink-0">
                <Image
                  src={store.logo}
                  alt={`Logo ${store.name}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {store.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verificada
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-zinc-500">
                  <RatingStars
                    rating={store.rating}
                    ratingCount={store.ratingCount}
                    size="sm"
                  />
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {store.city}/{store.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {store.activeYears} anos de atividade no mercado
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch sm:items-end gap-2">
              {store.pickupAvailable && (
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">
                      Retirada Balcão Disponível
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Retire em {store.city}/{store.state} em até 1 dia útil
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {store.instagram ? (
                  <a
                    href={store.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 text-[11px] font-bold text-zinc-700 hover:text-pink-600 hover:border-pink-300"
                  >
                    <InstagramIcon className="size-3.5 text-pink-500" />
                    Instagram
                  </a>
                ) : null}
                {store.whatsapp ? (
                  <a
                    href={store.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                  >
                    <WhatsAppIcon className="size-3.5 text-emerald-500" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-zinc-600 leading-relaxed max-w-4xl pt-4 border-t border-zinc-100">
            {store.description}
          </p>

          {/* Categorias vendidas pela loja */}
          {soldCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                Departamentos:
              </span>
              {soldCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}&loja=${store.slug}`}
                  className="text-xs font-medium text-zinc-700 hover:text-orange-600 bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-full transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Breadcrumbs */}
        <div className="mt-4">
          <Breadcrumbs
            items={[
              { label: "Lojas", href: "/lojas" },
              { label: store.name },
            ]}
          />
        </div>

        {/* Store Policies section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1">
                Política de Envios & Prazos
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {store.shippingPolicy}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1">
                Política de Trocas & Devoluções
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {store.returnPolicy}
              </p>
            </div>
          </div>
        </div>

        {/* Store Products */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
                Produtos de {store.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {storeProducts.length} itens disponíveis para pronta entrega
              </p>
            </div>
          </div>

          {storeProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-zinc-200">
              <p className="text-zinc-500 text-sm">Nenhum produto cadastrado no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
