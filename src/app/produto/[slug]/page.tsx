import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getProductBySlug,
  getStoreById,
  getCategoryById,
  getAllProducts,
} from "@/lib/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductSpecs } from "@/components/product/product-specs";
import { ShippingCalculator } from "@/components/product/shipping-calculator";
import { RelatedProducts } from "@/components/product/related-products";
import { MobileStickyBuy } from "@/components/product/mobile-sticky-buy";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceTag } from "@/components/shared/price-tag";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ShieldCheck, ArrowRight, MapPin } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: `${product.name} | Moto Mundo`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Moto Mundo`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      locale: "pt_BR",
      type: "article",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [store, category] = await Promise.all([
    getStoreById(product.storeId),
    getCategoryById(product.categoryId),
  ]);

  if (!store) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Produtos", href: "/produtos" },
          ...(category
            ? [{ label: category.name, href: `/produtos?categoria=${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-2">
        {/* Left: Product Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery
            productId={product.id}
            images={product.images}
            productName={product.name}
            freeShipping={product.freeShipping}
            stock={product.stock}
          />
        </div>

        {/* Right: Product Details & Purchase Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Store reference, Category & Brand */}
          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              {product.brand && (
                <Link
                  href={`/produtos?marca=${product.brandSlug || product.brand.toLowerCase()}`}
                  className="font-bold text-zinc-900 bg-zinc-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider transition-colors"
                >
                  {product.brand}
                </Link>
              )}
              {category && (
                <Link
                  href={`/produtos?categoria=${category.slug}`}
                  className="font-bold text-orange-600 uppercase tracking-wider text-[11px] hover:underline"
                >
                  {category.name}
                </Link>
              )}
            </div>
            <span className="text-zinc-400">Cód: {product.id}</span>
          </div>


          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Ratings & Sold Count */}
          <div className="flex items-center gap-4 text-xs">
            <RatingStars
              rating={product.rating}
              ratingCount={product.ratingCount}
              size="md"
            />
            <span className="text-zinc-300">|</span>
            <span className="text-zinc-500 font-medium">
              <strong className="text-zinc-800">{product.soldCount}</strong> vendidos
            </span>
          </div>

          {/* Price & Installments */}
          <div className="bg-zinc-50/80 p-4 rounded-xl border border-zinc-200">
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              size="xl"
            />
          </div>

          {/* Product Actions (Quantity + Add To Cart + Buy Now) */}
          <ProductActions product={product} store={store} />

          {/* Shipping Calculator */}
          <div className="pt-2">
            <ShippingCalculator
              freeShipping={product.freeShipping}
              pickupAvailable={store.pickupAvailable}
            />
          </div>

          {/* Store Info Card */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg border border-zinc-200 overflow-hidden shrink-0">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900">
                    {store.name}
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {store.city}/{store.state} • {store.activeYears} anos de atividade
                </p>
              </div>
            </div>
            <Link
              href={`/loja/${store.slug}`}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
            >
              Ver loja
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="mt-14 pt-10 border-t border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Description (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
            Descrição do Produto
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Garantia Moto Mundo</strong>
              Todos os produtos vendidos são originais, acompanham nota fiscal e contam com cobertura de devolução facilitada em até 7 dias corridos.
            </div>
          </div>
        </div>

        {/* Technical Specs (5 cols) */}
        <div className="lg:col-span-5">
          <ProductSpecs specs={product.specs} />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <RelatedProducts product={product} />
      </div>

      {/* Mobile Sticky Action Bar */}
      <MobileStickyBuy product={product} store={store} />
    </div>
  );
}
