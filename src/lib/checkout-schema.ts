import { z } from "zod";
import { isValidCPF } from "./cpf";

export const checkoutSchema = z
  .object({
    // 1. Identificação
    fullName: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .refine(
        (val) => val.trim().split(" ").length >= 2,
        "Digite seu nome e sobrenome completo"
      ),
    email: z.string().email("Digite um e-mail válido"),
    phone: z
      .string()
      .min(10, "Telefone incompleto")
      .refine((val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 11;
      }, "Digite um telefone com DDD válido (10 ou 11 dígitos)"),
    cpf: z
      .string()
      .min(11, "CPF incompleto")
      .refine((val) => isValidCPF(val), "CPF inválido (dígitos verificadores incorretos)"),

    // 2. Endereço
    cep: z
      .string()
      .min(8, "CEP incompleto")
      .refine((val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length === 8;
      }, "CEP deve ter 8 números"),
    street: z.string().min(2, "Rua/Avenida obrigatória"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro obrigatório"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z
      .string()
      .length(2, "UF deve conter exatamente 2 letras")
      .toUpperCase(),

    // 3. Entrega por loja (storeId -> optionId)
    shippingSelections: z.record(z.string(), z.string()),

    // 4. Pagamento
    paymentMethod: z.enum(["pix", "cartao", "boleto"]),

    // Campos do Cartão (validados se paymentMethod === "cartao")
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    installments: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "cartao") {
      // Cartão: 13 a 19 dígitos
      const cardDigits = (data.cardNumber || "").replace(/\D/g, "");
      if (cardDigits.length < 13 || cardDigits.length > 19) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número do cartão inválido (entre 13 e 19 dígitos)",
          path: ["cardNumber"],
        });
      }

      // Nome no cartão
      if (!data.cardName || data.cardName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Digite o nome como impresso no cartão",
          path: ["cardName"],
        });
      }

      // Validade MM/AA futura
      const expiry = (data.expiryDate || "").trim();
      const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Validade inválida (use o formato MM/AA)",
          path: ["expiryDate"],
        });
      } else {
        const month = parseInt(expiryMatch[1], 10);
        const year = 2000 + parseInt(expiryMatch[2], 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mês de expiração deve ser entre 01 e 12",
            path: ["expiryDate"],
          });
        } else if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A data de validade deve ser futura",
            path: ["expiryDate"],
          });
        }
      }

      // CVV: 3 ou 4 dígitos
      const cvvDigits = (data.cvv || "").replace(/\D/g, "");
      if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVV deve ter 3 ou 4 dígitos",
          path: ["cvv"],
        });
      }
    }
  });

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
