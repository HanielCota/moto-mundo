"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  size = "md",
  disabled = false,
  className,
  ariaLabel = "Quantidade",
}: QuantitySelectorProps) {
  const isMin = value <= min;
  const isMax = value >= max;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isMin) {
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isMax) {
      onChange(Math.min(max, value + 1));
    }
  };

  const isSm = size === "sm";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center border border-zinc-300 rounded-lg bg-white overflow-hidden shadow-2xs select-none transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20",
        disabled && "opacity-50 cursor-not-allowed bg-zinc-50",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isMin}
        aria-label="Diminuir quantidade"
        className={cn(
          "flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all focus:outline-none",
          isSm ? "w-8 h-8" : "w-9 h-9"
        )}
      >
        <Minus className={isSm ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </button>

      <span
        aria-live="polite"
        className={cn(
          "text-center font-bold text-zinc-900 tabular-nums px-1",
          isSm ? "w-8 text-xs" : "w-10 text-sm"
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isMax}
        aria-label="Aumentar quantidade"
        className={cn(
          "flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all focus:outline-none",
          isSm ? "w-8 h-8" : "w-9 h-9"
        )}
      >
        <Plus className={isSm ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </button>
    </div>
  );
}
