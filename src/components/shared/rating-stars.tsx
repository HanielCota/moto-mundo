import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  ratingCount?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  ratingCount,
  size = "sm",
  showNumber = true,
  className,
}: RatingStarsProps) {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-medium",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;
          const isHalf = !isFilled && rating >= starIndex - 0.5;

          return (
            <Star
              key={starIndex}
              className={cn(
                iconSizes[size],
                isFilled
                  ? "fill-amber-500 text-amber-500"
                  : isHalf
                  ? "fill-amber-500/50 text-amber-500"
                  : "text-zinc-300"
              )}
            />
          );
        })}
      </div>

      {showNumber && (
        <span className={cn("text-zinc-700 font-medium", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}

      {ratingCount !== undefined && (
        <span className={cn("text-zinc-500", textSizes[size])}>
          ({ratingCount})
        </span>
      )}
    </div>
  );
}
