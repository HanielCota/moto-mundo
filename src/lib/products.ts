import { Product, Store, Category, Brand } from "@/types";
import { PRODUCTS } from "@/data/products";
import { STORES } from "@/data/stores";
import { CATEGORIES } from "@/data/categories";
import { BRANDS } from "@/data/brands";

export interface ProductSearchParams {
  q?: string;
  categoria?: string;
  loja?: string;
  marca?: string;
  tamanho?: string;
  departamento?: string;
  cor?: string;
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

export async function getAllBrands(): Promise<Brand[]> {
  return BRANDS;
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

export function normalizeSearchTerm(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.categoryId === product.categoryId || p.storeId === product.storeId)
  )
    .sort((a, b) => {
      // Prioritize same category first
      const aSameCat = a.categoryId === product.categoryId ? 1 : 0;
      const bSameCat = b.categoryId === product.categoryId ? 1 : 0;
      if (bSameCat !== aSameCat) return bSameCat - aSameCat;
      // Then prioritize higher rated
      return b.rating - a.rating;
    })
    .slice(0, limit);
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

  // Text search (name, description, specs, brand) with diacritics/accent normalization
  if (params.q && params.q.trim() !== "") {
    const query = normalizeSearchTerm(params.q);
    results = results.filter((p) => {
      const nameMatch = normalizeSearchTerm(p.name).includes(query);
      const descMatch = normalizeSearchTerm(p.description).includes(query);
      const brandMatch = p.brand ? normalizeSearchTerm(p.brand).includes(query) : false;
      const specsMatch = Object.values(p.specs).some((val) =>
        normalizeSearchTerm(val).includes(query)
      );
      return nameMatch || descMatch || specsMatch || brandMatch;
    });
  }

  // Category filter by slug or ID
  if (params.categoria && params.categoria !== "todas") {
    const cat = CATEGORIES.find(
      (c) => c.slug === params.categoria || c.id === params.categoria
    );
    if (cat) {
      results = results.filter((p) => p.categoryId === cat.id);
    }
  }

  // Store filter by slug or ID
  if (params.loja && params.loja !== "todas") {
    const store = STORES.find(
      (s) => s.slug === params.loja || s.id === params.loja
    );
    if (store) {
      results = results.filter((p) => p.storeId === store.id);
    }
  }

  // Brand filter by slug or name
  if (params.marca && params.marca !== "todas") {
    const brandQuery = normalizeSearchTerm(params.marca);
    results = results.filter((p) => {
      const slugMatch = p.brandSlug && normalizeSearchTerm(p.brandSlug) === brandQuery;
      const nameMatch = p.brand && normalizeSearchTerm(p.brand) === brandQuery;
      return slugMatch || nameMatch;
    });
  }

  // Department filter (masculino / feminino / unissex)
  if (params.departamento && params.departamento !== "todos") {
    const dep = params.departamento.toLowerCase();
    results = results.filter((p) => {
      if (!p.department) return true;
      if (dep === "masculino") {
        return p.department === "masculino" || p.department === "unissex";
      }
      if (dep === "feminino") {
        return p.department === "feminino" || p.department === "unissex";
      }
      return p.department === dep;
    });
  }

  // Size filter (M, G, 40, 39, etc.)
  if (params.tamanho && params.tamanho !== "todos") {
    const sizeQuery = params.tamanho.trim().toLowerCase();
    results = results.filter((p) => {
      return p.sizes?.some((s) => s.trim().toLowerCase() === sizeQuery);
    });
  }

  // Color filter (Preto, Branco, Vermelho, Azul, Amarelo, Verde, Laranja)
  if (params.cor && params.cor !== "todas") {
    const colorQuery = normalizeSearchTerm(params.cor);
    results = results.filter((p) => {
      return p.colors?.some((c) => normalizeSearchTerm(c) === colorQuery);
    });
  }

  // Price range filters with inverted range safety check
  let min =
    params.precoMin !== undefined && params.precoMin !== ""
      ? Number(params.precoMin)
      : NaN;
  let max =
    params.precoMax !== undefined && params.precoMax !== ""
      ? Number(params.precoMax)
      : NaN;

  if (!isNaN(min) && !isNaN(max) && min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  if (!isNaN(min) && min >= 0) {
    results = results.filter((p) => p.price >= min);
  }

  if (!isNaN(max) && max >= 0) {
    results = results.filter((p) => p.price <= max);
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
      // Sort by weighted rating and sales volume
      results.sort((a, b) => {
        const scoreB = b.rating * 10 + b.soldCount;
        const scoreA = a.rating * 10 + a.soldCount;
        return scoreB - scoreA;
      });
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

export function getBrandBySlugSync(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug || normalizeSearchTerm(b.name) === normalizeSearchTerm(slug));
}

export function getAllBrandsSync(): Brand[] {
  return BRANDS;
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

