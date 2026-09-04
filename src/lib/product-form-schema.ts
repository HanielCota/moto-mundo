import { z } from "zod";

const optionalPrice = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}, z.number().positive("Preço inválido").optional());

export const productFormSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    description: z
      .string()
      .min(20, "Descreva o produto com pelo menos 20 caracteres"),
    brandSlug: z.string().min(1, "Selecione a marca"),
    categoryId: z.string().min(1, "Selecione a categoria"),
    storeId: z.string().min(1, "Selecione a loja"),
    department: z.enum(["masculino", "feminino", "unissex"]),
    price: z.number({ error: "Informe o preço de venda" }).positive("Informe o preço de venda"),
    originalPrice: optionalPrice,
    stock: z.number({ error: "Informe o estoque" }).int().min(0, "Estoque não pode ser negativo"),
    sku: z.string().optional(),
    freeShipping: z.boolean(),
    featured: z.boolean(),
    dealOfTheWeek: z.boolean(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    images: z.array(z.string().min(1)).min(1, "Adicione pelo menos uma foto"),
    specs: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.originalPrice !== undefined &&
      data.originalPrice > 0 &&
      data.originalPrice <= data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O preço original deve ser maior que o de venda",
        path: ["originalPrice"],
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const PRODUCT_FORM_SIZES = [
  "P",
  "M",
  "G",
  "GG",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "STD",
  "1L",
] as const;

export const PRODUCT_PHOTO_LIBRARY = [
  "/images/products/capacete-1.jpg",
  "/images/products/capacete-2.jpg",
  "/images/products/bota-1.jpg",
  "/images/products/bota-fox.jpg",
  "/images/products/colete.jpg",
  "/images/products/conjunto.jpg",
  "/images/products/luva.jpg",
  "/images/products/pneu.jpg",
  "/images/products/rodas.jpg",
  "/images/products/guidao.jpg",
  "/images/products/escapamento.jpg",
  "/images/products/motor.jpg",
  "/images/products/pistao.jpg",
  "/images/products/oleo.jpg",
  "/images/products/joelheira.jpg",
  "/images/products/oculos.jpg",
] as const;
