import { Product, Store, Category } from "@/types";
import { PRODUCTS } from "@/data/products";
import { STORES } from "@/data/stores";
import { CATEGORIES } from "@/data/categories";

export interface ProductSearchParams {
  q?: string;
  categoria?: string;
  loja?: string;
  precoMin?: number | string;
  precoMax?: number | string;
  disponivel?: string | boolean;
  ordem?: "relevantes" | "menor-preco" | "maior-preco" | "mais-vendidos" | string;
}

// ==========================================
// Asynchronous Server API (Server Components, Actions, Routes)
// ==========================================

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getAllStores(): Promise<Store[]> {
  return STORES;
}

export async function getAllCategories(): Promise<Category[]> {
  return CATEGORIES;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.id === id);
}

export async function getStoreBySlug(slug: string): Promise<Store | undefined> {
  return STORES.find((s) => s.slug === slug);
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  return STORES.find((s) => s.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return CATEGORIES.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return CATEGORIES.find((c) => c.id === id);
}

export async function getProductsByStore(storeIdOrSlug: string): Promise<Product[]> {
  const store = STORES.find((s) => s.id === storeIdOrSlug || s.slug === storeIdOrSlug);
  if (!store) return [];
  return PRODUCTS.filter((p) => p.storeId === store.id);
}

export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.categoryId === product.categoryId || p.storeId === product.storeId)
  ).slice(0, limit);
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.featured && p.stock > 0).slice(0, limit);
}

export async function getWeeklyDeals(limit: number = 6): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.dealOfTheWeek && p.originalPrice && p.stock > 0).slice(
    0,
    limit
  );
}

export async function searchProducts(params: ProductSearchParams): Promise<Product[]> {
  return filterProductsCore(params);
}

// ==========================================
// Synchronous In-Memory Lookups (Client Components & Filters)
// ==========================================

function filterProductsCore(params: ProductSearchParams): Product[] {
  let results = [...PRODUCTS];

  // Text search (name, description, specs)
  if (params.q && params.q.trim() !== "") {
    const query = params.q.toLowerCase().trim();
    results = results.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(query);
      const descMatch = p.description.toLowerCase().includes(query);
      const specsMatch = Object.values(p.specs).some((val) =>
        val.toLowerCase().includes(query)
      );
      return nameMatch || descMatch || specsMatch;
    });
  }

  // Category filter by slug
  if (params.categoria && params.categoria !== "todas") {
    const cat = CATEGORIES.find((c) => c.slug === params.categoria);
    if (cat) {
      results = results.filter((p) => p.categoryId === cat.id);
    }
  }

  // Store filter by slug
  if (params.loja && params.loja !== "todas") {
    const store = STORES.find((s) => s.slug === params.loja);
    if (store) {
      results = results.filter((p) => p.storeId === store.id);
    }
  }

  // Price range filters
  if (params.precoMin !== undefined && params.precoMin !== "") {
    const min = Number(params.precoMin);
    if (!isNaN(min)) {
      results = results.filter((p) => p.price >= min);
    }
  }

  if (params.precoMax !== undefined && params.precoMax !== "") {
    const max = Number(params.precoMax);
    if (!isNaN(max)) {
      results = results.filter((p) => p.price <= max);
    }
  }

  // Availability filter
  if (params.disponivel !== undefined && params.disponivel !== "") {
    const isAvailable =
      params.disponivel === true ||
      params.disponivel === "true" ||
      params.disponivel === "1";
    if (isAvailable) {
      results = results.filter((p) => p.stock > 0);
    }
  }

  // Sorting
  switch (params.ordem) {
    case "menor-preco":
      results.sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      results.sort((a, b) => b.price - a.price);
      break;
    case "mais-vendidos":
      results.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case "relevantes":
    default:
      // Sort by rating and sales
      results.sort((a, b) => b.rating * b.soldCount - a.rating * a.soldCount);
      break;
  }

  return results;
}

export function searchProductsSync(params: ProductSearchParams): Product[] {
  return filterProductsCore(params);
}

export function getStoreByIdSync(id: string): Store | undefined {
  return STORES.find((s) => s.id === id);
}

export function getCategoryByIdSync(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getStoreBySlugSync(slug: string): Store | undefined {
  return STORES.find((s) => s.slug === slug);
}

export function getCategoryBySlugSync(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByStoreSync(storeIdOrSlug: string): Product[] {
  const store = STORES.find((s) => s.id === storeIdOrSlug || s.slug === storeIdOrSlug);
  if (!store) return [];
  return PRODUCTS.filter((p) => p.storeId === store.id);
}

export function getProductBySlugSync(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
