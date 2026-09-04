import { Product, Store } from "@/types";
import { STORES } from "@/data/stores";
import { SHIPPING_RATES } from "@/lib/shipping";

export type StockPlace =
  | "balcao"
  | "deposito"
  | "em_rota"
  | "aguardando_retirada"
  | "esgotado";

export type DeliveryRoute = "economica" | "expressa" | "retirada";

export type ShipmentStatus =
  | "coletado"
  | "em_transito"
  | "saiu_para_entrega"
  | "aguardando_retirada";

export const STOCK_PLACE_LABEL: Record<StockPlace, string> = {
  balcao: "No balcão",
  deposito: "No depósito",
  em_rota: "Em rota",
  aguardando_retirada: "Aguardando retirada",
  esgotado: "Sem estoque",
};

export const DELIVERY_ROUTE_LABEL: Record<DeliveryRoute, string> = {
  economica: SHIPPING_RATES.economica.name,
  expressa: SHIPPING_RATES.expressa.name,
  retirada: SHIPPING_RATES.retirada.name,
};

export const SHIPMENT_STATUS_LABEL: Record<ShipmentStatus, string> = {
  coletado: "Coletado na loja",
  em_transito: "Em trânsito",
  saiu_para_entrega: "Saiu para entrega",
  aguardando_retirada: "Pronto para retirar",
};

const DESTINATIONS = [
  { city: "Cuiabá", state: "MT" },
  { city: "Goiânia", state: "GO" },
  { city: "Brasília", state: "DF" },
  { city: "Campo Grande", state: "MS" },
  { city: "Uberlândia", state: "MG" },
  { city: "Ribeirão Preto", state: "SP" },
  { city: "Londrina", state: "PR" },
  { city: "Rondonópolis", state: "MT" },
  { city: "Anápolis", state: "GO" },
  { city: "Itabira", state: "MG" },
  { city: "Piracicaba", state: "SP" },
  { city: "Sinop", state: "MT" },
] as const;

const ETA_BY_ROUTE: Record<DeliveryRoute, readonly string[]> = {
  economica: ["8 dias úteis", "10 dias úteis", "12 dias úteis"],
  expressa: ["amanhã", "2 dias úteis", "hoje até 18h"],
  retirada: ["hoje até 18h", "amanhã a partir das 9h", "já no balcão"],
};

const MONTH_WEIGHTS = [
  { label: "Abr", weight: 0.6 },
  { label: "Mai", weight: 0.69 },
  { label: "Jun", weight: 0.64 },
  { label: "Jul", weight: 0.83 },
  { label: "Ago", weight: 1 },
  { label: "Set", weight: 0.118 },
] as const;

export interface ProductLocation {
  product: Product;
  store: Store | undefined;
  place: StockPlace;
  unitsAtStore: number;
  unitsInWarehouse: number;
  unitsInTransit: number;
  unitsPickup: number;
  route: DeliveryRoute | null;
  destination: string | null;
}

export interface FakeShipment {
  id: string;
  product: Product;
  store: Store | undefined;
  origin: string;
  destination: string;
  route: DeliveryRoute;
  status: ShipmentStatus;
  eta: string;
  units: number;
  value: number;
}

export interface StoreRevenue {
  store: Store;
  revenue: number;
  orders: number;
}

