import { CartItem, CartTotals, StoreCartGroup } from "@/types";
import { calculateStoreDefaultShipping } from "./shipping";

export function groupCartByStore(items: CartItem[]): StoreCartGroup[] {
  const storeMap = new Map<string, CartItem[]>();

  items.forEach((item) => {
    const existing = storeMap.get(item.storeId) || [];
    existing.push(item);
    storeMap.set(item.storeId, existing);
  });

  const groups: StoreCartGroup[] = [];

  storeMap.forEach((storeItems, storeId) => {
    const storeName = storeItems[0]?.storeName || "Loja";
    const subtotal = storeItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const allFreeShipping = storeItems.every((item) => item.freeShipping);
    const shippingCost = calculateStoreDefaultShipping(storeItems);

    groups.push({
      storeId,
      storeName,
      items: storeItems,
      subtotal,
      allFreeShipping,
      shippingCost,
    });
  });

  return groups;
}

export function calculateCartTotals(
  items: CartItem[],
  customShippingByStore?: Record<string, number>
): CartTotals {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      shippingTotal: 0,
      discountTotal: 0,
      total: 0,
      itemsCount: 0,
    };
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const groups = groupCartByStore(items);

  let shippingTotal = 0;
  groups.forEach((group) => {
    if (
      customShippingByStore &&
      typeof customShippingByStore[group.storeId] === "number"
    ) {
      shippingTotal += customShippingByStore[group.storeId];
    } else {
      shippingTotal += group.shippingCost;
    }
  });

  const total = subtotal + shippingTotal;

  return {
    subtotal,
    shippingTotal,
    discountTotal: 0,
    total,
    itemsCount,
  };
}
