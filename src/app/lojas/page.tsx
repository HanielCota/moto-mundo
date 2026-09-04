import type { Metadata } from "next";
import { getAllStores } from "@/lib/products";
import { StoreCard } from "@/components/store/store-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Store as StoreIcon, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Lojas Parceiras",
  description:
    "Conheça as lojas, preparadoras e importadoras de peças off-road parceiras oficiais do Moto Mundo.",
};

export default async function LojasPage() {
  const stores = await getAllStores();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Lojas Parceiras" }]} />

      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
          <StoreIcon className="w-4 h-4" />
          Rede Credenciada
        </div>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
          Lojas e Oficinas Especializadas
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl mt-1">
          Compre com segurança diretamente dos maiores estoques e preparadores de motocross, velocross e trilha do Brasil.
        </p>
      </div>

      {/* Grid of Stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      {/* Safety info footer */}
      <div className="mt-12 p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900">
            Todas as lojas são homologadas e auditadas
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Garantimos envio seguro, produtos 100% autênticos e suporte centralizado Moto Mundo para qualquer problema de entrega.
          </p>
        </div>
      </div>
    </div>
  );
}
