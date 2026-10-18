import { useState, type FormEvent } from 'react';
import type { AiSearch, AiSearchResult, FilterSchema } from '../types';
import { styles } from './styles';

export interface AiSearchBoxProps<S extends FilterSchema> {
  /** The search created with `createAiSearch`. */
  search: AiSearch<S>;
  /** Called with the validated result and the prompt that produced it. */
  onResult: (result: AiSearchResult<S>, prompt: string) => void;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
}

/** A prompt input that runs an AI search. Theme it with the `--ai-search-*` CSS variables. */
export function AiSearchBox<S extends FilterSchema>({
  search,
  onResult,
  placeholder = 'Describe what you are looking for…',
  submitLabel = 'Search',
  className,
}: AiSearchBoxProps<S>) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    try {
      onResult(await search.search(text), text);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The search failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={['ai-search-box', className].filter(Boolean).join(' ')}
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <style href="ai-search-box" precedence="default">
        {styles}
      </style>
      <div className="ai-search-box__field">
        <SparkleIcon />
        <input
          className="ai-search-box__input"
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          disabled={loading}
        />
        <button
          className="ai-search-box__submit"
          type="submit"
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Searching…' : submitLabel}
        </button>
      </div>
      {error && (
        <p className="ai-search-box__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function SparkleIcon() {
  return (
    <svg className="ai-search-box__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  );
}
