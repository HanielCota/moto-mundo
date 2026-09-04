import { ShippingOptionId } from "./shipping";

export type PaymentMethodType = "pix" | "cartao" | "boleto";

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CardFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  installments: number;
}

export interface CheckoutFormData {
  // Identification
  fullName: string;
  email: string;
  phone: string;
  cpf: string;

  // Address
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;

  // Payment
  paymentMethod: PaymentMethodType;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  installments?: number;

  // Shipping selections per store
  shippingSelections: Record<string, ShippingOptionId>;
}
