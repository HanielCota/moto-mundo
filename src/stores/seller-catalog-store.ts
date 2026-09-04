import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";

interface SellerCatalogState {
  products: Product[];
  upsertProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getById: (productId: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
}

export const useSellerCatalogStore = create<SellerCatalogState>()(
  persist(
    (set, get) => ({
      products: [],

      upsertProduct: (product) => {
        set((state) => {
          const exists = state.products.some((item) => item.id === product.id);
          return {
            products: exists
              ? state.products.map((item) =>
                  item.id === product.id ? product : item
                )
              : [product, ...state.products],
          };
        });
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId),
        }));
      },

      getById: (productId) => get().products.find((item) => item.id === productId),

      getBySlug: (slug) => get().products.find((item) => item.slug === slug),
    }),
    {
      name: "moto-mundo-seller-catalog",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
