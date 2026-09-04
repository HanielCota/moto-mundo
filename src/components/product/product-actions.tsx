"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { Product, Store } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { StockStatus } from "@/components/shared/stock-status";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
  store: Store;
}

export function ProductActions({ product, store }: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock <= 0;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const result = addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        storeId: product.storeId,
        storeName: store.name,
        unitPrice: product.price,
        stock: product.stock,
        freeShipping: product.freeShipping,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      },
      quantity
    );

    if (result.success) {
      toast.success(result.message, {
        description: `${quantity}x ${product.name} ${
          selectedSize ? `(Tam: ${selectedSize})` : ""
        } adicionado ao carrinho.`,
        action: {
          label: "Ver Carrinho",
          onClick: () => router.push("/carrinho"),
        },
      });
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] || "/placeholder.jpg",
        storeId: product.storeId,
        storeName: store.name,
        unitPrice: product.price,
        stock: product.stock,
        freeShipping: product.freeShipping,
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined,
      },
      quantity
    );

    router.push("/checkout");
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Stock status indicator */}
      <div className="flex items-center gap-3">
        <StockStatus stock={product.stock} showCount={true} />
        {product.stock > 0 && (
          <span className="text-xs text-zinc-500">
            Vendido e entregue por{" "}
            <strong className="text-zinc-800">{store.name}</strong>
          </span>
        )}
      </div>

      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && !isOutOfStock && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-800 uppercase tracking-wider">
              Tamanho: <span className="text-orange-600 font-black">{selectedSize}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const isSelected = selectedSize === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {product.colors && product.colors.length > 0 && !isOutOfStock && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-800 uppercase tracking-wider">
              Cor: <span className="text-orange-600 font-black">{selectedColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const isSelected = selectedColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-orange-400" />}
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3 pt-1">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Quantidade:
          </label>
          <QuantitySelector
            value={quantity}
            min={1}
            max={product.stock}
            onChange={setQuantity}
            size="md"
          />
          <span className="text-xs text-zinc-400">
            (máx. {product.stock} un.)
          </span>
        </div>
      )}

      {/* Buttons: Add to Cart and Buy Now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`h-12 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
            isOutOfStock
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
              : "bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? "Indisponível" : "Adicionar ao carrinho"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`h-12 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            isOutOfStock
              ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
          }`}
        >
          <Zap className="w-4 h-4 fill-white" />
          Comprar agora
        </button>
      </div>
    </div>
  );
}
