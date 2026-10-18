// Adds the shop's own variables to Vite's `import.meta.env` type.
interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY?: string;
}
