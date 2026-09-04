export type ShippingOptionId = "economica" | "expressa" | "retirada";

export interface ShippingOption {
  id: ShippingOptionId;
  name: string;
  price: number;
  estimatedDays: string;
  storeId?: string;
}

export interface StoreShippingSelection {
  storeId: string;
  storeName: string;
  selectedOptionId: ShippingOptionId;
  availableOptions: ShippingOption[];
}
