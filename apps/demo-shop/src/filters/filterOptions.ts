import type { Category, Product } from '../types';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export interface FilterOptions {
  categories: Category[];
  colors: string[];
  clothingSizes: string[];
  shoeSizes: string[];
  maxPrice: number;
}

/** Derives the available filter values from the catalogue. */
export function getFilterOptions(products: Product[]): FilterOptions {
  const unique = <T>(values: T[]) => [...new Set(values)];
  const sizes = unique(products.flatMap((product) => product.sizes));

  return {
    categories: unique(products.map((product) => product.category)),
    colors: unique(products.flatMap((product) => product.colors)).sort(),
    clothingSizes: CLOTHING_SIZES.filter((size) => sizes.includes(size)),
    shoeSizes: sizes.filter((size) => !CLOTHING_SIZES.includes(size)).sort((a, b) => +a - +b),
    maxPrice: Math.ceil(Math.max(...products.map((product) => product.price)) / 10) * 10,
  };
}
