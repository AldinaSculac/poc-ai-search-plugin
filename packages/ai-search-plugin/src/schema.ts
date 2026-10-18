import type { FilterSchema } from './types';

/** Returns the schema unchanged, but keeps its literal values so result types stay precise. */
export function defineFilterSchema<const S extends FilterSchema>(schema: S): S {
  return schema;
}
