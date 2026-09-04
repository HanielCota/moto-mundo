import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout Seguro",
  description: "Finalize seu pedido com frete simulado e pagamento seguro.",
};

export default async function CheckoutPage() {
  return <CheckoutView />;
}
