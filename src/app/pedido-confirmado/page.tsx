"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Order } from "@/types";
import { formatBRL } from "@/lib/format";
import {
  CheckCircle2,
  PackageCheck,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Clock,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const emptySubscribe = () => () => {};

let cachedRaw: string | null = null;
let cachedOrder: Order | null = null;

function getStoredOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("moto-mundo-last-order");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedOrder = raw ? (JSON.parse(raw) as Order) : null;
    }
    return cachedOrder;
  } catch {
    return null;
  }
}

export default function PedidoConfirmadoPage() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const order = useSyncExternalStore(
    emptySubscribe,
    getStoredOrder,
    () => null
  );

  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!order) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(order.id);
        setCopied(true);
        toast.success("Código do pedido copiado!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.info(`Código: ${order.id}`);
      }
    } catch {
      toast.info(`Código: ${order.id}`);
    }
  };

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-zinc-600">Carregando detalhes do seu pedido...</p>
      </div>
    );
  }

  // Empty State if no order exists in sessionStorage
  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-5">
            <HelpCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
            Nenhum pedido recente encontrado
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mb-8 leading-relaxed">
            Parece que você ainda não finalizou uma compra ou a sessão anterior expirou. Visite nosso catálogo para conferir as peças e equipamentos.
          </p>

          <Link
            href="/produtos"
            className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Ir para o Catálogo de Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Success Hero Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs text-center flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
          Compra Concluída com Sucesso
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          Obrigado por comprar no Moto Mundo!
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mt-2 leading-relaxed">
          Enviamos uma confirmação detalhada para o e-mail{" "}
          <strong className="text-zinc-900">{order.customer.email}</strong>.
        </p>

        {/* Order ID Tag */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200">
          <span className="text-xs text-zinc-500 font-medium">Código do Pedido:</span>
          <span className="font-mono text-base font-black text-zinc-950 tracking-wider">
            {order.id}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Copiar código do pedido"
            className="p-1 rounded-md hover:bg-zinc-200 text-zinc-600 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Fictitious Next Steps Timeline */}
      <div className="bg-zinc-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Próximos Passos do seu Pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">1. Pedido Registrado</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Pagamento confirmado e distribuído aos estoques dos vendedores parceiros.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">2. Separação na Loja</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                As lojas conferem as peças e realizam a embalagem reforçada para envio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3. Envio & Rastreamento</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Código de rastreio de cada pacote enviado diretamente para seu e-mail.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer & Delivery Address */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
            <MapPin className="w-4 h-4 text-orange-600" />
            Destinatário & Endereço
          </h2>

          <div className="text-xs space-y-2 text-zinc-600">
            <p>
              <strong className="text-zinc-900">{order.customer.fullName}</strong>
            </p>
            <p>CPF: {order.customer.cpf}</p>
            <p>Telefone: {order.customer.phone}</p>
            <p className="pt-2 border-t border-zinc-100 text-zinc-700">
              {order.address.street}, nº {order.address.number}
              {order.address.complement && ` • ${order.address.complement}`}
              <br />
              {order.address.neighborhood} — {order.address.city}/{order.address.state}
              <br />
              <span className="font-mono font-medium">CEP {order.address.cep}</span>
            </p>
          </div>
        </div>

        {/* Payment & Delivery Details */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
            <CreditCard className="w-4 h-4 text-orange-600" />
            Pagamento & Envios
          </h2>

          <div className="text-xs space-y-3 text-zinc-600">
            <div className="flex items-center justify-between">
              <span>Método de Pagamento:</span>
              <span className="font-bold text-zinc-900 uppercase">
                {order.paymentMethod === "pix" && "PIX (Instantâneo)"}
                {order.paymentMethod === "cartao" && `Cartão (${order.installments || 1}x)`}
                {order.paymentMethod === "boleto" && "Boleto Bancário"}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-100">
              <span className="font-semibold text-zinc-800 block mb-1">
                Modalidades por loja:
              </span>
              {Object.values(order.shipping).map((shp) => (
                <div key={shp.storeId} className="flex justify-between text-[11px]">
                  <span>{shp.storeName}:</span>
                  <span className="font-medium text-zinc-900">
                    {shp.name} ({shp.estimatedDays})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Items Summary Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs mb-8">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-orange-600" />
            Itens do Pedido ({order.items.length})
          </h2>
        </div>

        <div className="divide-y divide-zinc-100 p-5">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    Loja: {item.storeName} • Qtd: {item.quantity}x
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-zinc-900 shrink-0">
                {formatBRL(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="p-5 bg-zinc-50/70 border-t border-zinc-200 text-xs text-zinc-600 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-zinc-900">{formatBRL(order.totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete total:</span>
            <span className="font-semibold text-zinc-900">
              {order.totals.shippingTotal === 0 ? "Grátis" : formatBRL(order.totals.shippingTotal)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-950">
            <span>Valor Total:</span>
            <span className="text-base text-orange-600 font-black">
              {formatBRL(order.totals.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Final Action CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/produtos"
          className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          Continuar Comprando
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="h-12 px-8 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-sm font-semibold flex items-center justify-center transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
