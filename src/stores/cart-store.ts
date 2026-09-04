import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartTotals } from "@/types";
import { calculateCartTotals } from "@/lib/cart";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => { success: boolean; message: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: (customShipping?: Record<string, number>) => CartTotals;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (itemData, quantityToAdd = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === itemData.productId);

        if (itemData.stock <= 0) {
          return { success: false, message: "Produto indisponível em estoque." };
        }

        const qtyToAdd = Math.max(1, Math.floor(quantityToAdd));

        if (existing) {
          if (existing.quantity >= itemData.stock) {
            return {
              success: false,
              message: `Limite de estoque atingido (${itemData.stock} un.). Você já possui todas as unidades disponíveis no carrinho.`,
            };
          }

          const newQty = existing.quantity + qtyToAdd;
          if (newQty > itemData.stock) {
            // Clamp to max stock
            set({
              items: items.map((i) =>
                i.productId === itemData.productId
                  ? { ...i, quantity: itemData.stock }
                  : i
              ),
            });
            return {
              success: true,
              message: `Limite de estoque atingido (${itemData.stock} un.). Quantidade ajustada para o máximo disponível.`,
            };
          }

          set({
            items: items.map((i) =>
              i.productId === itemData.productId
                ? { ...i, quantity: newQty }
                : i
            ),
          });
          return { success: true, message: "Quantidade atualizada no carrinho!" };
        }

        // New item
        const clampedQty = Math.min(qtyToAdd, itemData.stock);
        set({
          items: [
            ...items,
            {
              ...itemData,
              quantity: clampedQty,
            },
          ],
        });
        return { success: true, message: "Produto adicionado ao carrinho!" };
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        const cleanQty = Math.floor(quantity);
        if (cleanQty <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            const clamped = Math.min(cleanQty, item.stock);
            return { ...item, quantity: clamped };
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotals: (customShipping?: Record<string, number>) => {
        return calculateCartTotals(get().items, customShipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "moto-mundo-cart-storage",
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
