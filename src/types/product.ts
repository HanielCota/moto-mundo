export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: string;
  storeId: string;
  images: string[];
  rating: number;
  ratingCount: number;
  soldCount: number;
  freeShipping: boolean;
  specs: Record<string, string>;
  featured?: boolean;
  dealOfTheWeek?: boolean;
}
