import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/product/catalog-view";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description:
    "Explore capacetes, botas, escapamentos, proteções, pneus e peças para motos de motocross, trilha e velocross.",
};

export default async function ProdutosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CatalogView />
    </Suspense>
  );
}
