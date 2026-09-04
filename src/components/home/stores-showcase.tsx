import Link from "next/link";
import { getAllStores } from "@/lib/products";
import { StoreCard } from "@/components/store/store-card";
import { ArrowRight, Store } from "lucide-react";

export async function StoresShowcase() {
  const stores = await getAllStores();

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <Store className="w-4 h-4" />
              Rede de Especialistas
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Lojas Parceiras Oficiais
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Compre direto de quem entende de preparação, importação e trilha real.
            </p>
          </div>

          <Link
            href="/lojas"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Ver todas as lojas ({stores.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.slice(0, 3).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
