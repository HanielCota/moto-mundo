import { CartItem, CartTotals } from "./cart";
import { CustomerData, AddressData, PaymentMethodType } from "./checkout";

export interface OrderShippingInfo {
  storeId: string;
  storeName: string;
  optionId: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string; // e.g. MM-XXXXXX
  createdAt: string;
  items: CartItem[];
  totals: CartTotals;
  customer: CustomerData;
  address: AddressData;
  shipping: Record<string, OrderShippingInfo>;
  paymentMethod: PaymentMethodType;
  installments?: number;
}
