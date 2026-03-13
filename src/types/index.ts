export interface Product {
  id: string;
  name: string;
  providerPrice?: number;
  price1kg?: number;
  price500g?: number;
  price250g?: number;
  category: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
}

export type SortOption = 'name' | 'price' | 'category';
