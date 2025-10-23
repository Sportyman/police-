export interface Category {
  id: string;
  name: string;
  order: number;
}

export type ProductTag = string;

export interface Variant {
  id: string;
  name: string; // e.g., 'Black', 'Large'
  price: number;
  stock: number; // 0 means out of stock
  imageUrls: string[];
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  order: number;
  isPopular?: boolean;
  variants: Variant[];
  specifications: Specification[];
  tags: ProductTag[];
  videoUrl?: string;
}