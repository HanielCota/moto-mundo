"use client";

import { useSyncExternalStore } from "react";
import { useSellerCatalogStore } from "@/stores/seller-catalog-store";

const emptySubscribe = () => () => {};

export function useSellerCatalog() {
  const products = useSellerCatalogStore((state) => state.products);
  const upsertProduct = useSellerCatalogStore((state) => state.upsertProduct);
  const removeProduct = useSellerCatalogStore((state) => state.removeProduct);
  const getById = useSellerCatalogStore((state) => state.getById);
  const getBySlug = useSellerCatalogStore((state) => state.getBySlug);

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return {
    products: isHydrated ? products : [],
    isHydrated,
    upsertProduct,
    removeProduct,
    getById,
    getBySlug,
  };
}
