import { formatBRL, calculateDiscountPercent, calculateInstallments } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showInstallments?: boolean;
  className?: string;
}

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  showInstallments = true,
  className,
}: PriceTagProps) {
  const discountPercent = calculateDiscountPercent(originalPrice, price);
  const installments = calculateInstallments(price);

  const priceSizes = {
    sm: "text-base font-bold",
    md: "text-xl font-bold",
    lg: "text-2xl font-extrabold",
    xl: "text-3xl lg:text-4xl font-black",
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {originalPrice && originalPrice > price && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 line-through">
            {formatBRL(originalPrice)}
          </span>
          <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
            {discountPercent}% OFF
          </span>
        </div>
      )}

      <div className="flex items-baseline gap-1">
        <span className={cn("text-zinc-950 tracking-tight", priceSizes[size])}>
          {formatBRL(price)}
        </span>
      </div>

      {showInstallments && (
        <p className="text-xs text-zinc-600 font-medium">
          em <span className="text-zinc-900 font-semibold">{installments.count}x</span> de{" "}
          <span className="text-zinc-900 font-semibold">{formatBRL(installments.value)}</span> sem juros
        </p>
      )}
    </div>
  );
}
