const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(value: number): string {
  return brlFormatter.format(value);
}

export function calculateDiscountPercent(
  originalPrice?: number,
  price?: number
): number {
  if (!originalPrice || !price || originalPrice <= price) {
    return 0;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export interface InstallmentsInfo {
  count: number;
  value: number;
  formatted: string;
}

export function calculateInstallments(price: number): InstallmentsInfo {
  const count = price >= 200 ? 10 : 3;
  const value = price / count;
  return {
    count,
    value,
    formatted: `${count}x de ${formatBRL(value)} sem juros`,
  };
}
