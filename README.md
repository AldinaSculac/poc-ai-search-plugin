# AI Search Plugin PoC

A proof of concept for AI search in web shops: the shopper describes what they need in their own words, for example _"comfy sneakers for the weekend"_, and the shop shows matching products, filtered and ranked for that shopper.

## What this PoC tries to prove

1. **AI search can be a reusable plugin.** The same plugin works for any shop. Each shop only describes its own filters, products and rules in a config; the plugin itself never changes.
2. **It fits a shop's existing search.** The AI sets the same filters a shopper could set by hand, so shoppers see the usual catalogue and can keep refining it.
3. **It can be personal.** The plugin uses the shopper's profile, such as gender and sizes, so the results fit the person searching.
4. **It is practical.** A search takes a few seconds and costs well under one cent, and the model's reply is checked before the shop uses it.

Scope: the happy path only, no edge case handling.

## What is in this repo

| Project                                                            | What it is                                                                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [`packages/ai-search-plugin`](packages/ai-search-plugin/README.md) | The plugin: turns a request and a shopper profile into the shop's filters and a ranked product list. Works with any shop. |
| [`apps/demo-shop`](apps/demo-shop/README.md)                       | A fake clothing shop to try the plugin in. Demo only: no backend, fake login, 60 products.                                |

Each project has its own README with the details.

## Quick start

Requires Node 22 (see `.nvmrc`) and pnpm.

```sh
pnpm install
pnpm dev
```

Open http://localhost:5173, pick a shopper, and type a request in the AI search box above the catalogue.

AI search needs an Anthropic API key: paste it on the profile page, or set `VITE_ANTHROPIC_API_KEY` in `apps/demo-shop/.env.local` (see the [demo shop README](apps/demo-shop/README.md#run-it)).

## Try these prompts

Log in as the shopper in the first column. Each prompt shows a different part of the plugin; results can vary a little between runs.

| Shopper | Prompt                                                        | What it shows                                                                    |
| ------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Kramer  | _a warm jacket for a winter city break under 150 euros_       | Category, price and size from one sentence; the price slider follows.            |
| George  | _I have a job interview next week, what should I wear?_       | A whole outfit across categories, with clothing and shoe sizes from the profile. |
| Jerry   | _a birthday gift for my girlfriend, she loves a casual style_ | Shopping for someone else: women's products, no size set.                        |
| Elaine  | _going hiking in Scotland next week, it will rain a lot_      | Understands context: rain means waterproof boots and a rain jacket.              |
| Jerry   | _everything I need for my first half marathon_                | Running shoes, tee, shorts and a jacket, ranked by what matters most.            |
| George  | _trebam udobne cipele za cijeli dan na nogama_                | Other languages: a Croatian request gets matching shoes and a reply in Croatian. |

## Workspace scripts

Run from the repository root:

| Script              | What it does                             |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Starts the demo shop                     |
| `pnpm build`        | Builds the plugin, then the demo shop    |
| `pnpm typecheck`    | Type-checks both projects                |
| `pnpm lint`         | Runs ESLint                              |
| `pnpm format`       | Formats all files with Prettier          |
| `pnpm format:check` | Checks formatting without changing files |

## Stack

pnpm workspaces, TypeScript 6.0, Vite 8, React 19, and Claude Haiku 5.5 through the Anthropic SDK. Each project's README lists its own stack.
