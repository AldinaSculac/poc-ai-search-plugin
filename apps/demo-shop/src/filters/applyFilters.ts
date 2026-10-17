import type { Filters, Product } from '../types';

export const emptyFilters: Filters = {
  query: '',
  categories: [],
  gender: null,
  priceMax: null,
  colors: [],
  sizes: [],
};

/** True when any filter other than the text query is set. */
export function hasActiveFilters(filters: Filters) {
  return JSON.stringify({ ...filters, query: '' }) !== JSON.stringify(emptyFilters);
}

const matchesAny = (selected: string[], values: string[]) =>
  selected.length === 0 || selected.some((value) => values.includes(value));

function matchesQuery(product: Product, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = `${product.name} ${product.description}`.toLowerCase();
  return words.every((word) => text.includes(word));
}

function matches(product: Product, filters: Filters) {
  return (
    matchesQuery(product, filters.query) &&
    matchesAny(filters.categories, [product.category]) &&
    (filters.gender === null || product.gender === filters.gender || product.gender === 'unisex') &&
    (filters.priceMax === null || product.price <= filters.priceMax) &&
    matchesAny(filters.colors, product.colors) &&
    matchesAny(filters.sizes, product.sizes)
  );
}

/**
 * Returns the products matching all filters. When `rankedIds` is given (from
 * the AI search), ranked products come first in that order, followed by the
 * remaining matches in catalogue order.
 */
export function applyFilters(products: Product[], filters: Filters, rankedIds?: string[]) {
  const filtered = products.filter((product) => matches(product, filters));
  if (!rankedIds?.length) return filtered;

  const rank = new Map(rankedIds.map((id, index) => [id, index]));
  const position = (product: Product) => rank.get(product.id) ?? Infinity;
  // Array.prototype.sort is stable, so unranked products keep catalogue order.
  return filtered.sort((a, b) => position(a) - position(b));
}
