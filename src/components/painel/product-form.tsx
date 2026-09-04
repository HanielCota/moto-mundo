"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Product } from "@/types";
import { BRANDS } from "@/data/brands";
import { CATEGORIES } from "@/data/categories";
import { STORES } from "@/data/stores";
import { MAIN_COLORS } from "@/data/colors";
import {
  productFormSchema,
  ProductFormValues,
  PRODUCT_FORM_SIZES,
  PRODUCT_PHOTO_LIBRARY,
} from "@/lib/product-form-schema";
import { slugify } from "@/lib/slug";
import { useSellerCatalog } from "@/hooks/use-seller-catalog";
import { FormField } from "@/components/shared/form-field";
import { ProductCard } from "@/components/product/product-card";
import { PRODUCTS } from "@/data/products";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500";

interface ProductFormProps {
  product?: Product;
}

function toFormValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      description: "",
      brandSlug: "",
      categoryId: "",
      storeId: "",
      department: "unissex",
      price: 0,
      originalPrice: undefined,
      stock: 1,
      sku: "",
      freeShipping: false,
      featured: false,
      dealOfTheWeek: false,
      sizes: [],
      colors: [],
      images: [],
      specs: [
        { key: "Modelo", value: "" },
        { key: "Aplicação", value: "" },
      ],
    };
  }

  return {
    name: product.name,
    description: product.description,
    brandSlug: product.brandSlug || "",
    categoryId: product.categoryId,
    storeId: product.storeId,
    department: product.department || "unissex",
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    sku: product.specs.SKU || product.specs.Código || "",
    freeShipping: product.freeShipping,
    featured: Boolean(product.featured),
    dealOfTheWeek: Boolean(product.dealOfTheWeek),
    sizes: product.sizes || [],
    colors: product.colors || [],
    images: product.images,
    specs: Object.entries(product.specs).map(([key, value]) => ({ key, value })),
  };
}

