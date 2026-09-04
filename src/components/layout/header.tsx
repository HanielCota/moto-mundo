import Link from "next/link";
import { HeaderSearch } from "./header-search";
import { CartBadge } from "./cart-badge";
import { MobileNav } from "./mobile-nav";
import { LogoLink } from "./logo";
import { CATEGORIES } from "@/data/categories";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
      {/* Top Bar / Announcement Banner (Hidden on mobile) */}
      <div className="hidden md:block bg-zinc-950 text-white py-2.5 sm:py-3 px-4 border-b border-zinc-850 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 text-xs sm:text-sm md:text-base font-bold tracking-wide">
          <span className="text-orange-500 text-base sm:text-lg select-none">🚀</span>
          <span>
            Especialistas em Off-Road{" "}
            <span className="text-zinc-500 mx-1.5 font-normal">•</span>{" "}
            <span className="text-orange-400">Frete Grátis</span> e Parcelamento em até{" "}
            <span className="text-white underline decoration-orange-500 underline-offset-4 decoration-2">
              10x sem juros
            </span>
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Mobile hamburger + Logo */}
          <div className="flex items-center gap-2">
            <MobileNav />

            <LogoLink />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-2">
            <HeaderSearch />
          </div>

          {/* Desktop Navigation Links & Cart */}
          <div className="flex items-center gap-1 sm:gap-3">
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/produtos"
                className="px-3 py-2 rounded-md text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Produtos
              </Link>
              <Link
                href="/lojas"
                className="px-3 py-2 rounded-md text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Lojas
              </Link>
            </nav>

            <div className="h-6 w-px bg-zinc-200 hidden lg:block mx-1" />

            <CartBadge />
          </div>
        </div>

        {/* Mobile Search Bar (under logo on small screens) */}
        <div className="pb-3 md:hidden">
          <HeaderSearch />
        </div>
      </div>

      {/* Sub-header Categories Bar (Desktop) */}
      <div className="hidden lg:block border-t border-zinc-100 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 text-sm font-semibold text-zinc-700 scrollbar-none">
            <div className="flex items-center gap-7">
              {CATEGORIES.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/produtos?categoria=${category.slug}`}
                  className="whitespace-nowrap hover:text-orange-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <Link
              href="/produtos?ordem=mais-vendidos"
              className="text-sm font-bold text-orange-600 hover:text-orange-700 whitespace-nowrap pl-4 flex items-center gap-1"
            >
              🔥 Mais Vendidos
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
