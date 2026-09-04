import { Order } from "./order";

export interface UserAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  passwordHash: string;
  createdAt: string;
  addresses: UserAddress[];
  orders: Order[];
}

export type PublicUser = Omit<UserAccount, "passwordHash">;

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ProfileUpdatePayload {
  fullName: string;
  phone: string;
  cpf: string;
}
