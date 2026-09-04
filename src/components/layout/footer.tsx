"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowUp,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Store,
  Copy,
  Check,
  Lock,
  CreditCard,
  Zap,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { STORES } from "@/data/stores";
import { getOemBrands } from "@/data/brands";
import { SITE_SOCIAL } from "@/data/social";
import { toast } from "sonner";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";




export function Footer() {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleCopyCoupon = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText("PRIMEIRA10");
        setCopiedCoupon(true);
        toast.success("Cupom PRIMEIRA10 copiado!", {
          description: "Aproveite 10% de desconto na sua primeira compra.",
          icon: <Sparkles className="w-5 h-5 text-orange-500" />,
        });
        setTimeout(() => setCopiedCoupon(false), 3000);
      } else {
        toast.info("Cupom: PRIMEIRA10");
      }
    } catch {
      toast.info("Cupom: PRIMEIRA10");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-zinc-950 text-zinc-300 border-t border-zinc-800/80 overflow-hidden">
      {/* Ambient glowing backlight for modern depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-32 bg-orange-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      {/* Top Action Banners: Seller CTA & First-Order Discount */}
      <div className="relative border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Seller CTA Card */}
            <div className="relative group rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/70 border border-zinc-800 hover:border-orange-500/40 p-6 transition-all duration-300 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
              <div className="space-y-1.5 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold tracking-wide uppercase">
                  <Store className="w-3.5 h-3.5" />
                  <span>Para Lojas & Preparadores</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Quer vender no Moto Mundo?
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Conecte sua loja a milhares de pilotos off-road de todo o Brasil com taxas competitivas e gestão simplificada.
                </p>
              </div>
              <Link
                href="/lojas"
                className="z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-orange-600/20 active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Conhecer Parceiros</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Exclusive First-Order Coupon Card */}
            <div className="relative group rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/70 border border-zinc-800 hover:border-orange-500/40 p-6 transition-all duration-300 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="space-y-1.5 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cupom de Boas-Vindas</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  10% OFF no seu primeiro pedido
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Válido para equipamentos, peças de motor, pneus e proteções em todo o catálogo.
                </p>
              </div>

              {/* Interactive Coupon Box */}
              <div className="z-10 flex items-center gap-2 bg-zinc-950/80 border border-dashed border-orange-500/40 rounded-xl p-1.5 pl-3 shrink-0">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Código</span>
                  <span className="font-mono font-black text-sm text-orange-400 tracking-wider">PRIMEIRA10</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  aria-label="Copiar código do cupom"
                  className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/30 transition-all active:scale-95 cursor-pointer"
                  title="Copiar cupom"
                >
                  {copiedCoupon ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (Refined Modern Bento Row) */}
      <div className="border-b border-zinc-800/60 bg-zinc-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Entrega Nacional Ágil</h4>
                <p className="text-xs text-zinc-400">Rastreamento minuto a minuto em todo o país</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Compra 100% Protegida</h4>
                <p className="text-xs text-zinc-400">Garantia total do pagamento ao recebimento</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Troca Fácil & Grátis</h4>
                <p className="text-xs text-zinc-400">7 dias para trocas de tamanhos sem complicação</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Suporte por Pilotos</h4>
                <p className="text-xs text-zinc-400">Atendimento técnico especializado em off-road</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Community info (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-lg tracking-tight shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  MOTO<span className="text-orange-500">MUNDO</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase leading-none mt-1">
                  Off-Road Ecosystem
                </span>
              </div>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              O ecossistema digital do piloto off-road. Conectamos apaixonados por motocross, trilha, enduro e velocross às melhores lojas, marcas e preparadores de alta performance do Brasil.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-2.5 text-xs">
              <a
                href={SITE_SOCIAL.whatsappMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500/40 hover:bg-zinc-900 transition-all w-full max-w-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">WhatsApp Oficial:</span>
                  <span className="text-emerald-400 font-mono font-medium">{SITE_SOCIAL.whatsappDisplay}</span>
                </div>
              </a>

              <a
                href="mailto:suporte@motomundo.com.br"
                className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-orange-500/40 hover:bg-zinc-900 transition-all w-full max-w-xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">E-mail:</span>
                  <span className="text-zinc-400 group-hover:text-zinc-300">suporte@motomundo.com.br</span>
                </div>
              </a>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Polo Operacional: Belo Horizonte • MG, Brasil</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Siga nas Redes
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={SITE_SOCIAL.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Moto Mundo"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-pink-500/50 transition-all hover:scale-105 group"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Instagram</span>
                </a>
                <a
                  href={SITE_SOCIAL.whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Moto Mundo"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-emerald-500/50 transition-all hover:scale-105 group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>


          {/* Categorias (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Categorias Populares</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </h3>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/produtos?categoria=${cat.slug}`}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center justify-between group py-0.5"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </span>
                    {cat.slug === "capacetes" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Top
                      </span>
                    )}
                    {cat.slug === "escapamentos" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Hot
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>Ver todas as categorias</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Marcas oficiais + Lojas (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Marcas Oficiais</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </h3>
            <ul className="space-y-2.5 text-xs">
              {getOemBrands().map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`/marca/${brand.slug}`}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group py-0.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-orange-500/70 shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform truncate">
                      {brand.name}
                    </span>
                  </Link>
                </li>
              ))}
              {STORES.slice(0, 3).map((store) => (
                <li key={store.id}>
                  <Link
                    href={`/loja/${store.slug}`}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group py-0.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-orange-500/70 shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform truncate">
                      {store.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 flex flex-col gap-1.5">
                <Link
                  href="/marcas"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>Ver todas as marcas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/lojas"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>Ver todas as lojas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Ajuda, Atendimento & Políticas (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Ajuda & Confiança</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/perfil" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Entrar / Minha conta</span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Como Comprar no Marketplace</span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Prazos e Tipos de Envio</span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Garantia & Troca Fácil (7 dias)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CDC
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Tabela de Medidas & Guia de Tamanho</span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Termos de Uso & Condições</span>
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-1 transition-transform">Privacidade & Proteção de Dados (LGPD)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Security Seals Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-850/80 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Payment Methods */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Formas de Pagamento Aceitas
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* PIX Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-white shadow-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tracking-wide">PIX</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                  5% OFF
                </span>
              </div>

              {/* Credit Card Pills */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                <span>Cartão em até 10x</span>
              </div>

              <div className="inline-flex items-center px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-black text-zinc-400 tracking-wider">
                VISA
              </div>
              <div className="inline-flex items-center px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-black text-zinc-400 tracking-wider">
                MASTERCARD
              </div>
              <div className="inline-flex items-center px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-black text-zinc-400 tracking-wider">
                ELO
              </div>
              <div className="inline-flex items-center px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400">
                Boleto
              </div>
            </div>
          </div>

          {/* Security Certifications */}
          <div className="space-y-2.5 md:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Ambiente Seguro & Confiável
            </span>
            <div className="flex flex-wrap items-center md:justify-end gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-[11px]">SSL 256-bit Encriptado</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-semibold text-[11px]">Lojas Homologadas</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-[11px]">Compra Garantida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright, CNPJ & Back to Top */}
        <div className="mt-10 pt-6 border-t border-zinc-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            {/* Live System Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Sistemas 100% Operacionais</span>
            </div>

            <p>© {new Date().getFullYear()} Moto Mundo Marketplace Ltda. CNPJ: 45.123.890/0001-99.</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Feito para quem acelera no off-road
            </span>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/40 text-zinc-300 hover:text-white transition-all text-xs font-semibold active:scale-95 group cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
