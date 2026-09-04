"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutSchemaType } from "@/lib/checkout-schema";
import { useCart } from "@/hooks/use-cart";
import { groupCartByStore, calculateCartTotals } from "@/lib/cart";
import { formatBRL, calculateInstallments } from "@/lib/format";
import { formatCPF, formatPhone, formatCEP } from "@/lib/cpf";
import { isValidCEP, getAddressFromCEP, getStoreShippingOptions, SHIPPING_RATES } from "@/lib/shipping";
import { getStoreByIdSync } from "@/lib/products";
import { FormField } from "@/components/shared/form-field";
import { Order, OrderShippingInfo, ShippingOptionId } from "@/types";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  Loader2,
  Lock,
  ArrowLeft,
} from "lucide-react";

// Generate random order code: MM-XXXXXX
function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MM-${code}`;
}

export function CheckoutView() {
  const router = useRouter();
  const { items, isHydrated, clearCart } = useCart();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Group items by store
  const storeGroups = useMemo(() => groupCartByStore(items), [items]);

  // Initial shipping selections: "economica" for all stores
  const initialShippingSelections: Record<string, ShippingOptionId> = useMemo(() => {
    const map: Record<string, ShippingOptionId> = {};
    storeGroups.forEach((group) => {
      map[group.storeId] = "economica";
    });
    return map;
  }, [storeGroups]);

  // Setup react-hook-form with zodResolver
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cpf: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      shippingSelections: initialShippingSelections,
      paymentMethod: "pix",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      installments: 1,
    },
  });

  // Watch key fields via useWatch
  const currentPaymentMethod = useWatch({ control, name: "paymentMethod" }) || "pix";
  const currentShippingSelections = useWatch({ control, name: "shippingSelections" }) || initialShippingSelections;
  const currentCep = useWatch({ control, name: "cep" }) || "";

  // Redirect if cart is empty after hydration
  useEffect(() => {
    if (isHydrated && items.length === 0 && !isSubmittingOrder) {
      router.push("/carrinho");
    }
  }, [isHydrated, items, router, isSubmittingOrder]);

  // Calculate actual shipping costs based on selected options per store
  const customShippingByStore = useMemo(() => {
    const costMap: Record<string, number> = {};

    storeGroups.forEach((group) => {
      const selectedOptionId = currentShippingSelections[group.storeId] || "economica";

      if (selectedOptionId === "retirada") {
        costMap[group.storeId] = 0;
      } else if (selectedOptionId === "expressa") {
        costMap[group.storeId] = SHIPPING_RATES.expressa.price;
      } else {
        // Economica
        costMap[group.storeId] = group.allFreeShipping ? 0 : SHIPPING_RATES.economica.price;
      }
    });

    return costMap;
  }, [storeGroups, currentShippingSelections]);

  // Calculate overall totals through calculateCartTotals
  const totals = useMemo(() => {
    return calculateCartTotals(items, customShippingByStore);
  }, [items, customShippingByStore]);

  const installmentsInfo = calculateInstallments(totals.total);

  // Auto-fill address when valid CEP is typed
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setValue("cep", formatted, { shouldValidate: true });

    if (isValidCEP(formatted)) {
      const mockAddr = await getAddressFromCEP(formatted);
      if (mockAddr) {
        setValue("street", mockAddr.street, { shouldValidate: true });
        setValue("neighborhood", mockAddr.neighborhood, { shouldValidate: true });
        setValue("city", mockAddr.city, { shouldValidate: true });
        setValue("state", mockAddr.state, { shouldValidate: true });
      }
    }
  };

  // Submit handler
  const onSubmit = async (data: CheckoutSchemaType) => {
    setIsSubmittingOrder(true);

    // Simulate 1.5s processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Construct final Order object without sensitive card details
    const shippingMap: Record<string, OrderShippingInfo> = {};

    storeGroups.forEach((group) => {
      const optionId = data.shippingSelections[group.storeId] || "economica";
      let name: string = SHIPPING_RATES.economica.name;
      let price = group.allFreeShipping ? 0 : SHIPPING_RATES.economica.price;
      let days: string = SHIPPING_RATES.economica.estimatedDays;

      if (optionId === "expressa") {
        name = SHIPPING_RATES.expressa.name;
        price = SHIPPING_RATES.expressa.price;
        days = SHIPPING_RATES.expressa.estimatedDays;
      } else if (optionId === "retirada") {
        name = SHIPPING_RATES.retirada.name;
        price = 0;
        days = SHIPPING_RATES.retirada.estimatedDays;
      }

      shippingMap[group.storeId] = {
        storeId: group.storeId,
        storeName: group.storeName,
        optionId,
        name,
        price,
        estimatedDays: days,
      };
    });

    const newOrder: Order = {
      id: generateOrderCode(),
      createdAt: new Date().toISOString(),
      items: [...items],
      totals: { ...totals },
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
      },
      address: {
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
      shipping: shippingMap,
      paymentMethod: data.paymentMethod,
      installments: data.paymentMethod === "cartao" ? data.installments || 1 : undefined,
    };

    // Save to sessionStorage (DO NOT store sensitive card data)
    sessionStorage.setItem("moto-mundo-last-order", JSON.stringify(newOrder));

    // Clear cart
    clearCart();

    // Redirect to confirmation page
    router.push("/pedido-confirmado");
  };

  if (!isHydrated || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-600 mb-4" />
        <p className="text-sm text-zinc-600">Preparando checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
        <div>
          <Link
            href="/carrinho"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao carrinho
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
            Finalizar Compra
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Checkout Simulado 100% Seguro</span>
        </div>
      </div>

      {/* Main Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Columns (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. IDENTIFICAÇÃO */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider">
                  Identificação do Comprador
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <FormField
                  id="fullName"
                  label="Nome Completo"
                  required
                  error={errors.fullName?.message}
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    placeholder="ex: Carlos Alberto Ferreira"
                    {...register("fullName")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* Email */}
                <FormField
                  id="email"
                  label="E-mail para Confirmação"
                  required
                  error={errors.email?.message}
                >
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    {...register("email")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* Phone */}
                <FormField
                  id="phone"
                  label="Telefone Celular com DDD"
                  required
                  error={errors.phone?.message}
                >
                  <input
                    type="tel"
                    placeholder="(31) 98888-7777"
                    maxLength={15}
                    {...register("phone", {
                      onChange: (e) => setValue("phone", formatPhone(e.target.value)),
                    })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* CPF */}
                <FormField
                  id="cpf"
                  label="CPF (Validação com dígitos verificadores)"
                  required
                  error={errors.cpf?.message}
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    {...register("cpf", {
                      onChange: (e) => setValue("cpf", formatCPF(e.target.value)),
                    })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </FormField>
              </div>
            </section>

            {/* 2. ENDEREÇO DE ENTREGA */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider">
                  Endereço de Entrega
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 text-xs">
                {/* CEP */}
                <FormField
                  id="cep"
                  label="CEP (Auto-preenche Itabira/MG)"
                  required
                  error={errors.cep?.message}
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    placeholder="35900-000"
                    maxLength={9}
                    value={currentCep}
                    onChange={handleCepChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </FormField>

                {/* Street */}
                <FormField
                  id="street"
                  label="Rua / Avenida"
                  required
                  error={errors.street?.message}
                  className="sm:col-span-6"
                >
                  <input
                    type="text"
                    placeholder="Rua Tiradentes"
                    {...register("street")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* Number */}
                <FormField
                  id="number"
                  label="Número"
                  required
                  error={errors.number?.message}
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    placeholder="450"
                    {...register("number")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* Complement */}
                <FormField
                  id="complement"
                  label="Complemento (opcional)"
                  className="sm:col-span-4"
                >
                  <input
                    type="text"
                    placeholder="Apto 102, Galpão B..."
                    {...register("complement")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* Neighborhood */}
                <FormField
                  id="neighborhood"
                  label="Bairro"
                  required
                  error={errors.neighborhood?.message}
                  className="sm:col-span-2"
                >
                  <input
                    type="text"
                    placeholder="Centro"
                    {...register("neighborhood")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* City */}
                <FormField
                  id="city"
                  label="Cidade"
                  required
                  error={errors.city?.message}
                  className="sm:col-span-3"
                >
                  <input
                    type="text"
                    placeholder="Itabira"
                    {...register("city")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </FormField>

                {/* State */}
                <FormField
                  id="state"
                  label="UF"
                  required
                  error={errors.state?.message}
                  className="sm:col-span-1"
                >
                  <input
                    type="text"
                    placeholder="MG"
                    maxLength={2}
                    {...register("state")}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </FormField>
              </div>
            </section>

            {/* 3. OPÇÕES DE ENTREGA POR LOJA */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider">
                    Opções de Entrega por Loja
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Escolha a velocidade de envio desejada para cada parceiro do seu pedido.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {storeGroups.map((group) => {
                  const store = getStoreByIdSync(group.storeId);
                  const availableOptions = getStoreShippingOptions(
                    group.storeId,
                    group.items,
                    store?.pickupAvailable ?? false
                  );
                  const currentSelected = currentShippingSelections[group.storeId] || "economica";

                  return (
                    <fieldset
                      key={group.storeId}
                      className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3"
                    >
                      <legend className="sr-only">
                        Opções de envio da loja {group.storeName}
                      </legend>
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-orange-600" />
                          Envio de: {group.storeName}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {group.items.length} {group.items.length === 1 ? "item" : "itens"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {availableOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              currentSelected === option.id
                                ? "border-orange-600 bg-white ring-1 ring-orange-500/30"
                                : "border-zinc-200 bg-white hover:border-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`shipping-${group.storeId}`}
                                value={option.id}
                                checked={currentSelected === option.id}
                                onChange={() => {
                                  setValue(`shippingSelections.${group.storeId}`, option.id, {
                                    shouldValidate: true,
                                  });
                                }}
                                className="w-4 h-4 text-orange-600 border-zinc-300 focus:ring-orange-500"
                              />
                              <div>
                                <span className="text-xs font-bold text-zinc-900 block">
                                  {option.name}
                                </span>
                                <span className="text-[11px] text-zinc-500">
                                  {option.estimatedDays}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-zinc-900">
                              {option.price === 0 ? (
                                <span className="text-emerald-700">Grátis</span>
                              ) : (
                                formatBRL(option.price)
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </section>

            {/* 4. FORMA DE PAGAMENTO */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider">
                  Forma de Pagamento
                </h2>
              </div>

              {/* Payment selector tabs */}
              <fieldset className="mb-6">
                <legend className="sr-only">Escolha a Forma de Pagamento</legend>
                <div className="grid grid-cols-3 gap-3">
                  {/* PIX */}
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      currentPaymentMethod === "pix"
                        ? "border-orange-600 bg-orange-50/40 text-orange-950 font-bold ring-1 ring-orange-500/30"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="pix"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <QrCode className="w-5 h-5 text-orange-600 mb-1" />
                    <span className="text-xs font-semibold">PIX</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Aprovação imediata</span>
                  </label>

                  {/* Cartão de Crédito */}
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      currentPaymentMethod === "cartao"
                        ? "border-orange-600 bg-orange-50/40 text-orange-950 font-bold ring-1 ring-orange-500/30"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="cartao"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <CreditCard className="w-5 h-5 text-orange-600 mb-1" />
                    <span className="text-xs font-semibold">Cartão de Crédito</span>
                    <span className="text-[10px] text-zinc-500">Até 10x sem juros</span>
                  </label>

                  {/* Boleto */}
                  <label
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      currentPaymentMethod === "boleto"
                        ? "border-orange-600 bg-orange-50/40 text-orange-950 font-bold ring-1 ring-orange-500/30"
                        : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      value="boleto"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <FileText className="w-5 h-5 text-orange-600 mb-1" />
                    <span className="text-xs font-semibold">Boleto Bancário</span>
                    <span className="text-[10px] text-zinc-500">Compensação em 1 dia</span>
                  </label>
                </div>
              </fieldset>

              {/* PIX Details */}
              {currentPaymentMethod === "pix" && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
                  <p className="font-semibold text-zinc-900">
                    Pagamento Instantâneo via PIX
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    Ao confirmar o pedido, o código PIX Copia e Cola será gerado para que você realize o pagamento no app do seu banco com desconto e aprovação imediata.
                  </p>
                </div>
              )}

              {/* Boleto Details */}
              {currentPaymentMethod === "boleto" && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
                  <p className="font-semibold text-zinc-900">
                    Boleto Bancário
                  </p>
                  <p className="text-zinc-600 leading-relaxed">
                    O boleto será gerado após a confirmação com vencimento em até 3 dias úteis. A loja iniciará a separação do pacote após a compensação bancária.
                  </p>
                </div>
              )}

              {/* Cartão de Crédito Fields (Visible ONLY when selected) */}
              {currentPaymentMethod === "cartao" && (
                <div className="space-y-4 pt-2 border-t border-zinc-100 animate-in fade-in-50">
                  <FormField
                    id="cardNumber"
                    label="Número do Cartão (13 a 19 dígitos)"
                    required
                    error={errors.cardNumber?.message}
                  >
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      {...register("cardNumber")}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </FormField>

                  <FormField
                    id="cardName"
                    label="Nome Impresso no Cartão"
                    required
                    error={errors.cardName?.message}
                  >
                    <input
                      type="text"
                      placeholder="CARLOS A FERREIRA"
                      {...register("cardName")}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="expiryDate"
                      label="Validade (MM/AA)"
                      required
                      error={errors.expiryDate?.message}
                    >
                      <input
                        type="text"
                        placeholder="12/28"
                        maxLength={5}
                        {...register("expiryDate")}
                        className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      />
                    </FormField>

                    <FormField
                      id="cvv"
                      label="Código CVV (3 ou 4 dígitos)"
                      required
                      error={errors.cvv?.message}
                    >
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        {...register("cvv")}
                        className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      />
                    </FormField>
                  </div>

                  {/* Parcelamento Select */}
                  <FormField
                    id="installments"
                    label="Parcelas"
                    required
                  >
                    <select
                      {...register("installments", { valueAsNumber: true })}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      {Array.from({ length: installmentsInfo.count }, (_, i) => i + 1).map((num) => {
                        const val = totals.total / num;
                        return (
                          <option key={num} value={num}>
                            {num}x de {formatBRL(val)} sem juros
                          </option>
                        );
                      })}
                    </select>
                  </FormField>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary Grouped by Store (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs sticky top-24 space-y-6">
              <h2 className="text-base font-bold text-zinc-950 uppercase tracking-wider pb-3 border-b border-zinc-200">
                Resumo do Pedido ({items.length} itens)
              </h2>

              {/* Items grouped by store */}
              <div className="space-y-5 max-h-80 overflow-y-auto pr-1">
                {storeGroups.map((group) => {
                  const selectedOptionId = currentShippingSelections[group.storeId] || "economica";
                  const storeShippingCost = customShippingByStore[group.storeId] || 0;

                  return (
                    <div
                      key={group.storeId}
                      className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900 pb-2 border-b border-zinc-200">
                        <span>Loja: {group.storeName}</span>
                        <span className="text-zinc-500 font-normal">
                          {group.items.length} {group.items.length === 1 ? "un." : "unidades"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center gap-3 text-xs"
                          >
                            <div className="relative w-12 h-12 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-zinc-900 truncate">
                                {item.name}
                              </p>
                              <span className="text-[11px] text-zinc-500">
                                {item.quantity}x {formatBRL(item.unitPrice)}
                              </span>
                            </div>
                            <span className="font-bold text-zinc-900">
                              {formatBRL(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-200 text-zinc-600">
                        <span>Frete ({selectedOptionId}):</span>
                        <span className="font-semibold text-zinc-900">
                          {storeShippingCost === 0 ? "Grátis" : formatBRL(storeShippingCost)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals Calculation */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-200 text-xs text-zinc-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal produtos:</span>
                  <span className="font-semibold text-zinc-900">
                    {formatBRL(totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Frete total (todas as lojas):</span>
                  <span className="font-semibold text-zinc-900">
                    {totals.shippingTotal === 0 ? (
                      <span className="text-emerald-700">Grátis</span>
                    ) : (
                      formatBRL(totals.shippingTotal)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-zinc-950">Total Final:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-zinc-950 block">
                      {formatBRL(totals.total)}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      em até {installmentsInfo.count}x sem juros
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-wait"
              >
                {isSubmittingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando pedido...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirmar Pedido Simulado
                  </>
                )}
              </button>

              <div className="p-3 bg-zinc-50 rounded-lg text-[11px] text-zinc-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Ao confirmar, seu pedido será processado no ambiente de simulação e você receberá o código alfanumérico do pedido.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