export interface SellerDashboard {
  monthRevenue: number;
  previousMonthRevenue: number;
  monthGrowth: number;
  septemberRevenue: number;
  orders: number;
  unitsSold: number;
  averageTicket: number;
  inTransitValue: number;
  pickupOpen: number;
  monthlySeries: { label: string; value: number }[];
  routeMix: { route: DeliveryRoute; count: number; value: number }[];
  storeRevenue: StoreRevenue[];
  locations: ProductLocation[];
  shipments: FakeShipment[];
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function storeById(id: string): Store | undefined {
  return STORES.find((store) => store.id === id);
}

export function formatStoreAddress(store: Store): string {
  return [store.address, store.neighborhood, `${store.city}/${store.state}`]
    .filter(Boolean)
    .join(" · ");
}

export function formatStorePlace(store: Store): string {
  return `${store.name} · ${formatStoreAddress(store)}`;
}

function monthlyUnits(product: Product): number {
  const seed = hashString(product.id);
  const base = product.soldCount / 20;
  const factor = 0.7 + (seed % 40) / 100;
  return Math.max(1, Math.round(base * factor));
}

function destinationLabel(seed: number, store?: Store): string {
  const dest = pick(DESTINATIONS, seed);
  if (store && dest.city === store.city) {
    const fallback = pick(DESTINATIONS, seed + 3);
    return `${fallback.city}/${fallback.state}`;
  }
  return `${dest.city}/${dest.state}`;
}

export function locateProduct(product: Product): ProductLocation {
  const store = storeById(product.storeId);
  const seed = hashString(product.id);
  const stock = Math.max(0, product.stock);

  if (stock === 0) {
    return {
      product,
      store,
      place: "esgotado",
      unitsAtStore: 0,
      unitsInWarehouse: 0,
      unitsInTransit: 0,
      unitsPickup: 0,
      route: null,
      destination: null,
    };
  }

  const inTransit =
    stock >= 3 && seed % 3 === 0 ? Math.min(2, stock - 1) : 0;
  const pickup =
    store?.pickupAvailable && stock - inTransit >= 2 && seed % 5 === 0
      ? 1
      : 0;
  const remaining = stock - inTransit - pickup;
  const warehouse =
    remaining >= 4 && seed % 2 === 0 ? Math.floor(remaining * 0.4) : 0;
  const atStore = remaining - warehouse;

  let place: StockPlace = "balcao";
  if (inTransit > 0 && atStore === 0 && pickup === 0) place = "em_rota";
  else if (pickup > 0 && atStore === 0 && inTransit === 0) {
    place = "aguardando_retirada";
  } else if (warehouse > 0 && atStore === 0) place = "deposito";
  else if (inTransit > 0) place = "em_rota";
  else if (pickup > 0) place = "aguardando_retirada";
  else if (warehouse >= atStore && warehouse > 0) place = "deposito";

  const route: DeliveryRoute | null = inTransit
    ? seed % 2 === 0
      ? "expressa"
      : "economica"
    : pickup
      ? "retirada"
      : null;

  return {
    product,
    store,
    place,
    unitsAtStore: atStore,
    unitsInWarehouse: warehouse,
    unitsInTransit: inTransit,
    unitsPickup: pickup,
    route,
    destination: inTransit ? destinationLabel(seed, store) : null,
  };
}

function mergeCatalog(catalog: Product[], extras: Product[]): Product[] {
  const seen = new Set(catalog.map((item) => item.id));
  return [...catalog, ...extras.filter((item) => !seen.has(item.id))];
}

function shipmentStatus(route: DeliveryRoute, seed: number): ShipmentStatus {
  if (route === "retirada") return "aguardando_retirada";
  return pick(
    ["coletado", "em_transito", "saiu_para_entrega"] as const,
    seed
  );
}

function buildShipments(locations: ProductLocation[]): FakeShipment[] {
  const fromStock = locations.flatMap((location) => {
    if (location.unitsInTransit <= 0 && location.unitsPickup <= 0) return [];
    const seed = hashString(location.product.id);
    const route: DeliveryRoute =
      location.unitsPickup > 0 && location.unitsInTransit <= 0
        ? "retirada"
        : location.route ?? (seed % 2 === 0 ? "expressa" : "economica");
    const units =
      route === "retirada" ? location.unitsPickup : location.unitsInTransit;
    const origin = location.store
      ? `${location.store.city}/${location.store.state}`
      : "Origem não informada";
    const destination =
      route === "retirada"
        ? location.store
          ? formatStorePlace(location.store)
          : "Balcão da loja"
        : location.destination ?? destinationLabel(seed, location.store);

    return [
      {
        id: `rota-${location.product.id}`,
        product: location.product,
        store: location.store,
        origin,
        destination,
        route,
        status: shipmentStatus(route, seed),
        eta: pick(ETA_BY_ROUTE[route], seed),
        units,
        value: units * location.product.price,
      } satisfies FakeShipment,
    ];
  });

  const covered = new Set(fromStock.map((item) => item.product.storeId));
  const extraByStore = STORES.flatMap((store) => {
    if (covered.has(store.id)) return [];
    const product = locations.find((item) => item.product.storeId === store.id)
      ?.product;
    if (!product) return [];
    const seed = hashString(`extra-${store.id}`);
    const route: DeliveryRoute = store.pickupAvailable && seed % 3 === 0
      ? "retirada"
      : seed % 2 === 0
        ? "expressa"
        : "economica";
    const units = 1;
    return [
      {
        id: `rota-extra-${store.id}`,
        product,
        store,
        origin: `${store.city}/${store.state}`,
        destination:
          route === "retirada"
            ? formatStorePlace(store)
            : destinationLabel(seed, store),
        route,
        status: shipmentStatus(route, seed),
        eta: pick(ETA_BY_ROUTE[route], seed),
        units,
        value: units * product.price,
      } satisfies FakeShipment,
    ];
  });

  return [...fromStock, ...extraByStore].slice(0, 10);
}

export function buildSellerDashboard(
  catalog: Product[],
  extraProducts: Product[] = []
): SellerDashboard {
  const products = mergeCatalog(catalog, extraProducts);
  const locations = products.map(locateProduct);

  let monthRevenue = 0;
  let unitsSold = 0;
  const revenueByStore = new Map<string, { revenue: number; orders: number }>();

  for (const product of products) {
    const units = monthlyUnits(product);
    const revenue = units * product.price;
    monthRevenue += revenue;
    unitsSold += units;
    const current = revenueByStore.get(product.storeId) ?? {
      revenue: 0,
      orders: 0,
    };
    current.revenue += revenue;
    current.orders += units;
    revenueByStore.set(product.storeId, current);
  }

  const previousMonthRevenue = monthRevenue * 0.83;
  const septemberRevenue = monthRevenue * 0.118;
  const orders = unitsSold;
  const averageTicket = unitsSold > 0 ? monthRevenue / unitsSold : 0;
  const monthGrowth =
    previousMonthRevenue > 0
      ? (monthRevenue - previousMonthRevenue) / previousMonthRevenue
      : 0;

  const shipments = buildShipments(locations);
  const inTransitValue = shipments
    .filter((item) => item.route !== "retirada")
    .reduce((sum, item) => sum + item.value, 0);
  const pickupOpen = shipments
    .filter((item) => item.route === "retirada")
    .reduce((sum, item) => sum + item.units, 0);

  const routeTotals = new Map<DeliveryRoute, { count: number; value: number }>();
  for (const shipment of shipments) {
    const current = routeTotals.get(shipment.route) ?? { count: 0, value: 0 };
    current.count += 1;
    current.value += shipment.value;
    routeTotals.set(shipment.route, current);
  }

  const routeMix: SellerDashboard["routeMix"] = (
    ["expressa", "economica", "retirada"] as const
  )
    .map((route) => ({
      route,
      count: routeTotals.get(route)?.count ?? 0,
      value: routeTotals.get(route)?.value ?? 0,
    }))
    .filter((item) => item.count > 0);

  const storeRevenue: StoreRevenue[] = STORES.map((store) => {
    const stats = revenueByStore.get(store.id) ?? { revenue: 0, orders: 0 };
    return { store, revenue: stats.revenue, orders: stats.orders };
  })
    .filter((item) => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  return {
    monthRevenue,
    previousMonthRevenue,
    monthGrowth,
    septemberRevenue,
    orders,
    unitsSold,
    averageTicket,
    inTransitValue,
    pickupOpen,
    monthlySeries: MONTH_WEIGHTS.map((item) => ({
      label: item.label,
      value: monthRevenue * item.weight,
    })),
    routeMix,
    storeRevenue,
    locations,
    shipments,
  };
}
