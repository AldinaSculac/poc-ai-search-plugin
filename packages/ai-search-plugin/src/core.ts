import { parseResponse } from './parse';
import { buildPrompt } from './prompt';
import type { AiSearch, AiSearchConfig, FilterSchema } from './types';

/** Creates a search for one shop. Works with any framework, or none. */
export function createAiSearch<S extends FilterSchema, T>(
  config: AiSearchConfig<S, T>,
): AiSearch<S> {
  return {
    async search(prompt) {
      const reply = await config.transport(buildPrompt(config, prompt));
      const ids = new Set(config.catalog.items.map(config.catalog.id));
      return parseResponse(reply, config.schema, ids);
    },
  };
}
