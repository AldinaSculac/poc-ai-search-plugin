// Public types of the plugin. Nothing here knows about a specific shop: each shop describes
// its filters, catalogue and user through these types.

/** Pick any number of values from a fixed list, e.g. categories or colors. */
export interface MultiFilter {
  type: 'multi';
  values: readonly string[];
  description?: string;
}

/** Pick at most one value from a fixed list, e.g. gender. */
export interface SingleFilter {
  type: 'single';
  values: readonly string[];
  description?: string;
}

/** A numeric limit, e.g. maximum price. */
export interface NumberFilter {
  type: 'number';
  min?: number;
  max?: number;
  unit?: string;
  description?: string;
}

/** Free text, e.g. keywords matched against product names. */
export interface TextFilter {
  type: 'text';
  description?: string;
}

export type FilterDefinition = MultiFilter | SingleFilter | NumberFilter | TextFilter;

/** The shop's filters, keyed by the names the shop uses in its own filter state. */
export type FilterSchema = Record<string, FilterDefinition>;

type FilterValue<D extends FilterDefinition> = D extends MultiFilter
  ? D['values'][number][]
  : D extends SingleFilter
    ? D['values'][number] | null
    : D extends NumberFilter
      ? number | null
      : string;

/** Filter values inferred from a schema. Empty means "not set": `[]`, `null` or `''`. */
export type FiltersFrom<S extends FilterSchema> = { -readonly [K in keyof S]: FilterValue<S[K]> };

/** Tells the plugin how to read the shop's products. */
export interface CatalogAdapter<T> {
  items: readonly T[];
  /** Stable product id, returned in `rankedIds`. */
  id: (item: T) => string;
  /** One short line describing the product to the model. */
  describe: (item: T) => string;
}

/** The shopper's details, as a ready-made description or a plain object. */
export type UserContext = string | Record<string, unknown>;

export interface TransportRequest {
  system: string;
  prompt: string;
}

/** Sends a prompt to a model and returns the raw text reply. */
export type Transport = (request: TransportRequest) => Promise<string>;

export interface AiSearchConfig<S extends FilterSchema, T> {
  schema: S;
  catalog: CatalogAdapter<T>;
  /** Called on every search, so it always reflects the current user. */
  user?: () => UserContext | null | undefined;
  /** Shop-specific rules for the model, e.g. how to pick a size. */
  instructions?: string;
  transport: Transport;
}

export interface AiSearchResult<S extends FilterSchema> {
  filters: FiltersFrom<S>;
  /** Product ids, best match first. */
  rankedIds: string[];
  /** Short reply to show the shopper. */
  message: string;
}

export interface AiSearch<S extends FilterSchema> {
  search: (prompt: string) => Promise<AiSearchResult<S>>;
}
