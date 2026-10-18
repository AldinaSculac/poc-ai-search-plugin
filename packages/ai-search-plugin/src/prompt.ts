import type {
  AiSearchConfig,
  FilterDefinition,
  FilterSchema,
  TransportRequest,
  UserContext,
} from './types';

type PromptConfig<S extends FilterSchema, T> = Pick<
  AiSearchConfig<S, T>,
  'schema' | 'catalog' | 'user' | 'instructions'
>;

const ROLE = `You are the search assistant of an online shop. Turn the shopper's request into the shop's filters and a ranked list of matching products.

Rules:
- Set only the filters the request or the shopper's details call for. Leave every other filter empty.
- Use allowed values exactly as written.
- Rank only products from the catalogue that fit the request, best match first.
- Follow the shop instructions.`;

/** Builds the model prompt. The system part is the same for every search; the user part changes. */
export function buildPrompt<S extends FilterSchema, T>(
  config: PromptConfig<S, T>,
  prompt: string,
): TransportRequest {
  const instructions = config.instructions?.trim();
  const system = [
    ROLE,
    tag('filters', describeSchema(config.schema)),
    tag('catalogue', describeCatalog(config)),
    instructions && tag('shop_instructions', instructions),
    tag('reply_format', describeReply(config.schema)),
  ];

  const user = config.user?.();
  const request = [user && tag('shopper', describeUser(user)), tag('request', prompt.trim())];

  return { system: join(system), prompt: join(request) };
}

function describeSchema(schema: FilterSchema): string {
  return Object.entries(schema)
    .map(([key, definition]) => {
      const line = `- ${key}: ${describeValue(definition)}`;
      return definition.description ? `${line} ${definition.description}` : line;
    })
    .join('\n');
}

function describeValue(definition: FilterDefinition): string {
  switch (definition.type) {
    case 'multi':
      return `array of any of ${list(definition.values)}, empty array if not set.`;
    case 'single':
      return `one of ${list(definition.values)}, or null if not set.`;
    case 'number': {
      const unit = definition.unit ? ` in ${definition.unit}` : '';
      const range = [
        definition.min !== undefined && `min ${definition.min}`,
        definition.max !== undefined && `max ${definition.max}`,
      ].filter(Boolean);
      const limits = range.length ? ` (${range.join(', ')})` : '';
      return `number${unit}${limits}, or null if not set.`;
    }
    case 'text':
      return 'free text keywords, empty string if not set.';
  }
}

function describeCatalog<T>({ catalog }: Pick<PromptConfig<FilterSchema, T>, 'catalog'>): string {
  return catalog.items.map((item) => `${catalog.id(item)} | ${catalog.describe(item)}`).join('\n');
}

function describeReply(schema: FilterSchema): string {
  const example = {
    filters: Object.fromEntries(
      Object.entries(schema).map(([key, definition]) => [key, emptyValue(definition)]),
    ),
    rankedIds: ['<product id>'],
    message: '<one or two friendly sentences for the shopper, in the language of the request>',
  };
  return `Reply with JSON only, no other text, in this shape:\n${JSON.stringify(example, null, 2)}`;
}

function emptyValue(definition: FilterDefinition): unknown {
  switch (definition.type) {
    case 'multi':
      return [];
    case 'single':
    case 'number':
      return null;
    case 'text':
      return '';
  }
}

function describeUser(user: UserContext): string {
  return typeof user === 'string' ? user.trim() : JSON.stringify(user, null, 2);
}

function list(values: readonly string[]): string {
  return values.map((value) => JSON.stringify(value)).join(', ');
}

function tag(name: string, content: string): string {
  return `<${name}>\n${content}\n</${name}>`;
}

function join(parts: (string | false | null | undefined | '')[]): string {
  return parts.filter(Boolean).join('\n\n');
}
