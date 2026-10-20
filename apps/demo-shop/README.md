# Demo shop: Vandelay Industries

A fake clothing web shop, built only to show the [AI search plugin](../../packages/ai-search-plugin/README.md) in action. Shoppers pick a demo profile, browse a small catalogue with classic filters, and can describe what they need in their own words instead.

## Demo only, not for production

This app is deliberately simple. It exists to give the plugin a realistic place to run, and nothing more:

- **No backend.** All data is static JSON in the app, and everything else is stored in the browser's localStorage.
- **No real login.** "Logging in" means picking one of four demo shoppers. There are no accounts, passwords or sessions on a server.
- **API key in the browser.** AI search calls the Anthropic API directly from the browser, so the key is visible to anyone using the page. Fine for a local demo, never for a real shop (see the recommended setup in the [plugin README](../../packages/ai-search-plugin/README.md#3-choose-a-transport)).
- **Only the pages the demo needs:** login, catalogue and profile. No product pages, cart, checkout, payments, orders, wishlist, stock or search engine. The cart and wishlist icons are decoration.
- **Happy path only.** No tests, and little handling of errors and edge cases.

## What it does

- **Fake login:** pick one of four shoppers (Jerry, George, Elaine, Kramer), each with gender, age, height, weight, shoe size and preferred style.
- **Catalogue:** 60 clothing and shoe items with Unsplash photos, filters for category, gender, max price, color and size, and a classic text search.
- **Profile page:** the shopper's fit profile, and a field for the Anthropic API key.
- **AI search:** a prompt box above the catalogue. The AI sets the same filters a shopper could set by hand, ranks the results, and shows a short message. The shop's AI config is in [src/ai/aiSearch.ts](src/ai/aiSearch.ts); how the plugin works and how to configure it is in the [plugin README](../../packages/ai-search-plugin/README.md).

## Stack

| Area      | Choice                                                           |
| --------- | ---------------------------------------------------------------- |
| Framework | React 19 + React Router                                          |
| Build     | Vite 8                                                           |
| Language  | TypeScript 6.0                                                   |
| Styling   | Plain CSS, one file per component, theme tokens as CSS variables |
| Icons     | lucide-react                                                     |
| Data      | Static JSON (`src/data/products.json`, `src/data/users.json`)    |
| Storage   | localStorage (logged-in shopper, API key)                        |
| AI search | `ai-search-plugin` from this monorepo, Claude Haiku 5.5          |

## Run it

Requires Node 22 (see `.nvmrc`) and pnpm. From the repository root:

```sh
pnpm install
pnpm dev
```

Then open http://localhost:5173 and pick a shopper.

**AI search needs an Anthropic API key.** Either:

- paste it on the profile page (stored in this browser only), or
- for development, copy `.env.example` to `.env.local` and set `VITE_ANTHROPIC_API_KEY`. Restart `pnpm dev` after changing it. This key is used only by the dev server and is never included in a production build.

## Scripts

Run from this folder, or from the root with `pnpm --filter demo-shop <script>`:

| Script              | What it does                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Starts the dev server                                                                                                   |
| `pnpm build`        | Type-checks and builds to `dist/`                                                                                       |
| `pnpm preview`      | Serves the built `dist/` locally                                                                                        |
| `pnpm images:fetch` | One-time script that picked the Unsplash photos; needs `UNSPLASH_ACCESS_KEY` in `.env.local`. Not needed to run the app |
