import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getStoreById,
  getCategoryById,
  getAllProducts,
} from "@/lib/products";
import { ProductDetail } from "@/components/product/product-detail";
import { SellerProductFallback } from "@/components/product/seller-product-fallback";

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
      title: "Produto",
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
    return <SellerProductFallback slug={slug} />;
  }

  const [store, category] = await Promise.all([
    getStoreById(product.storeId),
    getCategoryById(product.categoryId),
  ]);

  if (!store) {
    notFound();
  }

  return (
    <ProductDetail product={product} store={store} category={category} />
  );
}
