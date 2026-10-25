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

/** Parses the first complete JSON object in the reply, ignoring any text or code fence around it. */
function readJson(text: string): unknown {
  for (let start = text.indexOf('{'); start !== -1; start = text.indexOf('{', start + 1)) {
    const end = findObjectEnd(text, start);
    // Never closed (e.g. a cut-off reply): stop rather than parse an object nested inside it.
    if (end === -1) break;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      // Braces in plain text, not JSON: try the next `{`.
    }
  }
  throw new Error('The model reply is not valid JSON.');
}

/** Returns the index of the `}` that closes the `{` at `start`, or -1. Skips braces in strings. */
function findObjectEnd(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  for (let index = start; index < text.length; index++) {
    const char = text[index];
    if (inString) {
      if (char === '\\') index++;
      else if (char === '"') inString = false;
    } else if (char === '"') inString = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return index;
  }
  return -1;
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
