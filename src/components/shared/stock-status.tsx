import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockStatusProps {
  stock: number;
  showCount?: boolean;
  className?: string;
}

export function StockStatus({
  stock,
  showCount = false,
  className,
}: StockStatusProps) {
  if (stock <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md",
          className
        )}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Indisponível
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md",
          className
        )}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Últimas {stock} unidades!
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md",
        className
      )}
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      {showCount ? `Em estoque (${stock} un.)` : "Em estoque"}
    </span>
  );
}
