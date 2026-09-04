import Link from "next/link";
import { ShoppingBag, ArrowRight, Compass } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 shadow-xs flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
          Seu carrinho está vazio
        </h1>

        <p className="text-sm text-zinc-600 max-w-sm mb-8 leading-relaxed">
          Você ainda não adicionou nenhum equipamento ou peça para sua moto. Explore nosso catálogo e encontre tudo para sua trilha.
        </p>

        <Link
          href="/produtos"
          className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Compass className="w-4 h-4" />
          Explorar Produtos
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Quick category entry points */}
        <div className="mt-8 pt-6 border-t border-zinc-100 w-full">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Ou navegue direto por:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: "Capacetes", slug: "capacetes" },
              { name: "Botas", slug: "botas" },
              { name: "Pneus", slug: "pneus" },
              { name: "Escapamentos", slug: "escapamentos" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/produtos?categoria=${cat.slug}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-zinc-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
