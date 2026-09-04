"use client";

import { MessageCircle } from "lucide-react";
import { SITE_SOCIAL } from "@/data/social";

export function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800">
        Fale conosco no WhatsApp
      </span>

      <a
        href={SITE_SOCIAL.whatsappMessageUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Iniciar conversa no WhatsApp com suporte Moto Mundo"
        className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
      >
        {/* Radar ping animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}
