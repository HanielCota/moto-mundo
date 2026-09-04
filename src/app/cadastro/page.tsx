import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Cadastre-se no Moto Mundo para acompanhar pedidos e salvar seus dados.",
};

export default function CadastroPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-sand">
      <RegisterForm />
    </div>
  );
}
