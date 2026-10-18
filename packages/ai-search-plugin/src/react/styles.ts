// Default look of <AiSearchBox />. Every rule sits in :where() so it has zero specificity and
// any shop stylesheet wins. Shops theme it through the variables below.
export const styles = `
:where(.ai-search-box) {
  --_accent: var(--ai-search-accent, #4f46e5);
  --_accent-text: var(--ai-search-accent-text, #fff);
  --_bg: var(--ai-search-bg, #fff);
  --_text: var(--ai-search-text, inherit);
  --_border: var(--ai-search-border, #d4d4d8);
  --_radius: var(--ai-search-radius, 999px);
  --_error: var(--ai-search-error, #b91c1c);
  font-family: var(--ai-search-font, inherit);
}
:where(.ai-search-box__field) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.375rem 0.375rem 1rem;
  background: var(--_bg);
  color: var(--_text);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
}
:where(.ai-search-box__field:focus-within) {
  border-color: var(--_accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--_accent) 20%, transparent);
}
:where(.ai-search-box__icon) {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  fill: var(--_accent);
}
:where(.ai-search-box__input) {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0;
  font: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  outline: none;
}
:where(.ai-search-box__submit) {
  flex: none;
  padding: 0.625rem 1.25rem;
  font: inherit;
  font-weight: 600;
  color: var(--_accent-text);
  background: var(--_accent);
  border: 0;
  border-radius: var(--_radius);
  cursor: pointer;
}
:where(.ai-search-box__submit:disabled) {
  opacity: 0.6;
  cursor: default;
}
:where(.ai-search-box__error) {
  margin: 0.5rem 1rem 0;
  font-size: 0.875rem;
  color: var(--_error);
}
`;
