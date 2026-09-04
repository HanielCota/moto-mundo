import type { Metadata } from "next";
import { PainelShell } from "@/components/painel/painel-shell";

export const metadata: Metadata = {
  title: "Painel do lojista",
  description:
    "Faturamento, onde está cada produto, rotas de entrega e cadastro do estoque da loja.",
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PainelShell>{children}</PainelShell>;
}
