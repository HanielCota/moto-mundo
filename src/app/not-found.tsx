import Link from "next/link";
import { Compass, ArrowRight, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-sand">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-zinc-200 p-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1">
          Erro 404 • Fora da Trilha
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-2">
          Página não encontrada
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
          O produto, loja ou página que você está procurando não existe, foi removido ou está temporariamente fora de estoque.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produtos"
            className="h-11 px-5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explorar Catálogo
          </Link>
          <Link
            href="/"
            className="h-11 px-5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Voltar ao Início
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
