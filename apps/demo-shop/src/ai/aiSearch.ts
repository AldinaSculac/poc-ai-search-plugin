import { createAiSearch, defineFilterSchema, type AiSearchConfig } from 'ai-search-plugin';
import { anthropicTransport } from 'ai-search-plugin/anthropic';
import { products } from '../data/products';
import { users } from '../data/users';
import { getFilterOptions } from '../filters/filterOptions';
import { loadSessionUserId } from '../session/sessionStorage';
import { getApiKey } from '../settings/apiKeyStorage';
import type { Product } from '../types';

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

function currentShopper() {
  const user = users.find((candidate) => candidate.id === loadSessionUserId());
  if (!user) return null;
  return {
    name: user.name,
    gender: user.gender,
    age: user.age,
    heightCm: user.heightCm,
    weightKg: user.weightKg,
    shoeSizeEu: user.shoeSizeEu,
    preferredStyle: user.preferredStyle,
  };
}

const instructions = `
- Gender: use the shopper's gender, unless the request is for someone else or names another gender.
- Sizes: when the shopper buys for themselves, set their sizes for the categories in the request.
  Clothing size comes from weight, one size up if they are taller than average for their gender:
  women: XS under 50 kg, S 50 to 59, M 60 to 69, L 70 to 79, XL 80 to 89, XXL 90 and over.
  men: S under 65 kg, M 65 to 76, L 77 to 87, XL 88 to 99, XXL 100 and over.
  Shoe size is their EU shoe size. Without a category in the request, set both.
  Do not set sizes when they buy for someone else, unless the request gives a size.
- Style: there is no style filter. When the request names no style, rank the shopper's preferred
  style first.
- Ranking: list only products that match the filters you set, at most 12.
- Message: address the shopper by first name and mention the size you picked, if any.
`.trim();

export const aiSearchConfig: AiSearchConfig<typeof filterSchema, Product> = {
  schema: filterSchema,
  catalog: { items: products, id: (product) => product.id, describe: describeProduct },
  user: currentShopper,
  instructions,
  transport: anthropicTransport({ apiKey: getApiKey, model: MODEL }),
};

export const aiSearch = createAiSearch(aiSearchConfig);
