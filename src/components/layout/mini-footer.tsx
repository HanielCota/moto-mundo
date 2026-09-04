import Link from "next/link";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";
import { LogoIcon } from "./logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";
import { SITE_SOCIAL } from "@/data/social";

const TRUST_ITEMS = [
  { icon: Lock, label: "Ambiente criptografado", className: "text-emerald-600" },
  { icon: ShieldCheck, label: "Lojas verificadas", className: "text-orange-600" },
  { icon: CreditCard, label: "Até 10x sem juros", className: "text-zinc-600" },
] as const;

export function MiniFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-3">
              <LogoIcon className="size-8 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight text-zinc-950 leading-none">
                  MOTO<span className="text-orange-600">MUNDO</span>
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mt-1">
                  Marketplace Off-Road
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={SITE_SOCIAL.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-pink-300 hover:text-pink-600 transition-colors"
              >
                <InstagramIcon className="size-3.5 text-pink-500" />
                Instagram
              </a>
              <a
                href={SITE_SOCIAL.whatsappMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <WhatsAppIcon className="size-3.5 text-emerald-500" />
                WhatsApp
              </a>
              <span className="hidden sm:block w-px h-4 bg-zinc-200 mx-1" />
              <Link
                href="/lojas"
                className="h-8 px-3 inline-flex items-center rounded-lg text-xs font-semibold text-zinc-600 hover:text-orange-600 hover:bg-zinc-50 transition-colors"
              >
                Lojas
              </Link>
              <Link
                href="/marcas"
                className="h-8 px-3 inline-flex items-center rounded-lg text-xs font-semibold text-zinc-600 hover:text-orange-600 hover:bg-zinc-50 transition-colors"
              >
                Marcas
              </Link>
              <Link
                href="/produtos"
                className="h-8 px-3 inline-flex items-center rounded-lg text-xs font-semibold text-zinc-600 hover:text-orange-600 hover:bg-zinc-50 transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/painel"
                className="h-8 px-3 inline-flex items-center rounded-lg text-xs font-semibold text-zinc-600 hover:text-orange-600 hover:bg-zinc-50 transition-colors"
              >
                Painel
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] font-semibold text-zinc-600"
                >
                  <Icon className={`size-3.5 shrink-0 ${item.className}`} />
                  {item.label}
                </span>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-zinc-400">
            <p>
              © {new Date().getFullYear()} Moto Mundo Marketplace Ltda. • CNPJ
              45.892.114/0001-83
            </p>
            <p>Peças e equipamentos para motocross, trilha e enduro.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
