import type { Metadata } from "next";
import Link from "next/link";
import { getAllStores } from "@/lib/products";
import { StoreCard } from "@/components/store/store-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { StoreProcess } from "@/components/store/store-process";
import { ShieldCheck, Store as StoreIcon, Truck, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Lojas Parceiras",
  description:
    "Conheça as lojas, preparadoras e importadoras de peças off-road parceiras oficiais do Moto Mundo.",
};

export default async function LojasPage() {
  const stores = await getAllStores();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: "Lojas Parceiras" }]} />

      <div className="mb-8 pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
          <StoreIcon className="size-4" />
          Aba das lojas
        </div>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
          Lojas parceiras oficiais
        </h1>
        <p className="text-sm text-zinc-600 max-w-2xl mt-1">
          Essas lojas já existem de verdade. O Moto Mundo só coloca o balcão
          delas no site: estoque da loja, WhatsApp da loja, retirada no local.
        </p>
      </div>

      <div className="mb-8">
        <StoreProcess />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-start gap-3">
          <BadgeCheck className="size-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-zinc-950">Loja verificada</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Homologada pelo Moto Mundo antes de vender.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-start gap-3">
          <Truck className="size-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-zinc-950">Envio pela loja</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Quem anuncia é quem despacha e dá suporte.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-zinc-200 p-4 flex items-start gap-3">
          <ShieldCheck className="size-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-zinc-950">Compra protegida</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Pagamento e troca com cobertura da plataforma.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black tracking-tight">
            Quer sua loja nesta vitrine?
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Oficinas, importadoras e casas de peças entram como lojistas — com
            página própria, produtos e contato direto.
          </p>
        </div>
        <Link
          href="/painel/produtos/novo"
          className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-sm font-bold shrink-0"
        >
          Abrir painel de cadastro
        </Link>
      </div>
    </div>
  );
}
