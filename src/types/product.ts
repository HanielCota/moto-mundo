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
  brand: string;
  brandSlug?: string;
  images: string[];
  rating: number;
  ratingCount: number;
  soldCount: number;
  freeShipping: boolean;
  specs: Record<string, string>;
  sizes?: string[];
  department?: "masculino" | "feminino" | "unissex";
  colors?: string[];
  featured?: boolean;
  dealOfTheWeek?: boolean;
}

