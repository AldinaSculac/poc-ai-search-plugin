import { createAiSearch, defineFilterSchema, type AiSearchConfig } from 'ai-search-plugin';
import { anthropicTransport } from 'ai-search-plugin/anthropic';
import { products } from '../data/products';
import { users } from '../data/users';
import { getFilterOptions } from '../filters/filterOptions';
import { loadSessionUserId } from '../session/sessionStorage';
import { getApiKey } from '../settings/apiKeyStorage';
import type { Gender, Product, UserProfile } from '../types';

// Everything the plugin knows about this shop lives in this file. Another shop would write
// its own version: its own schema, product lines, shopper details and rules.

/** Switch to 'claude-sonnet-5-5' for smarter but slower and more expensive searches. */
const MODEL = 'claude-haiku-5-5';

const options = getFilterOptions(products);

// Keys match the shop's `Filters`, so a result drops straight into the filter state.
export const filterSchema = defineFilterSchema({
  query: {
    type: 'text',
    description:
      'Keywords matched against product name and description. Every word must appear, so this ' +
      'removes most products: use it only for a specific item or material the other filters ' +
      'cannot express (e.g. "linen", "hoodie"), and leave it empty otherwise.',
  },
  categories: {
    type: 'multi',
    values: options.categories,
    description: 'Product types.',
  },
  gender: {
    type: 'single',
    values: ['women', 'men'],
    description: 'Shows products for this gender plus unisex products.',
  },
  priceMax: {
    type: 'number',
    min: 0,
    max: options.maxPrice,
    unit: 'EUR',
    description: 'Maximum price.',
  },
  colors: {
    type: 'multi',
    values: options.colors,
    description: 'A product matches if it comes in any selected color.',
  },
  sizes: {
    type: 'multi',
    values: [...options.clothingSizes, ...options.shoeSizes],
    description:
      'Clothing sizes (XS to XXL) and EU shoe sizes. A product matches if it has any selected size.',
  },
});

function describeProduct(product: Product): string {
  return [
    product.name,
    `${product.category}, ${product.gender}, ${product.style}`,
    `${product.price} EUR`,
    `colors: ${product.colors.join(' ')}`,
    `sizes: ${product.sizes.join(' ')}`,
    product.description,
  ].join(' | ');
}

// Size guide: the smallest weight (kg) for each size, plus the height from which a shopper
// goes one size up. Computed here rather than by the model, so the size never varies.
const sizeGuide: Record<Gender, { minWeightKg: [string, number][]; tallCm: number }> = {
  women: {
    minWeightKg: [
      ['XS', 0],
      ['S', 50],
      ['M', 60],
      ['L', 70],
      ['XL', 80],
      ['XXL', 90],
    ],
    tallCm: 175,
  },
  men: {
    minWeightKg: [
      ['S', 0],
      ['M', 65],
      ['L', 77],
      ['XL', 88],
      ['XXL', 100],
    ],
    tallCm: 188,
  },
};

function clothingSize(user: UserProfile): string {
  const { minWeightKg, tallCm } = sizeGuide[user.gender];
  // Sizes are in ascending order: the last size whose minimum weight the shopper reaches is theirs.
  let index = minWeightKg.filter(([, minKg]) => user.weightKg >= minKg).length - 1;
  if (user.heightCm >= tallCm) index = Math.min(index + 1, minWeightKg.length - 1);
  return minWeightKg[index][0];
}

function currentShopper() {
  const user = users.find((candidate) => candidate.id === loadSessionUserId());
  if (!user) return null;
  return {
    name: user.name,
    gender: user.gender,
    age: user.age,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    clothingSize: clothingSize(user),
    shoeSizeEu: user.shoeSizeEu,
    preferredStyle: user.preferredStyle,
  };
}

const instructions = `
- Gender: use the shopper's gender, unless the request is for someone else or names another gender.
- Sizes: when the shopper buys for themselves, set their sizes for the categories in the request:
  clothingSize for clothing, shoeSizeEu for shoes. Without a category in the request, set both.
  Do not set sizes when they buy for someone else, unless the request gives a size.
- Ranking: order products by how well they fit the request: the item type, the purpose, and any
  quality it asks for (e.g. warm, comfortable, formal). List only products that clearly fit and
  match the filters you set, at most 12.
- Style: there is no style filter. Use the shopper's preferred style only to order products that
  fit the request equally well.
- Message: address the shopper by first name and mention the size you picked, if any. Refer to
  products by name, never by id.
`.trim();

export const aiSearchConfig: AiSearchConfig<typeof filterSchema, Product> = {
  schema: filterSchema,
  catalog: { items: products, id: (product) => product.id, describe: describeProduct },
  user: currentShopper,
  instructions,
  // The demo has no backend, so it calls Anthropic from the browser (see the plugin README).
  transport: anthropicTransport({ apiKey: getApiKey, model: MODEL, allowBrowser: true }),
};

export const aiSearch = createAiSearch(aiSearchConfig);
