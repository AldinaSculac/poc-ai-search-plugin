import Anthropic from '@anthropic-ai/sdk';
import type { Transport } from '../types';

export interface AnthropicTransportOptions {
  /** The key itself, or a function that reads it on every search (e.g. from settings). */
  apiKey: string | (() => string | null | undefined);
  /** Defaults to Claude Haiku 5.5, which is fast and cheap enough for search. */
  model?: 'claude-haiku-5-5' | 'claude-sonnet-5-5';
}

/**
 * Calls the Anthropic API straight from the browser. Only for demos and local testing:
 * the API key is visible to anyone using the page. Real shops send the request through
 * their own backend with a custom transport instead.
 */
export function anthropicTransport({
  apiKey,
  model = 'claude-haiku-5-5',
}: AnthropicTransportOptions): Transport {
  return async ({ system, prompt }) => {
    const key = typeof apiKey === 'function' ? apiKey() : apiKey;
    if (!key) throw new Error('Missing Anthropic API key.');

    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
    const response = await client.beta.messages.create({
      model,
      max_tokens: 16000,
      // Searches should feel instant, and the task needs little reasoning.
      output_config: { effort: 'low' },
      // The system prompt is identical for every search, so cache it.
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: prompt }],
      // Haiku has no server-side fallback; Sonnet retries a safety decline on another model.
      ...(model === 'claude-sonnet-5-5' && {
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      }),
    });

    if (response.stop_reason === 'refusal') throw new Error('The model declined this search.');
    if (response.stop_reason === 'max_tokens') throw new Error('The model reply was cut off.');

    return response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('');
  };
}
