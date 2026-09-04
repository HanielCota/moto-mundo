export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  storeId: string;
  storeName: string;
  unitPrice: number;
  quantity: number;
  stock: number;
  freeShipping: boolean;
  selectedSize?: string;
  selectedColor?: string;
}


export interface CartTotals {
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  itemsCount: number;
}

export interface StoreCartGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  allFreeShipping: boolean;
  shippingCost: number;
}
