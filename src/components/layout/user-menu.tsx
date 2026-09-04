"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "MM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UserMenu() {
  const { currentUser, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div
        className="size-10 rounded-lg bg-zinc-100 animate-pulse"
        aria-hidden="true"
      />
    );
  }

  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
      >
        <UserRound className="size-5" />
        <span className="hidden xl:inline">Entrar</span>
      </Link>
    );
  }

  return (
    <Link
      href="/perfil"
      className="inline-flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
      aria-label={`Perfil de ${currentUser.fullName}`}
    >
      <span
        className={cn(
          "size-8 rounded-lg bg-zinc-950 text-white text-[11px] font-bold",
          "inline-flex items-center justify-center"
        )}
      >
        {getInitials(currentUser.fullName)}
      </span>
      <span className="hidden xl:flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
          Minha conta
        </span>
        <span className="text-xs font-semibold text-zinc-900 max-w-[110px] truncate">
          {currentUser.fullName.split(" ")[0]}
        </span>
      </span>
    </Link>
  );
}
