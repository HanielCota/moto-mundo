"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFavoritesStore } from "@/stores/favorites-store";
import { getProductByIdSync } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { formatCPF, formatPhone } from "@/lib/cpf";
import { profileSchema, ProfileSchemaType } from "@/lib/auth-schema";
import { FormField } from "@/components/shared/form-field";
import { ProductCard } from "@/components/product/product-card";
import { SITE_SOCIAL } from "@/data/social";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

type ProfileTab = "dados" | "pedidos" | "favoritos";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "MM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileView() {
  const router = useRouter();
  const { currentUser, isHydrated, logout } = useAuth();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [tab, setTab] = useState<ProfileTab>("dados");

  const favoriteProducts = useMemo(
    () =>
      favoriteIds
        .map((id) => getProductByIdSync(id))
        .filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [favoriteIds]
  );

  if (!isHydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="size-8 mx-auto mb-4 rounded-full border-4 border-orange-600 border-t-transparent animate-spin" />
        <p className="text-sm text-zinc-600">Carregando sua conta...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-xs">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mb-2">
            Entre para ver seu perfil
          </h1>
          <p className="text-xs text-zinc-500 mb-6">
            Acesse pedidos, favoritos e dados de entrega com a sua conta.
          </p>
          <Link
            href="/login?next=/perfil"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold"
          >
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Você saiu da conta.");
    router.push("/");
  };

  const tabs: { id: ProfileTab; label: string; icon: typeof UserRound }[] = [
    { id: "dados", label: "Meus dados", icon: UserRound },
    { id: "pedidos", label: "Pedidos", icon: Package },
    { id: "favoritos", label: "Favoritos", icon: Heart },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="size-14 rounded-2xl bg-zinc-950 text-white text-lg font-black inline-flex items-center justify-center">
            {getInitials(currentUser.fullName)}
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              {currentUser.fullName}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">{currentUser.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/painel"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-zinc-950 text-white text-xs font-bold"
          >
            Painel da loja
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all",
                isActive
                  ? "bg-zinc-950 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "dados" ? (
        <ProfileDataTab />
      ) : null}

      {tab === "pedidos" ? (
        <div className="flex flex-col gap-4">
          {currentUser.orders.length === 0 ? (
            <EmptyBlock
              icon={ShoppingBag}
              title="Nenhum pedido ainda"
              description="Quando você finalizar uma compra, o histórico aparece aqui."
              href="/produtos"
              cta="Ir ao catálogo"
            />
          ) : (
            currentUser.orders.map((order) => (
              <article
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-100">
                  <div>
                    <p className="text-xs font-bold text-zinc-950 font-mono">{order.id}</p>
                    <p className="text-[11px] text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="text-sm font-black text-orange-600">
                    {formatBRL(order.totals.total)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="relative size-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {item.quantity}x • {item.storeName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      {tab === "favoritos" ? (
        favoriteProducts.length === 0 ? (
          <EmptyBlock
            icon={Heart}
            title="Nenhum favorito"
            description="Toque no coração dos produtos para guardar aqui."
            href="/produtos"
            cta="Explorar produtos"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      ) : null}

      <div className="mt-8 p-4 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">Precisa de ajuda com um pedido?</p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Fale com o time Moto Mundo no WhatsApp ou acompanhe no Instagram.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={SITE_SOCIAL.whatsappMessageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold"
          >
            <WhatsAppIcon className="size-3.5" />
            WhatsApp
          </a>
          <a
            href={SITE_SOCIAL.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold"
          >
            <InstagramIcon className="size-3.5 text-pink-400" />
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

function ProfileDataTab() {
  const { currentUser, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: currentUser?.fullName ?? "",
      phone: currentUser?.phone ?? "",
      cpf: currentUser?.cpf ?? "",
    },
  });

  if (!currentUser) return null;

  const onSubmit = (data: ProfileSchemaType) => {
    const result = updateProfile({
      fullName: data.fullName,
      phone: data.phone,
      cpf: data.cpf ?? "",
    });
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const defaultAddress = currentUser.addresses.find((item) => item.isDefault);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col gap-4"
      >
        <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
          Dados pessoais
        </h2>

        <FormField
          id="fullName"
          label="Nome completo"
          required
          error={errors.fullName?.message}
        >
          <input
            type="text"
            {...register("fullName")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="email-readonly" label="E-mail">
          <input
            type="email"
            value={currentUser.email}
            disabled
            className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-500"
          />
        </FormField>

        <FormField id="phone" label="WhatsApp" required error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone")}
            onChange={(event) => {
              setValue("phone", formatPhone(event.target.value), {
                shouldValidate: true,
              });
            }}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="cpf" label="CPF" error={errors.cpf?.message}>
          <input
            type="text"
            {...register("cpf")}
            onChange={(event) => {
              setValue("cpf", formatCPF(event.target.value), { shouldValidate: true });
            }}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-lg bg-zinc-950 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
        >
          Salvar alterações
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider mb-4">
          Endereço de entrega
        </h2>
        {defaultAddress ? (
          <div className="flex items-start gap-3 text-xs text-zinc-600">
            <MapPin className="size-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-zinc-900">{defaultAddress.label}</p>
              <p className="mt-1 leading-relaxed">
                {defaultAddress.street}, nº {defaultAddress.number}
                {defaultAddress.complement ? ` • ${defaultAddress.complement}` : ""}
                <br />
                {defaultAddress.neighborhood} — {defaultAddress.city}/{defaultAddress.state}
                <br />
                CEP {defaultAddress.cep}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 leading-relaxed">
            Nenhum endereço salvo. O endereço informado no checkout fica disponível na
            confirmação do pedido.
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyBlock({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: typeof ShoppingBag;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-10 text-center shadow-xs">
      <div className="size-12 rounded-full bg-orange-50 text-orange-600 inline-flex items-center justify-center mb-3">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-bold text-zinc-950">{title}</h3>
      <p className="text-xs text-zinc-500 mt-1 mb-5">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-zinc-950 text-white text-xs font-bold"
      >
        {cta}
      </Link>
    </div>
  );
}
