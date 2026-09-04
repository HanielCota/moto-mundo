"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, Store, Tag, Sparkles, ChevronRight, Compass, UserRound, BadgeCheck } from "lucide-react";
import { SITE_SOCIAL } from "@/data/social";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";
import { useAuth } from "@/hooks/use-auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/data/categories";
import { STORES } from "@/data/stores";
import { getOemBrands } from "@/data/brands";
import { Logo } from "./logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { currentUser, isHydrated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="p-2 -ml-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden"
        aria-label="Abrir menu de navegação"
      >
        <Menu className="w-6 h-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto bg-white">
        <SheetHeader className="p-4 border-b border-zinc-800 bg-zinc-950 text-white">
          <SheetTitle className="text-left">
            <Logo theme="dark" showTagline={true} />
          </SheetTitle>
        </SheetHeader>

        {/* Mobile Search */}
        <div className="p-4 border-b border-zinc-100 bg-zinc-50">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder="Buscar produtos ou marcas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>
        </div>

        {/* Main Navigation */}
        <nav className="p-4 flex flex-col gap-1 border-b border-zinc-100">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <Compass className="w-4 h-4 text-orange-600" />
            Início
          </Link>
          <Link
            href={isHydrated && currentUser ? "/perfil" : "/login"}
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-3">
              <UserRound className="w-4 h-4 text-orange-600" />
              {isHydrated && currentUser ? "Meu perfil" : "Entrar / Cadastrar"}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
          <Link
            href="/produtos"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-orange-600" />
              Todos os Produtos
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
          <Link
            href="/marcas"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-3">
              <BadgeCheck className="w-4 h-4 text-orange-600" />
              Marcas
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
          <Link
            href="/lojas"
            onClick={handleLinkClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Store className="w-4 h-4 text-orange-600" />
              Lojas Parceiras
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
          <Link
            href="/carrinho"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            Meu Carrinho
          </Link>
        </nav>

        {/* Categories Section */}
        <div className="p-4 border-b border-zinc-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Categorias
          </h4>
          <div className="grid grid-cols-1 gap-0.5">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/produtos?categoria=${category.slug}`}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 rounded-md transition-colors"
              >
                <span>{category.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-zinc-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
            Marcas oficiais
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {getOemBrands().map((brand) => (
              <Link
                key={brand.id}
                href={`/marca/${brand.slug}`}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 rounded-md transition-colors"
              >
                <span>{brand.name}</span>
                <span className="text-[11px] text-zinc-400">{brand.origin}</span>
              </Link>
            ))}
            <Link
              href="/marcas"
              onClick={handleLinkClick}
              className="px-3 py-2 text-xs font-bold text-orange-600"
            >
              Ver todas as marcas
            </Link>
          </div>
        </div>

        {/* Stores Section */}
        <div className="p-4 border-b border-zinc-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
            Lojas em Destaque
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {STORES.map((store) => (
              <Link
                key={store.id}
                href={`/loja/${store.slug}`}
                onClick={handleLinkClick}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 rounded-md transition-colors"
              >
                <span>{store.name}</span>
                <span className="text-[11px] text-zinc-400">{store.city}/{store.state}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="p-4 bg-zinc-50/70">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2.5">
            Siga nas Redes
          </h4>
          <div className="grid grid-cols-2 gap-2 px-1">
            <a
              href={SITE_SOCIAL.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 hover:text-pink-600 hover:border-pink-300 transition-all shadow-xs"
            >
              <InstagramIcon className="size-3.5 text-pink-500" />
              <span>Instagram</span>
            </a>
            <a
              href={SITE_SOCIAL.whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all shadow-xs"
            >
              <WhatsAppIcon className="size-3.5 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

