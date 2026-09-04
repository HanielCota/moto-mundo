"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { loginSchema, LoginSchemaType } from "@/lib/auth-schema";
import { useAuth } from "@/hooks/use-auth";
import { DEMO_CREDENTIALS } from "@/stores/auth-store";
import { FormField } from "@/components/shared/form-field";
import { SITE_SOCIAL } from "@/data/social";
import { InstagramIcon, WhatsAppIcon } from "@/components/shared/icons";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = searchParams.get("next") || "/perfil";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(nextPath.startsWith("/") ? nextPath : "/perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue("email", DEMO_CREDENTIALS.email);
    setValue("password", DEMO_CREDENTIALS.password);
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col gap-5"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Área do piloto
          </span>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight mt-1">
            Entrar na conta
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Acesse pedidos, favoritos e dados de entrega.
          </p>
        </div>

        <FormField id="email" label="E-mail" required error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            {...register("email")}
            className="w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </FormField>

        <FormField id="password" label="Senha" required error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            {...register("password")}
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
            <LogIn className="size-4" />
          )}
          Entrar
        </button>

        <button
          type="button"
          onClick={fillDemo}
          className="text-xs font-semibold text-zinc-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          Usar conta de teste ({DEMO_CREDENTIALS.email})
        </button>

        <p className="text-xs text-zinc-500 text-center">
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-bold text-orange-600 hover:text-orange-700"
          >
            Criar cadastro
          </Link>
        </p>
      </form>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500">
        <a
          href={SITE_SOCIAL.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-pink-600 font-medium"
        >
          <InstagramIcon className="size-3.5 text-pink-500" />
          Instagram
        </a>
        <a
          href={SITE_SOCIAL.whatsappMessageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-emerald-600 font-medium"
        >
          <WhatsAppIcon className="size-3.5 text-emerald-500" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
