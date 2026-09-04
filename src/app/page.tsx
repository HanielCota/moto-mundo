import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductsShowcase } from "@/components/home/products-showcase";
import { StoresShowcase } from "@/components/home/stores-showcase";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { getWeeklyDeals, getFeaturedProducts, getAllProducts } from "@/lib/products";

export default async function HomePage() {
  const [deals, featured, allProducts] = await Promise.all([
    getWeeklyDeals(8),
    getFeaturedProducts(8),
    getAllProducts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50">
      {/* 1. Hero Section com foto de ação motocross */}
      <HeroSection />

      {/* 2. Barra de Confiança e Diferenciais Flutuante */}
      <TrustBar />

      {/* 3. Navegação Rápida por Linhas / Categorias */}
      <CategoryGrid />

      {/* 4. Vitrine Unificada de Produtos com Abas (Ofertas, Destaques, Mais Vendidos) */}
      <ProductsShowcase
        deals={deals}
        featured={featured}
        allProducts={allProducts}
      />

      {/* 5. Lojas Especializadas Oficiais */}
      <StoresShowcase />

      {/* 6. Newsletter & Alertas VIP */}
      <NewsletterSection />
    </div>
  );
}
