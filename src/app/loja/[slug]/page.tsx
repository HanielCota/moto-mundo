import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getStoreBySlug,
  getProductsByStore,
  getAllCategories,
  getAllStores,
} from "@/lib/products";
import { StoreFront } from "@/components/store/store-front";
import { StoreCatalog } from "@/components/store/store-catalog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

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

  const categoryIds = new Set(storeProducts.map((product) => product.categoryId));
  const soldCategories = allCategories.filter((category) =>
    categoryIds.has(category.id)
  );
  const soldCount = storeProducts.reduce(
    (total, product) => total + product.soldCount,
    0
  );

  return (
    <div className="min-h-screen bg-zinc-50/70 pb-16">
      <StoreFront
        store={store}
        productCount={storeProducts.length}
        soldCount={soldCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Lojas", href: "/lojas" },
            { label: store.name },
          ]}
        />
      </div>

      <StoreCatalog
        store={store}
        products={storeProducts}
        categories={soldCategories}
      />
    </div>
  );
}
