import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeFreeShippingProps {
  className?: string;
  size?: "sm" | "default";
}

export function BadgeFreeShipping({
  className,
  size = "sm",
}: BadgeFreeShippingProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold text-white bg-emerald-600 border border-emerald-600 rounded-md tracking-tight shadow-sm",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
        className
      )}
    >
      <Truck className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      Frete Grátis
    </span>
  );
}
