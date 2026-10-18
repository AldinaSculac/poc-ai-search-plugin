import type { AiSearchResult, FilterDefinition, FilterSchema, FiltersFrom } from './types';

/**
 * Reads the model's JSON reply and keeps only what the schema and catalogue allow, so the
 * shop never receives an unknown filter, value or product id.
 */
export function parseResponse<S extends FilterSchema>(
  text: string,
  schema: S,
  ids: ReadonlySet<string>,
): AiSearchResult<S> {
  const reply = toRecord(readJson(text));
  const filters = toRecord(reply.filters);

  return {
    filters: Object.fromEntries(
      Object.entries(schema).map(([key, definition]) => [key, toValue(filters[key], definition)]),
    ) as FiltersFrom<S>,
    rankedIds: unique(toArray(reply.rankedIds).filter(isString)).filter((id) => ids.has(id)),
    message: isString(reply.message) ? reply.message.trim() : '',
  };
}

function readJson(text: string): unknown {
  const body = text.replace(/```(?:json)?/gi, '');
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    throw new Error('The model reply is not valid JSON.');
  }
}

function toValue(value: unknown, definition: FilterDefinition): unknown {
  switch (definition.type) {
    case 'multi':
      return unique(
        toArray(value)
          .map((item) => matchAllowed(item, definition.values))
          .filter(isString),
      );
    case 'single':
      return matchAllowed(value, definition.values);
    case 'number': {
      const number = typeof value === 'string' && value.trim() ? Number(value) : value;
      if (typeof number !== 'number' || !Number.isFinite(number)) return null;
      return Math.min(definition.max ?? Infinity, Math.max(definition.min ?? -Infinity, number));
    }
    case 'text':
      return isString(value) ? value.trim() : '';
  }
}

/** Returns the allowed value in the schema's spelling, ignoring case, or null. */
function matchAllowed(value: unknown, allowed: readonly string[]): string | null {
  if (!isString(value)) return null;
  const wanted = value.trim().toLowerCase();
  return allowed.find((option) => option.toLowerCase() === wanted) ?? null;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
