export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  ratingCount: number;
  city: string;
  state: string;
  address?: string;
  neighborhood?: string;
  activeYears: number;
  pickupAvailable: boolean;
  shippingPolicy: string;
  returnPolicy: string;
  instagram?: string;
  whatsapp?: string;
  specialties?: string[];
}
