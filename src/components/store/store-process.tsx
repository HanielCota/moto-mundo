import { MapPin, Package, CreditCard, Store } from "lucide-react";

const STEPS = [
  {
    n: "1",
    title: "Entra na loja que já conhece",
    text: "Moto Braga, Edgar Racing, Gringa MX… a loja física continua sendo a loja. Só ganha uma vitrine no site.",
    icon: Store,
  },
  {
    n: "2",
    title: "Escolhe no estoque dela",
    text: "O produto sai do balcão daquela loja, não de um depósito genérico.",
    icon: Package,
  },
  {
    n: "3",
    title: "Paga no Moto Mundo",
    text: "PIX, cartão ou boleto. A compra fica registrada e protegida na plataforma.",
    icon: CreditCard,
  },
  {
    n: "4",
    title: "Retira no local ou recebe em casa",
    text: "Quem mora perto passa no balcão. Quem está longe recebe o despacho da própria loja.",
    icon: MapPin,
  },
] as const;

export function StoreProcess() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
          Processo na prática
        </p>
        <h2 className="text-xl font-black text-zinc-950 tracking-tight mt-1">
          A loja física é quem vende
        </h2>
        <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
          Não muda o jeito de trabalhar no balcão. O Moto Mundo só coloca o
          estoque da loja na frente do piloto, no Brasil inteiro.
        </p>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.n}
              className="relative rounded-xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <span className="absolute -top-2.5 left-4 inline-flex size-6 items-center justify-center rounded-full bg-orange-600 text-[11px] font-black text-white">
                {step.n}
              </span>
              <Icon className="size-5 text-orange-600 mt-2 mb-2" />
              <h3 className="text-sm font-bold text-zinc-950 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                {step.text}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
