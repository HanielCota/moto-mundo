import type { Metadata } from "next";
import { PainelShell } from "@/components/painel/painel-shell";

export const metadata: Metadata = {
  title: "Painel do lojista",
  description: "Cadastre produtos, preço, estoque e fotos da sua loja no Moto Mundo.",
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PainelShell>{children}</PainelShell>;
}
