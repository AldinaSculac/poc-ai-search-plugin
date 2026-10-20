# ai-search-plugin

AI search for web shops. The shopper describes what they need in their own words, and the plugin turns that request, plus the shopper's profile, into the shop's own filters and a ranked list of products.

> "Comfy sneakers for the weekend"
> becomes: `{ categories: ['shoes'], gender: 'women', sizes: ['38'] }`, a ranking of the best matching product ids, and a short message for the shopper.

The plugin is **shop-agnostic**: it knows nothing about a particular shop's products, users or filters. Each shop describes itself once in a config, and the plugin answers in the shop's own terms, so the result drops straight into the filters the shop already has.

## How it works

1. **Config (once):** the shop calls `createAiSearch(config)` with its filter schema, its catalogue, the current shopper, its own rules and a transport.
2. **Prompt:** the plugin builds a prompt from the schema, one line per product, the shopper's details and the rules.
3. **Call:** the transport sends the prompt to the model and returns the raw reply.
4. **Validate:** the plugin reads the JSON reply and drops anything the schema does not allow: unknown filters, values outside the allowed lists, and product ids that are not in the catalogue.
5. **Result:** `search(prompt)` resolves to `{ filters, rankedIds, message }`, typed by the shop's schema.

## Stack

| Area          | Choice                                                                  |
| ------------- | ----------------------------------------------------------------------- |
| Language      | TypeScript 6.0, types inferred from the shop's schema                   |
| Build         | Vite 8 in library mode, ES modules, three entry points                  |
| Core          | No dependencies, runs in the browser and in Node                        |
| AI transport  | `@anthropic-ai/sdk` (optional entry point), Claude Haiku 5.5 by default |
| UI (optional) | React 19 component, peer dependency                                     |

| Entry point                  | Contents                                          |
| ---------------------------- | ------------------------------------------------- |
| `ai-search-plugin`           | `createAiSearch`, `defineFilterSchema`, all types |
| `ai-search-plugin/anthropic` | `anthropicTransport`                              |
| `ai-search-plugin/react`     | `<AiSearchBox />`                                 |

## Setup

The package is not published yet. Inside a pnpm workspace, add it as a dependency:

```json
"dependencies": {
  "ai-search-plugin": "workspace:^"
}
```

Build it with `pnpm --filter ai-search-plugin build` (output in `dist/`). During development, bundlers that support the `development` export condition, such as Vite, use the TypeScript source directly.

### 1. Describe the shop's filters

Each filter has a type and, where it applies, the allowed values. The keys should match the shop's own filter state.

```ts
import { defineFilterSchema } from 'ai-search-plugin';

const schema = defineFilterSchema({
  query: { type: 'text', description: 'Keywords matched against product names.' },
  categories: { type: 'multi', values: ['tops', 'bottoms', 'shoes'] },
  gender: { type: 'single', values: ['women', 'men'] },
  priceMax: { type: 'number', min: 0, unit: 'EUR', description: 'Maximum price.' },
  sizes: { type: 'multi', values: ['S', 'M', 'L', '38', '39', '40'] },
});
```

| Type     | Result value                   | Not set |
| -------- | ------------------------------ | ------- |
| `multi`  | array of allowed values        | `[]`    |
| `single` | one allowed value              | `null`  |
| `number` | number, clamped to `min`/`max` | `null`  |
| `text`   | string                         | `''`    |

`description` is optional and goes to the model as is: use it to explain how the shop applies the filter.

### 2. Create the search

```ts
import { createAiSearch } from 'ai-search-plugin';
import { anthropicTransport } from 'ai-search-plugin/anthropic';

const aiSearch = createAiSearch({
  schema,
  catalog: {
    items: products,
    id: (product) => product.id,
    describe: (product) => `${product.name} | ${product.category} | ${product.price} EUR`,
  },
  user: () => ({ gender: 'women', clothingSize: 'S', shoeSizeEu: 38 }),
  instructions: "Use the shopper's sizes when they buy for themselves.",
  transport: anthropicTransport(),
});

const { filters, rankedIds, message } = await aiSearch.search('comfy sneakers for the weekend');
```

