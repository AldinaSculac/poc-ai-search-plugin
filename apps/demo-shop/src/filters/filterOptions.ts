import type { Category, Product } from '../types';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export interface FilterOptions {
  categories: Category[];
  colors: string[];
  clothingSizes: string[];
  shoeSizes: string[];
  minPrice: number;
  maxPrice: number;
}

/** Derives the available filter values from the catalogue. */
export function getFilterOptions(products: Product[]): FilterOptions {
  const unique = <T>(values: T[]) => [...new Set(values)];
  const sizes = unique(products.flatMap((product) => product.sizes));
  const prices = products.map((product) => product.price);

  return {
    categories: unique(products.map((product) => product.category)),
    colors: unique(products.flatMap((product) => product.colors)).sort(),
    clothingSizes: CLOTHING_SIZES.filter((size) => sizes.includes(size)),
    shoeSizes: sizes.filter((size) => !CLOTHING_SIZES.includes(size)).sort((a, b) => +a - +b),
    // Rounded to tens, and never below 10 so a price limit always leaves something to show.
    minPrice: Math.max(10, Math.floor(Math.min(...prices) / 10) * 10),
    maxPrice: Math.ceil(Math.max(...prices) / 10) * 10,
  };
}
