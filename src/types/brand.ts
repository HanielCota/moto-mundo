export type BrandKind = "oem" | "specialist";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  kind: BrandKind;
  origin: string;
  official: boolean;
  instagram?: string;
  whatsapp?: string;
}
