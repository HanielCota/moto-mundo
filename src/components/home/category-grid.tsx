import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export function CategoryGrid() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
              Navegue por Linhas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Categorias em Destaque
            </h2>
          </div>
          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Ver catálogo completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.slug}`}
              className="group relative flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md hover:border-orange-500/50 transition-all duration-200"
            >
              <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight drop-shadow-md group-hover:text-orange-400 transition-colors uppercase">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200 line-clamp-1 opacity-90 mt-0.5 font-medium">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Ver catálogo completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
