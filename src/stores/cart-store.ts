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

        if (existing) {
          const newQty = existing.quantity + quantityToAdd;
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
              message: `Limite de estoque atingido (${itemData.stock} un.). Quantidade ajustada.`,
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
        const clampedQty = Math.min(Math.max(1, quantityToAdd), itemData.stock);
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
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.productId !== productId) return item;
              // Clamp between 1 and item.stock
              const clamped = Math.min(Math.max(1, quantity), item.stock);
              return { ...item, quantity: clamped };
            })
            .filter((item) => item.quantity > 0),
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
