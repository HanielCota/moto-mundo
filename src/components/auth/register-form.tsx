"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { registerSchema, RegisterSchemaType } from "@/lib/auth-schema";
import { useAuth } from "@/hooks/use-auth";
import { FormField } from "@/components/shared/form-field";
import { formatPhone } from "@/lib/cpf";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerAccount } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsSubmitting(true);
    try {
      const result = await registerAccount({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Novo piloto
          </span>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mt-1">
            Criar conta
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Cadastre-se para acompanhar pedidos e salvar seus dados de entrega.
          </p>
        </div>

        <FormField
          id="fullName"
          label="Nome completo"
          required
          error={errors.fullName?.message}
        >
          <input
            type="text"
            autoComplete="name"
            placeholder="Nome e sobrenome"
            {...register("fullName")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="email" label="E-mail" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            {...register("email")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="phone" label="WhatsApp" required error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="(31) 99999-0000"
            {...register("phone")}
            onChange={(event) => {
              setValue("phone", formatPhone(event.target.value), {
                shouldValidate: true,
              });
            }}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="password" label="Senha" required error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            {...register("password")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirmar senha"
          required
          error={errors.confirmPassword?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            {...register("confirmPassword")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Criar conta
        </button>

        <p className="text-xs text-zinc-500 text-center">
          Já tem conta?{" "}
          <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
