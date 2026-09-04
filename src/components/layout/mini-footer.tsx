import Link from "next/link";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";
import { LogoIcon } from "./logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";
import { SITE_SOCIAL } from "@/data/social";

export function MiniFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-white py-6 text-zinc-500 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Legal Info */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <LogoIcon className="w-6 h-6" />
            <div>
              <p className="font-semibold text-zinc-700">
                Moto Mundo — Marketplace Oficial de Peças & Equipamentos Off-Road
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                © {new Date().getFullYear()} Moto Mundo Marketplace Ltda. • CNPJ 45.892.114/0001-83
              </p>
            </div>
          </div>

          {/* Social Links: Instagram & WhatsApp */}
          <div className="flex items-center gap-3 text-xs">
            <a
              href={SITE_SOCIAL.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-pink-600 font-medium transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram</span>
            </a>
            <span className="text-zinc-300">•</span>
            <a
              href={SITE_SOCIAL.whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-emerald-600 font-medium transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Trust, Security & Payment Summary */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Ambiente 100% Criptografado
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              Lojas Oficiais Verificadas
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-600" />
              Até 10x Sem Juros
            </span>
          </div>

          {/* Quick Support Link */}
          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/lojas"
              className="text-zinc-600 hover:text-orange-600 font-medium transition-colors"
            >
              Lojas Parceiras
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href="/produtos"
              className="text-zinc-600 hover:text-orange-600 font-medium transition-colors"
            >
              Catálogo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
