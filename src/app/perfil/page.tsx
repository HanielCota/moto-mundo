import type { Metadata } from "next";
import { ProfileView } from "@/components/auth/profile-view";

export const metadata: Metadata = {
  title: "Meu perfil",
  description: "Gerencie seus dados, pedidos e favoritos no Moto Mundo.",
};

export default function PerfilPage() {
  return <ProfileView />;
}
