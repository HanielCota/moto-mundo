"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  Package,
  Plus,
  Store,
  Truck,
  Wallet,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { formatBRL } from "@/lib/format";
import {
  buildSellerDashboard,
  DELIVERY_ROUTE_LABEL,
  formatStoreAddress,
  SHIPMENT_STATUS_LABEL,
  STOCK_PLACE_LABEL,
  type DeliveryRoute,
  type ProductLocation,
  type StockPlace,
} from "@/lib/seller-dashboard";
import { cn } from "@/lib/utils";

const PLACE_CLASS: Record<StockPlace, string> = {
  balcao: "bg-emerald-50 text-emerald-800",
  deposito: "bg-sky-50 text-sky-800",
  em_rota: "bg-orange-50 text-orange-800",
  aguardando_retirada: "bg-amber-50 text-amber-800",
  esgotado: "bg-zinc-100 text-zinc-500",
};

const ROUTE_CLASS: Record<DeliveryRoute, string> = {
  expressa: "bg-orange-600 text-white",
  economica: "bg-zinc-900 text-white",
  retirada: "bg-emerald-700 text-white",
};

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1).replace(".", ",")}%`;
}

function stockSummary(location: ProductLocation): string {
  const parts: string[] = [];
  if (location.unitsAtStore > 0) {
    parts.push(`${location.unitsAtStore} no balcão`);
  }
  if (location.unitsInWarehouse > 0) {
    parts.push(`${location.unitsInWarehouse} no depósito`);
  }
  if (location.unitsInTransit > 0) {
    parts.push(`${location.unitsInTransit} em rota`);
  }
  if (location.unitsPickup > 0) {
    parts.push(`${location.unitsPickup} p/ retirada`);
  }
  return parts.join(" · ") || "Sem unidades";
}

export function DashboardOverview() {
  const { products: sellerProducts, isHydrated } = useSellerCatalog();
  const dashboard = useMemo(
    () =>
      buildSellerDashboard(PRODUCTS, isHydrated ? sellerProducts : []),
    [isHydrated, sellerProducts]
  );

  const maxMonth = Math.max(...dashboard.monthlySeries.map((item) => item.value), 1);
  const maxRoute = Math.max(...dashboard.routeMix.map((item) => item.count), 1);
  const maxStore = Math.max(...dashboard.storeRevenue.map((item) => item.revenue), 1);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Números de demonstração · agosto/2026 e rotas abertas agora
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Faturamento (ago)"
          value={formatBRL(dashboard.monthRevenue)}
          hint={
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-bold",
                dashboard.monthGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {dashboard.monthGrowth >= 0 ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {formatPercent(dashboard.monthGrowth)} vs jul
            </span>
          }
        />
        <KpiCard
          label="Setembro (4 dias)"
          value={formatBRL(dashboard.septemberRevenue)}
          hint="Parcial do mês"
        />
        <KpiCard
          label="Pedidos no mês"
          value={String(dashboard.orders)}
          hint={`Ticket médio ${formatBRL(dashboard.averageTicket)}`}
        />
        <KpiCard
          label="Valor em rota"
          value={formatBRL(dashboard.inTransitValue)}
          hint={`${dashboard.pickupOpen} retirada${dashboard.pickupOpen === 1 ? "" : "s"} no balcão`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <section className="lg:col-span-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-black text-zinc-950">Faturamento nos últimos meses</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Agosto fechado. Setembro ainda em aberto.
          </p>
          <div className="mt-5 flex items-end gap-2 h-32">
            {dashboard.monthlySeries.map((item) => {
              const height = Math.max(8, Math.round((item.value / maxMonth) * 100));
              const isCurrent = item.label === "Set";
              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full"
                >
                  <span className="text-[10px] font-bold text-zinc-500 tabular-nums">
                    {formatCompact(item.value)}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-md",
                      isCurrent ? "bg-zinc-300" : "bg-orange-500"
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-black text-zinc-950">Rotas em andamento</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Mix dos despachos abertos agora.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {dashboard.routeMix.map((item) => (
              <li key={item.route}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-800">
                    {DELIVERY_ROUTE_LABEL[item.route]}
                  </span>
                  <span className="text-zinc-500">
                    {item.count} · {formatBRL(item.value)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      item.route === "expressa"
                        ? "bg-orange-500"
                        : item.route === "retirada"
                          ? "bg-emerald-600"
                          : "bg-zinc-800"
                    )}
                    style={{ width: `${Math.round((item.count / maxRoute) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-black text-zinc-950">Faturamento por loja</h2>
        <p className="text-xs text-zinc-500 mt-0.5 mb-4">
          Onde o dinheiro entrou em agosto, loja a loja.
        </p>
        <ul className="flex flex-col gap-3">
          {dashboard.storeRevenue.map((item) => (
            <li key={item.store.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="font-bold text-zinc-900 truncate">
                  {item.store.name}
                  <span className="font-medium text-zinc-400 ml-1.5">
                    {item.store.city}/{item.store.state}
                  </span>
                </span>
                <span className="font-black text-zinc-950 tabular-nums shrink-0">
                  {formatBRL(item.revenue)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{
                    width: `${Math.round((item.revenue / maxStore) * 100)}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100">
          <h2 className="text-sm font-black text-zinc-950">Onde está cada produto</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Estoque físico no endereço da loja, depósito, rota ou fila de retirada.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="px-4 py-2 font-bold">Produto</th>
                <th className="px-4 py-2 font-bold">Onde está</th>
                <th className="px-4 py-2 font-bold">Unidades</th>
                <th className="px-4 py-2 font-bold">Rota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {dashboard.locations.map((location) => (
                <tr key={location.product.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative size-11 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <Image
                          src={location.product.images[0] || "/placeholder.jpg"}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-950 leading-snug line-clamp-2">
                          {location.product.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {location.product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex h-5 items-center px-2 rounded-full text-[10px] font-bold",
                        PLACE_CLASS[location.place]
                      )}
                    >
                      {STOCK_PLACE_LABEL[location.place]}
                    </span>
                    <p className="text-[11px] text-zinc-600 mt-1.5 leading-snug max-w-[240px]">
                      {location.store ? (
                        <>
                          <span className="font-bold text-zinc-800">
                            {location.store.name}
                          </span>
                          <br />
                          {formatStoreAddress(location.store)}
                        </>
                      ) : (
                        "Loja não identificada"
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 leading-relaxed whitespace-nowrap">
                    {stockSummary(location)}
                  </td>
                  <td className="px-4 py-3">
                    {location.route ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "inline-flex w-fit h-5 items-center px-2 rounded-full text-[10px] font-bold",
                            ROUTE_CLASS[location.route]
                          )}
                        >
                          {DELIVERY_ROUTE_LABEL[location.route]}
                        </span>
                        {location.destination ? (
                          <span className="text-[11px] text-zinc-500">
                            → {location.destination}
                          </span>
                        ) : location.route === "retirada" ? (
                          <span className="text-[11px] text-zinc-500">
                            Cliente busca no local
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-400">
                        Sem despacho agora
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center gap-2">
          <Truck className="size-4 text-orange-600" />
          <div>
            <h2 className="text-sm font-black text-zinc-950">Rotas de entrega abertas</h2>
            <p className="text-xs text-zinc-500">
              Origem na loja física, destino do piloto e prazo estimado.
            </p>
          </div>
        </div>
        <ul className="divide-y divide-zinc-100">
          {dashboard.shipments.map((shipment) => (
            <li
              key={shipment.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
            >
              <div className="relative size-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                <Image
                  src={shipment.product.images[0] || "/placeholder.jpg"}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-zinc-950 truncate">
                  {shipment.product.name}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5 flex items-start gap-1">
                  <MapPin className="size-3 mt-0.5 shrink-0 text-zinc-400" />
                  <span>
                    Sai de <strong className="text-zinc-700">{shipment.origin}</strong>
                    {" → "}
                    {shipment.destination}
                  </span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {shipment.units} un. · {formatBRL(shipment.value)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "inline-flex h-5 items-center px-2 rounded-full text-[10px] font-bold",
                    ROUTE_CLASS[shipment.route]
                  )}
                >
                  {DELIVERY_ROUTE_LABEL[shipment.route]}
                </span>
                <span className="inline-flex h-5 items-center px-2 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600">
                  {SHIPMENT_STATUS_LABEL[shipment.status]}
                </span>
                <span className="text-[11px] font-bold text-zinc-700">
                  {shipment.eta}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-black text-zinc-950">Como cadastrar</h2>
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">1</span>
            <p className="font-bold text-zinc-950 mt-1">Dados do item</p>
            <p className="text-xs text-zinc-500 mt-1">
              Nome, marca, categoria e a loja física que está vendendo.
            </p>
          </li>
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">2</span>
            <p className="font-bold text-zinc-950 mt-1">Preço e estoque</p>
            <p className="text-xs text-zinc-500 mt-1">
              Valor de venda, promoção, quantidade no balcão e frete.
            </p>
          </li>
          <li className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
            <span className="text-[11px] font-black text-orange-600">3</span>
            <p className="font-bold text-zinc-950 mt-1">Foto e medidas</p>
            <p className="text-xs text-zinc-500 mt-1">
              Fotos, tamanhos, cores e ficha técnica. Publica na vitrine.
            </p>
          </li>
        </ol>
        <Link
          href="/painel/produtos/novo"
          className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold"
        >
          <Plus className="size-4" />
          Cadastrar produto
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <Package className="size-4 text-orange-600" />
        Produtos cadastrados entram no catálogo e na página da loja.
        <Wallet className="size-4 ml-1 text-zinc-400" />
        <Store className="size-4 text-zinc-400" />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-zinc-200 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-black text-zinc-950 mt-1 tabular-nums leading-tight">
        {value}
      </p>
      <p className="text-[11px] text-zinc-500 mt-1">{hint}</p>
    </div>
  );
}

function formatCompact(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)} mil`;
  }
  return formatBRL(value);
}