function buildProduct(
  data: ProductFormValues,
  existing: Product | undefined,
  usedSlugs: Set<string>
): Product {
  const brand = BRANDS.find((item) => item.slug === data.brandSlug);
  let slug = slugify(data.name) || `produto-${Date.now()}`;
  if (existing?.slug === slug) {
    slug = existing.slug;
  } else {
    let suffix = 2;
    const base = slug;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
  }

  const specs: Record<string, string> = {};
  data.specs.forEach((row) => {
    if (row.key.trim() && row.value.trim()) {
      specs[row.key.trim()] = row.value.trim();
    }
  });
  if (data.sku?.trim()) {
    specs.SKU = data.sku.trim();
  }
  if (brand) {
    specs.Marca = brand.name;
  }

  return {
    id: existing?.id ?? `prod-loja-${Date.now()}`,
    slug,
    name: data.name.trim(),
    description: data.description.trim(),
    price: data.price,
    originalPrice: data.originalPrice,
    stock: data.stock,
    categoryId: data.categoryId,
    storeId: data.storeId,
    brand: brand?.name || data.brandSlug,
    brandSlug: brand?.slug || data.brandSlug,
    images: data.images,
    rating: existing?.rating ?? 0,
    ratingCount: existing?.ratingCount ?? 0,
    soldCount: existing?.soldCount ?? 0,
    freeShipping: data.freeShipping,
    specs,
    sizes: data.sizes,
    department: data.department,
    colors: data.colors,
    featured: data.featured,
    dealOfTheWeek: data.dealOfTheWeek,
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { products, upsertProduct } = useSellerCatalog();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValues>,
    defaultValues: toFormValues(product),
  });

  const watched = useWatch({ control });

  const previewProduct = useMemo(() => {
    const used = new Set([
      ...PRODUCTS.map((item) => item.slug),
      ...products.map((item) => item.slug),
    ]);
    try {
      const parsed = productFormSchema.safeParse({
        ...toFormValues(product),
        ...watched,
        images: watched.images?.length ? watched.images : ["/placeholder.jpg"],
        name: watched.name || "Novo produto",
        description:
          watched.description && watched.description.length >= 20
            ? watched.description
            : "Prévia do cadastro do produto na vitrine da loja.",
        brandSlug: watched.brandSlug || BRANDS[0].slug,
        categoryId: watched.categoryId || CATEGORIES[0].id,
        storeId: watched.storeId || STORES[0].id,
        price: watched.price || 1,
      });
      if (!parsed.success) return null;
      return buildProduct(parsed.data, product, used);
    } catch {
      return null;
    }
  }, [watched, product, products]);

  const toggleValue = (field: "sizes" | "colors", value: string) => {
    const current = watched[field] || [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  };

  const toggleImage = (src: string) => {
    const current = watched.images || [];
    const next = current.includes(src)
      ? current.filter((item) => item !== src)
      : [...current, src];
    setValue("images", next, { shouldValidate: true });
  };

  const onSubmit = (data: ProductFormValues) => {
    const used = new Set([
      ...PRODUCTS.map((item) => item.slug),
      ...products
        .filter((item) => item.id !== product?.id)
        .map((item) => item.slug),
    ]);
    const saved = buildProduct(data, product, used);
    upsertProduct(saved);
    toast.success(product ? "Produto atualizado." : "Produto cadastrado na vitrine.");
    router.push("/painel/produtos");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-6">
        <section className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 mb-4">
            1. O que é o produto
          </h2>
          <div className="flex flex-col gap-4">
            <FormField id="name" label="Nome" required error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="Ex: Pneu Pirelli Scorpion MX Extra X 110/90-19"
                className={inputClass}
              />
            </FormField>
            <FormField
              id="description"
              label="Descrição"
              required
              error={errors.description?.message}
            >
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Para que serve, em qual moto encaixa, material, diferencial..."
                className={`${inputClass} h-auto py-2`}
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="brandSlug" label="Marca" required error={errors.brandSlug?.message}>
                <select {...register("brandSlug")} className={inputClass}>
                  <option value="">Selecione</option>
                  {BRANDS.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="categoryId"
                label="Categoria"
                required
                error={errors.categoryId?.message}
              >
                <select {...register("categoryId")} className={inputClass}>
                  <option value="">Selecione</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField id="storeId" label="Loja" required error={errors.storeId?.message}>
                <select {...register("storeId")} className={inputClass}>
                  <option value="">Selecione</option>
                  {STORES.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} — {store.city}/{store.state}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField id="department" label="Departamento">
                <select {...register("department")} className={inputClass}>
                  <option value="unissex">Unissex</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </FormField>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 mb-4">
            2. Preço e estoque
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField id="price" label="Preço de venda (R$)" required error={errors.price?.message}>
              <input type="number" step="0.01" min="0" {...register("price", { valueAsNumber: true })} className={inputClass} />
            </FormField>
            <FormField
              id="originalPrice"
              label="Preço original (de)"
              hint="Opcional, para mostrar desconto"
              error={errors.originalPrice?.message}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("originalPrice", { valueAsNumber: true })}
                className={inputClass}
              />
            </FormField>
            <FormField id="stock" label="Estoque" required error={errors.stock?.message}>
              <input type="number" min="0" step="1" {...register("stock", { valueAsNumber: true })} className={inputClass} />
            </FormField>
            <FormField id="sku" label="SKU / código interno">
              <input {...register("sku")} placeholder="Ex: 1SM-11631-00" className={inputClass} />
            </FormField>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input type="checkbox" {...register("freeShipping")} className="size-4 accent-orange-600" />
              Frete grátis
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input type="checkbox" {...register("featured")} className="size-4 accent-orange-600" />
              Destacar na vitrine
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input type="checkbox" {...register("dealOfTheWeek")} className="size-4 accent-orange-600" />
              Oferta da semana
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 mb-4">
            3. Tamanhos e cores
          </h2>
          <p className="text-xs text-zinc-500 mb-3">Tamanhos</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {PRODUCT_FORM_SIZES.map((size) => {
              const selected = watched.sizes?.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleValue("sizes", size)}
                  className={cn(
                    "h-8 min-w-8 px-2 rounded-lg text-xs font-bold border cursor-pointer",
                    selected
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-zinc-700 border-zinc-200"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 mb-3">Cores</p>
          <div className="flex flex-wrap gap-1.5">
            {MAIN_COLORS.map((color) => {
              const selected = watched.colors?.includes(color.name);
              return (
                <button
                  key={color.slug}
                  type="button"
                  onClick={() => toggleValue("colors", color.name)}
                  className={cn(
                    "h-8 px-3 rounded-lg text-xs font-bold border inline-flex items-center gap-2 cursor-pointer",
                    selected
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-700 border-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "size-3 rounded-full",
                      color.border && "border border-zinc-300"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950 mb-1">
            4. Fotos
          </h2>
          <p className="text-xs text-zinc-500 mb-3">
            Escolha fotos de exemplo ou cole um link. Precisa de pelo menos uma.
          </p>
          {errors.images?.message ? (
            <p className="text-rose-600 text-[11px] font-medium mb-2">{errors.images.message}</p>
          ) : null}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
            {PRODUCT_PHOTO_LIBRARY.map((src) => {
              const selected = watched.images?.includes(src);
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => toggleImage(src)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer",
                    selected ? "border-orange-600" : "border-zinc-200"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
          <FormField id="imageUrl" label="Ou cole a URL de uma foto">
            <div className="flex gap-2">
              <input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                className={inputClass}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  const value = event.currentTarget.value.trim();
                  if (!value) return;
                  const current = watched.images || [];
                  if (!current.includes(value)) {
                    setValue("images", [...current, value], { shouldValidate: true });
                  }
                  event.currentTarget.value = "";
                }}
              />
              <span className="text-[11px] text-zinc-400 self-center whitespace-nowrap">
                Enter para adicionar
              </span>
            </div>
          </FormField>
        </section>

        <section className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">
              5. Ficha técnica
            </h2>
            <button
              type="button"
              onClick={() =>
                setValue("specs", [
                  ...(watched.specs || []).map((item) => ({
                    key: item.key ?? "",
                    value: item.value ?? "",
                  })),
                  { key: "", value: "" },
                ])
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Linha
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {(watched.specs || []).map((_row, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  {...register(`specs.${index}.key`)}
                  placeholder="Ex: Modelo"
                  className={inputClass}
                />
                <input
                  {...register(`specs.${index}.value`)}
                  placeholder="Ex: Tech 7 Enduro"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "specs",
                      (watched.specs || [])
                        .filter((_, i) => i !== index)
                        .map((item) => ({
                          key: item.key ?? "",
                          value: item.value ?? "",
                        }))
                    )
                  }
                  className="size-10 rounded-lg border border-zinc-200 text-zinc-500 hover:text-rose-600 cursor-pointer"
                  aria-label="Remover linha"
                >
                  <Trash2 className="size-4 mx-auto" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white text-sm font-bold"
        >
          {product ? "Salvar alterações" : "Publicar produto na vitrine"}
        </button>
      </div>

      <aside className="xl:sticky xl:top-28 h-fit">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Prévia na vitrine
        </p>
        {previewProduct ? (
          <ProductCard product={previewProduct} />
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
            Preencha o nome e o preço para ver a prévia.
          </div>
        )}
      </aside>
    </form>
  );
}
