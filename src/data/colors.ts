export interface ColorOption {
  name: string;
  slug: string;
  hex: string;
  border?: boolean;
}

export const MAIN_COLORS: ColorOption[] = [
  { name: "Preto", slug: "preto", hex: "#18181b", border: false },
  { name: "Branco", slug: "branco", hex: "#ffffff", border: true },
  { name: "Vermelho", slug: "vermelho", hex: "#dc2626", border: false },
  { name: "Azul", slug: "azul", hex: "#2563eb", border: false },
  { name: "Amarelo", slug: "amarelo", hex: "#eab308", border: false },
  { name: "Verde", slug: "verde", hex: "#16a34a", border: false },
  { name: "Laranja", slug: "laranja", hex: "#ea580c", border: false },
];
