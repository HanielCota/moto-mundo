import { Store, ShieldCheck, Wrench, Truck } from "lucide-react";

export function TrustBar() {
  const benefits = [
    {
      icon: Store,
      title: "Lojas Especializadas",
      description: "Marcas e importadoras oficiais reunidas",
    },
    {
      icon: ShieldCheck,
      title: "Compra Protegida",
      description: "Garantia total do pagamento à entrega",
    },
    {
      icon: Wrench,
      title: "Produtos Homologados",
      description: "Peças testadas em trilha e motocross",
    },
    {
      icon: Truck,
      title: "Envio Rápido Brasil",
      description: "Opções expressas com rastreamento",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-md shadow-zinc-950/5 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
        {benefits.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3.5 ${
                index > 0 ? "pt-3 sm:pt-0 sm:pl-6" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