| Config         | What it is                                                                   |
| -------------- | ---------------------------------------------------------------------------- |
| `schema`       | The filters, from `defineFilterSchema`                                       |
| `catalog`      | The products, with a stable `id()` and a one-line `describe()` for the model |
| `user`         | Optional. Returns the current shopper (object or text), read on every search |
| `instructions` | Optional. The shop's own rules, in plain language                            |
| `transport`    | Sends `{ system, prompt }` to a model and returns the reply text             |

Tip: anything the shop can compute exactly, such as a clothing size from a size chart, should be computed in code and passed in `user`, not described in `instructions`. The model then uses the value instead of working it out, and the result stays the same on every search.

### 3. Choose a transport

`anthropicTransport(options)` calls the Anthropic Messages API with the official SDK, at low effort and with the system prompt cached.

| Option         | Default            | What it does                                                                                      |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| `apiKey`       | none               | A key, or a function that reads it on every search. Without it, the SDK reads `ANTHROPIC_API_KEY` |
| `model`        | `claude-haiku-5-5` | Or `claude-sonnet-5-5` for harder requests (slower and more expensive)                            |
| `allowBrowser` | `false`            | Allows calling the API from a browser. The key is then visible to every visitor: demos only       |

**Recommended setup:** run `createAiSearch` on the shop's backend, with the API key in the server environment. The browser sends only the shopper's request to an endpoint and gets the result back. The key never reaches the browser, and the endpoint can only run product search.

Any other model or service works with a custom transport:

```ts
import type { Transport } from 'ai-search-plugin';

const myTransport: Transport = async ({ system, prompt }) => {
  // Call any model and return its reply text (JSON in the format the prompt describes).
  return callMyModel(system, prompt);
};
```

### 4. Show the search box (React, optional)

```tsx
import { AiSearchBox } from 'ai-search-plugin/react';

<AiSearchBox
  search={aiSearch}
  onResult={(result, prompt) => {
    setFilters(result.filters);
    setRanking(result.rankedIds);
  }}
  placeholder="Describe what you need"
/>;
```

`search` accepts anything with a `search(prompt)` method, so with the backend setup it can be an object that calls the shop's endpoint with `fetch`.

Props: `search`, `onResult`, and optional `placeholder`, `submitLabel` and `className`. The box shows a loading state while searching and an error message if the search fails. It brings its own styles; theme it with CSS variables:

| Variable                  | Default   |
| ------------------------- | --------- |
| `--ai-search-accent`      | `#4f46e5` |
| `--ai-search-accent-text` | `#fff`    |
| `--ai-search-bg`          | `#fff`    |
| `--ai-search-text`        | `inherit` |
| `--ai-search-border`      | `#d4d4d8` |
| `--ai-search-radius`      | `999px`   |
| `--ai-search-error`       | `#b91c1c` |
| `--ai-search-font`        | `inherit` |

## Scripts

| Script           | What it does                                                     |
| ---------------- | ---------------------------------------------------------------- |
| `pnpm build`     | Builds the three entry points to `dist/`, with type declarations |
| `pnpm typecheck` | Type-checks the source                                           |

## Future improvements

- **Large catalogues:** every search currently sends one line per product, which suits small shops (about 4,000 tokens for 60 products). Large catalogues need a filters-only mode that sends no products, or a shortlist mode where the shop's own search picks the candidates for the model to rank.
- **Shops with their own AI model:** make the catalogue optional and let the shop provide its own product id check, for models that already have access to the catalogue.
- **More AI providers:** ready-made transports for other providers and for a backend endpoint.
- **Chat mode:** let the shopper continue after a search, e.g. "cheaper" or "in black", with the previous result as context.
- **Speed:** a search takes about 4 to 6 seconds. Streaming the reply, a shorter output format, or a smaller catalogue in the prompt would make it feel faster.
- **Smaller browser bundle:** load the Anthropic SDK only on the first search (about 320 kB, 75 kB gzipped).
- **Errors and edge cases:** clearer error types for the shop to handle, cancelling a search when a new one starts, and reporting which values validation dropped.
- **Component texts:** the loading label "Searching…" is fixed in English; make all texts props for other languages.
- **Tests:** unit tests for the prompt builder and the parser, and type tests for the schema inference.
- **Publishing:** point the package's types at the built declarations in `dist/` (they currently point at the source), then publish it to npm.
