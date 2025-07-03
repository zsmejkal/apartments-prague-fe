export interface Apartment {
  id: number;
  hash_id: number;
  name: string;
  price: number;
  price_unit: string;
  locality: string;
  size_sqm: number | null;
  room_layout: string | null;
  has_garage: boolean;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  date_created: string;
  date_updated: string;
}

export interface ApartmentFilters {
  skip?: number;
  limit?: number;
  min_price?: number | null;
  max_price?: number | null;
  min_size?: number | null;
  max_size?: number | null;
  has_garage?: boolean | null;
  room_layout?: string | null;
}