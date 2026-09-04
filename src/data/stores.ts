import { Store } from "@/types";

export const STORES: Store[] = [
  {
    id: "store-edgar-racing",
    slug: "edgar-racing",
    name: "Edgar Racing",
    description:
      "Referência mineira em preparação de motores e equipamentos de alta performance para motocross, velocross e trilha pesada.",
    logo: "/images/products/motor.jpg",
    banner: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&h=400&q=80",
    rating: 4.9,
    ratingCount: 342,
    city: "Belo Horizonte",
    state: "MG",
    address: "Rua da Oficina, 420",
    neighborhood: "Santa Efigênia",
    activeYears: 14,
    pickupAvailable: true,
    shippingPolicy:
      "Envios despachados em até 24h úteis para todo o Brasil com código de rastreamento direto no e-mail.",
    returnPolicy:
      "Garantia de 90 dias e devolução gratuita em até 7 dias corridos após o recebimento da mercadoria.",
    instagram: "https://instagram.com/000000",
    whatsapp: "https://wa.me/00000000000",
    specialties: ["Motores", "Preparação", "Pistões"],
  },
  {
    id: "store-america-racing",
    slug: "america-racing",
    name: "America Racing",
    description:
      "Especialistas em importação de peças especiais, suspensões preparadas e escapamentos esportivos para motos japonesas e europeias.",
    logo: "/images/products/escapamento.jpg",
    banner: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&h=400&q=80",
    rating: 4.8,
    ratingCount: 219,
    city: "Campinas",
    state: "SP",
    address: "Av. das Oficinas, 1180",
    neighborhood: "Jardim do Lago",
    activeYears: 9,
    pickupAvailable: true,
    shippingPolicy:
      "Embalagens reforçadas para peças pesadas e entrega expressa via transportadora com seguro total.",
    returnPolicy:
      "Trocas de tamanho sem custo em vestuário e devolução facilitada em até 7 dias.",
    instagram: "https://instagram.com/000000",
    whatsapp: "https://wa.me/00000000000",
    specialties: ["Importados", "Escapamentos", "Rodas"],
  },
  {
    id: "store-gringa-mx",
    slug: "gringa-mx",
    name: "Gringa MX",
    description:
      "O maior estoque de vestuário, botas premium e capacetes das principais marcas globais de motocross e enduro.",
    logo: "/images/products/capacete-1.jpg",
    banner: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&h=400&q=80",
    rating: 4.9,
    ratingCount: 488,
    city: "Curitiba",
    state: "PR",
    address: "Rua do Motocross, 88",
    neighborhood: "Rebouças",
    activeYears: 12,
    pickupAvailable: false,
    shippingPolicy:
      "Coleta diária pelas melhores transportadoras do país. Rastreio em tempo real atualizado a cada etapa.",
    returnPolicy:
      "Garantia estendida do fabricante e troca ágil de numeração de botas e capacetes.",
    instagram: "https://instagram.com/000000",
    whatsapp: "https://wa.me/00000000000",
    specialties: ["Capacetes", "Botas", "Vestuário"],
  },
  {
    id: "store-moto-braga",
    slug: "moto-braga",
    name: "Moto Braga",
    description:
      "Tradição em peças de reposição rápida, pneus com cravos agressivos, câmaras reforçadas e manutenção de trilha.",
    logo: "/images/products/pneu.jpg",
    banner: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=1200&h=400&q=80",
    rating: 4.7,
    ratingCount: 175,
    city: "Chapecó",
    state: "SC",
    address: "Av. Getúlio Vargas, 1550",
    neighborhood: "Centro",
    activeYears: 18,
    pickupAvailable: true,
    shippingPolicy:
      "Despacho prioritário para borracharias e oficinas, com frete econômico competitivo para todo o Sul e Sudeste.",
    returnPolicy:
      "Garantia de fábrica contra defeitos de fabricação em borrachas e componentes mecânicos.",
    instagram: "https://instagram.com/000000",
    whatsapp: "https://wa.me/00000000000",
    specialties: ["Pneus", "Reposição", "Óleos"],
  },
  {
    id: "store-off-road-store",
    slug: "off-road-store",
    name: "Off Road Store",
    description:
      "Sua parceira definitiva em proteções corporais, guidões anatômicos, ferramentas de trilha e kits de adesivos de alta espessura.",
    logo: "/images/products/guidao.jpg",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&h=400&q=80",
    rating: 4.8,
    ratingCount: 260,
    city: "Ribeirão Preto",
    state: "SP",
    address: "Rua das Trilhas, 310",
    neighborhood: "Vila Tibério",
    activeYears: 7,
    pickupAvailable: false,
    shippingPolicy:
      "Postagem ágil e logística integrada com as principais plataformas nacionais de entrega rápida.",
    returnPolicy:
      "Suporte técnico especializado para dúvidas de compatibilidade e devolução garantida.",
    instagram: "https://instagram.com/000000",
    whatsapp: "https://wa.me/00000000000",
    specialties: ["Proteções", "Guidões", "Acessórios"],
  },
];
