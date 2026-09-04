import Link from "next/link";
import { HeaderSearch } from "./header-search";
import { CartBadge } from "./cart-badge";
import { MobileNav } from "./mobile-nav";
import { LogoLink } from "./logo";
import { UserMenu } from "./user-menu";
import { CATEGORIES } from "@/data/categories";
import { SITE_SOCIAL } from "@/data/social";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
      {/* Top Bar / Announcement Banner (Hidden on mobile) */}
      <div className="hidden md:block bg-zinc-950 text-white py-2 px-4 border-b border-zinc-850 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold tracking-wide">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-sm select-none">🚀</span>
            <span>
              Especialistas em Off-Road{" "}
              <span className="text-zinc-500 mx-1.5 font-normal">•</span>{" "}
              <span className="text-orange-400">Frete Grátis</span> e Parcelamento em até{" "}
              <span className="text-white underline decoration-orange-500 underline-offset-4 decoration-2">
                10x sem juros
              </span>
            </span>
          </div>

          {/* Redes Sociais: Instagram & WhatsApp */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
            <a
              href={SITE_SOCIAL.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram</span>
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href={SITE_SOCIAL.whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
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
                href="/marcas"
                className="px-3 py-2 rounded-md text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Marcas
              </Link>
              <Link
                href="/lojas"
                className="px-3 py-2 rounded-md text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Lojas
              </Link>
              <Link
                href="/painel"
                className="px-3 py-2 rounded-md text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Painel
              </Link>
            </nav>

            <div className="h-6 w-px bg-zinc-200 hidden lg:block mx-1" />

            <UserMenu />
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
