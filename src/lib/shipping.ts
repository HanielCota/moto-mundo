import { ShippingOption, CartItem } from "@/types";

export const SHIPPING_RATES = {
  economica: {
    name: "Entrega Econômica",
    price: 24.9,
    estimatedDays: "8 a 12 dias úteis",
  },
  expressa: {
    name: "Entrega Expressa",
    price: 49.9,
    estimatedDays: "2 a 4 dias úteis",
  },
  retirada: {
    name: "Retirada na Loja",
    price: 0,
    estimatedDays: "1 dia útil",
  },
  gratis: {
    name: "Frete Grátis",
    price: 0,
    estimatedDays: "5 a 9 dias úteis",
  },
} as const;

export const FICTITIOUS_ADDRESS = {
  street: "Rua Tiradentes",
  number: "450",
  complement: "Loja A",
  neighborhood: "Centro",
  city: "Itabira",
  state: "MG",
};

export function isValidCEP(cep: string): boolean {
  const clean = cep.replace(/\D/g, "");
  return clean.length === 8;
}

export async function getAddressFromCEP(
  cep: string
): Promise<typeof FICTITIOUS_ADDRESS | null> {
  if (!isValidCEP(cep)) {
    return null;
  }
  return { ...FICTITIOUS_ADDRESS };
}

export function getAddressFromCEPSync(
  cep: string
): typeof FICTITIOUS_ADDRESS | null {
  if (!isValidCEP(cep)) {
    return null;
  }
  return { ...FICTITIOUS_ADDRESS };
}

/**
 * Returns available shipping options for a given store and its items.
 * If all items have freeShipping, returns a Free Shipping option (or free economica/retirada).
 */
export function getStoreShippingOptions(
  storeId: string,
  items: CartItem[],
  pickupAvailable: boolean
): ShippingOption[] {
  const allFree = items.length > 0 && items.every((i) => i.freeShipping);

  const options: ShippingOption[] = [];

  if (allFree) {
    options.push({
      id: "economica",
      name: `${SHIPPING_RATES.gratis.name} (Econômica)`,
      price: 0,
      estimatedDays: SHIPPING_RATES.gratis.estimatedDays,
      storeId,
    });
  } else {
    options.push({
      id: "economica",
      name: SHIPPING_RATES.economica.name,
      price: SHIPPING_RATES.economica.price,
      estimatedDays: SHIPPING_RATES.economica.estimatedDays,
      storeId,
    });
  }

  options.push({
    id: "expressa",
    name: SHIPPING_RATES.expressa.name,
    price: SHIPPING_RATES.expressa.price,
    estimatedDays: SHIPPING_RATES.expressa.estimatedDays,
    storeId,
  });

  if (pickupAvailable) {
    options.push({
      id: "retirada",
      name: SHIPPING_RATES.retirada.name,
      price: SHIPPING_RATES.retirada.price,
      estimatedDays: SHIPPING_RATES.retirada.estimatedDays,
      storeId,
    });
  }

  return options;
}

/**
 * Calculates shipping cost for a store group in the cart.
 * If all items have freeShipping: 0
 * Otherwise standard economica: 24.90
 */
export function calculateStoreDefaultShipping(items: CartItem[]): number {
  if (items.length === 0) return 0;
  const allFree = items.every((i) => i.freeShipping);
  return allFree ? 0 : SHIPPING_RATES.economica.price;
}
