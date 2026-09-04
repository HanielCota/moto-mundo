"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/produtos");
    }
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white py-20 md:py-28 border-b border-zinc-800">
      {/* Background Motocross Action Photo with responsive gradient overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Piloto de motocross em salto"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[78%_12%] sm:object-[80%_8%] lg:object-[84%_6%] opacity-70 md:opacity-85 contrast-105"
        />
        {/* Directional gradient: solid dark on the left (for text readability), transparent on the right (to showcase the motocross rider) */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/10" />
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Marketplace Oficial Off-Road
          </div>

          {/* Strong Off-Road Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] uppercase text-white">
            Domine qualquer pista com equipamentos de{" "}
            <span className="text-orange-500 inline-block">alta performance</span>
          </h1>

          {/* Short Marketplace Text */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
            Reunimos as melhores lojas, importadoras e preparadoras de motocross, trilha e enduro em um único lugar. Peças originais, entrega rápida para todo o Brasil e parcelamento em até 10x sem juros.
          </p>

          {/* Hero Search & CTA */}
          <div className="pt-2 max-w-xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="O que sua moto precisa hoje? (ex: capacete, bota, pneu...)"
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-zinc-900 transition-all backdrop-blur-xs"
                />
                <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="h-12 px-6 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 shrink-0"
              >
                Buscar
              </button>
            </form>

            {/* Quick Button Link */}
            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors group"
              >
                <span>Explorar produtos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-zinc-600">•</span>
              <Link
                href="/marcas"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Yamaha, Honda e marcas
              </Link>
            </div>
          </div>

          {/* Mini trust points */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-800/80 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Zap className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Envio em até 24h</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Compra Protegida</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Award className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Lojas Verificadas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
