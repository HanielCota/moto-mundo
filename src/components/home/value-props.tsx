import { Store, ShieldCheck, Wrench, Truck } from "lucide-react";

export function ValueProps() {
  const benefits = [
    {
      icon: Store,
      title: "Várias Lojas Especializadas",
      description:
        "O melhor estoque do Brasil com lojas renomadas de motocross, trilha e velocross reunidas em um só carrinho.",
    },
    {
      icon: ShieldCheck,
      title: "Compra 100% Segura",
      description:
        "Garantia de entrega, dados criptografados e proteção total para seu pagamento do pedido ao recebimento.",
    },
    {
      icon: Wrench,
      title: "Produtos Especializados Off-Road",
      description:
        "Peças originais testadas no barro e na terra, preparações de motor, suspensões e equipamentos homologados.",
    },
    {
      icon: Truck,
      title: "Entrega Rápida em Todo Brasil",
      description:
        "Logística ágil com opções expressas, frete econômico e retirada física para lojas selecionadas.",
    },
  ];

  return (
    <section className="py-14 bg-zinc-950 text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">
            Por que escolher o Moto Mundo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Feito por quem pilota para quem vive sobre duas rodas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-start p-6 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
