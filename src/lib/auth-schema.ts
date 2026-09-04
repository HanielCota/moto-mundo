import { z } from "zod";
import { isValidCPF } from "./cpf";

export const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .refine(
        (value) => value.trim().split(" ").length >= 2,
        "Digite nome e sobrenome"
      ),
    email: z.string().email("Digite um e-mail válido"),
    phone: z
      .string()
      .min(10, "Telefone incompleto")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 11;
      }, "Digite um telefone com DDD válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .refine(
      (value) => value.trim().split(" ").length >= 2,
      "Digite nome e sobrenome"
    ),
  phone: z
    .string()
    .min(10, "Telefone incompleto")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }, "Digite um telefone com DDD válido"),
  cpf: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === "") return true;
      return isValidCPF(value);
    }, "CPF inválido"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ProfileSchemaType = z.infer<typeof profileSchema>;
