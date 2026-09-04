import { Product } from "@/types";
import { getRelatedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";

interface RelatedProductsProps {
  product: Product;
}

export async function RelatedProducts({ product }: RelatedProductsProps) {
  const related = await getRelatedProducts(product, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-12 border-t border-zinc-200">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
          Complete seu equipamento
        </span>
        <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
          Produtos Relacionados
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
