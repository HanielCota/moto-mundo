"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/painel/produtos", label: "Meus produtos", icon: Package, exact: false },
  { href: "/painel/produtos/novo", label: "Cadastrar produto", icon: Plus, exact: true },
] as const;

function headingFor(pathname: string): { title: string; description: string } {
  if (pathname === "/painel/produtos/novo") {
    return {
      title: "Cadastrar produto",
      description:
        "Sobe o que tem no balcão: nome, preço, estoque, fotos e tamanho. O item entra na vitrine da loja.",
    };
  }
  if (pathname.startsWith("/painel/produtos/") && pathname !== "/painel/produtos") {
    return {
      title: "Editar produto",
      description: "Atualiza preço, estoque, fotos e o restante do item.",
    };
  }
  if (pathname === "/painel/produtos") {
    return {
      title: "Meus produtos",
      description: "Itens cadastrados no painel, com a loja física onde cada um está.",
    };
  }
  return {
    title: "Visão da loja",
    description:
      "Faturamento, onde está cada produto e as rotas de entrega. Os valores são de demonstração.",
  };
}

export function PainelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const heading = headingFor(pathname);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
          Painel do lojista
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          {heading.title}
        </h1>
        <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
          {heading.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href ||
                (item.href === "/painel/produtos" &&
                  pathname.startsWith("/painel/produtos") &&
                  pathname !== "/painel/produtos/novo");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-3 rounded-xl text-xs font-bold whitespace-nowrap",
                  isActive
                    ? "bg-zinc-950 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/lojas"
            className="inline-flex items-center gap-2 h-10 px-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-orange-600"
          >
            <Store className="size-4" />
            Ver lojas
          </Link>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
