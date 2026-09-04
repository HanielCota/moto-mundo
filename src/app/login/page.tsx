import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Moto Mundo para ver pedidos, favoritos e dados de entrega.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-sand">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-96 rounded-2xl bg-white border border-zinc-200 animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
