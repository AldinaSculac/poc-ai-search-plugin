// One-time script: finds an Unsplash photo for each product and stores the
// hotlink URL and photographer credit in src/data/products.json.
// Usage: pnpm --filter demo-shop images:fetch (needs UNSPLASH_ACCESS_KEY in .env.local)
// Products that already have an Unsplash image are skipped, so the script can
// be rerun after the hourly rate limit (50 requests in demo mode) resets.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const PRODUCTS_PATH = new URL('../src/data/products.json', import.meta.url);
const UTM = 'utm_source=ai_search_poc&utm_medium=referral';

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) {
  console.error('Missing UNSPLASH_ACCESS_KEY in apps/demo-shop/.env.local');
  process.exit(1);
}

const products = JSON.parse(await readFile(PRODUCTS_PATH, 'utf8'));
const isFetched = (product) => product.image.startsWith('https://images.unsplash.com');
const usedPhotoIds = new Set(
  products.filter(isFetched).map((product) => new URL(product.image).pathname),
);

// From most to least specific; later queries are only tried when earlier ones find nothing.
function buildQueries(product) {
  const person = { women: 'woman', men: 'man', unisex: '' }[product.gender];
  const shortName = product.name.split(' ').slice(-2).join(' ');
  const join = (...parts) => parts.filter(Boolean).join(' ');
  return [
    join(person, product.colors[0], product.name),
    join(person, product.name),
    join(person, shortName),
  ];
}

async function searchPhoto(query) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.search = new URLSearchParams({ query, orientation: 'portrait', per_page: '10' });
  const response = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
  const remaining = Number(response.headers.get('x-ratelimit-remaining'));
  if (!response.ok) {
    throw new Error(`Unsplash ${response.status}: ${await response.text()}`);
  }
  const { results } = await response.json();
  const photo = results.find((result) => !usedPhotoIds.has(new URL(result.urls.raw).pathname));
  return { photo, remaining };
}

let updated = 0;
for (const product of products) {
  if (isFetched(product)) continue;

  let photo;
  let query;
  let remaining;
  try {
    for (query of buildQueries(product)) {
      ({ photo, remaining } = await searchPhoto(query));
      if (photo || remaining === 0) break;
    }
  } catch (error) {
    console.error(`Stopped at ${product.id}: ${error.message}`);
    break;
  }

  if (photo) {
    usedPhotoIds.add(new URL(photo.urls.raw).pathname);
    product.image = `${photo.urls.raw}&w=600&h=750&fit=crop&auto=format&q=80`;
    product.imageCredit = {
      name: photo.user.name,
      url: `${photo.user.links.html}?${UTM}`,
    };
    updated++;
    console.log(`${product.id} ${query} -> ${photo.user.name}`);
  } else {
    console.warn(`${product.id} ${query} -> no unused photo found`);
  }

  if (remaining === 0) {
    console.log('Rate limit reached, run again in an hour to continue.');
    break;
  }
}

const filepath = fileURLToPath(PRODUCTS_PATH);
const prettierConfig = await resolveConfig(filepath);
await writeFile(
  PRODUCTS_PATH,
  await format(JSON.stringify(products), { ...prettierConfig, filepath }),
);
const missing = products.filter((product) => !isFetched(product)).length;
console.log(`Updated ${updated} products, ${missing} still without an Unsplash image.`);
