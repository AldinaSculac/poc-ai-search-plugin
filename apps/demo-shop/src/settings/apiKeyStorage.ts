const API_KEY = 'demo-shop.anthropicApiKey';

/**
 * Development only: the key from `VITE_ANTHROPIC_API_KEY` in `.env.local`. Vite writes VITE_
 * variables into the built JavaScript, so the `DEV` check matters: in a production build it
 * is `false` and the key is removed from the bundle.
 */
export const devApiKey: string | null =
  (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_API_KEY) || null;

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY, apiKey);
}

export function loadApiKey(): string | null {
  return localStorage.getItem(API_KEY);
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY);
}

/** The key AI search uses: the one saved on the profile page, else the development key. */
export function getApiKey(): string | null {
  return loadApiKey() ?? devApiKey;
}
