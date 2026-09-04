import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon";
  theme?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
}

/**
 * Ícone Sutil & Elegante "M":
 * - Design minimalista, limpo e premium
 * - Badge arredondado suave com gradiente laranja vibrante
 * - Monograma "M" geométrico esportivo, sem ruídos visuais
 */
export function LogoIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "shrink-0 transition-transform duration-200 group-hover:scale-105",
        className
      )}
    >
      <defs>
        <linearGradient id="motoOrangeGradSutil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Base lisa e arredondada (Squircle Premium) */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#motoOrangeGradSutil)"
      />

      {/* Brilho superior suave */}
      <path
        d="M 14 3.5 L 34 3.5 C 41 3.5 44.5 7 44.5 14 L 44.5 15.5 C 44.5 8 40 5 33 5 L 15 5 C 8 5 3.5 8 3.5 15.5 L 3.5 14 C 3.5 7 7 3.5 14 3.5 Z"
        fill="#FFFFFF"
        fillOpacity="0.22"
      />

      {/* Monograma "M" Limpo, Forte e Esportivo */}
      <path
        d="M 12 35.5 L 12 12.5 L 18.5 12.5 L 24 23 L 29.5 12.5 L 36 12.5 L 36 35.5 L 30.5 35.5 L 30.5 20.5 L 25.5 30 L 22.5 30 L 17.5 20.5 L 17.5 35.5 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function Logo({
  variant = "horizontal",
  theme = "light",
  className,
  showTagline = true,
}: LogoProps) {
  const isDark = theme === "dark";

  if (variant === "icon") {
    return <LogoIcon className={className || "w-9 h-9"} />;
  }

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col items-center text-center gap-2 group select-none", className)}>
        <LogoIcon className="w-13 h-13" />
        <div className="flex flex-col items-center">
          <div className="flex items-baseline font-black tracking-tight text-2xl leading-none">
            <span className={cn(isDark ? "text-white" : "text-zinc-950", "transition-colors")}>
              MOTO
            </span>
            <span className="text-orange-600 ml-0.5">MUNDO</span>
          </div>
          {showTagline && (
            <span
              className={cn(
                "text-[10px] font-bold tracking-[0.22em] uppercase mt-1.5",
                isDark ? "text-zinc-400" : "text-zinc-500"
              )}
            >
              Off-Road Marketplace
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal (Header e Menus) - Sutil, limpo e direto
  return (
    <div className={cn("flex items-center gap-2.5 group select-none", className)}>
      <LogoIcon className="w-9 h-9" />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline font-black tracking-tight text-xl leading-none">
          <span
            className={cn(
              isDark ? "text-white" : "text-zinc-950",
              "group-hover:text-orange-600 transition-colors"
            )}
          >
            MOTO
          </span>
          <span className="text-orange-600 ml-0.5">MUNDO</span>
        </div>
        {showTagline && (
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.2em] uppercase mt-1 leading-none",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Off-Road Marketplace
          </span>
        )}
      </div>
    </div>
  );
}

export function LogoLink({
  href = "/",
  variant = "horizontal",
  theme = "light",
  className,
  showTagline = true,
}: LogoProps & { href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md p-0.5 transition-all",
        className
      )}
      aria-label="Moto Mundo - Off-Road Marketplace"
    >
      <Logo variant={variant} theme={theme} showTagline={showTagline} />
    </Link>
  );
}
