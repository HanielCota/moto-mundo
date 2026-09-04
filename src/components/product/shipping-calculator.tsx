"use client";

import { useState } from "react";
import { Truck, MapPin, Check, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { formatCEP } from "@/lib/cpf";
import { isValidCEP, getAddressFromCEP, SHIPPING_RATES } from "@/lib/shipping";

interface ShippingCalculatorProps {
  freeShipping: boolean;
  pickupAvailable: boolean;
}

export function ShippingCalculator({
  freeShipping,
  pickupAvailable,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<{
    city: string;
    state: string;
    neighborhood: string;
  } | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidCEP(cep)) {
      setError("CEP inválido. Digite 8 números (ex: 35900-000)");
      setHasCalculated(false);
      setAddress(null);
      return;
    }

    setError(null);
    const mockAddr = await getAddressFromCEP(cep);
    setAddress(mockAddr);
    setHasCalculated(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCep(formatCEP(raw));
    if (error) setError(null);
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
        <Truck className="w-4 h-4 text-orange-600" />
        Calcular Frete e Prazo de Entrega
      </div>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={cep}
            onChange={handleInputChange}
            placeholder="00000-000"
            maxLength={9}
            className="w-full h-9 px-3 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shrink-0"
        >
          Calcular
        </button>
      </form>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}

      {hasCalculated && address && (
        <div className="space-y-3 pt-2 border-t border-zinc-200 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <MapPin className="w-3 h-3 text-zinc-400" />
            <span>
              Entrega para: <strong className="text-zinc-800">{address.neighborhood}, {address.city}/{address.state}</strong>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Opção Econômica */}
            <div className="flex items-center justify-between p-2 rounded-md bg-white border border-zinc-200">
              <div>
                <span className="font-semibold text-zinc-900 block">
                  {freeShipping ? "Frete Grátis (Econômico)" : SHIPPING_RATES.economica.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {freeShipping ? SHIPPING_RATES.gratis.estimatedDays : SHIPPING_RATES.economica.estimatedDays}
                </span>
              </div>
              <span className="font-bold text-emerald-700">
                {freeShipping ? "Grátis" : formatBRL(SHIPPING_RATES.economica.price)}
              </span>
            </div>

            {/* Opção Expressa */}
            <div className="flex items-center justify-between p-2 rounded-md bg-white border border-zinc-200">
              <div>
                <span className="font-semibold text-zinc-900 block">
                  {SHIPPING_RATES.expressa.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {SHIPPING_RATES.expressa.estimatedDays}
                </span>
              </div>
              <span className="font-bold text-zinc-900">
                {formatBRL(SHIPPING_RATES.expressa.price)}
              </span>
            </div>

            {/* Opção Retirada */}
            {pickupAvailable && (
              <div className="flex items-center justify-between p-2 rounded-md bg-white border border-zinc-200">
                <div>
                  <span className="font-semibold text-zinc-900 block flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {SHIPPING_RATES.retirada.name}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {SHIPPING_RATES.retirada.estimatedDays}
                  </span>
                </div>
                <span className="font-bold text-emerald-700">Grátis</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
